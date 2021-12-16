var myGameArea;
var myGamePiece;
var myObstacles = [];
var myscore;
var canvasWidth = 1920;
var canvasHeight = 942;
var playerSpeed = 20;
var ticks = 50;
var ticksMs = Math.floor(1000 / ticks);
var gameSpeed = -10; // Скорость движения препяствий. Минус чтобы двигаться влево, плюс чтобы двигаться вправо
var obstacleGap = 40; // Промежуток между препятствиями (измеряется в тиках в секунду (ticks))
var currentObstacle = 0;
var gameRunning = false;
var gameOver = false;

document.addEventListener('keydown', function(event) {
    if (gameRunning) {
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
        case String.fromCharCode(27): // Escape
            pauseGame();
            break;
        case "P":
            pauseGame();
            break;
        default:
            break;
        }
    }
    else if (gameOver)
    {
        var key_press = String.fromCharCode(event.keyCode);
        switch(key_press) {
            case "R":
            restartGame();
            break;
        }
    }
});
document.addEventListener('keyup', function(event) {
    if (gameRunning) {
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
    }
});

function restartGame() {
    document.getElementById("myfilter").style.display = "none";
    document.getElementById("myrestartbutton").style.display = "none";
    document.getElementById("gamePaused").style.display = "none";
    document.getElementById("levelPassed").style.display = "none";
    myGameArea.stop();
    myGameArea.clear();
    myGameArea = {};
    myGamePiece = {};
    myObstacles = [];
    currentObstacle = 0;
    myscore = {};
    //currentLevel = [];
    document.getElementById("canvascontainer").innerHTML = "";
    startGame();
}
function closeGame() {
    myGameArea.clear();
    myGameArea.stop();
    gameRunning = false;
    myGameArea = {};
    myGamePiece = {};
    myObstacles = [];
    currentObstacle = 0;
    myscore = {};
    document.getElementById("gamecontainer").style.display = "none";
    document.getElementById("myfilter").style.display = "none";
    document.getElementById("myrestartbutton").style.display = "none";
    document.getElementById("gamePaused").style.display = "none";
    document.getElementById("levelPassed").style.display = "none";
    document.getElementById("canvascontainer").innerHTML = "";
}

function startGame() {
    myGameArea = new gamearea();
    myGamePiece = new component(60, 60, "red", 150, 150);
    myscore = new component("15px", "Consolas", "black", 220, 25, "text");

    document.getElementById("gamecontainer").style.display = "block";
    
    //currentLevel = 0;

    myGameArea.start();
    gameRunning = true;
}

function music(){
    var m = document.getElementById("testmusic");
    //var m = document.getElementById("testmusic");
    //m.autoplay = true;
    //m.load();
    document.getElementById("testmusic").loop = true;
    //document.getElementById("testmusic").muted = true;
}

function pauseGame() {
    if (myGameArea.pause){
        myGameArea.pause = false;
        document.getElementById("gamePaused").style.display = "none";
    }
    else {
        myGameArea.pause = true;
        document.getElementById("gamePaused").style.display = "flex"; /*если 
        "flex" заменить на "" будет так как я хочу отоброжать паузу и вообще вседа,
        напишите в наш дискорд если поймёте как это сделать*/
    }
}

function finishGame() {
    myGameArea.pause = true;
    gameRunning = false;
    gameOver = false;
    document.getElementById("levelPassed").style.display = "flex";
}

function gamearea() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.currentLevel = 0;

    document.getElementById("canvascontainer").appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");
    this.pause = false;
    this.frameNo = 0;
    this.start = function() {
        gameRunning = true;
        this.interval = setInterval(updateGameArea, ticksMs);
    }
    this.stop = function() {
        clearInterval(this.interval);
        this.pause = true;
        gameRunning = false;
        gameOver = true;
    }
    this.clear = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.finish = function(){
        clearInterval(this.interval);
        finishGame();
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
        if (myGamePiece.crashWith(myObstacles[i]) && myObstacles[i].type != "finish") {
            myGameArea.stop();
            document.getElementById("myfilter").style.display = "block";
            document.getElementById("myrestartbutton").style.display = "flex";
            return;
        }
        else if (myGamePiece.crashWith(myObstacles[i]) && myObstacles[i].type == "finish")
        {
            myGameArea.finish();
            return;
        }
    }
    if (myGameArea.pause == false) {
        myGameArea.clear();
        myGameArea.frameNo += 1;
        myscore.score +=1;

        //эпичный комментарий
        generateLevel();
        
        for (i = 0; i < myObstacles.length; i += 1) {
            if (myObstacles[i].type == "cannon" && everyinterval(myObstacles[i].bulletRate)) {
                myObstacles.push(new component(70, 70, "red", myObstacles[i].x+10, myObstacles[i].y, "bullet", myObstacles[i].bulletSpeed));
            }
            if (myObstacles[i].type == "bullet") { myObstacles[i].y += myObstacles[i].bulletSpeed; }

            //этот if делает так, чтобы препятствия, которые уже не видны на экране, не обновлялись
            if (myObstacles[i].x + myObstacles[i].width >= -50) {
                myObstacles[i].x += gameSpeed;
                myObstacles[i].update();
            }
            
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


//Уровни 

function generateLevel() {
    switch(myGameArea.frameNo) {
        case 1:
            myObstacles.push(new component(2000, 100, "black", canvasWidth, canvasHeight-120));
            myObstacles.push(new component(2000, 100, "black", canvasWidth, 20));
            break;
        case 51:
            myObstacles.push(new component(1500, 100, "black", canvasWidth, canvasHeight-220));
            myObstacles.push(new component(1500, 100, "black", canvasWidth, 120));
            break;
        case 101:
            myObstacles.push(new component(1000, 100, "black", canvasWidth, canvasHeight-320));
            myObstacles.push(new component(1000, 100, "black", canvasWidth, 220));
            break;
        case 151:
            myObstacles.push(new component(500, 100, "black", canvasWidth, canvasHeight-420));
            myObstacles.push(new component(500, 100, "black", canvasWidth, 320));
            break;
        case 251:
            myObstacles.push(new component(150, 500, "black", canvasWidth, canvasHeight-520));
            break;
        case 301:
            myObstacles.push(new component(150, 500, "black", canvasWidth, 20));
            break;
        case 351:
            myObstacles.push(new component(150, 600, "black", canvasWidth, canvasHeight-620));
            break;
        case 401:
            myObstacles.push(new component(150, 600, "black", canvasWidth, 20));
            break;
        case 451:
            myObstacles.push(new component(150, 700, "black", canvasWidth, canvasHeight-720));
            break;
        case 501:
            myObstacles.push(new component(150, 700, "black", canvasWidth, 20));
            break;
        case 601:
            myObstacles.push(new component(150, 800, "black", canvasWidth, 20));
            break;
        case 651:
            myObstacles.push(new component(150, 600, "black", canvasWidth, 20));
            myObstacles.push(new component(150, 100, "black", canvasWidth, canvasHeight-120));
            break;
        case 701:
            myObstacles.push(new component(150, 400, "black", canvasWidth, 20));
            myObstacles.push(new component(150, 300, "black", canvasWidth, canvasHeight-320));
            break;
        case 751:
            myObstacles.push(new component(150, 200, "black", canvasWidth, 20));
            myObstacles.push(new component(150, 500, "black", canvasWidth, canvasHeight-520));
            break;
        case 801:
            myObstacles.push(new component(150, 700, "black", canvasWidth, canvasHeight-720));
            break;
        case 851:
            myObstacles.push(new component(150, 380, "black", canvasWidth, 20));
            myObstacles.push(new component(150, 380, "black", canvasWidth, canvasHeight-400));
            break;
        case 901:
            myObstacles.push(new component(150, 680, "black", canvasWidth, 20));
            myObstacles.push(new component(150, 80, "black", canvasWidth, canvasHeight-100));
            break;
        case 951:
            myObstacles.push(new component(150, 160, "black", canvasWidth, 20));
            myObstacles.push(new component(150, 600, "black", canvasWidth, canvasHeight-620));
            break;
        case 1001:
            myObstacles.push(new component(150, 600, "black", canvasWidth, 20));
            myObstacles.push(new component(150, 160, "black", canvasWidth, canvasHeight-180));
            break;
        case 1051:
            myObstacles.push(new component(150, 80, "black", canvasWidth, 20));
            myObstacles.push(new component(150, 680, "black", canvasWidth, canvasHeight-700));
            break;
        case 1151:
            myObstacles.push(new component(150, 150, "black", canvasWidth+150, canvasHeight-700));
            myObstacles.push(new component(150, 680, "black", canvasWidth, canvasHeight-700));
            myObstacles.push(new component(150, 680, "black", canvasWidth+300, canvasHeight-700));
            break;
        case 1251:
            myObstacles.push(new component(150, 150, "black", canvasWidth+150, 550));
            myObstacles.push(new component(150, 680, "black", canvasWidth, 20));
            myObstacles.push(new component(150, 680, "black", canvasWidth+300, 20));
            break;
        case 1351:
            myObstacles.push(new component(150, 150, "black", canvasWidth+150, canvasHeight-700));
            myObstacles.push(new component(150, 680, "black", canvasWidth, canvasHeight-700));
            myObstacles.push(new component(150, 680, "black", canvasWidth+300, canvasHeight-700));
            break;
        case 1451:
            myObstacles.push(new component(150, 150, "black", canvasWidth+150, 550));
            myObstacles.push(new component(150, 680, "black", canvasWidth, 20));
            myObstacles.push(new component(150, 680, "black", canvasWidth+300, 20));
            break;
        case 1551:
            myObstacles.push(new component(1050, 150, "black", canvasWidth, canvasHeight-170));
            myObstacles.push(new component(750, 150, "black", canvasWidth+150, canvasHeight-320));
            myObstacles.push(new component(450, 150, "black", canvasWidth+300, canvasHeight-470));
            myObstacles.push(new component(150, 150, "black", canvasWidth+450, canvasHeight-620));
            break;
        case 1651:
            myObstacles.push(new component(1050, 150, "black", canvasWidth, 20));
            myObstacles.push(new component(750, 150, "black", canvasWidth+150, 170));
            myObstacles.push(new component(450, 150, "black", canvasWidth+300, 320));
            myObstacles.push(new component(150, 150, "black", canvasWidth+450, 470));
            break;
        case 1751:
            myObstacles.push(new component(1050, 150, "black", canvasWidth, canvasHeight-170));
            myObstacles.push(new component(750, 150, "black", canvasWidth+150, canvasHeight-320));
            myObstacles.push(new component(450, 150, "black", canvasWidth+300, canvasHeight-470));
            myObstacles.push(new component(150, 150, "black", canvasWidth+450, canvasHeight-620));
            break;
        case 1851:
            myObstacles.push(new component(1050, 150, "black", canvasWidth, 20));
            myObstacles.push(new component(750, 150, "black", canvasWidth+150, 170));
            myObstacles.push(new component(450, 150, "black", canvasWidth+300, 320));
            myObstacles.push(new component(150, 150, "black", canvasWidth+450, 470));
            break;
        case 2001:
            myObstacles.push(new component(150, canvasHeight-40, "green", canvasWidth, 20, "finish"));
            break;
        default:
            break;
    }
}