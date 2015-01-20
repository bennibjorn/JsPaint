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
        nextColor: "black",
        nextFont: "Georgia",
        fontsize: "20px"
    };

    // Mouse handlers
    $("#tempPainter").mousedown(function(e) {
        x0 = e.pageX - $(this).offset().left;
        y0 = e.pageY - $(this).offset().top;
        mousePressed = true;

        //console.log(x0 + ", " + y0);
        if (drawing.nextObject == "rect") {
            //Implemented in mousemove
        }
        else if (drawing.nextObject == "line") {
            //Implemented in mousemove
        }
        else if (drawing.nextObject == "circle") {
            //Implemented in mousemove
        }
        else if (drawing.nextObject == "pen") {
            tempContext.beginPath();
            tempContext.moveTo(x0,y0);
        }
    });

    $("#tempPainter").mousemove(function(e) {
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;

        //console.log(x + ", " + y);

        if (drawing.nextObject == "rect" && mousePressed) {
            tempContext.fillStyle = drawing.nextColor;
            tempContext.clearRect(0, 0, canvas.width, canvas.height);
            tempContext.fillRect(x0, y0, (x - x0), (y - y0));
        }
        else if (drawing.nextObject == "line" && mousePressed) {
            tempContext.clearRect(0, 0, canvas.width, canvas.height);
            tempContext.beginPath();
            tempContext.strokeStyle = drawing.nextColor;
            tempContext.moveTo(x0, y0);
            tempContext.lineTo(x, y);
            tempContext.stroke();
            tempContext.closePath();
        }
        else if (drawing.nextObject == "circle" && mousePressed) {
            tempContext.clearRect(0, 0, canvas.width, canvas.height);
            tempContext.beginPath();
            tempContext.arc(Math.abs(x-x0), Math.abs(y-y0), Math.abs((x-x0)/2), 0, 2 * Math.PI);
            tempContext.stroke();
        }
        else if (drawing.nextObject == "pen" && mousePressed) {
            tempContext.lineTo(x,y);
            tempContext.strokeStyle = drawing.nextColor;
            tempContext.stroke();
        }
        else if (drawing.nextObject == "3dTool") { //bonus
            if(mousePressed) {
                context.beginPath();
                context.moveTo(x0,y0);
                context.lineTo(x,y);
                context.stroke();
            }
        }
    });

    $("#tempPainter").mouseup(function(e) {
        var x1 = e.pageX - $(this).offset().left;
        var y1 = e.pageY - $(this).offset().top;
        mousePressed = false;

        if (drawing.nextObject == "rect") {
            mousePressed = false;
            context.fillStyle = drawing.nextColor;
            context.fillRect(x0, y0, (x1 - x0), (y1-y0));
            tempContext.clearRect(0, 0, canvas.width, canvas.height);
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
            tempContext.closePath();
            context.drawImage(tempCanvas, 0, 0);
            tempContext.clearRect(0, 0, canvas.width, canvas.height);
        }
        else if (drawing.nextObject == "pen") {
            tempContext.closePath();
            context.drawImage(tempCanvas, 0, 0);
            tempContext.clearRect(0, 0, canvas.width, canvas.height);
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

            $(".canvasContainer").append(currentInputBox);
            currentInputBox.focus();
        }
    });

    $(document).keypress(function(event) {
        if(event.which === 13 && drawing.nextObject == "text") {
            if(currentInputBox) {
                var inputBoxOffset = currentInputBox.offset();
                canvastext(inputBoxOffset.left, inputBoxOffset.top, currentInputBox.val());
                //canvastext(x1, y1, currentInputBox.val());
                currentInputBox.remove();
            }
        }
    });

    function canvastext(left, top, text) {
        if (text == "3d") { //oooo secret stuff
            drawing.nextObject = "3dTool";
        }
        context.font = drawing.fontsize + ' ' + drawing.nextFont;
        context.fillStyle = drawing.nextColor;
        context.fillText(text, left, top);
    }

    $("#clearBtn").mousedown(function() {
       context.clearRect(0, 0, canvas.width, canvas.height);
    });

    $(".toolButton").mousedown(function() {
        drawing.nextObject = $(this).attr("data-tooltype");
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            $(this).addClass('selected');
        }
    });
    $(".colorButton").mousedown(function() {
       drawing.nextColor = $(this).attr("data-tooltype");
    });
    $(".fontSize").mousedown(function() {
        drawing.fontsize = $(this).attr("data-tooltype");
    });
    $(".fontSelect").mousedown(function() {
        drawing.nextFont = $(this).attr("data-tooltype");
    });
});
