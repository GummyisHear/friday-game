var myGameArea;
var myGamePiece;
var myObstacles = [];
var myscore;
var canvasWidth = 1920;
var canvasHeight = 942;
var playerSpeed = 40;

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
        default:
            break;
        }
    });
document.addEventListener('keyup', function(event) {
    var key_press = String.fromCharCode(event.keyCode);
    if (key_press == "W")
    {
        myGamePiece.speedY = 0; 
    }
    if (key_press == "S")
    {
        myGamePiece.speedY = 0; 
    }
    if (key_press == "A")
    {
        myGamePiece.speedX = 0; 
    }
    if (key_press == "D")
    {
        myGamePiece.speedX = 0; 
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
        this.interval = setInterval(updateGameArea, 20);
    }
    this.stop = function() {
        clearInterval(this.interval);
        this.pause = true;
    }
    this.clear = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {

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
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
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

function updateGameArea() {
    var x, y, min, max, height, gap;
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
        if (myGameArea.frameNo == 1 || everyinterval(400)) {
            x = myGameArea.canvas.width;
            y = myGameArea.canvas.height - 100;
            min = 20;
            max = 400;
            height = Math.floor(Math.random()*(max-min+1)+min);
            min = 150;
            max = 300;
            gap = Math.floor(Math.random()*(max-min+1)+min);
            myObstacles.push(new component(90, height, "green", x, 0));
            myObstacles.push(new component(90, x - height - gap, "green", x, height + gap));
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += -1;
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
        else if (myGamePiece.y > canvasHeight)
            myGamePiece.y = canvasHeight;
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