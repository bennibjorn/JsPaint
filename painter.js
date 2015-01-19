$(document).ready(function(){
    var canvas = document.getElementById("painter");
    var context = canvas.getContext("2d");
    var drawing = {
        shapes: [],
        nextObject: "pen",
        nextColor: "black"

        //drawAll: function drawAll() {
        //    for (var i = 0; i < shapes.length; ++i) {
        //        shapes[i].draw(// TODO: there will be some parameters here...);
        //    }
        //}
    };

    // Mouse handlers
    /*
    $("#painter").mousemove(function(e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(mouseX, mouseY);
        context.stroke();
    });
    */
    $("#painter").mousedown(function(e) { //paints a black rect on mousedown
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        context.fillStyle = "black";
        context.fillRect(mouseX - 30, mouseY - 30, 60, 60);
    });
    $("#clearBtn").mousedown(function() {
       context.clearRect(0, 0, canvas.width, canvas.height);
    });

    $(".toolButton").mousedown(function() {
        drawing.nextObject = $(this).attr("data-tooltype");
    });
});

//
//
//$(".colorButton").click(function(event) {
//    // Similar code to the toolButton event handler above
//    drawing.nextColor = ...
//});
//
//$("#myCanvas").mousedown(function(e) {
//    if (nextObject === "rect") {
//        // Should draw a rectangle
//        drawing.shapes.push( new Rect(drawing.nextColor, e.X, e.Y ));
//    } else if (nextObject === "circle") {
//        drawing.shapes.push( new Circle(drawing.nextColor, e.X, e.Y ));
//    }
//});
//
//function Shape() {
//    this.x = x;
//    this.y = y;
//    this.color = color;
//
//    this.isAtPoint = function(x,y) {
//        //
//    }
//}
//
//function Rect(color, x, y) {
//    this.draw = function draw () {
//        // TODO: learn about canvas!!!
//    },
//        this.isAtPoint = function(x,y) {
////		return this.shape.isAtPoint(x,y)
//        }
//}
//
//Rect.prototype = new Shape();
//
//function Circle() {
//    this.draw = function draw() {
//        // TODO: learn about canvas!!!
//    }
//}
//
//Circle.prototype = new Shape();
