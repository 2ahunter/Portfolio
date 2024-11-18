$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#navbar-menu").collapse('hide');
    }
  });
});

(function (global) {

var ah = {};
var carouselHtml = "snippets/carousel.html"

var homeHtml = "snippets/home-snippet.html";
var galleriesTitleHtml = "snippets/galleries-title.html";
var galleryTitleHtml = "snippets/gallery-title.html";

var galleriesImageHtml = "snippets/galleries-image.html";
var galleryImageHtml = "snippets/image-snippet.html";


var galleriesHomeHtml = "snippets/galleries-home.html";
var galleriesUrl="data/galleries.json";
var galleryUrl="data/{{gallery}}.json";
console.log(homeHtml);

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {
// On first load, show home view
showLoading("#main-content");
setupHistoryClicks();
ah.loadGalleries()
});

var setupHistoryClicks = function() {
  addClicker(document.getElementById("Galleries"));
}

var addClicker=function(link) {
  link.addEventListener("click", function(e) {
  	console.log("link clicked");
  	history.pushState(null, null, link.href);
  	e.preventDefault();
    ah.loadGalleries();
  }, false);
}

window.addEventListener("popstate", function(e) {
// On first load, show home view
showLoading("#main-content");
// setupHistoryClicks();
$ajaxUtils.sendGetRequest(
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
});

// var galLoad = document.querySelector("#gallery-tile");
// galLoad.addEventListener("click", testClick, false);
// function testClick(e){
// 	if (e.target !== e.currentTarget) {
//         var clickedItem = e.target.id;
//         alert("Hello " + clickedItem);
//     }
//     e.stopPropagation();
// }


ah.loadGalleries = function () {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(
		galleriesUrl,
		buildAndShowGalleriesHTML);
}

ah.loadGallery = function(gallery){
	showLoading("#main-content");
	// url = galleryUrl + gallery + ".json";
	url = insertProperty(galleryUrl,"gallery", gallery);
	$ajaxUtils.sendGetRequest(
		url,
		buildAndShowGalleryHTML);
}

//builds the HTML from galleries.json data
function buildAndShowGalleriesHTML(galleries){
	$ajaxUtils.sendGetRequest(
		galleriesTitleHtml,
		function(galleriesTitleHtml) {
			//retrieve gallery image snippet
			$ajaxUtils.sendGetRequest(
				galleriesImageHtml,
				function (galleriesImageHtml) {
					var galleriesViewHtml = 
						buildGalleriesViewHtml(galleries, 
												galleriesTitleHtml,
												galleriesImageHtml);
					insertHtml("#main-content", galleriesViewHtml);	
				},
				false);
		},
		false);
}

function buildAndShowGalleryHTML(gallery){
	$ajaxUtils.sendGetRequest(
		galleryTitleHtml,
		function(galleryTitleHtml){
			$ajaxUtils.sendGetRequest(
				galleryImageHtml,
				function(galleryImageHtml){
					var galleryViewHtml = 
						buildGalleryViewHtml(
							gallery, 
							galleryTitleHtml, 
							galleryImageHtml);
					insertHtml("#main-content", galleryViewHtml);
				},
				false);
		},
		false);
}

function buildGalleriesViewHtml(galleries,
                                 galleriesTitleHtml,
                                 galleriesImageHtml) {

	var finalHtml = galleriesTitleHtml;
		finalHtml += "<section class='row'>";

	  	// Loop over galleries
		for (var i = 0; i < galleries.length; i++) {
		  	// Insert gallery values
			var html = galleriesImageHtml;
			var title = "" + galleries[i].title;
			var gallery = galleries[i].gallery;
			var location = galleries[i].location;
			html = insertProperty(html, "title", title);
			html = insertProperty(html, "gallery", gallery);
			html = insertProperty(html, "location", location);
			finalHtml += html;
		}
		finalHtml += "</section>";
		return finalHtml;
}

function buildGalleryViewHtml(gallery, 
							galleryTitleHtml, 
							galleryImageHtml){
	var landscapeRowClass = "col-md-4 col-sm-6 col-xs-12";
	var portraitRowClass = "col-md-3 col-sm-4 col-xs-12";
	var galleryTitle = "" + gallery.title;
	var finalHtml = insertProperty(galleryTitleHtml, "title", galleryTitle);

	finalHtml+= "<section class='row'>";
	var oldOrientation = gallery.images[0].orientation;
	// Loop over galleries
		for (var i = 0; i < gallery.images.length; i++) {
			var html = "";
			var rowClass;
			var newOrientation = gallery.images[i].orientation;
			//add a clearfix if the orientation has changed
			// if (gallery.images[i].orientation != oldOrientation) {
		 //  		html +=
   //      		"<div class='clearfix visible-lg-block visible-md-block visible-sm-block'></div>";
   //  		}

    		html += galleryImageHtml;
			// if (newOrientation == "landscape") {
   //  			rowClass = landscapeRowClass;
   //  		} else {
   //  			rowClass = portraitRowClass;
   //  		}
   			rowClass = portraitRowClass;

		  	// Insert gallery values
			var title = "" + gallery.images[i].title;
			var index = "" + gallery.images[i].index;
			var galleryCatName = "" + gallery.galleryCatName;
			html = insertProperty(html, "orientation", newOrientation);
			html = insertProperty(html, "class", rowClass);
			console.log(html);
			html = insertProperty(html, "title", title);
			html = insertProperty(html, "galleryCatName", galleryCatName);
			html = insertProperty(html, "index", index);
			
			finalHtml += html;
			oldOrientation = newOrientation;
		}
		finalHtml += "</div>";
		return finalHtml;
}

global.$ah = ah;

})(window);

