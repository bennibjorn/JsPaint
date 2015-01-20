$(document).ready(function(){
    var canvas = document.getElementById("painter");
    var context = canvas.getContext("2d");
    var tempCanvas = document.getElementById("tempPainter");
    var tempContext = tempCanvas.getContext("2d");
    var x0 = 0;
    var y0 = 0;
    var mousePressed = false;

    var currentInputBox;
    var drawing = {
        shapes: [],
        nextObject: "pen",
        nextColor: "black"
    };
        //drawAll: function drawAll() {
        //    for (var i = 0; i < shapes.length; ++i) {
        //        shapes[i].draw(// TODO: there will be some parameters here...);
        //    }
        //}

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
    $("#painter").mousedown(function(e) {
        x0 = e.pageX - this.offsetLeft;
        y0 = e.pageY - this.offsetTop;

        if (drawing.nextObject == "rect") {
            //Implemented in mouseup
        }
        else if (drawing.nextObject == "line") {
            //Implemented in mouseup
        }
        else if (drawing.nextObject == "circle") {
            mousePressed = true;
            context.beginPath();
        }
        else if (drawing.nextObject == "pen") {
            mousePressed = true;
            context.beginPath();
            context.moveTo(x0,y0);
        }
        else if (drawing.nextObject == "text") {
        }
    });

    $("#painter").mousemove(function(e) {
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;

        if (drawing.nextObject == "rect") {
            //TODO
        }
        else if (drawing.nextObject == "line") {
            //TODO
        }
        else if (drawing.nextObject == "circle") {
            //TODO: add functionality for circle
        }
        else if (drawing.nextObject == "pen") {
            if(mousePressed) {
                context.lineTo(x,y);
            }
        }
        else if (drawing.nextObject == "text") {
            //TODO
        }
        /*
        else if (3dTool) {
            if(mousePressed) {
                context.beginPath();
                context.moveTo(x0,y0);
                context.lineTo(x,y);
                context.stroke();
            }
        }
        */
    });

    $("#painter").mouseup(function(e) {
        var x1 = e.pageX - this.offsetLeft;
        var y1 = e.pageY - this.offsetTop;

        if (drawing.nextObject == "rect") {
            context.fillStyle = drawing.nextColor;
            context.fillRect(x0, y0, (x1 - x0), (y1-y0));
        }
        else if (drawing.nextObject == "line") {
            context.beginPath();
            context.strokeStyle = drawing.nextColor;
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.closePath();
            context.stroke();
        }
        else if (drawing.nextObject == "circle") {
            mousePressed = false;
            context.arc(x1-x0, (y1-y0), ((x1-x0)/2), 0, 2 * Math.PI);
            context.stroke();
            //context.arc((x1-x0), (y1-y0), ((x1-x0)/2), 0, 2 * Math.PI);
        }
        else if (drawing.nextObject == "pen") {
            mousePressed = false;
            //context.closePath();
            context.stroke();
        }
        else if (drawing.nextObject == "text") {
            if (currentInputBox) {
                currentInputBox.remove();
            }
            var inputposY = y1 + 120;
            var inputposX = x1 + 40;
            currentInputBox = $("<input />");
            currentInputBox.css("position", "fixed");
            currentInputBox.css("top", inputposY);
            currentInputBox.css("left", inputposX);

            $(".canvasdiv").append(currentInputBox);
            currentInputBox.focus();
        }
    });

    $(document).keypress(function(event) {
        if(event.which === 13 && drawing.nextObject == "text") {
            if(currentInputBox) {
                var inputBoxOffset = currentInputBox.offset();
                canvastext(inputBoxOffset.left, inputBoxOffset.top, currentInputBox.val());
                currentInputBox.remove();
            }
        }
    });

    function canvastext(left, top, text) {
        context.font = "14px Georgia";
        context.fillText(text, left, top);
    }

    $("#clearBtn").mousedown(function() {
       context.clearRect(0, 0, canvas.width, canvas.height);
    });

    $(".toolButton").mousedown(function() {
        drawing.nextObject = $(this).attr("data-tooltype");
    });
});
