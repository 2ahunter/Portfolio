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
//for the masonry example
// var gridHtml = "snippets/grid.html";
var gridHtml = "snippets/gridGallery.html";

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
$ajaxUtils.sendGetRequest(
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
});

ah.loadImage = function(url){
	var height = this.height;
	var width = this.width;
	console.log(url);
}

ah.loadGalleries = function () {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(
		galleriesUrl,
		buildAndShowGalleriesHTML);
}

ah.loadGallery = function(gallery){
	showLoading("#main-content");
	url = galleryUrl + gallery + ".json";
	$ajaxUtils.sendGetRequest(
		url,
		buildAndShowGalleryHTML);
}

ah.loadGridGallery = function(gallery){
	showLoading("#main-content");
	url = insertProperty(galleryUrl,"gallery", gallery);
	console.log(url);
	// $ajaxUtils.sendGetRequest(
	// 	url,
	// 	buildAndShowGridHTML);
}

ah.loadGrid = function () {
	showLoading("#main-content");
	$ajaxUtils.sendGetRequest(
		gridHtml,
		function(gridHtml){
			insertHtml("#main-content", gridHtml);
		}, false);
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

function buildAndShowGridHTML(gallery){
	$ajaxUtils.sendGetRequest(
		gridHtml,
		function(galleryTitleHtml){
			$ajaxUtils.sendGetRequest(
				gridItemHtml,
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
	var galleryTitle = "" + gallery.title;
	var finalHtml = insertProperty(galleryTitleHtml, "title", galleryTitle);

	// finalHtml+= "<section class='row'>";
	finalHtml+= '<div id="grid" data-columns>'
	// Loop over galleries
		for (var i = 0; i < gallery.images.length; i++) {
		  	// Insert gallery values
			var html = galleryImageHtml;
			var title = "" + gallery.images[i].title;
			var index = "" + gallery.images[i].index;
			var galleryCatName = "" + gallery.galleryCatName;
			html = insertProperty(html, "title", title);
			html = insertProperty(html, "galleryCatName", galleryCatName);
			html = insertProperty(html, "index", index);
			
			finalHtml += html;
		}
		finalHtml += "</div>";
		return finalHtml;

}

global.$ah = ah;

})(window);