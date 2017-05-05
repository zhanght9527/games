/**
 * Created by zhang on 2017/4/7.
 */
var Grids = multiArray(20,20);
var snakeNum = [];
var timer;//创建定时器
var speed;
var len;
var direction;
var height = 20;
var width = 20;
var foodXY = [];
var space = true;
var snakeHead = [];
$(function () {
    createTable();
    start();
});
//创建表格
function createTable() {
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    for(var i=0;i<height;i++){
        var tr = document.createElement("tr");
        for(var j=0;j<width;j++){
            var th = document.createElement("th");
            Grids[i][j] = tr.appendChild(th);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    $("#box").get(0).appendChild(table);
}
//创建二维数组
function multiArray(m,n) {
    var arr =  new Array(n);
    for(var i=0; i<m; i++)
        arr[i] = new Array(m);
    return arr;
}
function start() {
    $("input").click(function () {
        $("table").remove();
        createTable();//初始化网格
        len = 5;
        speed = 8;
        snakeNum = [];
        snakeHead = [];
        snake();
        $("#GG").css("display","none");
        initFood();
    })
}
function walk() {
    if(timer) window.clearInterval(timer);
    timer = window.setInterval(step, Math.floor(3000/speed));
}
function step() {
    var headX = snakeNum[len-1][1];
    var headY = snakeNum[len-1][0];
    var bodyLastX = snakeNum[0][1];
    var bodyLastY = snakeNum[0][0];
    $(document).keyup(function (event) {
        var keyId = event.keyCode;
        switch (keyId){
            case 37: if(direction!="right"){
                direction = "left";
            }
                break;
            case 38: if(direction!="down"){
                direction = "top";
            }
                break;
            case 39: if(direction!="left"){
                direction = "right";
            }
                break;
            case 40: if(direction!="up"){
                direction = "down";
            }
                break;
            case 80: if(space){
                window.clearInterval(timer);
                space = false;
                return;
            }else {
                walk();
                space = true;
            }
        }
    });
    switch (direction) {
        case 'left':   headX -=1;break;
        case 'top':   headY -=1;break;
        case 'right':  headX +=1;break;
        case 'down':  headY +=1;break;
    }
    if (headX == width || headX < 0 || headY < 0 || Grids[headY][headX].className == "cover") {
        $("#GG").css("display", "block");
        window.clearInterval(timer);
        return;
    }
    if(headX==foodXY[0][1]&&headY==foodXY[0][0]){
        len++;
        initFood();
        $("strong").html(len-5);
    }else{
        Grids[bodyLastY][bodyLastX].className = "";
        snakeNum.shift();
    }
    if(len%5 == 0){
        speed = 7+len/5;
    }
    snakeNum.push([headY,headX]);
    snakeHead.push([headY,headX]);
    Grids[headY][headX].className = "coverHead";
    Grids[snakeHead[0][0]][snakeHead[0][1]].className = "cover";
    snakeHead.shift();
}
function initFood() {
    foodXY = [];
    var foodX = Math.round(Math.random()*(width-1));
    var foodY = Math.round(Math.random()*(height-1));
    foodXY.push([foodY,foodX]);
    for(var i=0;i<len;i++){
        if(Grids[foodY][foodX].className =="cover"||Grids[foodY][foodX].className =="coverHead"){
            return initFood();
        }else {
            Grids[foodY][foodX].className ="food";
        }
    }
}
function snake() {
    for(var i=0;i<len;i++){
        snakeNum.push([0,i]);
        Grids[0][i].className = "cover";
    }
    snakeHead.push(snakeNum[len-1]);
    Grids[0][len-1].className = "coverHead";
    direction = "right";
    walk();
}