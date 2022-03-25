/*
Javascript for Blue Plaques website (Task 5.3)
Student number: 201578549
*/



// First some global variables are defined


var side_bar_html = "";   // Variable collects the html which will eventually be placed in the side_bar 
var myCentreLat = 53.82028051341155;  // Lat and Long coords on which initial map view will be centered, and initial zoom level
var myCentreLng = -1.5443547457634423;
var initialZoom = 11; 
var gmarkers = []; // Array to hold markers
var map; 
var infowindow = new google.maps.InfoWindow(); 


// A function to create the marker and set up the event window function 


function createMarker(myPos,myTitle,myInfo) {
	
	var marker = new google.maps.Marker({
		position: myPos,
		map: map,
		title: myTitle,
		icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Blue drop icon		
	});

	google.maps.event.addListener(marker, 'click', function() {      // Event window function on click
        map.panTo(marker.getPosition());
        if (marker.getVisible() && (marker.getMap() != null)) {     // If marker is visible (not clustered) then display the info window
          infowindow.setContent(myInfo); 
          infowindow.open(map,marker);
        } 
		else {                                                   // Else open cluster
          infowindow.setContent(myInfo);
          infowindow.setPosition(marker.getPosition());
          infowindow.open(map);
          google.maps.event.addListenerOnce(map, 'idle', function() {
            infowindow.setContent(myInfo);
            infowindow.open(map,marker);  
          });
        }
    });
	
    gmarkers.push(marker); // push marker to gmarkers array
    
    side_bar_html += '<a href="javascript:myclick(' + (gmarkers.length-1) + ')">' + myTitle + '<\/a><br>'; // add a line to the side_bar html
   
}


 
// This function picks up the click and opens the corresponding info window


function myclick(i) {
  google.maps.event.trigger(gmarkers[i], "click");
  map.setZoom(16)
  
}

// Initialize function creates the map onload 

function initialize() {
	var latlng = new google.maps.LatLng(myCentreLat,myCentreLng); //create latlng coordinates from center coordinates previously defined
	var myOptions = {
		zoom: initialZoom,
		center: latlng,
		mapTypeControl: true,
		mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
		navigationControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
  
	map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);  // Creates map with id "map_canvas" and my options
  
	google.maps.event.addListener(map, 'click', function() {     // infowindow closes when user clicks on the map
		infowindow.close();
	});
	
	// For loop goes through os_markers setting info for infowindow, converting coordinates to lat and long and creating a marker for each
  
	for (id in os_markers) {  
		var info = "<div class=infowindow><h2>" +
			os_markers[id].title + "</h2><p><b>Unveiled:</b> "+os_markers[id].date+"</p><p>"+os_markers[id].caption + "</p></div>";

		// Convert co-ords
		var osPt = new OSRef(
			os_markers[id].easting,os_markers[id].northing);
		
		var llPt = osPt.toLatLng(osPt);
		llPt.OSGB36ToWGS84();

		var marker= new createMarker(new google.maps.LatLng(llPt.lat,llPt.lng),os_markers[id].title,info);  
    }
	
	// Creating clusters from markers using tool found at https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/src/markerclusterer.js
	
    markerCluster = new MarkerClusterer(map, gmarkers, { 
		imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m' 
	});
	
	// Put the assembled side_bar_html contents into the side_bar div
	document.getElementById("side_bar").innerHTML = side_bar_html;
}
