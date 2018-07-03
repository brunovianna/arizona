// JavaScript Document
var map;



var panPath = [];   // An array of points the current panning action will use
var panQueue = [];  // An array of subsequent panTo actions to take
var STEPS = 10;     // The number of steps that each panTo action will undergo
var pan_started = 0;
var allowedBounds;
var lastValidCenter;
var reservationOverlay;
var cruzesOverlay;
var videoWidth = 200;
var videoHeight = 112;
var videoUp = 61;
var goingToMexico = false;
var returningToMesa = false;
var vimeo_fronteira;
var currentVideoId = -1;
var screenplay_screenplay_content = "<br><b>ROTEIRO</b><br><br>Baseado em suas respostas, recomendamos que você visite as seguintes localidades em Mesa: <br><br>";

var cruzes_bounds = [];
var cruzes_overlay = [];

var layerOverlapFlag = false;

var videos  = [[226354540, "Casa dos Hanny"],
  [226353399, "Casa do Corbin"],
  [226353447, "Casa da Kristen"],
  [226353387, "Casa da Cait"],
  [226353434, "Casa dos Casillas"],
  [226368841, "Casa da Jan"],
  [226354563, "Tour das Igrejas"],
  [253042771, "Volta por Mesa"],
  [225001757, "High School"],
  [226357094, "Shooting Range"],
  [225001970, "Gym"],
  [225002041, "Condomínios +55"],
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
      if ((!returningToMesa)&&(map.getCenter().lat() < 33.30)) {
        //show border arrow
        //use different trigger now? crosses mouseover?
        document.getElementById('fence_id').style.display = "inline";
        document.getElementById('fence_us_id').style.display = "none";
        document.getElementById('fence_mexico_id').style.display = "none";

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
    //console.log("hidden "+data.seconds+", status: "+vimeo_player.getPaused());
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

//crosses overlay

var cruzesBounds = {
  north: 33.246,
  south: 33.144,
  east: -111.684,
  west: -111.921
};

cruzesOverlay = new google.maps.GroundOverlay(
    'images/cruzes_cinza.png',
    cruzesBounds);
cruzesOverlay.setMap(map);


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

// CROSSES behaviours
google.maps.event.addListener(cruzesOverlay, 'mouseover', function() {
  cruzesOverlay.set('url', 'images/cruzes_amarelas.png');
  cruzesOverlay.setMap(map);
  document.getElementById("box_fronteira_id").style.display = "grid";


}  );

google.maps.event.addListener(cruzesOverlay, 'mouseout', function() {
  cruzesOverlay.set('url', 'images/cruzes_cinza.png');
  cruzesOverlay.setMap(map);
}  );



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


  /*
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

  */

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


  setTimeout(function () {
    //console.log("time out");
    if (!layerOverlapFlag) {
      document.getElementById('wrapper_vimeo_id').style.display = "none";
      /*
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
      */

      //out_overlay.set('url', 'images/arizona_icone_triangulo-cinza.png');
      //out_overlay.setMap(map);



      layerOverlapFlag = false;
    }
  }, 500);



}

// HOUSES behaviours

google.maps.event.addListener(casa_1_overlay, 'mouseover', function () { casaMouseOver(casa_1_overlay, 'wrapper_vimeo_id',0, 'Casa dos ','Hanny');});
google.maps.event.addListener(casa_1_overlay, 'mouseout', function () { casaMouseOut(casa_1_overlay);});
google.maps.event.addListener(casa_2_overlay, 'mouseover', function () { casaMouseOver(casa_2_overlay, 'wrapper_vimeo_id',1,'Casa do ','Corbin');});
google.maps.event.addListener(casa_2_overlay, 'mouseout', function () { casaMouseOut(casa_2_overlay);});
google.maps.event.addListener(casa_3_overlay, 'mouseover', function () { casaMouseOver(casa_3_overlay, 'wrapper_vimeo_id',2,'Casa da ','Kristen');});
google.maps.event.addListener(casa_3_overlay, 'mouseout', function () { casaMouseOut(casa_3_overlay);});
google.maps.event.addListener(casa_4_overlay, 'mouseover', function () { casaMouseOver(casa_4_overlay, 'wrapper_vimeo_id',3,'Casa da ','Cait');});
google.maps.event.addListener(casa_4_overlay, 'mouseout', function () { casaMouseOut(casa_4_overlay);});
google.maps.event.addListener(casa_5_overlay, 'mouseover', function () { casaMouseOver(casa_5_overlay, 'wrapper_vimeo_id',4,'Casa dos ','Casillas');});
google.maps.event.addListener(casa_5_overlay, 'mouseout', function () { casaMouseOut(casa_5_overlay);});
google.maps.event.addListener(casa_6_overlay, 'mouseover', function () { casaMouseOver(casa_6_overlay, 'wrapper_vimeo_id',5,'Casa da ','Jan');});
google.maps.event.addListener(casa_6_overlay, 'mouseout', function () { casaMouseOut(casa_6_overlay);});

function casaMouseOver(me, id, video_id, text_1, text_2) {
  /*me.setOptions({
		fillColor: '#ff9100',
	});

  me.set('url', 'images/arizona_icone_quadrado-amarelo.png');
  me.setMap(map);

  */

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

function casaMouseOut (me) {

  setTimeout(function () {
    //console.log("time out");
    if (!layerOverlapFlag) {
      /*
      me.setOptions({
    		fillColor:'#ffcf2f',
    	});

      me.set('url', 'images/arizona_icone_quadrado-cinza.png');
      me.setMap(map);
      */
      document.getElementById('wrapper_vimeo_id').style.display = "none";
      layerOverlapFlag = false;
    }
  }, 500);



}

// VOLTA behaviours
google.maps.event.addListener(volta_overlay, 'mouseover', function (event) {

  //line 30
   video_id = 7;

    //volta_overlay.set('url', 'images/icone_estrada-amarelo.png');

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



  setTimeout(function () {
    //console.log("time out");
    if (!layerOverlapFlag) {
      //volta_overlay.set('url', 'images/icone_estrada.png');

      document.getElementById('wrapper_vimeo_id').style.display = "none";
      layerOverlapFlag = false;
    }
  }, 500);


});


// SCHOOL behaviours
google.maps.event.addListener(skyland_highschool_rect, 'mouseover', function (event) {
	// Within the event listener, "this" refers to the polygon which
	// received the event.
  //

  //line 31
  video_id = 8;

	//this.setOptions({		fillColor: '#ffcf2f',	});

  //this creates a div retangle in the same place so it can be placed above other layers
  //copy_map_rectangle_position (document.getElementById('rectangle_above_id'),this);

  //these lines below bring ot the video preview and the


  var r = get_mapthing_bounds(skyland_highschool_rect) ;
  var center_h = Math.round((r.right + r.left)/2);

  document.getElementById("video_title_id").innerHTML = "High School";
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
  delayOverlayMouseout(this);

});


// GYM behaviours
google.maps.event.addListener(gym_rect, 'mouseover', function (event) {

	//this.setOptions({		fillColor: '#ffcf2f',	});

  //line 31
  video_id = 10;

  //move the video to near the icon
  var r = get_mapthing_bounds(gym_rect) ;
  var center_h = Math.round((r.right + r.left)/2);
  document.getElementById("video_title_id").innerHTML = "Academia do Ryan";
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
  delayOverlayMouseout(this);

});




// SHOOTING RANGE behaviours
google.maps.event.addListener(shooting_range_rect, 'mouseover', function (event) {

	//this.setOptions({		fillColor: '#ffcf2f',	});

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
  delayOverlayMouseout(this);
});

// RETIREMENT behaviours
google.maps.event.addListener(retirement_rect, 'mouseover', function (e) {


  video_id = 11; //line 34

  //this.setOptions({		fillColor: '#ffcf2f',	});


  //move the video to near the icon
  var r = get_mapthing_bounds(retirement_rect) ;
  var center_h = Math.round((r.right + r.left)/2);
  document.getElementById('wrapper_vimeo_id').style.left = (center_h-videoWidth/2)+"px";
  document.getElementById('wrapper_vimeo_id').style.top = (r.bottom-videoHeight-videoUp)+"px";
  document.getElementById("video_title_id").innerHTML = "Condomínios +55";
  document.getElementById('wrapper_vimeo_id').style.display = "inline";

  //the callback function 'timeupdate' will make the video frame visible when it resets
  if (currentVideoId != video_id){
    document.getElementById("vimeo_id").style.display = "none";
    currentVideoId = video_id;
    change_video(videos[video_id][0]);
  }

});

google.maps.event.addListener(retirement_rect, 'mouseout', function (event) {

  //console.log("bola mouseleave");
  delayOverlayMouseout(this);



});



// RODEO behaviours
google.maps.event.addListener(rodeo_rect, 'mouseover', function (event) {

  video_id = 12; //line 35

	//this.setOptions({		fillColor: '#ffcf2f',	});



    //move the video to near the icon
    var r = get_mapthing_bounds(rodeo_rect) ;
    var center_h = Math.round((r.right + r.left)/2);
    document.getElementById('wrapper_vimeo_id').style.left = (center_h-videoWidth/2)+"px";
    document.getElementById('wrapper_vimeo_id').style.top = (r.bottom-videoHeight-videoUp)+"px";
    document.getElementById("video_title_id").innerHTML = "Rodeo";
    document.getElementById('wrapper_vimeo_id').style.display = "inline";

    //the callback function 'timeupdate' will make the video frame visible when it resets
    if (currentVideoId != video_id){
      document.getElementById("vimeo_id").style.display = "none";
      currentVideoId = video_id;
      change_video(videos[video_id][0]);
    }

});

google.maps.event.addListener(rodeo_rect, 'mouseout', function (event) {
  delayOverlayMouseout(this);

});


// WESTERN PARK behaviours
google.maps.event.addListener(western_park_circle, 'mouseover',function (event)  {

  video_id = 13; //line 35

  //this.setOptions({    fillColor: '#ffcf2f',  });

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
  delayOverlayMouseout(this);

});





document.getElementById('wrapper_vimeo_id').addEventListener('mouseenter', function () {
    //console.log("wrapper mouseenter");
    layerOverlapFlag = true;
});

document.getElementById('wrapper_vimeo_id').addEventListener('mouseleave', function () {
    //console.log("wrapper mouseleave");
    layerOverlapFlag = false;
    document.getElementById('wrapper_vimeo_id').style.display = "none";

});

//light up the places according to the form answers

var places = [];
var screenplay_places = [];
var screenplay_texts = [];


for (var i=0;i<9;i++) {
  if (question[i]!= -1) {
    if (question_map[i][question[i]] !== "---" ) {
        if (places.includes(question_map[i][question[i]][0])) {
          var where = places.indexOf(question_map[i][question[i]][0]);
          if (screenplay_texts[where]!=question_map[i][question[i]][2]) {
            screenplay_texts[where] = screenplay_texts[where] + question_map[i][question[i]][2];
          }
        } else {
          places.push (question_map[i][question[i]][0]);
          screenplay_places.push (question_map[i][question[i]][1]);;
          screenplay_texts.push (question_map[i][question[i]][2]);
        }
    }
  }
}

for (var i=0; i<places.length; i++) {
  screenplay_screenplay_content = screenplay_screenplay_content + (i+1) + screenplay_places[i] + screenplay_texts[i] + "<br>";
}

screenplay_screenplay_content = screenplay_screenplay_content + "<br><br>Você também pode explorar outros lugares do mapa livremente"

document.getElementById("screenplay_screenplay_id").innerHTML = screenplay_screenplay_content;
document.getElementById('screenplay_id').style.left = "-310px";


for (var i=0; i<places.length; i++) {
  switch (places[i]) {

    case "hanny":
      casa_1_overlay.set('url', 'images/arizona_icone_quadrado-amarelo.png');
      casa_1_overlay.setMap(map);
      break;

    case "corbin":
      casa_2_overlay.set('url', 'images/arizona_icone_quadrado-amarelo.png');
      casa_2_overlay.setMap(map);
      break;

    case "kristen":
      casa_3_overlay.set('url', 'images/arizona_icone_quadrado-amarelo.png');
      casa_3_overlay.setMap(map);
      break;

    case "cait":
      casa_4_overlay.set('url', 'images/arizona_icone_quadrado-amarelo.png');
      casa_4_overlay.setMap(map);
      break;

    case "casillas":
      casa_5_overlay.set('url', 'images/arizona_icone_quadrado-amarelo.png');
      casa_5_overlay.setMap(map);
      break;

    case "jan":
      casa_6_overlay.set('url', 'images/arizona_icone_quadrado-amarelo.png');
      casa_6_overlay.setMap(map);
      break;

    case "igrejas":
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
      break;

    case "volta":
      volta_overlay.set('url', 'images/icone_estrada-amarelo.png');
      break;


    case "highschool":
      skyland_highschool_rect.setOptions({		fillColor: '#ffcf2f',	})
      break;

    case "shootingrange":
      shooting_range_rect.setOptions({		fillColor: '#ffcf2f',	});
      break;

    case "gym":
      gym_rect.setOptions({		fillColor: '#ffcf2f',	});
      break;

    case "retirementhome":
      retirement_rect.setOptions({		fillColor: '#ffcf2f',	});
      break;

    case "rodeo":
      rodeo_rect.setOptions({		fillColor: '#ffcf2f',	});
      break;

    case "westernpark":
      western_park_circle.setOptions({		fillColor: '#ffcf2f',	});
      break;

    case "fronteira":
    //document.getElementById('fence_id').style.display = "inline";
    //document.getElementById('fence_us_id').style.display = "none";
    //document.getElementById('fence_mexico_id').style.display = "none";
      break;
  }

}

/*
{

}
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
  document.getElementById('fence_id').style.display = "none";
  document.getElementById('wrapper_wrapper_fronteira_id').style.display = "inline";

  //when the movie is finishedm return to main screen

  vimeo_fronteira.setCurrentTime(0);
  vimeo_fronteira.on('ended', endFronteira );

}



var endFronteira = function () {

    vimeo_fronteira.off('ended', endFronteira);
    document.getElementById('wrapper_wrapper_fronteira_id').style.display = "none";
    document.getElementById('fence_id').style.display = "none";


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

function delayOverlayMouseout (mythis) {
  setTimeout(function () {
    //console.log("time out");
    if (!layerOverlapFlag) {
      //mythis.setOptions({      fillColor: '#969696',      });

      document.getElementById('wrapper_vimeo_id').style.display = "none";
      layerOverlapFlag = false;
    }
  }, 500);
}


function close_box_fronteira() {
  document.getElementById("box_fronteira_id").style.display = "none";
  cruzesOverlay.set('url', 'images/cruzes_cinza.png');
  cruzesOverlay.setMap(map);

}


function click_fence() {
  goingToMexico=true;
  map.set('minZoom',0);
  map.set('maxZoom',18);
  panTo(32.5,-111.5,8,900,4);
  document.getElementById("fence_us_id").style.display = "none";
  document.getElementById("fence_id").style.display = "none";
  document.getElementById("fence_mexico_id").style.display = "none";

}

function show_fence_text () {
  document.getElementById("fence_us_id").style.display = "inline";
  document.getElementById("fence_mexico_id").style.display = "inline";
}

function hide_fence_text () {
  document.getElementById("fence_us_id").style.display = "none";
  document.getElementById("fence_mexico_id").style.display = "none";
}


var question_map =   [
  [["highschool"," <b>High school</b>  -"," Assistir jogo de futebol americano e Falar com Caruso sobre cultura do atleta."],
  ["gym"," <b>Academia do Ryan</b> -"," Falar com Ryan e Marcos sobre pessoas da idade deles"],
  "---",
  ["retirementhome"," <b>Condomínio +55</b> -"," Saber sobre aposentados em Mesa."]],
  [["fronteira"," <b>Fronteira do México</b> -"," Saber sobre influência mexicana em Mesa."],
  ["westernpark"," <b>Parque Western</b> -"," Saber sobre nativos no Arizona."],
  "---",
  ["fronteira"," <b>Fronteira do México</b> -"," Saber sobre influência mexicana em Mesa."],
  "---",
  ["fronteira"," <b>Fronteira do México</b> -"," Saber sobre influência mexicana em Mesa."],
  "---"],
  [["kristen", " <b>Casa da Kristen</b> -"," Falar sobre o clima em Mesa."],
  ["kristen", " <b>Casa da Kristen</b> -"," Falar sobre o clima em Mesa."],
  "---",
  ["kristen", " <b>Casa da Kristen</b> -"," Falar sobre o clima em Mesa."],
  "---"],
  [["corbin", " <b>Casa do Corbin</b> -"," Falar sobre conservadores."],
  ["corbin", " <b>Casa do Corbin</b> -"," Falar sobre conservadores."],
  ["volta"," <b>Volta por Mesa</b> -"," Saber como a cidade mudou em 15 anos."],
  ["hanny", " <b>Casa dos Hanny</b> -"," Falar com Pam sobre constituição."],
  "---"],
  [["igrejas"," <b>Tour das igrejas</b> -"," Saber quem são os mormons."],
  ["igrejas"," <b>Tour das igrejas</b> -"," Saber quem são os mormons."],
  ["igrejas"," <b>Tour das igrejas</b> -"," Saber quem são os mormons."],
  ["igrejas"," <b>Tour das igrejas</b> -"," Saber sobre a influência dos mormons  em Mesa."],
  ["igrejas"," <b>Tour das igrejas</b> -"," Saber sobre a influência dos mormons  em Mesa."]],
  [["cait", " <b>Casa da Cait</b> -"," Perguntar para Cait a diferença entre republicanos e democratas."],
  ["cait", " <b>Casa da Cait</b> -"," Perguntar para Cait a diferença entre republicanos e democratas."],
  ["casillas"," <b>Casa dos Casillas</b> -"," Falar com Mr Casillas sobre Dom Quixote."],
  ["corbin", " <b>Casa do Corbin</b> -"," Falar com Corbin sobre libertários."],
  ["hanny", " <b>Casa dos Hanny</b> -"," Falar com Vic sobre conservadores."],
  "---",
  ["corbin", " <b>Casa do Corbin</b> -"," Falar com Corbin sobre libertários."],
  ["casillas", " <b>Casa dos Casillas</b> -"," Falar com Mr Casillas sobre Dom Quixote."],
  ["rodeo"," <b>Rodeio</b> -"," Falar com EJ sobre eleições de 2016."],
  "---"],
  [["jan", " <b>Casa da Jan</b> -"," Falar com Jan sobre carro."],
  ["hanny", " <b>Casa dos Hanny</b> -"," Falar com Brandon sobre transporte em Mesa."],
  ["volta"," <b>Volta por Mesa</b>",""],
  ["volta"," <b>Volta por Mesa</b>",""],
  ["volta"," <b>Volta por Mesa</b>",""]],
  [["shootingrange"," <b>Shooting Range</b>  -"," Falar com Ricky sobre armas."],
  ["shootingrange"," <b>Shooting Range</b> -"," Saber como é a lei de armas no Arizona."],
  ["shootingrange"," <b>Shooting Range</b> -"," Falar com Ricky sobre armas e Falar com Vic sobre 2ª emenda."],
  ["shootingrange"," <b>Shooting Range</b> -"," Falar com Ricky sobre armas e Falar com Vic sobre 2ª emenda."],
  "---"],
  [["fronteira"," <b>Fronteira do México</b> -"," Saber sobre influência mexicana em Mesa."],
  ["fronteira"," <b>Fronteira do México</b> -"," Saber sobre influência mexicana em Mesa."],
  ["fronteira"," <b>Fronteira do México</b> -"," Ouvir opinião sobre o muro."],
  ["fronteira"," <b>Fronteira do México</b> -"," Ouvir opinião sobre o muro."],
  ["fronteira"," <b>Fronteira do México</b> -"," Saber sobre influência mexicana em Mesa."]]
];

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




/*
var cruzes = [
  32.1117,32.1087,-112.9925,-112.9955,
  31.91683,31.91383,-112.93808,-112.94108,
  31.700433,31.697433,-111.700666,-111.703666,
  33.63877,33.63577,-114.26164,-114.26464,
  32.31711,32.31411,-113.13486,-113.13786,
  32.31711,32.31411,-113.13483,-113.13783,
  32.30597,32.30297,-113.09133,-113.09433,
  31.68753,31.68453,-111.98465,-111.98765,
  32.06821,32.06521,-112.4018,-112.4048,
  31.99745,31.99445,-112.12123,-112.12423,
  32.11655,32.11355,-111.67701,-111.68001,
  32.45399,32.45099,-113.18415,-113.18715,
  32.0145,32.0115,-112.06358,-112.06658,
  32.3088,32.3058,-111.395217,-111.398217,
  31.4246,31.4216,-111.2435,-111.2465,
  31.90777,31.90477,-110.40457,-110.40757,
  32.08317,32.08017,-112.29913,-112.30213,
  32.31615,32.31315,-113.08218,-113.08518,
  32.3235,32.3205,-113.10186,-113.10486,
  32.28982,32.28682,-113.08218,-113.08518,
  31.847404,31.844404,-111.404717,-111.407717,
  32.29002,32.28702,-113.08218,-113.08518,
  31.42439,31.42139,-111.24375,-111.24675,
  32.16779,32.16479,-113.11262,-113.11562,
  31.95165,31.94865,-112.83267,-112.83567,
  31.745261,31.742261,-111.855706,-111.858706,
  31.85898,31.85598,-112.40396,-112.40696,
  32.393333,32.390333,-113.1245,-113.1275,
  32.34814,32.34514,-113.09823,-113.10123,
  31.820317,31.817317,-112.141433,-112.144433,
  31.49293,31.48993,-111.40696,-111.40996,
  31.77614,31.77314,-111.23924,-111.24224,
  32.08903,32.08603,-113.25421,-113.25721,
  32.170217,32.167217,-112.376717,-112.379717,
  31.9442,31.9412,-113.018383,-113.021383,
  31.70533,31.70233,-112.00406,-112.00706,
  32.01978,32.01678,-112.15991,-112.16291,
  32.39312,32.39012,-113.39312,-113.39612,
  31.79776,31.79476,-112.12161,-112.12461,
  32.2623,32.2593,-111.57253,-111.57553,
  32.34637,32.34337,-113.11729,-113.12029,
  31.9758,31.9728,-112.988183,-112.991183,
  32.328767,32.325767,-113.118367,-113.121367,
  32.11713,32.11413,-113.00212,-113.00512,
  32.04674,32.04374,-113.00973,-113.01273,
  31.884333,31.881333,-111.806183,-111.809183,
  32.04694,32.04394,-113.00973,-113.01273,
  31.98845,31.98545,-112.149283,-112.152283,
  31.80328,31.80028,-112.40016,-112.40316,
  32.41068,32.40768,-113.13601,-113.13901,
  32.54941,32.54641,-113.13165,-113.13465,
  31.88556,31.88256,-110.54183,-110.54483,
  32.4503,32.4473,-113.13721,-113.14021,
  32.43983,32.43683,-113.13195,-113.13495,
  32.43381,32.43081,-113.12862,-113.13162,
  31.882383,31.879383,-112.16165,-112.16465,
  32.601267,32.598267,-112.671433,-112.674433,
  32.034241,32.031241,-111.339419,-111.342419,
  31.76012,31.75712,-111.42261,-111.42561,
  32.31955,32.31655,-112.5273,-112.5303,
  31.98217,31.97917,-112.13511,-112.13811,
  31.64953,31.64653,-111.45708,-111.46008,
  32.44072,32.43772,-113.11978,-113.12278,
  32.41934,32.41634,-113.13554,-113.13854,
  32.41131,32.40831,-113.13784,-113.14084,
  32.41175,32.40875,-113.13807,-113.14107,
  32.41754,32.41454,-113.1268,-113.1298,
  32.42663,32.42363,-113.12548,-113.12848,
  32.45975,32.45675,-113.12954,-113.13254,
  32.46414,32.46114,-113.13318,-113.13618,
  31.90665,31.90365,-111.337367,-111.340367,
  32.40368,32.40068,-111.5488,-111.5518,
  32.3334,32.3304,-113.1181,-113.1211,
  31.793083,31.790083,-111.852183,-111.855183,
  31.70756,31.70456,-112.00154,-112.00454,
  32.106783,32.103783,-112.969983,-112.972983,
  32.06269,32.05969,-112.47641,-112.47941,
  31.9984,31.9954,-113.0138,-113.0168,
  32.22316,32.22016,-112923,-112923003,
  31.764317,31.761317,-111.390167,-111.393167,
  31.764317,31.761317,-111.390147,-111.393147,
  31.735367,31.732367,-111.835983,-111.838983,
  32.35445,32.35145,-111.56925,-111.57225,
  32.126939,32.123939,-112.410878,-112.413878,
  31.91138,31.90838,-111.3925,-111.3955,
  32.3624,32.3594,-113.1166,-113.1196,
  32.13059,32.12759,-111.16547,-111.16847,
  32.34835,32.34535,-113.10178,-113.10478,
  31.9237,31.9207,-112.9088,-112.9118,
  32.19935,32.19635,-111.4761,-111.4791,
  31.493283,31.490283,-111.467866,-111.470866,
  32.36358,32.36058,-112.32331,-112.32631,
  32.363583,32.360583,-112.323517,-112.326517,
  32.03378,32.03078,-113.01675,-113.01975,
  31.92835,31.92535,-111.3568,-111.3598,
  32.00386,32.00086,-112.77683,-112.77983,
  32.376133,32.373133,-113.105733,-113.108733,
  32.181667,32.178667,-111.882317,-111.885317,
  31.76985,31.76685,-111.96225,-111.96525,
  32.16643,32.16343,-113.00467,-113.00767,
  31.735967,31.732967,-111.954083,-111.957083,
  31.684483,31.681483,-111.863267,-111.866267,
  31.751633,31.748633,-111.987583,-111.990583,
  32.06815,32.06515,-111.997033,-112.000033,
  32.28838,32.28538,-113.07648,-113.07948,
  31.59205,31.58905,-111.86046,-111.86346,
  31.71875,31.71575,-112.2128,-112.2158,
  31.830667,31.827667,-111.3885,-111.3915,
  32.216033,32.213033,-111.558767,-111.561767,
  32.19406,32.19106,-112.9916,-112.9946,
  31.490717,31.487717,-111.426033,-111.429033,
  31.81731,31.81431,-111.32687,-111.32987,
  32.15686,32.15386,-112.92628,-112.92928,
  32.150433,32.147433,-113.144967,-113.147967,
  32.17897,32.17597,-112.89472,-112.89772,
  31.96283,31.95983,-110.2434,-110.2464,
  31.90245,31.89945,-110.4074,-110.4104,
  32.1505,32.1475,-112.90348,-112.90648,
  31.88146,31.87846,-111.40476,-111.40776,
  31.805867,31.802867,-111.604967,-111.607967,
  31.86881,31.86581,-111.36656,-111.36956,
  31.68535,31.68235,-110.42346,-110.42646,
  32.05535,32.05235,-112.429783,-112.432783,
  32.09966,32.09666,-112.70402,-112.70702
];
*/
