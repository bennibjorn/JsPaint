Programming assignment 1

In this assignment, your task is to write a drawing application, using JavaScript and HTML5. It should use the HTML5 canvas element, and use object-oriented design for the JavaScript code. A use case for your application could be for a teacher which wants to use your application instead of a regular whiteboard.

The application should be capable of the following:

(40%) it should be possible to add primitive drawing objects to the drawing, i.e.:
circle
rectangle
line
text
pen (i.e. a freehand drawing)
This should work similarly as in most drawing programs (MSPaint, Gimp etc.). The pen should be the default drawing object.
(10%) It should be able to manipulate various properties of the drawing objects, such as their color(s), linewidth, font etc.
(10%) the application should support undo and redo. It is sufficient that each object added to the drawing can be "undone" (and redone). A penstroke should be considered a single object, i.e. when that object is undone it should disappear completely.
(10%) all elements should be movable.
(10%) it should be possible to save and load a drawing (See below: an API is provided which makes this easier).
Also, the following will be considered in the final grade as well:

(10%) code quality (consistency in indentation, variable names, brace placements, whitespace usage etc., structure of the code (are there many global variables? Is the code split up into different files?)
(10%) usability: is it easy to use the application? Does it have sensible defaults? 
Bonus points (which could bring the grade up to 12) will be awarded if the solution contains any of the following features:

A more advanced undo/redo: such as when an object is moved, when the color is changed and more.
Multiple move: The ability to move many objects simultaneously (i.e. select many objects first, then move them all together).
The ability to group primitives (rect, circle, line etc.) together into a template, which can be saved and then added to a new whiteboard with ease (example: a teacher might want to create a "binary tree node" template, containing a circle with text inside, and two arrows pointing downwards from the circle)
Math formulas, and symbols commonly used in math (such as Pi, the sum symbol etc.). You are free to experiment with the implementation of this, one possibility is to be able to write equations in some sort of a language which would then be converted to a drawing by the application (see example here).
Other features may come into consideration when bonus points are awarded. The question "how much do we have to implement to get 12?" can only be answered by: "It depends on the quality of the implementation".

A number of web-based drawing applications and tutorials are available online, including (but not limited to):

An example from Opera
SketchPad
You may find some of these to be helpful, but they are not necessarily doing exactly what we want. If you happen to stumble upon other examples you think might be useful, please allow other to enjoy your findings.

Using libraries to help with the implementation is allowed (such as jQuery, Bootstrap etc.)

API for saving

You can either experiment with saving to local storage, or use the following RPC API calls:

http://whiteboard.apphb.com/Home/Save
Saves a text string (such as a JSON representation of the objects in the drawing). The following parameters are defined:
user: your RU username (string)
name: The title of the drawing (string)
content: the content of the drawing (string)
template: true if this is a template, false if it a full blown drawing (boolean)
http://whiteboard.apphb.com/Home/GetList
Loads a list of drawings or templates for a given user. Parameters:
user: your RU username (string)
template: true if you want to load a list of templates, false if you want a list of drawings (boolean)
http://whiteboard.apphb.com/Home/GetWhiteboard
Returns a single drawing/template. Parameters:
id: the id of the drawing, which is returned in the GetList function above.
All APIs use JSONP, i.e. if you use $.ajax() to call them, you must specify "dataType: 'jsonp'" in your calls.

For instance, saving an array of shapes (called shapesToSave in the following code example) could be done like this:
 


			var stringifiedArray = JSON.stringify(shapesToSave);
			var param = { "user": "dabs", // You should use your own username!
				"name": title,
				"content": stringifiedArray,
				"template": true
			};

			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "http://whiteboard.apphb.com/Home/Save",
				data: param,
				dataType: "jsonp",
				crossDomain: true,
				success: function (data) {
					// The save was successful...
				},
				error: function (xhr, err) {
					// Something went wrong...
				}
			});

NOTE: since this API uses JSONP, POST requests are actually converted to GET requests behind the scenes. This means that saving of large images will fail! This will not affect your grade in any way, and is something you should be aware of during development.