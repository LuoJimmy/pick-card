
var distance = 240;
var liDistance = 260;

var shell = document.getElementById("shell");
var ulBox = document.getElementById("ul-box");
var items = ulBox.getElementsByTagName("li");
var aBtn = ulBox.getElementsByTagName("a");


var startX,startY;
var isMoving = false;
var nowIndex = getNowIndex();
var shellWidth = parseInt(window.getComputedStyle ? window.getComputedStyle(shell,null).width : shell.currentStyle.width);
var ulWidth = items.length * liDistance + 100;
var realDistance = 0;
var scale = ulWidth / shellWidth;
var totalRealDistance = 0;

//alert(shellWidth);

init();

addClickEvent(aBtn);
addTouchEvent();
addMouseWheelEvent();
addMouseMoveEvent();

function init() {
	ulBox.style.width = ulWidth+'px';
	ulBox.style.left = "0px";
}

function addMouseMoveEvent() {
	var x1,x2,movingX,tempX;
	var startTime,endTime,moveTime;
	var isMouseDown = false;
	var speed = 0;//鼠标滑动速度。慢速（滑动一格）：let(1px/ms);中速（滑动两格）：betwwen(1,3);高速（滑动三格）：get(4)
	var movingDistance,  nextIndexDistance;
	var rightDirection, isStartMoving;		
	document.addEventListener('mousedown',function(event){
		startTime = new Date().getTime();
		x1 = event.clientX;
		tempX = x1;
		isMouseDown = true;
		speed = 0;
		movingDistance = 0;
		nextIndexDistance = 0;
		isStartMoving = true;
		rightDirection = -1;//向左为0，向右为1,不动为-1
		console.log("nowIndex:"+nowIndex);
	},false);
	
	document.addEventListener('mousemove',function(event){
		if(isMouseDown){
			var currentDistance , moveDistance,absNextIndexDistance, scaleSize1, scaleSize2, marginOffset1, marginOffset2, isMovingChangeDirection;
			movingX = event.clientX;
			ulBox.removeAttribute("class");
			currentDistance = getTranslateX();
			movingDistance = movingX - tempX;
			
			if(isStartMoving) {
				if(movingDistance > 0){
					rightDirection = 1;
					console.log("right-------------------->");
				}else if(movingDistance < 0){
					rightDirection = 0;
					console.log("left<--------------------");
				}
				isMovingChangeDirection = false;
				isStartMoving = false;
			}else{
				if((rightDirection==1 && movingDistance < 0)){//右移动变为左移动
					isMovingChangeDirection = true;
					rightDirection = 0;
					console.log("change to left!!");
				}else if(rightDirection==0 && movingDistance > 0){//左移动变成右移动
					isMovingChangeDirection = true;
					rightDirection = 1;
					console.log("change to right!!");
				}
			}
			
			if((nowIndex == 0 && movingDistance > 0)|| (nowIndex == items.length-1 && movingDistance < 0)){
				movingDistance = 0;
				console.log("movingDistance:"+movingDistance)
			}
			moveDistance = movingDistance + currentDistance;
			nextIndexDistance += movingDistance;
			absNextIndexDistance = Math.abs(nextIndexDistance);
			
			//缩放比
			scaleSize1 = (1.5 - (absNextIndexDistance/distance)*0.5);
			scaleSize2 = (1+(absNextIndexDistance/distance)*0.5);
			marginOffset1 = (70 - (absNextIndexDistance/distance)*50);
			marginOffset2 = (20 + (absNextIndexDistance/distance)*50)
			
			//缩放，当前图片按滑动比例缩小，下一图片按滑动比例缩大,margin-left和margin-right也按比例改变
			items[nowIndex].style.transform = "scale("+scaleSize1+")";
			items[nowIndex].style.marginLeft = marginOffset1+"px";
			items[nowIndex].style.marginRight = marginOffset1+"px";
			if(movingDistance > 0){//右滑
				if(isMovingChangeDirection && nowIndex != items.length-1){
					items[nowIndex+1].style.transform = "scale(1)";
				}
				items[nowIndex-1].style.transform = "scale("+scaleSize2+")";
				items[nowIndex-1].style.marginLeft = marginOffset2+"px";
				items[nowIndex-1].style.marginRight = marginOffset2+"px";
			}else if(movingDistance < 0){//左滑
				if(isMovingChangeDirection && nowIndex != 0){
					items[nowIndex-1].style.transform = "scale(1)";
				}
				items[nowIndex+1].style.transform = "scale("+scaleSize2+")";
				items[nowIndex+1].style.marginLeft = marginOffset2+"px";
				items[nowIndex+1].style.marginRight = marginOffset2+"px";
			}
			
			if(absNextIndexDistance >= distance) { //滑动一格了
				if(movingDistance > 0){//右滑
					items[nowIndex].style.transform = "scale(1)";//先缩放完，再去掉transition,不然就恢复不了
					items[nowIndex].removeAttribute("class");
					nowIndex -= 1;
					items[nowIndex].setAttribute("class","focus");
				}else{//左滑
					items[nowIndex].style.transform = "scale(1)";
					items[nowIndex].removeAttribute("class");
					nowIndex += 1;
					items[nowIndex].setAttribute("class","focus");
				}
				nextIndexDistance = (nextIndexDistance > 0?1:-1)*(absNextIndexDistance-distance);
			}
			
			ulBox.style.left = moveDistance+"px";
			//items[nowIndex].style.transform = "scale("+ (1-(Math.abs(realDistance)>240?240:Math.abs(realDistance)) )+")"
			tempX = movingX;
			console.log("movingX:"+movingX+";movingDistance:"+movingDistance+";moveDistance:"+moveDistance+";nextIndexDistance:"+nextIndexDistance);
		}
	},false);
	
	document.addEventListener('mouseup', function(){
		
		var nextIndex, isSwipeRight;
		isMouseDown = false;
		x2 = event.clientX;
		endTime = new Date().getTime();
		moveTime = endTime - startTime;
		speed = Math.abs(x2 - x1)/moveTime;
		
		if(movingDistance != 0){
			console.log("滑动了");
		}
	
		if(speed !=0 ){
			if(movingDistance > 0){//向右滑
				isSwipeRight = true;
			}else{
				isSwipeRight = false;
			}
			
			console.log("慢速"+";nowIndex:"+nowIndex);
			if(isSwipeRight){
				nextIndex = nowIndex - 1;
			}else{
				nextIndex = nowIndex + 1;
			}
			ulBox.setAttribute("class","finish-ani");
			if((nowIndex > 0 && nowIndex < items.length-1) || (nowIndex == 0 && movingDistance < 0)|| (nowIndex == items.length-1 && movingDistance > 0)){
				ulBox.style.left = (distance - nextIndex*distance)+"px";
				items[nowIndex].style.marginLeft = "20px";
				items[nowIndex].style.marginRight = "20px";
				items[nextIndex].style.marginLeft = "70px";
				items[nextIndex].style.marginRight = "70px";
				items[nowIndex].style.transform = "scale("+1+")";
				items[nextIndex].style.transform = "scale("+1.5+")";
				items[nowIndex].removeAttribute("class");
				items[nextIndex].setAttribute("class","focus");
				nowIndex = nextIndex;
			}
			
			/*if(speed>1 && speed<=3){
				console.log("中速");
				if(isSwipeRight){
					nextIndex = nowIndex - 2;
				}else{
					nextIndex = nowIndex + 2;
				}
			}else{
				console.log("高速");
				if(isSwipeRight){
					nextIndex = nowIndex - 3;
				}else{
					nextIndex = nowIndex + 3;
				}
			}*/
		}
		console.log("x1:"+x1+";x2:"+x2+";startTime:"+startTime+";endTime:"+endTime+";moveTime:"+moveTime);
		
		//swipeFunc(nowIndex,nextIndex);
		
	},false);
}
	
function addMouseWheelEvent() {
	 //给页面绑定滑轮滚动事件，firefox
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    }
   
    //滚动滑轮触发scrollFunc方法
    window.onmousewheel = scrollFunc;
}

function addTouchEvent() {
	if ('ontouchstart' in document) {//支持触摸事件
		console.log("support touch");
		shell.addEventListener('touchstart', onTouchStart, false);
	}
}

function addClickEvent(btns) {
	
	/*for(var i = 0; i < btns.length; i++){
		btns[i].addEventListener("click",(function(i){
			return function(){
				if(nowIndex != i) {//如果不是当前卡片
					swipeFunc(nowIndex, i);
				}
			};
		})(i));//防止闭包
	}*/
	
	//利用事件委托技术解决系能问题
	ulBox.addEventListener("click", function(event) {
		var e = event || window.event;//IE中event是window的一个属性
		var target = e.target || e.srcElement;
		var index = parseInt(target.id.substring(1)) - 1;
		console.log("index:"+index+";target"+target);
		if(index != nowIndex) {
			swipeFunc(nowIndex, index);
		}
		
	},false);
}

function scrollFunc(e) {
    e = e || window.event;
    if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件             
        if (e.wheelDelta > 0) { //当滑轮向上滚动时
            if(nowIndex > 0) {
				swipeFunc(nowIndex,nowIndex-1);
			}
        }
        if (e.wheelDelta < 0) { //当滑轮向下滚动时
            if(nowIndex < items.length - 1) {
				swipeFunc(nowIndex,nowIndex+1);
			}
        }
    } else if (e.detail) {  //Firefox滑轮事件,e.detail的值为负值时，滚轮向上
        if (e.detail < 0) { //当滑轮向上滚动时
           if(nowIndex > 0) {
				swipeFunc(nowIndex,nowIndex-1);
			}
        }
        if (e.detail > 0) { //当滑轮向下滚动时
            if(nowIndex < items.length - 1) {
				swipeFunc(nowIndex,nowIndex+1);
			}
        }
    }
}

function cancelTouch() {
	shell.removeEventListener('touchmove', onTouchMove);
	startX = null;
	isMoving = false;
}

function onTouchEnd(e) {
	console.log("endTime:"+new Date().getTime());
	/*var x = e.touches[0].pageX; 
	var width = parseInt(items[nowIndex-1 >= 0 ? nowIndex-1:nowIndex+1].style.width);
	var marginWidth = 2*parseInt(items[nowIndex-1 >= 0 ? nowIndex-1:nowIndex+1].style.marginLeft);
	var itemWidth = width +marginWidth;
	var swipeIndex = Math.ceil((x -itemWidth / 2) / width);
	var dx = (x - startX)/20;//触屏移动距离缩小10倍
	
	if(dx > 0) {//向右划
		items[nowIndex].removeAttribute("class");
		items[(nowIndex + swipeIndex ) > items.length?items.length-1:nowIndex + swipeIndex].setAttribute("class","focus");	
	}else if(dx < 0){//向左划
		items[nowIndex].removeAttribute("class");
		items[(nowIndex-swipeIndex) < 1?0:nowIndex-swipeIndex].setAttribute("class","focus");	
	}*/

}
	
function onTouchMove(e) {

	if( ! isMoving ) 
		return;
	
	var thresholdX = 20;
	var x = e.touches[0].clientX; 
	var dx =  x - startX;//触屏手势移动距离
	var currentDistance, moveDistance;
	var nextIndex;
	
	realDistance = Math.abs(dx) * scale;//实际页面要移动的距离
	totalRealDistance += realDistance;
	
	console.log("x:"+x+";dx:"+dx+";totalRealDistance:"+totalRealDistance);
	
	currentDistance = getTranslateX();
	if(dx > 0) {//向右划
		moveDistance = currentDistance + realDistance;
	}else if(dx < 0) {//向左划
		moveDistance = currentDistance - realDistance;
	}
	
	if(currentDistance > (nowIndex - 0)*distance){
		moveDistance = (nowIndex - 0)*distance;
	}else if(currentDistance < (nowIndex - items.length + 1  )*distance) {
		moveDistance = (nowIndex - items.length + 1  )*distance;
	}
	
	
	
	/*if ( Math.abs(dx) >= thresholdX ) {
		cancelTouch();
		if(dx > 0){//右划
			if(nowIndex > 0) {
				swipeFunc(nowIndex,nowIndex-1);//只是滑动一个图片
			}
			
		}else {//左划
			if(nowIndex < items.length - 1) {
				swipeFunc(nowIndex,nowIndex+1);
			}
		}
		console.log("nowIndex:" + nowIndex);
	}*/
	moveIndex = Math.floor(Math.abs(totalRealDistance) / liDistance);
	//console.log("+++++"+moveIndex+"********"+nowIndex);
	/*if(moveIndex > 0) {
		items[nowIndex].removeAttribute("class");
		if(dx > 0){
			nextIndex = (nowIndex - moveIndex)<0?0:nowIndex - moveIndex;
			items[nextIndex].setAttribute("class","focus");
			nowIndex = nextIndex;
		}else{
			nextIndex = (nowIndex + moveIndex)>=items.length?items.length-1:nowIndex + moveIndex;
			items[nextIndex].setAttribute("class","focus");
			nowIndex = nextIndex;
		}
		
	}*/
	
	
	ulBox.style.left = moveDistance +"px";
	startX = x;
	
	/*if(realDistance <= liDistance ) {
		items[nowIndex].style.width = realDistance + 'px';
	}*/
	
	//console.log("dx:"+dx+";movedistance:"+moveDistance+";left:"+ulBox.style.left+";realDistance:"+realDistance+";scale:"+scale+";totalRealDistance:"+totalRealDistance);

}

function onTouchStart(e) {

	if (e.touches.length !== 1)
		return;

	startX = e.touches[0].pageX;
	isMoving = true;
	shell.addEventListener('touchmove', onTouchMove, false);
	shell.addEventListener('touchend', onTouchEnd, false);
	
	console.log("touch start:"+startX+";startTime:"+new Date().getTime());
	
}

function scaleAnimation(){
	
}

function movingFunc() {
	
}

/**
 * 两种思路，用left平移或translate平移，其中left兼容性好、获取值方便
 * @param {Object} currentIndex
 * @param {Object} nextIndex
 */

function swipeFunc(currentIndex, nextIndex) {
	if(!(typeof currentIndex == "number" && typeof nextIndex == "number")) {
		return;
	}
	if(nextIndex < 0){
		nextIndex = 0
	}else if(nextIndex > items.length - 1){
		nextIndex = items.length - 1;
	}
	var currentDistance, moveDistance;
	//currentDistance = getTranslateX();
	currentDistance = getTranslateX();
	moveDistance = (currentIndex - nextIndex)*distance + currentDistance;
	/*ulBox.style.transform = "translateX("+ moveDistance +"px)";
	ulBox.style.webkitTransform = "translateX("+ moveDistance +"px)";
	ulBox.style.MozTransform = "translateX("+ moveDistance +"px)";
	ulBox.style.msTransform = "translateX("+ moveDistance +"px)";*/
	ulBox.setAttribute("class","ani");
	items[currentIndex].removeAttribute("class");
	items[nextIndex].setAttribute("class","focus");	
	ulBox.style.left = moveDistance+"px";
	nowIndex = nextIndex;
	console.log("currentIndex:" + currentIndex+";nextIndex:"+nextIndex+";currentDistance:"+currentDistance + ";moveDistacne:"+moveDistance+";nowIndex:"+nowIndex);
}

function getNowIndex() {
	var currentIndex = 0;
	for(var j = 0; j < items.length; j++){
		if(items[j].getAttribute("class") == "focus"){
			currentIndex = j;
		}
	}
	return currentIndex;
}

function getTranslateX() {
	//var matrix = "";
	var tranX = 0;
	/*matrix = window.getComputedStyle ? window.getComputedStyle(ulBox,null).transform : ulBox.currentStyle.transform;
	if(matrix != "none" && matrix != null){
		matrix = matrix.substring(matrix.indexOf("(")+1,matrix.lastIndexOf(")"));
		tranX = parseInt(matrix.split(",")[4]);
	}*/
	//tranX = window.getComputedStyle ? window.getComputedStyle(ulBox,null).left : ulBox.currentStyle.left;
	
	tranX = parseInt(ulBox.style.left?ulBox.style.left:0);
	
	//console.log("*****"+tranX+";ulBox.style.left:"+ulBox.style.left);
	return tranX;
}