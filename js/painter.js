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
        redo: [],
        nextObject: "pen",
        nextColor: "black",
        nextFont: "px " + "Arial",
        fontSize: 10,
        lineWidth: 5
    };

    var Shape = Base.extend({
        constructor: function(x, y, color, lw, tool) {
            this.x0 = x;
            this.y0 = y;
            this.color = color;
            this.lineWidth = lw;
            this.tool = tool;
        },
        x0: 0,
        y0: 0,
        color: "black",
        lineWidth: 1,
        tool: ""
    });

    var Rect = Shape.extend({
        constructor: function(x, y, h, w, color, lw) {
            this.base(x, y, color, lw, "rect");
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

    var Circle = Shape.extend({
        constructor: function(x, y, h, w, color, lw) {
            this.base(x, y, color, lw, "circle");
            this.height = h;
            this.width = w;
        },
        height: 0,
        width: 0,

        draw: function() {
            context.strokeStyle = this.color;
            context.lineWidth = this.lineWidth;
            drawEllipse(context, this.x0, this.y0, this.width, this.height, this.lineWidth, this.color);
        }
    });

    var Line = Shape.extend({
        constructor: function(x, y, x1, y1, color, lw) {
            this.base(x, y, color, lw, "line");
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
            this.base(x, y, color, lw, "pen");
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
            this.base(x, y, color, lw, "text");
            this.font = font;
            this.fontSize = fontSize;
            this.text = text;
        },
        font: "Arial",
        fontSize: 14,
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

            context.font = this.fontSize + this.font;
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
            context.strokeStyle = drawing.nextColor;
            context.lineWidth = drawing.lineWidth;
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
    $("#clearBtn").mousedown(function() { //clears the screen and empties both arrays
        clear();
        while (drawing.shapes.length > 0) {
            drawing.shapes.pop();
        }
        while (drawing.redo.length > 0) {
            drawing.redo.pop();
        }
    });
    $(".toolButton").mousedown(function() {
        drawing.nextObject = $(this).attr("data-tooltype");
        $(".toolButton").removeClass("selected");
        $(this).addClass("selected");
    });
    $(function () { //to initialize the tooltips for the toolButtons
        $('[data-toggle="tooltip"]').tooltip()
    });
    $("#hexColorInput").change(function() {
        drawing.nextColor = document.getElementById("hexColorInput").value;
        document.getElementById("hexColorButton").style.backgroundColor = drawing.nextColor;
    });
    $(".lineWidth").mousemove(function () {
        drawing.lineWidth = document.getElementById("lineW").value;
        $(".lineWidthBadge").text(drawing.lineWidth);
    });
    $("#fontSize").mousemove(function() {
        drawing.fontSize = document.getElementById("fontSize").value;
        $(".fontSizeBadge").text(drawing.fontSize);
    });
    $(".fontSelect").mouseup(function() {
        drawing.nextFont = $(this).attr("data-font");
    });
    $(".undo").mousedown(function () {
        var temp = drawing.shapes.pop();
        drawing.redo.push(temp);
        clear();

        for(var i = 0; i < drawing.shapes.length; i++) {
            drawing.shapes[i].draw();
        }
    });
    $(".redo").mousedown(function () {
        var temp = drawing.redo.pop();
        drawing.shapes.push(temp);
        temp.draw();
    });

    // Save API
    $('#saveModal').on('shown.bs.modal', function () {
        $('#saveUsername').focus();
    });
    $("#saveButton").mouseup(function() {
        var username = $("#saveUsername").val();
        var title = $("#saveTitle").val();
        var stringifiedArray = JSON.stringify(drawing.shapes);

        var param = {
            "user": username,
            "name": title,
            "content": stringifiedArray,
            "template": false
        };

        $.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "http://whiteboard.apphb.com/Home/Save",
				data: param,
				dataType: "jsonp",
				crossDomain: true,
				success: function () {
                    $('#saveModal').modal('hide');
				},
				error: function (xhr, err) {
                    alert("Sorry didn't work :(");
                    console.log("xhr: " + xhr);
                    console.log("err: " + err);
				}
			});
    });

    // Load API
    $('#loadModal').on('shown.bs.modal', function () {
        $('#loadUsername').focus();
    });
    $("#loadListButton").mouseup(function() {
        var username = $("#loadUsername").val();

        var param = {
            "user": username,
            "template": false
        };

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "http://whiteboard.apphb.com/Home/GetList",
            data: param,
            dataType: "jsonp",
            crossDomain: true,
            success: function (data) {
                // The save was successful...
                printLoadList(data);
            },
            error: function (xhr, err) {
                // Something went wrong...
                alert("Save didn't work" + "\n" + xhr + "\n" + err);
            }
        });
    });

    var whiteboardID = 0;
    function printLoadList(data) {
        var loadedList = [];
        for(var i = 0; i < data.length; i++) {
            loadedList.push('<button type="button" class="btn btn-default btn-block loadWhiteboardButton" data-whiteboardID="' + data[i].ID + '">' + data[i].WhiteboardTitle + '</button>');
        }
        loadedList.join("");

        $(".loadList").html(loadedList);

        $(".loadWhiteboardButton").mouseup(function() {
            whiteboardID = $(this).attr("data-whiteboardID");
        });

        console.log(drawing.shapes);
    }

    $("#loadSelectedButton").mouseup(function() {
         $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "http://whiteboard.apphb.com/Home/GetWhiteboard",
            data: {"ID": whiteboardID},
            dataType: "jsonp",
            crossDomain: true,
            success: function (data) {
                // The save was successful...
                var arr = JSON.parse(data.WhiteboardContents);
                console.log(arr);
                console.log(drawing.shapes);
                loadWorker(arr);
                console.log(drawing.shapes);
            },
            error: function (xhr, err) {
                // Something went wrong...
                alert("Save didn't work" + "\n" + xhr + "\n" + err);
            }
        });
    });

    function loadWorker(arr) {
        for(var i = 0; i < arr.length; i++) {
            var tooltype = arr[i].tool;
            var item = arr[i];
            clear();
            while (drawing.shapes.length > 0) {
                drawing.shapes.pop();
            }
            console.log("item: ");
            console.log(item);

            if(tooltype === "rect") {
                drawing.shapes.push(new Rect(item.x0, item.y0, item.height, item.width, item.color, item.lineWidth));
                console.log(drawing.shapes);
            }
            else if(tooltype === "circle") {
                var c = new Circle(item.x0, item.y0, item.height, item.width, item.color, item.lineWidth);
                c.draw();
                console.log(c);
                drawing.shapes.push(c);
            }
            else if(tooltype === "line") {
                var l = new Line(item.x0, item.y0, item.x1, item.y1, item.color, item.lineWidth);
                l.draw();
                drawing.shapes.push(new Line(item.x0, item.y0, item.x1, item.y1, item.color, item.lineWidth));
                console.log(drawing.shapes);
            }
            else if(tooltype === "pen") {
                var p = new Pen(item.x0, item.y0, item.color, item.lineWidth);
                p.arr = item.arr;
                p.draw();
                drawing.shapes.push(p);
            }
            else if(tooltype === "text") {
                var t = new Text(item.x0, item.y0, item.font, item.fontSize, item.text, item.color, item.lineWidth);
                t.draw();
                drawing.shapes.push(t);
            }
        }
    }
});
