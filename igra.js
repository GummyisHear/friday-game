var myGameArea;
var myGamePiece;
var myObstacles = [];
var myscore;
var canvasWidth = 1920;
var canvasHeight = 942;
var playerSpeed = 40;
var ticks = 50;
var ticksMs = Math.floor(1000 / ticks);
var gameSpeed = -10; // Скорость движения препяствий. Минус чтобы двигаться влево, плюс чтобы двигаться вправо
var obstacleGap = 40; // Промежуток между препятствиями (измеряется в тиках в секунду (ticks))

document.addEventListener('keydown', function(event) {
    var key_press = String.fromCharCode(event.keyCode);
    switch(key_press) {
    case "W":
        myGamePiece.speedY = -playerSpeed;
        break;
    case "A":
        myGamePiece.speedX = -playerSpeed; 
        break;
    case "S":
        myGamePiece.speedY = playerSpeed; 
        break;
    case "D":
        myGamePiece.speedX = playerSpeed; 
        break;
    case "R":
        restartGame();
        break;
    default:
        break;
    }
});
document.addEventListener('keyup', function(event) {
    var key_press = String.fromCharCode(event.keyCode);
    switch(key_press) {
    case "W":
        myGamePiece.speedY = 0;
        break;
    case "A":
        myGamePiece.speedX = 0; 
        break;
    case "S":
        myGamePiece.speedY = 0;
        break;
    case "D":
        myGamePiece.speedX = 0;
        break;
    default:
        break;
    }
});

function restartGame() {
    document.getElementById("myfilter").style.display = "none";
    document.getElementById("myrestartbutton").style.display = "none";
    myGameArea.stop();
    myGameArea.clear();
    myGameArea = {};
    myGamePiece = {};
    myObstacles = [];
    myscore = {};
    document.getElementById("canvascontainer").innerHTML = "";
    startGame()
}

function startGame() {
    myGameArea = new gamearea();
    myGamePiece = new component(60, 60, "red", 150, 150);
    myscore = new component("15px", "Consolas", "black", 220, 25, "text");
    myGameArea.start();
}

function gamearea() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    document.getElementById("canvascontainer").appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");
    this.pause = false;
    this.frameNo = 0;
    this.start = function() {
        this.interval = setInterval(updateGameArea, ticksMs);
    }
    this.stop = function() {
        clearInterval(this.interval);
        this.pause = true;
    }
    this.clear = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type, bulletRate, bulletSpeed) {

    this.type = type;
    if (type == "text") {
        this.text = color;
    }
    this.score = 0;    
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    if (type == "bullet") {
        this.bulletSpeed = bulletRate;
    }
    if (type == "cannon") {
        this.bulletRate = bulletRate;
        this.bulletSpeed = bulletSpeed;
    }
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } 
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function generateRandomObstacle() {
    var obstacleId = Math.floor(Math.random() * 3); //0 - 2

    //ID 0 - Две трубы и пустое место посреди них
    //ID 1 - Один черный блок
    //ID 2 - Пушка снизу

    if (obstacleId == 0) {
        var x, y, min, max, height, gap;

        x = canvasWidth;
        y = canvasHeight;
        min = 60;
        max = canvasHeight-360;
        height = Math.floor(Math.random()*(max-min-1)+min);
        min = 150;
        max = 300;
        gap = Math.floor(Math.random()*(max-min-1)+min);
        myObstacles.push(new component(90, height, "green", x, 20));
        myObstacles.push(new component(90, y - height - gap - 20, "green", x, height + gap));
    }
    else if (obstacleId == 1) {
        var x, y, min, max, height, gap;

        x = canvasWidth;
        y = canvasHeight;
        height = 600;
        min = 20;
        max = 322;
        gap = Math.floor(Math.random()*(max-min-1)+min);
        myObstacles.push(new component(90, height, "black", x, gap));
    }
    else if (obstacleId == 2) {
        var x, y, bulletRate;

        x = canvasWidth;
        y = canvasHeight;
        bulletRate = 25;
        bulletSpeed = -20;
        myObstacles.push(new component(90, 100, "red", x, y-120, "cannon", bulletRate, bulletSpeed));
    }
}

function updateGameArea() {
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            document.getElementById("myfilter").style.display = "block";
            document.getElementById("myrestartbutton").style.display = "block";
            return;
        }
    }
    if (myGameArea.pause == false) {
        myGameArea.clear();
        myGameArea.frameNo += 1;
        myscore.score +=1;        
        if (myGameArea.frameNo == 1 || everyinterval(obstacleGap)) {
            generateRandomObstacle();
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            if (myObstacles[i].type == "cannon" && everyinterval(myObstacles[i].bulletRate)) {
                myObstacles.push(new component(70, 70, "red", myObstacles[i].x+10, myObstacles[i].y, "bullet", myObstacles[i].bulletSpeed));
            }
            if (myObstacles[i].type == "bullet") { myObstacles[i].y += myObstacles[i].bulletSpeed; }
            myObstacles[i].x += gameSpeed;
            myObstacles[i].update();
        }
        myscore.text="SCORE: " + myscore.score + "| Pos: " + myGamePiece.x + ", " + myGamePiece.y;        
        myscore.update();

        //Проверки для того, чтобы игрок не мог пройти за края карты
        if(myGamePiece.x < 0)
            myGamePiece.x = 0;
        else if(myGamePiece.x > canvasWidth)
            myGamePiece.x = canvasWidth;
        else
            myGamePiece.x += myGamePiece.speedX;

        if (myGamePiece.y < 0)
            myGamePiece.y = 0;
        else if (myGamePiece.y > canvasHeight-40)
            myGamePiece.y = canvasHeight-40;
        else  
            myGamePiece.y += myGamePiece.speedY;

        myGamePiece.update();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

startGame();