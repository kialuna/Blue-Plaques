//<![CDATA[
      // this variable will collect the html which will eventually be placed in the side_bar 
var side_bar_html = ""; 
var myCentreLat = 53.82028051341155;
var myCentreLng = -1.5443547457634423;
var initialZoom = 11;
// arrays to hold copies of the markers and html used by the side_bar 
// because the function closure trick doesnt work there 
var gmarkers = []; 

// global "map" variable
var map;
var markerclusterer;
var infowindow = new google.maps.InfoWindow();

// A function to create the marker and set up the event window function 


function createMarker(myPos,myTitle,myInfo) {
	var marker = new google.maps.Marker({
		position: myPos,
		map: map,
		title: myTitle,
		icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
		//zIndex: Math.round(myPos.lat()*-100000)<<5 // No idea what this does yet
		
		
	});
    // var infowindow = new google.maps.InfoWindow({content: myInfo});
   
    //google.maps.event.addListener(marker,'click', infoCallback(infowindow, marker));
	google.maps.event.addListener(marker, 'click', function() {      // Event window function
        map.panTo(marker.getPosition());
        if (marker.getVisible() && (marker.getMap() != null)) {     // If marker is visible (not clustered) then display the info window
          infowindow.setContent(myInfo); 
          infowindow.open(map,marker);
        } 
		else {                                                    // Otherwise 
          infowindow.setContent(myInfo);
          infowindow.setPosition(marker.getPosition());
          infowindow.open(map);
          google.maps.event.addListenerOnce(map, 'idle', function() {
            infowindow.setContent(myInfo);
            infowindow.open(map,marker);  
          });
        }
    });
	// save the info we need to use later for the side_bar
    gmarkers.push(marker);
    // add a line to the side_bar html
    side_bar_html += '<a href="javascript:myclick(' + (gmarkers.length-1) + ')">' + myTitle + '<\/a><br>';
   
}


 
// This function picks up the click and opens the corresponding info window
function myclick(i) {
  google.maps.event.trigger(gmarkers[i], "click");
  map.setZoom(16)
  
}

function initialize() {
  // create the map
	var latlng = new google.maps.LatLng(myCentreLat,myCentreLng);
	var myOptions = {
		zoom: initialZoom,
		center: latlng,
		mapTypeControl: true,
		mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
		navigationControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
  
	map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
  
	google.maps.event.addListener(map, 'click', function() {
		infowindow.close();
	});
  
	for (id in os_markers) {
		var info = "<div class=infowindow><h1>" +
			os_markers[id].title + "</h1><h3>Erected: "+os_markers[id].date+"</h3><p>"+os_markers[id].caption + "</p></div>";

		// Convert co-ords
		var osPt = new OSRef(
			os_markers[id].easting,os_markers[id].northing);
		
		var llPt = osPt.toLatLng(osPt);
		llPt.OSGB36ToWGS84();

		var marker= new createMarker(new google.maps.LatLng(llPt.lat,llPt.lng),os_markers[id].title,info);
    }
    markerCluster = new MarkerClusterer(map, gmarkers, { 
		imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m' 
	});
	// put the assembled side_bar_html contents into the side_bar div
	document.getElementById("side_bar").innerHTML = side_bar_html;
}


    

    // This Javascript is based on code provided by the
    // Community Church Javascript Team
    // http://www.bisphamchurch.org.uk/   
    // http://econym.org.uk/gmap/
    // from the v2 tutorial page at:
    // http://econym.org.uk/gmap/basic3.htm 
//]]>