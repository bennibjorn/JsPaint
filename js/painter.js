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
        temp: [],
        nextObject: "pen",
        nextColor: "black",
        nextFont: "Georgia",
        fontSize: "20px",
        lineWidth: 5
    };

    var Shape = Base.extend({
        constructor: function(x, y, color, lw) {
            this.x0 = x;
            this.y0 = y;
            this.color = color;
            this.lineWidth = lw;
        },
        x0: 0,
        y0: 0,
        color: "black",
        lineWidth: 1
    });



    var Rect = Shape.extend({
        constructor: function(x, y, h, w, color, lw) {
            this.base(x, y, color, lw);
            this.height = h;
            this.width = w;
        },
        height: 0,
        width: 0,

        draw: function() {
            context.strokeStyle = this.color;
            context.lineWidth = this.lineWidth;
            context.strokeRect(this.x0, this.y0, this.width, this.height);
        }
    });

    var Circle = Rect.extend({
        constructor: function(x, y, h, w, color, lw) {
            this.base(x, y, h, w, color, lw);
        },

        draw: function() {
            context.strokeStyle = this.color;
            context.lineWidth = this.lineWidth;
            drawEllipse(context, this.x0, this.y0, this.width, this.height, this.lineWidth, this.color);
        }
    });

    var Line = Shape.extend({
        constructor: function(x, y, x1, y1, color, lw) {
            this.base(x, y, color, lw);
            this.x1 = x1;
            this.y1 = y1;
        },
        x1: 0,
        y1: 0,

        draw: function() {
            context.beginPath();
            context.strokeStyle = this.color;
            context.lineWidth = this.lineWidth;
            context.moveTo(this.x0, this.y0);
            context.lineTo(this.x1, this.y1);
            context.stroke();
            context.closePath();
        }
    });

    var Pen = Shape.extend({
        constructor: function(x, y, color, lw) {
            this.base(x, y, color, lw);
            this.arr = [];
        },
        arr: [],

        draw: function() {
            context.beginPath();
            context.strokeStyle = this.color;
            context.lineWidth = this.lineWidth;
            context.moveTo(this.x0, this.y0);

            for(var i = 0; i < this.arr.length; i++) { // Line to every point the mouse moved to while pressed
                var x = this.arr[i].x;
                var y = this.arr[i].y;
                context.lineTo(x, y);
            }

            context.stroke();
            context.closePath();
        }
    });

    var Text = Shape.extend({
        constructor: function(x, y, font, fontSize, text, color, lw) {
            this.base(x, y, color, lw);
            this.font = font;
            this.fontSize = fontSize;
            this.text = text;
        },
        font: "Arial",
        fontSize: "14px",
        text: "",

        draw: function() {
            if (this.text === "3d") { //oooo secret stuff
                drawing.nextObject = "3dTool";
                alert("Enjoy your Easter egg");
                return;
            }
            else if (this.text === "easterFill") {
                easterFill();
                return;
            }

            context.font = this.fontSize + ' ' + this.font;
            context.fillStyle = drawing.nextColor;
            context.fillText(this.text, this.x0, this.y0);
        }
    });

    // DrawEllipse function gotten from http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas/2173084#2173084 through link in slides
    function drawEllipse(ctx, x, y, w, h, lw, c) {
        var kappa = 0.5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        ctx.beginPath();
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        ctx.strokeStyle = c;
        ctx.lineWidth = lw;
        ctx.stroke();
    }

    // Mouse handlers
    $("#tempPainter").mousedown(function(e) {
        x0 = e.pageX - $(this).offset().left;
        y0 = e.pageY - $(this).offset().top;
        mousePressed = true;

        //console.log(x0 + ", " + y0);
        if (drawing.nextObject == "rect") {
            drawing.shapes.push(new Rect(x0, y0, 0, 0, drawing.nextColor, drawing.lineWidth));
        }
        else if (drawing.nextObject == "line") {
            drawing.shapes.push(new Line(x0, y0, x0, y0, drawing.nextColor, drawing.lineWidth));
        }
        else if (drawing.nextObject == "circle") {
            drawing.shapes.push(new Circle(x0, y0, 0, 0, drawing.nextColor, drawing.lineWidth));
        }
        else if (drawing.nextObject == "pen") {
            drawing.shapes.push(new Pen(x0, y0, drawing.nextColor, drawing.lineWidth));
            tempContext.beginPath();
            tempContext.moveTo(x0,y0);
        }
        else if (drawing.nextObject == "text") {
            // x, y, font, fontSize, text, color, lw
            drawing.shapes.push(new Text(x0, y0, drawing.nextFont, drawing.fontSize, "", drawing.nextColor, drawing.lineWidth));
        }
    });

    $("#tempPainter").mousemove(function(e) {
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;

        if (drawing.nextObject == "rect" && mousePressed) {
            tempContext.strokeStyle = drawing.nextColor;
            tempContext.clearRect(0, 0, canvas.width, canvas.height);
            tempContext.strokeRect(x0, y0, (x - x0), (y - y0));
            tempContext.lineWidth = drawing.lineWidth;
        }
        else if (drawing.nextObject == "line" && mousePressed) {
            tempContext.clearRect(0, 0, canvas.width, canvas.height);
            tempContext.beginPath();
            tempContext.strokeStyle = drawing.nextColor;
            tempContext.moveTo(x0, y0);
            tempContext.lineTo(x, y);
            tempContext.stroke();
            tempContext.closePath();
            tempContext.lineWidth = drawing.lineWidth;
        }
        else if (drawing.nextObject == "circle" && mousePressed) {
            tempContext.clearRect(0, 0, canvas.width, canvas.height);
            drawEllipse(tempContext, x0, y0, (x-x0), (y-y0), drawing.lineWidth, drawing.nextColor);
        }
        else if (drawing.nextObject == "pen" && mousePressed) {
            drawing.shapes[drawing.shapes.length - 1].arr.push({x: x, y: y});

            tempContext.lineTo(x,y);
            tempContext.strokeStyle = drawing.nextColor;
            tempContext.lineWidth = drawing.lineWidth;
            tempContext.stroke();

        }
        else if (drawing.nextObject == "3dTool" && mousePressed) { //bonus
            context.beginPath();
            context.moveTo(x0,y0);
            context.lineTo(x,y);
            context.stroke();
        }
    });

    $("#tempPainter").mouseup(function(e) {
        var x1 = e.pageX - $(this).offset().left;
        var y1 = e.pageY - $(this).offset().top;
        mousePressed = false;

        tempContext.clearRect(0, 0, canvas.width, canvas.height); // Cleaning up

        if (drawing.nextObject == "rect") {
            var r = drawing.shapes.pop();
            r.x1 = x1;
            r.y1 = y1;
            r.width = (x1 - r.x0);
            r.height = (y1 - r.y0);
            r.draw();
            drawing.shapes.push(r);
        }
        else if (drawing.nextObject == "line") {
            var l = drawing.shapes.pop();
            l.x1 = x1;
            l.y1 = y1;
            l.draw();
            drawing.shapes.push(l);
        }
        else if (drawing.nextObject == "circle") {
            var c = drawing.shapes.pop();
            c.x1 = x1;
            c.y1 = y1;
            c.width = (x1 - c.x0);
            c.height = (y1 - c.y0);
            c.draw();
            drawing.shapes.push(c);
        }
        else if (drawing.nextObject == "pen") {
            drawing.shapes[drawing.shapes.length - 1].draw();
        }
        else if (drawing.nextObject == "text") {
            if (currentInputBox) {
                currentInputBox.remove();
            }
            var inputposY = e.pageY - 20;   // -20 so the canvas text is at the same place as the input box
            var inputposX = e.pageX;
            currentInputBox = $("<input />");
            currentInputBox.css("position", "fixed");
            currentInputBox.css("top", inputposY);
            currentInputBox.css("left", inputposX);

            $(".canvasContainer").append(currentInputBox);
            currentInputBox.focus();
            // Continues after user presses ENTER
        }
    });

    // ENTER function for text-input
    $(document).keypress(function(event) {
        if(event.which === 13 && drawing.nextObject == "text") {
            if(currentInputBox) {
                var t = drawing.shapes.pop();
                t.text = currentInputBox.val();
                t.draw();
                drawing.shapes.push(t);

                currentInputBox.remove();
            }
        }
    });

    // ESC function
    $(document).keydown(function(e) {
       if(e.which == 27) {
           tempContext.clearRect(0, 0, canvas.width, canvas.height);
           tempContext.beginPath();
           drawing.shapes.pop();
       }
    });

    function canvasText(left, top, text) {
        if (text == "3d") { //oooo secret stuff
            drawing.nextObject = "3dTool";
            alert("Enjoy your Easter egg");
            return;
        } else if (text == "easterFill") { easterFill(); return; }
        context.font = drawing.fontSize + ' ' + drawing.nextFont;
        context.fillStyle = drawing.nextColor;
        context.fillText(text, left, top);
    }

    function easterFill() {
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();

        var easteri = 0;
        var easterj = 0;
        var easterk = 0;

        function lineFill(context) {
            context.beginPath();
            context.moveTo(250, 250);
            context.lineTo(easteri, easterj);
            context.stroke();

            if(easterk < 500) {
                easteri++;
                easterk++;
            } else if(500 <= easterk && easterk < 1000) {
                easterj++;
                easterk++;
            } else if(1000 <= easterk && easterk < 1500) {
                easteri--;
                easterk++;
            } else if(1500 <= easterk && easterk < 2001 ) {
                easterj--;
                easterk++;
            }
        }

        function animate(context) {
            lineFill(context);
            window.requestAnimFrame(function() {
                if(easterk != 2001) {
                  animate(context);
                }
            });
        }

        animate(context);
    }
    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        tempContext.clearRect(0, 0, canvas.width, canvas.height);

    }
    $("#clearBtn").mousedown(function() {
        clear();
        while (drawing.shapes.length > 0) {
            drawing.shapes.pop();
        }
    });

    $(".toolButton").mousedown(function() {
        drawing.nextObject = $(this).attr("data-tooltype");
        $(".toolButton").removeClass("selected");
        $(this).addClass("selected");
    });
    $(".colorButton").mousedown(function() {
        drawing.nextColor = $(this).attr("data-tooltype");
        $(".colorButton").removeClass("selected");
        $(this).addClass("selected");
    });
    $(".lineWidth").click(function () {
        //drawing.lineWidth = $(this).value();
        drawing.lineWidth = document.getElementById("lW").value;
    });
    $(".fontSize").mouseup(function() {
        //drawing.fontSize = $(this).attr("data-tooltype");
        drawing.fontSize = document.getElementsByClassName(".fontSize");
    });
    $(".fontSelect").mouseup(function() {
        drawing.nextFont = $(this).attr("data-tooltype");
    });
    $(".undo").mousedown(function () {
        drawing.temp.push(drawing.shapes.pop);
        clear();
        for (var i = 0; i < drawing.shapes.length(); i++) {
            drawing.shapes[i].draw();
        }
    });
    $(".redo").mousedown(function () {
        drawing.shapes.push(drawing.temp.pop);
        clear();
        for (var i = 0; i < drawing.shapes.length(); i++) {
            context.drawImage(drawing.shapes[i], 0, 0);
        }
    });
});
