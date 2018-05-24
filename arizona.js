// JavaScript Document
var map;



var panPath = [];   // An array of points the current panning action will use
var panQueue = [];  // An array of subsequent panTo actions to take
var STEPS = 10;     // The number of steps that each panTo action will undergo
var pan_started = 0;
var allowedBounds;
var lastValidCenter;
var reservationOverlay;
var videoWidth = 200;
var videoHeight = 112;
var videoUp = 61;
var goingToMexico = false;
var returningToMesa = false;
var vimeo_fronteira;
var currentVideoId = -1;

var layerOverlapFlag = false;

var videos  = [[226354540, "Casa dos Hanny"],
  [226353399, "Casa do Corbin"],
  [226353447, "Casa da Kristen"],
  [226353387, "Casa da Cait"],
  [226353434, "Casa dos Casillas"],
  [226368841, "Casa da Jan"],
  [226354563, "Tour das Igrejas"],
  [253042771, "Volta por Mesa"],
  [225001757, "Skyland Highschool"],
  [226357094, "Shooting Range"],
  [225001970, "Gym"],
  [225002041, "Retirement Home"],
  [226364472, "Rodeo"],
  [226354643, "Western Park"]];


function initMap() {
// Create the map with no initial style specified.
// It therefore has default styling.
map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 33.37, lng: -111.8},
  zoom: 13,
  format: "png",
  mapType: "roadmap",
  mapTypeControl: false,
  streetViewControl: false,
  scaleControl: false,
  scrollwheel: false,
  navigationControl: false,
  streetViewControl: false,
  disableDefaultUI: true,
  minZoom: 13,
  maxZoom: 13
});

map.setOptions({styles: map_style});
/*
google.maps.event.addListener(map, 'tilesloaded', function (event) {
  console.log("loaded");
  if (pan_started==1) {
      setTimeout(doPan, 20 );
  }
});*/

//we need this to be able to get the x and y pixel position of the map rectangles
overlay = new google.maps.OverlayView();
overlay.draw = function () {};
overlay.setMap(map);




// bounds of the mesa area -- no panning beyond this
allowedBounds = new google.maps.LatLngBounds(
     new google.maps.LatLng(33.2, -112),
     //new google.maps.LatLng(31.18, -112),
     new google.maps.LatLng(33.45, -111.7)
);
lastValidCenter = map.getCenter();


google.maps.event.addListener(map, 'center_changed', function() {
    //console.log(map.getCenter().lat()+ " "+map.getCenter().lng());
    //console.log(allowedBounds+ " "+map.getCenter().lng());
    //console.log("center changed");
    // check if we're doing the pan to mexico
    if (!goingToMexico) {
      if ((!returningToMesa)&&(map.getCenter().lat() < 33.25)) {
        //show border arrow
        document.getElementById('wrapper_wrapper_seta_fronteira_id').style.display = "inline";

      }
      if (allowedBounds.contains(map.getCenter())) {
          // still within valid bounds, so save the last valid position
          //console.log("center");
          lastValidCenter = map.getCenter();
          return;
      }

      // not valid anymore => return to last valid position
      map.panTo(lastValidCenter);
      //console.log("yeah");
    }
});


vimeo_fronteira = new Vimeo.Player(document.getElementById("video_fronteira"));

vimeo_player = new Vimeo.Player(document.getElementById("vimeo_id"));


vimeo_player.on('timeupdate', function(data) {
    // data is an object containing properties specific to that event
    if (document.getElementById("vimeo_id").style.display == "none") {
      //console.log("hidden "+data.seconds);

      if (data.seconds < 0.5 ){
        document.getElementById("vimeo_id").style.display="block";
        //console.log("showing "+data.seconds);

      }
    } else {
      //console.log("timeupdate "+data.seconds);
    }
});

//reservation overlay
var reservationBounds = {
  north: 33.512,
  south: 33.4251,
  east: -111.791,
  west: -111.891
};

reservationOverlay = new google.maps.GroundOverlay(
    'images/reserva.svg',
    reservationBounds);
reservationOverlay.setMap(map);

//casas width .006 height .005

// casa 1 hanny 226354540
// casa 2 corbin 226353399
// casa 3 kristen 226353447
// casa 4 cait 226353387
// casa 5 casillas 226353434
// casa 6 jan 226368841


var casa_1_bounds = {  north: 33.443,   south: 33.438,   east: -111.763,  west: -111.769 };
var casa_2_bounds = {  north: 33.414,   south: 33.409,   east: -111.712,  west: -111.718 };
var casa_3_bounds = {  north: 33.356,   south: 33.351,   east: -111.814,  west: -111.820 };
var casa_4_bounds = { north: 33.356,   south: 33.351,  east: -111.723,  west: -111.729 };
var casa_5_bounds = {  north: 33.373,   south: 33.368,   east: -111.662,  west: -111.668 };
var casa_6_bounds = {  north: 33.312,   south: 33.307,   east: -111.903,  west: -111.909 };

var casa_1_overlay = new google.maps.GroundOverlay('images/arizona_icone_quadrado-cinza.png', casa_1_bounds);
var casa_2_overlay = new google.maps.GroundOverlay('images/arizona_icone_quadrado-cinza.png', casa_2_bounds);
var casa_3_overlay = new google.maps.GroundOverlay('images/arizona_icone_quadrado-cinza.png', casa_3_bounds);
var casa_4_overlay = new google.maps.GroundOverlay('images/arizona_icone_quadrado-cinza.png', casa_4_bounds);
var casa_5_overlay = new google.maps.GroundOverlay('images/arizona_icone_quadrado-cinza.png', casa_5_bounds);
var casa_6_overlay = new google.maps.GroundOverlay('images/arizona_icone_quadrado-cinza.png', casa_6_bounds);

casa_1_overlay.setMap(map);
casa_2_overlay.setMap(map);
casa_3_overlay.setMap(map);
casa_4_overlay.setMap(map);
casa_5_overlay.setMap(map);
casa_6_overlay.setMap(map);

//igrejas width .002 height .003
var igreja_1_bounds = {  north: 33.432,   south: 33.427,   east: -111.771,  west: -111.777 };
var igreja_2_bounds = {  north: 33.437,   south: 33.432,   east: -111.684,  west: -111.690 };
var igreja_3_bounds = {  north: 33.414,   south: 33.409,   east: -111.833,  west: -111.839 };
var igreja_4_bounds = {  north: 33.414,   south: 33.409,   east: -111.800,  west: -111.806 };
var igreja_5_bounds = {  north: 33.422,   south: 33.417,   east: -111.737,  west: -111.743 };
var igreja_6_bounds = {  north: 33.399,   south: 33.394,   east: -111.793,  west: -111.799 };
var igreja_7_bounds = {  north: 33.399,   south: 33.394,   east: -111.712,  west: -111.718 };
var igreja_8_bounds = {  north: 33.364,   south: 33.359,   east: -111.825,  west: -111.831 };
var igreja_9_bounds = {  north: 33.327,   south: 33.322,   east: -111.779,  west: -111.785 };
var igreja_10_bounds = { north: 33.321,   south: 33.316,  east: -111.697,  west: -111.703 };
var igreja_11_bounds = {  north: 33.298,   south: 33.293,   east: -111.797,  west: -111.803 };

var igreja_1_overlay = new google.maps.GroundOverlay('images/arizona_icone_triangulo-cinza.png', igreja_1_bounds);
var igreja_2_overlay = new google.maps.GroundOverlay('images/arizona_icone_triangulo-cinza.png', igreja_2_bounds);
var igreja_3_overlay = new google.maps.GroundOverlay('images/arizona_icone_triangulo-cinza.png', igreja_3_bounds);
var igreja_4_overlay = new google.maps.GroundOverlay('images/arizona_icone_triangulo-cinza.png', igreja_4_bounds);
var igreja_5_overlay = new google.maps.GroundOverlay('images/arizona_icone_triangulo-cinza.png', igreja_5_bounds);
var igreja_6_overlay = new google.maps.GroundOverlay('images/arizona_icone_triangulo-cinza.png', igreja_6_bounds);
var igreja_7_overlay = new google.maps.GroundOverlay('images/arizona_icone_triangulo-cinza.png', igreja_7_bounds);
var igreja_8_overlay = new google.maps.GroundOverlay('images/arizona_icone_triangulo-cinza.png', igreja_8_bounds);
var igreja_9_overlay = new google.maps.GroundOverlay('images/arizona_icone_triangulo-cinza.png', igreja_9_bounds);
var igreja_10_overlay = new google.maps.GroundOverlay('images/arizona_icone_triangulo-cinza.png', igreja_10_bounds);
var igreja_11_overlay = new google.maps.GroundOverlay('images/arizona_icone_triangulo-cinza.png', igreja_11_bounds);

igreja_1_overlay.setMap(map);
igreja_2_overlay.setMap(map);
igreja_3_overlay.setMap(map);
igreja_4_overlay.setMap(map);
igreja_5_overlay.setMap(map);
igreja_6_overlay.setMap(map);
igreja_7_overlay.setMap(map);
igreja_8_overlay.setMap(map);
igreja_9_overlay.setMap(map);
igreja_10_overlay.setMap(map);
igreja_11_overlay.setMap(map);

/*
33.263942, -111.947513
33.228106, -111.907209
33.220066, -111.859775
33.202503, -111.792365
33.194429, -111.753308
33.217652, -111.724291
*/

var cruz_1_bounds = {  north: 33.267,   south: 33.264,   east: -111.947,  west: -111.950 };
var cruz_2_bounds = {  north: 33.231,   south: 33.228,   east: -111.907,  west: -111.910 };
var cruz_3_bounds = {  north: 33.223,   south: 33.220,   east: -111.860,  west: -111.863 };
var cruz_4_bounds = {  north: 33.205,   south: 33.202,  east: -111.792,  west: -111.795 };
var cruz_5_bounds = {  north: 33.197,   south: 33.194,   east: -111.753,  west: -111.756 };
var cruz_6_bounds = {  north: 33.221,   south: 33.218,   east: -111.724,  west: -111.727 };

var cruz_1_overlay = new google.maps.GroundOverlay('images/arizona_icone_cruz-cinza.png', cruz_1_bounds);
var cruz_2_overlay = new google.maps.GroundOverlay('images/arizona_icone_cruz-cinza.png', cruz_2_bounds);
var cruz_3_overlay = new google.maps.GroundOverlay('images/arizona_icone_cruz-cinza.png', cruz_3_bounds);
var cruz_4_overlay = new google.maps.GroundOverlay('images/arizona_icone_cruz-cinza.png', cruz_4_bounds);
var cruz_5_overlay = new google.maps.GroundOverlay('images/arizona_icone_cruz-cinza.png', cruz_5_bounds);
var cruz_6_overlay = new google.maps.GroundOverlay('images/arizona_icone_cruz-cinza.png', cruz_6_bounds);

cruz_1_overlay.setMap(map);
cruz_2_overlay.setMap(map);
cruz_3_overlay.setMap(map);
cruz_4_overlay.setMap(map);
cruz_5_overlay.setMap(map);
cruz_6_overlay.setMap(map);


//volta width .004 height .004
var volta_bounds = {  north: 33.392,   south: 33.388,   east: -111.947,  west: -111.951 };
var volta_overlay = new google.maps.GroundOverlay('images/icone_estrada.png', volta_bounds);
volta_overlay.setMap(map);


//polygons!
var skyland_highschool_rect = new google.maps.Circle({
	map: map,
	center:
    new google.maps.LatLng(33.390,-111.746),
  radius: 300,
	strokeWeight: 0,
//	fillColor: '#ffcf2f',
fillColor: '#969696',
	fillOpacity: 1
});

var gym_rect = new google.maps.Circle({
	map: map,
	center:
    new google.maps.LatLng(33.44,-111.715),
radius: 300,
	strokeWeight: 0,
  fillColor: '#969696',
	fillOpacity: 1
});

var shooting_range_rect = new google.maps.Circle({
	map: map,
	center:
    new google.maps.LatLng(33.427,-111.649),
  radius: 300,
	strokeWeight: 0,
  fillColor: '#969696',
	fillOpacity: 1
});

var retirement_rect = new google.maps.Circle({
	map: map,
	center:
    new google.maps.LatLng(33.3245,-111.8157),
  radius: 300,
	strokeWeight: 0,
  fillColor: '#969696',
	fillOpacity: 1
});

var rodeo_rect = new google.maps.Circle({
	map: map,
	center:
    new google.maps.LatLng(33.343,-111.696),
  radius: 300,
	strokeWeight: 0,
  fillColor: '#969696',
	fillOpacity: 1
});

var western_park_circle = new google.maps.Circle({
	map: map,
	center:
    new google.maps.LatLng(33.2984,-112.0061),
  radius: 650,
	strokeWeight: 0,
  fillColor: '#969696',
	fillOpacity: 1
});

// CHURCHES behaviours

google.maps.event.addListener(igreja_1_overlay, 'mouseover', function() { igrejaMouseOver (igreja_1_overlay); }  );
google.maps.event.addListener(igreja_1_overlay, 'mouseout', function() { igrejaMouseOut (igreja_1_overlay); } );
google.maps.event.addListener(igreja_2_overlay, 'mouseover', function() { igrejaMouseOver (igreja_2_overlay); }   );
google.maps.event.addListener(igreja_2_overlay, 'mouseout', function() { igrejaMouseOut (igreja_2_overlay); } );
google.maps.event.addListener(igreja_3_overlay, 'mouseover', function() { igrejaMouseOver (igreja_3_overlay); }   );
google.maps.event.addListener(igreja_3_overlay, 'mouseout', function() { igrejaMouseOut(igreja_3_overlay); }  );
google.maps.event.addListener(igreja_4_overlay, 'mouseover', function() { igrejaMouseOver (igreja_4_overlay); }   );
google.maps.event.addListener(igreja_4_overlay, 'mouseout', function() { igrejaMouseOut (igreja_4_overlay); } );
google.maps.event.addListener(igreja_5_overlay, 'mouseover', function() { igrejaMouseOver (igreja_5_overlay); }   );
google.maps.event.addListener(igreja_5_overlay, 'mouseout', function() { igrejaMouseOut(igreja_5_overlay); }  );
google.maps.event.addListener(igreja_6_overlay, 'mouseover', function() { igrejaMouseOver (igreja_6_overlay); }   );
google.maps.event.addListener(igreja_6_overlay, 'mouseout', function() { igrejaMouseOut (igreja_6_overlay); } );
google.maps.event.addListener(igreja_7_overlay, 'mouseover', function() { igrejaMouseOver (igreja_7_overlay); }   );
google.maps.event.addListener(igreja_7_overlay, 'mouseout', function() { igrejaMouseOut (igreja_7_overlay); } );
google.maps.event.addListener(igreja_8_overlay, 'mouseover', function() { igrejaMouseOver (igreja_8_overlay); }   );
google.maps.event.addListener(igreja_8_overlay, 'mouseout', function() { igrejaMouseOut (igreja_8_overlay); } );
google.maps.event.addListener(igreja_9_overlay, 'mouseover', function() { igrejaMouseOver (igreja_9_overlay); }   );
google.maps.event.addListener(igreja_9_overlay, 'mouseout', function() { igrejaMouseOut (igreja_9_overlay); } );
google.maps.event.addListener(igreja_10_overlay, 'mouseover', function() { igrejaMouseOver (igreja_10_overlay); }   );
google.maps.event.addListener(igreja_10_overlay, 'mouseout', function() { igrejaMouseOut (igreja_10_overlay); } );
google.maps.event.addListener(igreja_11_overlay, 'mouseover', function() { igrejaMouseOver (igreja_11_overlay); }   );
google.maps.event.addListener(igreja_11_overlay, 'mouseout', function() { igrejaMouseOut (igreja_11_overlay); } );

function igrejaMouseOver (my_overlay) {

  video_id = 6; //line 29

  igreja_1_overlay.set('url', 'images/arizona_icone_triangulo-amarelo.png');
  igreja_2_overlay.set('url', 'images/arizona_icone_triangulo-amarelo.png');
  igreja_3_overlay.set('url', 'images/arizona_icone_triangulo-amarelo.png');
  igreja_4_overlay.set('url', 'images/arizona_icone_triangulo-amarelo.png');
  igreja_5_overlay.set('url', 'images/arizona_icone_triangulo-amarelo.png');
  igreja_6_overlay.set('url', 'images/arizona_icone_triangulo-amarelo.png');
  igreja_7_overlay.set('url', 'images/arizona_icone_triangulo-amarelo.png');
  igreja_8_overlay.set('url', 'images/arizona_icone_triangulo-amarelo.png');
  igreja_9_overlay.set('url', 'images/arizona_icone_triangulo-amarelo.png');
  igreja_10_overlay.set('url', 'images/arizona_icone_triangulo-amarelo.png');
  igreja_11_overlay.set('url', 'images/arizona_icone_triangulo-amarelo.png');

  igreja_1_overlay.setMap(map);
  igreja_2_overlay.setMap(map);
  igreja_3_overlay.setMap(map);
  igreja_4_overlay.setMap(map);
  igreja_5_overlay.setMap(map);
  igreja_6_overlay.setMap(map);
  igreja_7_overlay.setMap(map);
  igreja_8_overlay.setMap(map);
  igreja_9_overlay.setMap(map);
  igreja_10_overlay.setMap(map);
  igreja_11_overlay.setMap(map);

  var r = get_mapthing_bounds(my_overlay) ;
  var center_h = Math.round((r.right + r.left)/2);

  document.getElementById('wrapper_vimeo_id').style.left = (center_h-videoWidth/2)+"px";
  document.getElementById('wrapper_vimeo_id').style.top = (r.bottom-videoHeight-videoUp)+"px";
  document.getElementById('wrapper_vimeo_id').style.display = "inline";
    document.getElementById("video_title_id").innerHTML = "Tour das Igrejas";

    //the callback function 'timeupdate' will make the video frame visible when it resets
    if (currentVideoId != video_id){
      document.getElementById("vimeo_id").style.display = "none";
      currentVideoId = video_id;
      change_video(videos[video_id][0]);
    }
}

function igrejaMouseOut (out_overlay) {
  document.getElementById('wrapper_vimeo_id').style.display = "none";

  igreja_1_overlay.set('url', 'images/arizona_icone_triangulo-cinza.png');
  igreja_2_overlay.set('url', 'images/arizona_icone_triangulo-cinza.png');
  igreja_3_overlay.set('url', 'images/arizona_icone_triangulo-cinza.png');
  igreja_4_overlay.set('url', 'images/arizona_icone_triangulo-cinza.png');
  igreja_5_overlay.set('url', 'images/arizona_icone_triangulo-cinza.png');
  igreja_6_overlay.set('url', 'images/arizona_icone_triangulo-cinza.png');
  igreja_7_overlay.set('url', 'images/arizona_icone_triangulo-cinza.png');
  igreja_8_overlay.set('url', 'images/arizona_icone_triangulo-cinza.png');
  igreja_9_overlay.set('url', 'images/arizona_icone_triangulo-cinza.png');
  igreja_10_overlay.set('url', 'images/arizona_icone_triangulo-cinza.png');
  igreja_11_overlay.set('url', 'images/arizona_icone_triangulo-cinza.png');

  igreja_1_overlay.setMap(map);
  igreja_2_overlay.setMap(map);
  igreja_3_overlay.setMap(map);
  igreja_4_overlay.setMap(map);
  igreja_5_overlay.setMap(map);
  igreja_6_overlay.setMap(map);
  igreja_7_overlay.setMap(map);
  igreja_8_overlay.setMap(map);
  igreja_9_overlay.setMap(map);
  igreja_10_overlay.setMap(map);
  igreja_11_overlay.setMap(map);

  out_overlay.set('url', 'images/arizona_icone_triangulo-cinza.png');
  out_overlay.setMap(map);

}

// HOUSES behaviours

google.maps.event.addListener(casa_1_overlay, 'mouseover', function () { casaMouseOver(casa_1_overlay, 'wrapper_vimeo_id',0, 'Casa dos ','Hanny');});
google.maps.event.addListener(casa_1_overlay, 'mouseout', function () { casaMouseOut(casa_1_overlay, 'wrapper_vimeo_id');});
google.maps.event.addListener(casa_2_overlay, 'mouseover', function () { casaMouseOver(casa_2_overlay, 'wrapper_vimeo_id',1,'Casa do ','Corbin');});
google.maps.event.addListener(casa_2_overlay, 'mouseout', function () { casaMouseOut(casa_2_overlay, 'wrapper_vimeo_id');});
google.maps.event.addListener(casa_3_overlay, 'mouseover', function () { casaMouseOver(casa_3_overlay, 'wrapper_vimeo_id',2,'Casa da ','Kirsten');});
google.maps.event.addListener(casa_3_overlay, 'mouseout', function () { casaMouseOut(casa_3_overlay, 'wrapper_vimeo_id');});
google.maps.event.addListener(casa_4_overlay, 'mouseover', function () { casaMouseOver(casa_4_overlay, 'wrapper_vimeo_id',3,'Casa da ','Cait');});
google.maps.event.addListener(casa_4_overlay, 'mouseout', function () { casaMouseOut(casa_4_overlay, 'wrapper_vimeo_id');});
google.maps.event.addListener(casa_5_overlay, 'mouseover', function () { casaMouseOver(casa_5_overlay, 'wrapper_vimeo_id',4,'Casa dos ','Casillas');});
google.maps.event.addListener(casa_5_overlay, 'mouseout', function () { casaMouseOut(casa_5_overlay, 'wrapper_vimeo_id');});
google.maps.event.addListener(casa_6_overlay, 'mouseover', function () { casaMouseOver(casa_6_overlay, 'wrapper_vimeo_id',5,'Casa da ','Jan');});
google.maps.event.addListener(casa_6_overlay, 'mouseout', function () { casaMouseOut(casa_6_overlay, 'wrapper_vimeo_id');});

function casaMouseOver(me, id, video_id, text_1, text_2) {
  me.setOptions({
		fillColor: '#ff9100',
	});

  me.set('url', 'images/arizona_icone_quadrado-amarelo.png');
  me.setMap(map);

  var r = get_mapthing_bounds(me) ;
  var center_h = Math.round((r.right + r.left)/2);

  document.getElementById("video_title_id").innerHTML = text_1+text_2;
  document.getElementById(id).style.left = (center_h-videoWidth/2)+"px";
  document.getElementById(id).style.top = (r.bottom-videoHeight-videoUp)+"px";
  document.getElementById(id).style.display = "inline";

  //the callback function 'timeupdate' will make the video frame visible when it resets
  if (currentVideoId != video_id){
    document.getElementById("vimeo_id").style.display = "none";
    currentVideoId = video_id;
    change_video(videos[video_id][0]);
  }

  };

function casaMouseOut (me, id) {
  me.setOptions({
		fillColor:'#ffcf2f',
	});


  me.set('url', 'images/arizona_icone_quadrado-cinza.png');
  me.setMap(map);

  document.getElementById(id).style.display = "none";

}

// VOLTA behaviours
google.maps.event.addListener(volta_overlay, 'mouseover', function (event) {

  //line 30
   video_id = 7;

    volta_overlay.set('url', 'images/icone_estrada-amarelo.png');

    var r = get_mapthing_bounds(volta_overlay) ;
    var center_h = Math.round((r.right + r.left)/2);

    document.getElementById("video_title_id").innerHTML = "Volta por Mesa";
    document.getElementById('wrapper_vimeo_id').style.left = (center_h-videoWidth/2)+"px";
    document.getElementById('wrapper_vimeo_id').style.top = (r.bottom-videoHeight-videoUp)+"px";
    document.getElementById('wrapper_vimeo_id').style.display = "inline";

    //the callback function 'timeupdate' will make the video frame visible when it resets
    if (currentVideoId != video_id){
      document.getElementById("vimeo_id").style.display = "none";
      currentVideoId = video_id;
      change_video(videos[video_id][0]);
    }


});

google.maps.event.addListener(volta_overlay, 'mouseout', function (event) {

  volta_overlay.set('url', 'images/icone_estrada.png');
  document.getElementById('wrapper_vimeo_id').style.display = "none";

});


// SCHOOL behaviours
google.maps.event.addListener(skyland_highschool_rect, 'mouseover', function (event) {
	// Within the event listener, "this" refers to the polygon which
	// received the event.
  //

  //line 31
  video_id = 8;

	this.setOptions({
		fillColor: '#ffcf2f',
	});

  //this creates a div retangle in the same place so it can be placed above other layers
  //copy_map_rectangle_position (document.getElementById('rectangle_above_id'),this);

  //these lines below bring ot the video preview and the


  var r = get_mapthing_bounds(skyland_highschool_rect) ;
  var center_h = Math.round((r.right + r.left)/2);

  document.getElementById("video_title_id").innerHTML = "Skyland Highschool";
  document.getElementById('wrapper_vimeo_id').style.left = (center_h-videoWidth/2)+"px";
  document.getElementById('wrapper_vimeo_id').style.top = (r.bottom-videoHeight-videoUp)+"px";
  document.getElementById('wrapper_vimeo_id').style.display = "inline";

  //the callback function 'timeupdate' will make the video frame visible when it resets
  if (currentVideoId != video_id){
    document.getElementById("vimeo_id").style.display = "none";
    currentVideoId = video_id;
    change_video(videos[video_id][0]);
  }

});

google.maps.event.addListener(skyland_highschool_rect, 'mouseout', function (event) {
	// Within the event listener, "this" refers to the polygon which
	// received the event.
  	//document.getElementById('highschool').style.display="none";
	this.setOptions({
	fillColor: '#969696',
	});

  document.getElementById('wrapper_vimeo_id').style.display = "none";

});


// GYM behaviours
google.maps.event.addListener(gym_rect, 'mouseover', function (event) {

	this.setOptions({
		fillColor: '#ffcf2f',
	});

  //line 31
  video_id = 10;

  //move the video to near the icon
  var r = get_mapthing_bounds(gym_rect) ;
  var center_h = Math.round((r.right + r.left)/2);
  document.getElementById("video_title_id").innerHTML = "Gym";
  document.getElementById('wrapper_vimeo_id').style.left = (center_h-videoWidth/2)+"px";
  document.getElementById('wrapper_vimeo_id').style.top = (r.bottom-videoHeight-videoUp)+"px";
  document.getElementById('wrapper_vimeo_id').style.display = "inline";

  //the callback function 'timeupdate' will make the video frame visible when it resets
  if (currentVideoId != video_id){
    document.getElementById("vimeo_id").style.display = "none";
    currentVideoId = video_id;
    change_video(videos[video_id][0]);
  }

});

google.maps.event.addListener(gym_rect, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#969696',
	});

  document.getElementById('wrapper_vimeo_id').style.display = "none";

});




// SHOOTING RANGE behaviours
google.maps.event.addListener(shooting_range_rect, 'mouseover', function (event) {
	this.setOptions({
		fillColor: '#ffcf2f',
	});

  //line 32
  video_id = 9;

  //move the video to near the icon
  var r = get_mapthing_bounds(shooting_range_rect) ;
  var center_h = Math.round((r.right + r.left)/2);
  document.getElementById('wrapper_vimeo_id').style.left = (center_h-videoWidth/2)+"px";
  document.getElementById('wrapper_vimeo_id').style.top = (r.bottom-videoHeight-videoUp)+"px";

  document.getElementById("video_title_id").innerHTML = "Shooting Range";
  document.getElementById('wrapper_vimeo_id').style.display = "inline";

  //the callback function 'timeupdate' will make the video frame visible when it resets
  if (currentVideoId != video_id){
    document.getElementById("vimeo_id").style.display = "none";
    currentVideoId = video_id;
    change_video(videos[video_id][0]);
  }

});

google.maps.event.addListener(shooting_range_rect, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#969696',
	});

  document.getElementById('wrapper_vimeo_id').style.display = "none";
});

// RETIREMENT behaviours
google.maps.event.addListener(retirement_rect, 'mouseover', function (e) {


  video_id = 11; //line 34

  this.setOptions({
		fillColor: '#ffcf2f',
	});


  //move the video to near the icon
  var r = get_mapthing_bounds(retirement_rect) ;
  var center_h = Math.round((r.right + r.left)/2);
  document.getElementById('wrapper_vimeo_id').style.left = (center_h-videoWidth/2)+"px";
  document.getElementById('wrapper_vimeo_id').style.top = (r.bottom-videoHeight-videoUp)+"px";
  document.getElementById("video_title_id").innerHTML = "Retirement Home";
  document.getElementById('wrapper_vimeo_id').style.display = "inline";

  //the callback function 'timeupdate' will make the video frame visible when it resets
  if (currentVideoId != video_id){
    document.getElementById("vimeo_id").style.display = "none";
    currentVideoId = video_id;
    change_video(videos[video_id][0]);
  }

});

google.maps.event.addListener(retirement_rect, 'mouseout', function (event) {

  console.log("bola mouseleave");
  mythis = this;

  setTimeout(function () {
    console.log("time out");
    if (!layerOverlapFlag) {
      mythis.setOptions({
      fillColor: '#969696',
      });

      document.getElementById('wrapper_vimeo_id').style.display = "none";
      layerOverlapFlag = false;
    }
  }, 500);

});

document.getElementById('wrapper_vimeo_id').addEventListener('mouseenter', function () {
    console.log("wrapper mouseenter");
    layerOverlapFlag = true;
});

document.getElementById('wrapper_vimeo_id').addEventListener('mouseleave', function () {
    console.log("wrapper mouseleave");
    retirement_rect.setOptions({
    fillColor: '#969696',
    });
    layerOverlapFlag = false;
    document.getElementById('wrapper_vimeo_id').style.display = "none";

});

document.getElementById('vimeo_id').addEventListener('mouseenter', function () {
    console.log("video mouseeneter");

});


// RODEO behaviours
google.maps.event.addListener(rodeo_rect, 'mouseover', function (event) {

  video_id = 12; //line 35

	this.setOptions({
		fillColor: '#ffcf2f',
	});



    //move the video to near the icon
    var r = get_mapthing_bounds(rodeo_rect) ;
    var center_h = Math.round((r.right + r.left)/2);
    document.getElementById('wrapper_vimeo_id').style.left = (center_h-videoWidth/2)+"px";
    document.getElementById('wrapper_vimeo_id').style.top = (r.bottom-videoHeight-videoUp)+"px";
    document.getElementById("video_title_id").innerHTML = "Retirement Home";
    document.getElementById('wrapper_vimeo_id').style.display = "inline";

    //the callback function 'timeupdate' will make the video frame visible when it resets
    if (currentVideoId != video_id){
      document.getElementById("vimeo_id").style.display = "none";
      currentVideoId = video_id;
      change_video(videos[video_id][0]);
    }

});

google.maps.event.addListener(rodeo_rect, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#969696',
	});

  document.getElementById('wrapper_vimeo_id').style.display = "none";

});


// WESTERN PARK behaviours
google.maps.event.addListener(western_park_circle, 'mouseover',function (event)  {

  video_id = 13; //line 35

  this.setOptions({
    fillColor: '#ffcf2f',
  });

  //move the video to near the icon
  var r = get_mapthing_bounds(western_park_circle) ;
  var center_h = Math.round((r.right + r.left)/2);
  document.getElementById('wrapper_vimeo_id').style.left = (center_h-videoWidth/2)+"px";
  document.getElementById('wrapper_vimeo_id').style.top = (r.bottom-videoHeight-videoUp)+"px";
  document.getElementById("video_title_id").innerHTML = "Western Park";
  document.getElementById('wrapper_vimeo_id').style.display = "inline";

  //the callback function 'timeupdate' will make the video frame visible when it resets
  if (currentVideoId != video_id){
    document.getElementById("vimeo_id").style.display = "none";
    currentVideoId = video_id;
    change_video(videos[video_id][0]);
  }

});


google.maps.event.addListener(western_park_circle, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#969696',
	});

  document.getElementById('wrapper_vimeo_id').style.display = "none";

});


//erase me!!!
//document.getElementById('wrapper_wrapper_fronteira_id').style.display = "inline";
//for debugging only


document.getElementById('wrapper_wrapper_seta_fronteira_id').addEventListener('click', function (event) {
  goingToMexico=true;
  map.set('minZoom',0);
  map.set('maxZoom',18);
  panTo(32.5,-111.5,8,900,4);

});

/*

google.maps.event.addListener(skyland_highschool_rect, 'mouseover', function (event) {
	// Within the event listener, "this" refers to the polygon which
	// received the event.
  //


	this.setOptions({
		fillColor: '#ff9100',
	});

  //this creates a div retangle in the same place so it can be placed above other layers
  //copy_map_rectangle_position (document.getElementById('rectangle_above_id'),this);

  //these lines below bring ot the video preview and the
  //document.getElementById('wrapper_wrapper_id').style.display="inline";
  //document.getElementById('rectangle_above_id').style.display = "inline";
  document.getElementById('place_name_id').style.display = "inline";
  document.getElementById('skyland_highschool_img_id').style.display = "inline";

});

google.maps.event.addListener(skyland_highschool_rect, 'mouseout', function (event) {
	// Within the event listener, "this" refers to the polygon which
	// received the event.
  	//document.getElementById('highschool').style.display="none";
	this.setOptions({
	fillColor: '#ffcf2f',
	});
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('skyland_highschool_img_id').style.display = "none";

});

*/

}

function get_mapthing_bounds (mymapthing) {
  var mapthing_topright = mymapthing.getBounds().getNorthEast();
  var mapthing_bottomleft = mymapthing.getBounds().getSouthWest();
  var xy_topright = overlay.getProjection().fromLatLngToContainerPixel(mapthing_topright);
  var xy_bottomleft = overlay.getProjection().fromLatLngToContainerPixel(mapthing_bottomleft);

  var r = {'left': xy_bottomleft.x, 'top':xy_topright.y, 'right': xy_topright.x, 'bottom': xy_bottomleft.y};

  return r;

}

//from lat lng to pixel x, pixel y
function copy_map_rectangle_position (my_div, mymapthing ) {

  var ll_topright = mymapthing.getBounds().getNorthEast();
  var ll_bottomleft = mymapthing.getBounds().getSouthWest();

  var xy_topright = overlay.getProjection().fromLatLngToContainerPixel(ll_topright);
  var xy_bottomleft = overlay.getProjection().fromLatLngToContainerPixel(ll_bottomleft);



  //console.log(xy.x);
  my_div.style.left = xy_bottomleft.x+'px';
  my_div.style.top = xy_topright.y+'px';
  my_div.style.width = (xy_topright.x-xy_bottomleft.x)+'px';
  my_div.style.height = (xy_bottomleft.y-xy_topright.y)+'px';

}


//form stuff
function confirm() {
  if (current_form_page<9) {
  current_form_page = current_form_page + 1;
  document.getElementById('form_question_id').innerHTML = form_responses_questions[current_form_page][0];
  document.getElementById('form_left_id').innerHTML = (current_form_page+1) + "/10";
  document.getElementById('label1').innerHTML = form_responses_questions[current_form_page][1][0];
  document.getElementById('label2').innerHTML = form_responses_questions[current_form_page][1][1];
  document.getElementById('label3').innerHTML = form_responses_questions[current_form_page][1][2];
  document.getElementById('label4').innerHTML = form_responses_questions[current_form_page][1][3];
  //some questions have only 3 answers
  if (form_responses_questions[current_form_page][1][3]=="") {

    document.getElementById('label4').style.display="none";
  } else {
    document.getElementById('label4').style.display="inline";
  }

} else {

  //process results
    document.getElementById('form_id').style.display = 'none';
    document.getElementById('screenplay_id').style.left = 0;

}
}

function screenplay_close() {
    if (document.getElementById('screenplay_id').style.left == "-310px") {
      document.getElementById('screenplay_id').style.left = "0";
    } else {
      document.getElementById('screenplay_id').style.left = "-310px";
    }
}


//to smoothly pan the map
function panTo(newLat, newLng, newZoom, d, steps) {

    // Lets compute the points we'll use
    //console.log("panto ");

    panPath.push("LAZY SYNCRONIZED LOCK");  // make length non-zero - 'release' this before calling setTimeout
    var curLat = map.getCenter().lat();
    var curLng = map.getCenter().lng();
    var curZoom = map.getZoom();
    var dLat = (newLat - curLat)/steps;
    var dLng = (newLng - curLng)/steps;
    var dZoom = (newZoom - curZoom)/steps;

    for (var i=0; i < steps; i++) {
      panPath.push([curLat + dLat * i, curLng + dLng * i, curZoom + dZoom * i]);
    }
    panPath.push([newLat, newLng, newZoom]);
    panPath.shift();      // LAZY SYNCRONIZED LOCK
    pan_started = 1;
    var first = panPath.shift();
    //setTimeout(doPan, 100);

    doPan(d,steps);

}

function doPan(d,steps) {
  //console.log("do pan");

  var next = panPath.shift();


  if (next != null) {
    // Continue our current pan action
    //console.log(map.getBounds()+ " "+ next[2]);
    map.panTo( new google.maps.LatLng(next[0], next[1]));
    map.setZoom(Math.round(next[2]));
    setTimeout(function(){doPan(d,steps);}, d);


  } else {
    // We are finished with this pan -
    pan_started = 0;

    //after 2 seconds, begin the movie
    if (goingToMexico) {
      setTimeout(showFronteira, 1000);
    } else {
      returningToMesa=false;
    }
  }

}




function showFronteira() {
  document.getElementById('wrapper_wrapper_seta_fronteira_id').style.display = "none";
  document.getElementById('wrapper_wrapper_fronteira_id').style.display = "inline";

  //when the movie is finishedm return to main screen

  vimeo_fronteira.setCurrentTime(0);
  vimeo_fronteira.on('ended', endFronteira );

}



var endFronteira = function () {

    vimeo_fronteira.off('ended', endFronteira);
    document.getElementById('wrapper_wrapper_fronteira_id').style.display = "none";
    document.getElementById('wrapper_wrapper_seta_fronteira_id').style.display = "none";


    setTimeout(function() {
      goingToMexico=false;
      returningToMesa=true;
      panTo(33.37, -111.8, 13, 900, 4);
      }
      , 1000);

}



function change_video (new_id) {
  vimeo_player.loadVideo(new_id).then(function() {
      // the video successfully loaded
      //console.log("finally");
      vimeo_player.play();

  }).catch(function(error) {
      switch (error.name) {
          case 'TypeError':
              // the id was not a number
              console.log("type error");
              break;

          case 'PasswordError':
              // the video is password-protected and the viewer needs to enter the
              // password first
              console.log("pass error");
              break;

          case 'PrivacyError':
              // the video is password-protected or private
              break;

          default:
              // some other error occurred
              console.log("default");
              break;
      }
  });
}


var map_style = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
     "featureType": "administrative.country",
     "elementType": "geometry.stroke",
     "stylers": [
        {
           "visibility": "on"
         },
         {
           "color": "#111111"
         }
       ]
     },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f0d2b4"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": []
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": []
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "stylers": [
      {
        "color": "#969696"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": []
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#969696"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": []
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": []
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": []
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
];
