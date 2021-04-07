// canvas related vars
var canvas=document.createElement("canvas");
var ctx=canvas.getContext("2d");
var cw=canvas.width;
var ch=canvas.height;
document.body.appendChild(canvas);
canvas.style.border='1px solid red';
var context = canvas.getContext("2d");

// used to calc canvas position relative to window
function reOffset(){
    var BB=canvas.getBoundingClientRect();
    offsetX=BB.left;
    offsetY=BB.top;        
}
var offsetX,offsetY;
reOffset();
window.onscroll=function(e){ reOffset(); }
window.onresize=function(e){ reOffset(); }
canvas.onresize=function(e){ reOffset(); }

// save relevant information about shapes drawn on the canvas
var shapes=[];
// define one rect and save it in the shapes[] array
shapes.push( {x:100, y:20, width:75, height:35, color:'red'} );
shapes.push( {x:30, y:60, width:100, height: 45, color:'blue'} );
// define one rectangle and save it in the shapes[] array
console.log("initial shapes array: ", shapes)

// drag related vars
var isDragging=false;
var startX,startY;
var mouseX, mouseY, posX, posY;

// hold the index of the shape being dragged (if any)
var selectedShapeIndex;

var isDrawing = false;

// given mouse X & Y (mx & my) and shape object
// return true/false whether mouse is inside the shape
function isMouseInShape(mx,my,shape){
    console.log("mx, my" + " " + mx + " " + my)
    console.log("shape " + shape.width, shape.height, shape.color)
     if(shape.width){
        // this is a rectangle
        // if(shape.width < 0){
            //     shape.width * -1
            // } 
            // if(shape.height <0 ){
                //     shape.height * -1
                // }
        var rLeft=shape.x;
        var rRight=shape.x+shape.width;
        var rTop=shape.y;
        var rBott=shape.y+shape.height;
        console.log(" rleft " + " " + rLeft + " rRight " + " " + rRight + " rTop " + " " + rTop + " rBott " + " " + rBott)
        // math test to see if mouse is inside rectangle
        if( mx>rLeft && mx<rRight && my>rTop && my<rBott ){
            console.log("it's on a rectangle");
            return(true);
        }
    }
    // the mouse isn't in any of the shapes
    console.log("you missed!");
    return(false);
}

function handleMouseDown(e){
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // calculate the current mouse position
    startX=parseInt(e.clientX-offsetX);
    startY=parseInt(e.clientY-offsetY);
    // test mouse position against all shapes

    // post result if mouse is in a shape
    for(var i=0;i<shapes.length;i++){
        if(isMouseInShape(startX,startY,shapes[i])){
            // the mouse is inside this shape
            // select this shape
            selectedShapeIndex=i;
            // set the isDragging flag
            isDragging=true;
            isDrawing=false;
            // and return (==stop looking for 
            //     further shapes under the mouse)
            return;
        }
    }
    isDrawing = true;
    isDragging=false;
    return 
}

function handleMouseUp(e){
    // return if we're not dragging
    if(!isDragging && !isDrawing){return;}
    // tell the browser we're handling this event
    canvas.style.cursor = "default";
    e.preventDefault();
    e.stopPropagation();
    if(isDrawing){
        console.log("EEEEEEEE", e)
        var widthX = posX - startX
        var heightY = posY - startY

        shapes.push({
            x: widthX > 0 ? startX : posX,
            y: heightY > 0 ? startY : posY,
            width: widthX > 0 ? widthX : startX - posX,
            height: heightY > 0 ? heightY : startY - posY,
          });
        isDrawing = false;
    }
    
    // the drag is over -- clear the isDragging flag
    isDragging=false;
    isDrawing=false;
    console.log("startX", startX, "posX", posX)
    console.log("startY", startY, "posY", posY)
    console.log("current shapes array: ", shapes)
}

function handleMouseOut(e){
    // return if we're not dragging
    if(!isDragging){return;}
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // the drag is over -- clear the isDragging flag
    isDragging=false;
    isDrawing=false;
}

function handleMouseMove(e){
    // if dragging, drag the shape
    if(isDragging && !isDrawing){
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // calculate the current mouse position         
        mouseX=parseInt(e.clientX-offsetX);
        mouseY=parseInt(e.clientY-offsetY);
        // how far has the mouse dragged from its previous mousemove position?
        var dx=mouseX-startX;
        var dy=mouseY-startY;
        // move the selected shape by the drag distance
        var selectedShape=shapes[selectedShapeIndex];
        selectedShape.x+=dx;
        selectedShape.y+=dy;
        // clear the canvas and redraw all shapes
        drawAll();
        // update the starting drag position (== the current mouse position)
        startX=mouseX;
        startY=mouseY;
    } else if (!isDragging && isDrawing){
       //do logic to draw something
       e.preventDefault();
       e.stopPropagation();

       // calculate the current mouse position         
       posX=parseInt(e.clientX-offsetX);
       posY=parseInt(e.clientY-offsetY);

       canvas.style.cursor = "crosshair";

       context.beginPath();
       context.rect(startX, startY, posX - startX, posY - startY);
    //    console.log("startX, startY, posX, posY = ", startX + " " + startY + " " + posX + " " + posY)
    //    console.log("posX - startX, posY - startY = ", posX - startX + " " + posY - startY)
       context.fill();
        } else if (!isDrawing && !isDragging) {
            return;
        }
}

// clear the canvas and 
// redraw all shapes in their current positions
function drawAll(){
    ctx.clearRect(0,0,cw,ch);
    for(var i=0;i<shapes.length;i++){
        var shape=shapes[i];
        if(shape.radius){
            // it's a circle
            ctx.beginPath();
            ctx.arc(shape.x,shape.y,shape.radius,0,Math.PI*2);
            ctx.fillStyle=shape.color;
            ctx.fill();
        }else if(shape.width){
            // it's a rectangle
            ctx.fillStyle=shape.color;
            ctx.fillRect(shape.x,shape.y,shape.width,shape.height);
        }
    }
}


// draw the shapes on the canvas
drawAll();

// listen for mouse events
canvas.onmousedown=handleMouseDown;
canvas.onmousemove=handleMouseMove;
canvas.onmouseup=handleMouseUp;
canvas.onmouseout=handleMouseOut;
