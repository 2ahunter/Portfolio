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
setupHistoryClicks("Galleries");
$ajaxUtils.sendGetRequest(
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
});

var setupHistoryClicks = function(elemId) {
  addClicker(document.getElementById(elemId));
}

var addClicker=function(link) {
  link.addEventListener("click", function(e) {
  	console.log(link.id);
  	history.pushState(null, null, link.href);
  	e.preventDefault();
  	if (link.id=="Galleries") {
  		ah.loadGalleries()
  	}
  	
  }, false);
}

window.addEventListener("popstate", function(e) {
// On first load, show home view
// Note that this returns and event with a state, e.state.  Use the state to
//load the correct view.  The state can presumably be the name of the function
// and other data 
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
});

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
	var rowClass = "col-md-3 col-sm-4 col-xs-12";
	var galleryTitle = "" + gallery.title;
	var finalHtml = insertProperty(galleryTitleHtml, "title", galleryTitle);

	finalHtml+= "<section class='row'>";
	// Loop over galleries
		for (var i = 0; i < gallery.images.length; i++) {
			var html = "";
    		html += galleryImageHtml;
		  	// Insert gallery values
			var title = "" + gallery.images[i].title;
			var index = "" + gallery.images[i].index;
			var galleryCatName = "" + gallery.galleryCatName;
			html = insertProperty(html, "class", rowClass);
			console.log(html);
			html = insertProperty(html, "title", title);
			html = insertProperty(html, "galleryCatName", galleryCatName);
			html = insertProperty(html, "index", index);
			//add Html to final
			finalHtml += html;
		}
		finalHtml += "</div>";
		return finalHtml;
}

global.$ah = ah;

})(window);

