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
        fontsize: "20px",
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
            context.fillStyle = this.color;
            context.fillRect(this.x0, this.y0, this.width, this.height);
        }
    });

    var Circle = Rect.extend({
        constructor: function(x, y, h, w, color, lw) {
            this.base(x, y, h, w, color, lw);
        },

        draw: function() {
            drawEllipse(context, this.x0, this.y0, this.width, this.height, this.lineWidth, this.color);
        },
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

    function Pen(arr) {
        //TODO
    }

    function Text() {
        //TODO
    }

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
            drawEllipse(tempContext, x0, y0, (x-x0), (y-y0), drawing.lineWidth, drawing.nextColor);
        }
        else if (drawing.nextObject == "pen" && mousePressed) {
            tempContext.lineTo(x,y);
            tempContext.strokeStyle = drawing.nextColor;
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
            tempContext.clearRect(0, 0, canvas.width, canvas.height); // Temp fix for line not going away

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
            fromTempToCanvas();
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

    function fromTempToCanvas() {
        tempContext.closePath();
        context.drawImage(tempCanvas, 0, 0);
        tempContext.clearRect(0, 0, canvas.width, canvas.height);
    }

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

    $(document).keydown(function(e) {
       if(e.which == 27) {
           tempContext.clearRect(0, 0, canvas.width, canvas.height);
           tempContext.beginPath();
       }
    });

    function canvastext(left, top, text) {
        if (text == "3d") { //oooo secret stuff
            drawing.nextObject = "3dTool";
            alert("Enjoy your Easter egg");
            return;
        } else if (text == "easterFill") { easterFill(); return; }
        context.font = drawing.fontsize + ' ' + drawing.nextFont;
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

    $("#clearBtn").mousedown(function() {
       context.clearRect(0, 0, canvas.width, canvas.height);
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
    $(".fontSize").mousedown(function() {
        drawing.fontsize = $(this).attr("data-tooltype");
    });
    $(".fontSelect").mousedown(function() {
        drawing.nextFont = $(this).attr("data-tooltype");
    });
});
