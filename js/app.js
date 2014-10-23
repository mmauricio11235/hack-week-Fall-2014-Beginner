var parseAPPID ="nWaGdXUhchnfgMeTeBC6d5pZZChOcEWM8Dl0FSwj";
var parseJSID = "lvlI3tjmZ36VNA4dTTuilqJQCHwPyvRnocbvK4eI";

//Initialize Parse
Parse.initialize(parseAPPID,parseJSID);

var NoteOb = Parse.Object.extend("Note");

$(document).on("pageshow", "#home", function(e, ui) {
	$.mobile.loading("show");

	var query = new Parse.Query(NoteOb);
	query.limit(10);
	query.descending("createdAt");

	
	query.find({ 
		success:function(results) {
			$.mobile.loading("hide");
			var $content = $("<div></div>");

			// clean out the content
			$("#home div[data-role=content]").html("");

			console.log(results.length);
			for(var i=0; i<results.length; i++) {
				$title = $("<h3></h3>")
						.addClass("note")
						.text(results[i].get("title"));
				$hiddenContent = $("<div></div>")
						.addClass("noteContent")
						.text(results[i].get("text"));
				$hiddenTitle = $("<div></div>")
						.addClass("title")
						.text(results[i].get("text"));
				$title.append($hiddenContent);
				$title.append($hiddenTitle);

				$content.append($title);
			}
			
			$("#home div[data-role=content]").append($content);
			
			// add event handler to link a note to its page
			// here i'm using local storage to pass variables between different views
			//TODO: should we use a templating system?
			$(".note").click(function(){
				var clicked = $(this);
				localStorage.text = clicked.find(".noteContent").text();
				localStorage.title = clicked.find(".title").text();
				$("#note .content").html(localStorage.text);
				$("#note .noteTitle").html("<h3>" + localStorage.title + "</h3>");
				window.location.href = "#note";
			});
		},error:function(e) {
			$.mobile.loading("hide");

		}
	});
});

$(document).on("pageshow", "#addNote", function(e, ui) {

	$("#saveNoteBtn").on("click", function(e) {
		//e.preventDefault();
		//$(this).attr("disabled","disabled").button("refresh");

		var noteText = $("#noteText").val();
		var noteTitle = $("#noteTitle").val();
		if(noteText === '') return;

			var note = new NoteOb();
			note.set("text",noteText);
			note.set("title", noteTitle);
			note.save(null, {
				success:function(ob) {
					$.mobile.changePage("#home");
				}, error:function(e) {
					console.log("Oh crap", e);
				}
			});
			cleanUp();
	});
	
	function failHandler(e) {
		alert("ErrorFromC");
		alert(e);
		console.log(e.toString());
	}

	function cleanUp() {
		$("#noteText").val("");
		$("#noteTitle").val("");
	}

});
