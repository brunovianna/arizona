// JavaScript Document
var map;



var panPath = [];   // An array of points the current panning action will use
var panQueue = [];  // An array of subsequent panTo actions to take
var STEPS = 10;     // The number of steps that each panTo action will undergo
var pan_started = 0;
var allowed_bounds;
var last_valid_center;
var reservationOverlay;
var video_width = 200;
var video_height = 112;
var video_up = 61;
var video_status = "none";
var goingToMexico = false;
var returningToMesa = false;
var mouseover_enabled = false;
var mouseover_place = "";
var vimeo_fronteira;
var vimeo_player;
var currentVideoId = -1;
var screenplay_content = "<br><b>ROTEIRO</b><br><br>Baseado em suas respostas, recomendamos que você visite as seguintes localidades em Mesa: <br><br>";


var cruzes_bounds = [];
var cruzes_overlays = [];

var layerOverlapFlag = false;


var places = [];
var screenplay_places = [];
var screenplay_texts = [];

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
  maxZoom: 13,
  gestureHandling: "none"
});

map.setOptions({styles: map_style});

//we need this to be able to get the x and y pixel position of the map rectangles
overlay = new google.maps.OverlayView();
overlay.draw = function () {};
overlay.setMap(map);

// bounds of the mesa area -- no panning beyond this
allowed_bounds = new google.maps.LatLngBounds(
     new google.maps.LatLng(33.2, -112),
     //new google.maps.LatLng(31.18, -112),
     new google.maps.LatLng(33.45, -111.7)
);
last_valid_center = map.getCenter();


google.maps.event.addListener(map, 'center_changed', function() {
    //console.log(map.getCenter().lat()+ " "+map.getCenter().lng());
    //console.log(allowed_bounds+ " "+map.getCenter().lng());
    //console.log("center changed");
    // check if we're doing the pan to mexico
    if (!goingToMexico) {
      if ((!returningToMesa)&&(map.getCenter().lat() < 33.22)) {
        //show border arrow
        //use different trigger now? crosses mouseover?
        document.getElementById('fence_id').style.display = "block";
        document.getElementById('fence_us_id').style.display = "none";
        document.getElementById('fence_mexico_id').style.display = "none";

      }
      if (allowed_bounds.contains(map.getCenter())) {
          // still within valid bounds, so save the last valid position
          //console.log("center");
          last_valid_center = map.getCenter();
          return;
      }

      // not valid anymore => return to last valid position
      map.panTo(last_valid_center);
      //console.log("yeah");
    }
});

//vimeo_fronteira = new Vimeo.Player(document.getElementById("video_fronteira"));

vimeo_player = new Vimeo.Player(document.getElementById("vimeo_id"));

video_full = new Vimeo.Player(document.getElementById("video_full_id"));


// vimeo_player.on('timeupdate', function(data) {
//     // data is an object containing properties specific to that event
//     //console.log("hidden "+data.seconds+", status: "+vimeo_player.getPaused());
//     if (document.getElementById("vimeo_id").style.display == "none") {
//       //console.log("hidden "+data.seconds);
//
//       if (data.seconds < 0.5 ){
//         document.getElementById("vimeo_id").style.display="block";
//         //console.log("showing "+data.seconds);
//
//       }
//     } else {
//       //console.log("timeupdate "+data.seconds);
//     }
// });

vimeo_player.on('bufferend', function(){
  if (document.getElementById("vimeo_id").style.display == "none") {
    document.getElementById("vimeo_id").style.display="block";
  }
});

// vimeo_player.on('loaded', function(){
//   console.log("loaded "+video_status);
// });

vimeo_player.on('ended', function(data) {

    // show display videos
    show_display_videos();

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
cruzes_bounds.forEach (function (item, index) {
  cruzes_overlays[index] = new google.maps.GroundOverlay('images/arizona_icone_cruz-cinza.png', item);
  cruzes_overlays[index].setMap(map);
  }

);


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

//CROSSES behaviours
cruzes_overlays.forEach ( function(item, index){

  google.maps.event.addListener(item, 'mouseover', function() {
    if (mouseover_enabled) {
      cruzes_overlays.forEach ( function (subitem,subindex){
        subitem.set('url', 'images/arizona_icone_cruz-amarelo.png');
        subitem.setMap(map);
      });
      document.getElementById("box_fronteira_id").style.display = "grid";
    }
  }  );


  }
);

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
  if (mouseover_enabled) {
    video_id = 226354563; //line 29

    var r = get_mapthing_bounds(my_overlay) ;

    show_preview (r, video_id, "Tour das Igrejas");

  }
}

function igrejaMouseOut (out_overlay) {
  if (mouseover_enabled) {
    delay_overlay_mouseout(out_overlay);
  }
}

// HOUSES behaviours

google.maps.event.addListener(casa_1_overlay, 'mouseover', function () { casaMouseOver(casa_1_overlay, 'wrapper_preview_id',226354540, 'Casa dos ','Hanny');});
google.maps.event.addListener(casa_1_overlay, 'mouseout', function () { casaMouseOut(casa_1_overlay);});
google.maps.event.addListener(casa_2_overlay, 'mouseover', function () { casaMouseOver(casa_2_overlay, 'wrapper_preview_id',226353399,'Casa do ','Corbin');});
google.maps.event.addListener(casa_2_overlay, 'mouseout', function () { casaMouseOut(casa_2_overlay);});
google.maps.event.addListener(casa_3_overlay, 'mouseover', function () { casaMouseOver(casa_3_overlay, 'wrapper_preview_id',226353447,'Casa da ','Kristen');});
google.maps.event.addListener(casa_3_overlay, 'mouseout', function () { casaMouseOut(casa_3_overlay);});
google.maps.event.addListener(casa_4_overlay, 'mouseover', function () { casaMouseOver(casa_4_overlay, 'wrapper_preview_id',226353387,'Casa da ','Cait');});
google.maps.event.addListener(casa_4_overlay, 'mouseout', function () { casaMouseOut(casa_4_overlay);});
google.maps.event.addListener(casa_5_overlay, 'mouseover', function () { casaMouseOver(casa_5_overlay, 'wrapper_preview_id',226353434,'Casa dos ','Casillas');});
google.maps.event.addListener(casa_5_overlay, 'mouseout', function () { casaMouseOut(casa_5_overlay);});
google.maps.event.addListener(casa_6_overlay, 'mouseover', function () { casaMouseOver(casa_6_overlay, 'wrapper_preview_id',226368841,'Casa da ','Jan');});
google.maps.event.addListener(casa_6_overlay, 'mouseout', function () { casaMouseOut(casa_6_overlay);});

function casaMouseOver(me, id, video_id, text_1, text_2) {
  if (mouseover_enabled) {

    var r = get_mapthing_bounds(me) ;
    show_preview(r, video_id,(text_1+text_2));

  }
};

function casaMouseOut (casa_overlay) {

  if (mouseover_enabled) {

    delay_overlay_mouseout(casa_overlay);

  }

}

// VOLTA behaviours
google.maps.event.addListener(volta_overlay, 'mouseover', function (event) {

  if (mouseover_enabled) {

    //line 30
     video_id = 253042771;

      var r = get_mapthing_bounds(volta_overlay) ;
      show_preview(r, video_id, "Volta por Mesa");


    }
});

google.maps.event.addListener(volta_overlay, 'mouseout', function (event) {


  if (mouseover_enabled) {

    delay_overlay_mouseout();
  }

});


// SCHOOL behaviours
google.maps.event.addListener(skyland_highschool_rect, 'mouseover', function (event) {
	// Within the event listener, "this" refers to the polygon which
	// received the event.
  //
  if (mouseover_enabled) {

    //line 31
    video_id = 225001757;

    var r = get_mapthing_bounds(skyland_highschool_rect) ;
    show_preview(r, video_id, "High School");

  }
});

google.maps.event.addListener(skyland_highschool_rect, 'mouseout', function (event) {
  if (mouseover_enabled) {
    delay_overlay_mouseout(this);
  }

});


// GYM behaviours
google.maps.event.addListener(gym_rect, 'mouseover', function (event) {

	//this.setOptions({		fillColor: '#ffcf2f',	});
  if (mouseover_enabled) {

    //line 31
    video_id = 225001970;

    //move the video to near the icon
    var r = get_mapthing_bounds(gym_rect) ;
    show_preview(r, video_id, "Academia do Ryan");

  }
});

google.maps.event.addListener(gym_rect, 'mouseout', function (event) {
  if (mouseover_enabled) {
    delay_overlay_mouseout(this);
  }

});

// SHOOTING RANGE behaviours
google.maps.event.addListener(shooting_range_rect, 'mouseover', function (event) {

	//this.setOptions({		fillColor: '#ffcf2f',	});
  if (mouseover_enabled) {

    //line 32
    video_id = 226357094;

    //move the video to near the icon
    var r = get_mapthing_bounds(shooting_range_rect) ;
    show_preview(r, video_id, "Shooting Range");

  }
});

google.maps.event.addListener(shooting_range_rect, 'mouseout', function (event) {
  if (mouseover_enabled) {
    delay_overlay_mouseout(this);
  }
});

// RETIREMENT behaviours
google.maps.event.addListener(retirement_rect, 'mouseover', function (e) {

  if (mouseover_enabled) {

    video_id = 225002041; //line 34

    //this.setOptions({		fillColor: '#ffcf2f',	});


    //move the video to near the icon
    var r = get_mapthing_bounds(retirement_rect) ;
    show_preview(r, video_id, "Condomínios +55");

  }
});

google.maps.event.addListener(retirement_rect, 'mouseout', function (event) {

  //console.log("bola mouseleave");
  if (mouseover_enabled) {

    delay_overlay_mouseout(this);
  }


});



// RODEO behaviours
google.maps.event.addListener(rodeo_rect, 'mouseover', function (event) {

  if (mouseover_enabled) {

    video_id = 226364472; //line 35


      //move the video to near the icon
      var r = get_mapthing_bounds(rodeo_rect) ;
      show_preview(r, video_id, "Rodeo");

    }
});

google.maps.event.addListener(rodeo_rect, 'mouseout', function (event) {
  if (mouseover_enabled) {
    delay_overlay_mouseout(this);
  }
});


// WESTERN PARK behaviours
google.maps.event.addListener(western_park_circle, 'mouseover',function (event)  {

  if (mouseover_enabled) {
        video_id = 226354643; //line 35

      //this.setOptions({    fillColor: '#ffcf2f',  });

      //move the video to near the icon
      var r = get_mapthing_bounds(western_park_circle) ;
      show_preview(r, video_id, "Western Park");

    }
});


google.maps.event.addListener(western_park_circle, 'mouseout', function (event) {
  if (mouseover_enabled) {
    delay_overlay_mouseout(this);
  }
});





document.getElementById('wrapper_preview_id').addEventListener('mouseenter', function () {
    //console.log("wrapper mouseenter");
    layerOverlapFlag = true;
});

document.getElementById('wrapper_preview_id').addEventListener('mouseleave', function () {
    //console.log("wrapper mouseleave");
    close_preview();
});

document.getElementById("wrapper_content_id").addEventListener('mouseleave', function () {
  //
  //console.log("mouseleave");
  close_display_videos();
});



//light up the places according to the form answers

for (var i=0;i<9;i++) {
  if (question[i]!= -1) {
    if (question_map[i][question[i]] !== "---" ) {
        if (places.includes(question_map[i][question[i]][0])) {
          var where = places.indexOf(question_map[i][question[i]][0]);
          if (screenplay_texts[where]!=question_map[i][question[i]][2]) {
            screenplay_texts[where] = screenplay_texts[where]  + question_map[i][question[i]][2];

          }
        } else {
          places.push (question_map[i][question[i]][0]);
          screenplay_places.push (question_map[i][question[i]][1]);
          screenplay_texts.push (question_map[i][question[i]][2]);
;
        }
    }
  }
}


for (var i=0; i<places.length; i++) {
  screenplay_content = screenplay_content + (i+1) + screenplay_places[i] + screenplay_texts[i] + "<br>";
}

screenplay_content = screenplay_content + "<br><br>Você também pode explorar outros lugares do mapa livremente"

document.getElementById("screenplay_id").innerHTML = screenplay_content;


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
    //document.getElementById('fence_id').style.display = "block";
    //document.getElementById('fence_us_id').style.display = "none";
    //document.getElementById('fence_mexico_id').style.display = "none";
      break;
  }

}


// for the toggle to work properly
document.getElementById("wrapper_reiniciar_id").style.display = "none";

//scrollbar function
$(function()
{

  $('.wrapper_welcome').jScrollPane(
  {

    showArrows: true,
    horizontalGutter: 10
  });

  $('.wrapper_screenplay').jScrollPane(
  {

    showArrows: true,
    horizontalGutter: 10
  });


});

}

//hack to detect mouse click on iframe
var iframe_monitor = setInterval(function(){
    var elem = document.activeElement;
    if(elem && elem.tagName == 'IFRAME'){
      if (elem.id == "vimeo_id") {
        console.log(video_status);
        if (video_status!="none") {
          // if the preview is already fullscreen, clicking will close it and show the display videos
          if (  document.getElementById("wrapper_preview_id").style.width == "97%") {
            show_display_videos();
          } else { //otherwise show to preview on fullscreen
            preview_fullscreen();
          }
        }
      } else { //clicked on the display video_titles

      }
      elem.blur();
    }
}, 100);

function show_video_content_full_screen (video_content_id, video_object) {
  document.getElementById("wrapper_video_full_id").style.display = "block";
}


function show_preview (r, my_video_id, text) {

  video_status = my_video_id;

  var center_h = Math.round((r.right + r.left)/2);

  document.getElementById('wrapper_preview_id').style.left = (center_h-video_width/2)+"px";
  document.getElementById('wrapper_preview_id').style.top = (r.bottom-video_height-video_up)+"px";
  document.getElementById('wrapper_preview_id').style.display = "block";
  document.getElementById("video_title_id").innerHTML = text;

    //the callback function 'timeupdate' will make the video frame visible when it resets
    if (currentVideoId != my_video_id){
      document.getElementById("vimeo_id").style.display = "none";
      currentVideoId = my_video_id;
      change_video(my_video_id, vimeo_player);
  }

}



function get_mapthing_bounds (mymapthing) {
  var mapthing_topright = mymapthing.getBounds().getNorthEast();
  var mapthing_bottomleft = mymapthing.getBounds().getSouthWest();
  var xy_topright = overlay.getProjection().fromLatLngToContainerPixel(mapthing_topright);
  var xy_bottomleft = overlay.getProjection().fromLatLngToContainerPixel(mapthing_bottomleft);

  var r = {'left': xy_bottomleft.x, 'top':xy_topright.y, 'right': xy_topright.x, 'bottom': xy_bottomleft.y};

  return r;

}
function find_key (my_obj, my_keymap) {

  var position = -1;
  for (var item in my_keymap){
    if (my_keymap[item] == my_obj ) {
      position = item;
      break;
    }
  }

  return position;

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
      setTimeout(show_fronteira, 2000);
    } else {
      returningToMesa=false;
    }
  }

}

function show_fronteira() {
  document.getElementById('fence_id').style.display = "none";
  //document.getElementById('wrapper_wrapper_fronteira_id').style.display = "block";

  //when the movie is finishedm return to main screen

  video_status = find_key("fronteira",preview_videos);

  document.getElementById('wrapper_preview_id').style.display = "block";

  preview_fullscreen();

  // vimeo_fronteira.setCurrentTime(0);
  // vimeo_fronteira.on('ended', end_fronteira );

}

var end_fronteira = function () {

  //  vimeo_fronteira.off('ended', end_fronteira);
  //  document.getElementById('wrapper_wrapper_fronteira_id').style.display = "none";
    document.getElementById('fence_id').style.display = "none";


    setTimeout(function() {
      goingToMexico=false;
      returningToMesa=true;
      panTo(33.37, -111.8, 13, 900, 5);
      }
      , 1000);

}

function change_video (new_id, video_object) {
  video_object.unload().then(function() {
    video_object.loadVideo(new_id).then(function() {
        // the video successfully loaded
        console.log("finally");
          if (document.getElementById("vimeo_id").style.display == "none") {
            document.getElementById("vimeo_id").style.display="block";
          }
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
    });
}

function preview_fullscreen () {


  document.getElementById("wrapper_preview_id").style.width = "97%";
  document.getElementById("wrapper_preview_id").style.height = "97%";
  document.getElementById("wrapper_preview_id").style.top = "50%";
  document.getElementById("wrapper_preview_id").style.left = "50%";
  document.getElementById("wrapper_preview_id").style.transform = "translate(-50%,-50%)";
  document.getElementById("wrapper_preview_id").style.zIndex = 1000;
  document.getElementById("video_title_id").style.display = "none";
  document.getElementById("video_arrow_id").style.display = "none";
  document.getElementById("video_wrapper_id").style.width = "100%";
  document.getElementById("video_wrapper_id").style.height = "100%";
  document.getElementById("video_wrapper_id").style.margintop = "0px";

  vimeo_player.setLoop(false).then(function(loop) {
      // loop was turned on

  }).catch(function(error) {
      // an error occurred
      console.log("couldnt stop loop");
  });

  //document.getElementById("video_wrapper_id").style.top = "0px";

}

function show_display_videos() {
  place = preview_videos[video_status];
  var position = -1;
  for (var i=0;i<places_display_videos_map.length;i++) {
    if (places_display_videos_map[i][0] == place) {
      position = i;
      break;
    }
  }

  place_display_videos = places_display_videos_map[i][1];

  document.getElementById("text_content_1_id").innerHTML = display_video_keymap[place_display_videos[0]];
  document.getElementById("div_img_content_1_id").style.display = "block";
  document.getElementById("text_content_1_id").style.display = "block";
  document.getElementById("wrapper_content_grid_id").style.gridTemplateRows = "300px";
  document.getElementById("wrapper_content_grid_id").style.top = "50%";
  document.getElementById("wrapper_content_grid_id").style.transform = "translate(0,-50%)";


  if (place_display_videos[1]!=undefined) {

    document.getElementById("text_content_2_id").innerHTML = display_video_keymap[place_display_videos[1]];
    document.getElementById("div_img_content_2_id").style.display = "block";
    document.getElementById("text_content_2_id").style.display = "block";
    document.getElementById("wrapper_content_grid_id").style.gridTemplateRows = "300px 300px";
    document.getElementById("wrapper_content_grid_id").style.top = "50%";
    document.getElementById("wrapper_content_grid_id").style.transform = "translate(0,-50%)";

  } else {

    document.getElementById("div_img_content_2_id").style.display = "none";
    document.getElementById("text_content_2_id").style.display = "none";
  }

  if (place_display_videos[2]!=undefined) {

    document.getElementById("text_content_3_id").innerHTML = display_video_keymap[place_display_videos[2]];
    document.getElementById("div_img_content_3_id").style.display = "block";
    document.getElementById("text_content_3_id").style.display = "block";
    document.getElementById("wrapper_content_grid_id").style.gridTemplateRows = "300px 300px 300px";
    document.getElementById("wrapper_content_grid_id").style.top = "0";

  } else {
    document.getElementById("div_img_content_3_id").style.display = "none";
    document.getElementById("text_content_3_id").style.display = "none";
  }

  close_preview();
  var bg_color = -1;
  for (var i=0;i<places_colors_map.length;i++) {
    if (places_colors_map[i][0] == place) {
      position = i;
      break;
    }
  }
  document.getElementById("wrapper_content_id").style.backgroundColor = places_colors_map[i][1];
  document.getElementById("wrapper_content_id").style.display = "block";

}


function close_display_videos() {

  document.getElementById("wrapper_content_id").style.display = "none";
  if (video_status == 226354838) { // fronteira

  }

}

function close_preview() {

  document.getElementById('wrapper_preview_id').style.display = "none";
  document.getElementById("wrapper_preview_id").style.width = "200px";
  document.getElementById("wrapper_preview_id").style.height = "136px";
  document.getElementById("wrapper_preview_id").style.zIndex = "initial";
  document.getElementById("wrapper_preview_id").style.transform = "";
  document.getElementById("video_title_id").style.display = "block";
  document.getElementById("video_arrow_id").style.display = "block";
  document.getElementById("video_wrapper_id").style.width = "100%";
  document.getElementById("video_wrapper_id").style.height = "112px";
  document.getElementById("video_wrapper_id").style.margintop = "-18px";
  layerOverlapFlag = false;

  if (video_status == 226354838) { //fronteir has no mouseover preview

    end_fronteira();
  } else {

    vimeo_player.setLoop(true).then(function(loop) {
        // loop was turned on
    }).catch(function(error) {
        // an error occurred
        console.log("couldnt restart loop");
    });
  }
}

function delay_overlay_mouseout (mythis) {
  setTimeout(function () {
    //console.log("time out");
    if (!layerOverlapFlag) {
      //mythis.setOptions({      fillColor: '#969696',      });

      document.getElementById('wrapper_preview_id').style.display = "none";
      document.getElementById("wrapper_preview_id").style.zIndex = "initial";
      layerOverlapFlag = false;
    }
  }, 500);
}

function close_box_fronteira() {
  document.getElementById("box_fronteira_id").style.display = "none";
  cruzes_overlays.forEach ( function(item, index){
    item.set('url', 'images/arizona_icone_cruz-cinza.png');
    item.setMap(map);
  });
}

function click_fence() {
  goingToMexico=true;
  map.set('minZoom',0);
  map.set('maxZoom',18);
  panTo(32.5,-111.5,8,900,4);
  document.getElementById("fence_us_id").style.display = "none";
  document.getElementById("fence_id").style.display = "none";
  document.getElementById("fence_mexico_id").style.display = "none";
  document.getElementById("box_fronteira_id").style.display = "none";

}

function show_fence_text () {
  document.getElementById("fence_us_id").style.display = "inline";
  document.getElementById("fence_mexico_id").style.display = "inline";
}

function hide_fence_text () {
  document.getElementById("fence_us_id").style.display = "none";
  document.getElementById("fence_mexico_id").style.display = "none";
}

function close_welcome() {
  document.getElementById("wrapper_welcome_id").style.display="none";
  document.getElementById("nav_info_img_id").src = "images/info_branco.png";
  document.getElementById("wrapper_screenplay_id").style.display = "block";
  document.getElementById("nav_screenplay_img_id").src = "images/roteiro_cinza.png"

  //enable map drag
  map.setOptions({gestureHandling: "auto"});

  //enable mouseover
  mouseover_enabled = true;

}

function close_screenplay() {
    document.getElementById("wrapper_screenplay_id").style.display = "none";
    document.getElementById("nav_screenplay_img_id").src = "images/roteiro_branco.png"
}

function toggle_confirm_restart () {
  if (document.getElementById("wrapper_reiniciar_id").style.display == "none") {
    document.getElementById("wrapper_reiniciar_id").style.display = "grid";
    document.getElementById("nav_home_img_id").src = "images/home_cinza.png"
  } else
     close_restart();
}

function confirm_restart () {
  window.location.href = "http://vps3575.publiccloud.com.br/v7_juntando_tudo/";
}

function close_restart() {
  document.getElementById("wrapper_reiniciar_id").style.display = "none";
  document.getElementById("nav_home_img_id").src = "images/home_branco.png"
}

function toggle_screenplay() {
  if (document.getElementById("wrapper_screenplay_id").style.display == "none") {
    document.getElementById("wrapper_screenplay_id").style.display = "block";
    document.getElementById("nav_screenplay_img_id").src = "images/roteiro_cinza.png"

  } else {
    document.getElementById("wrapper_screenplay_id").style.display = "none";
    document.getElementById("nav_screenplay_img_id").src = "images/roteiro_branco.png"

  }
}

function toggle_welcome() {
  if (document.getElementById("wrapper_welcome_id").style.display == "none") {
    document.getElementById("wrapper_welcome_id").style.display = "block";
    document.getElementById("nav_info_img_id").src = "images/info_cinza.png";
  } else {
    document.getElementById("wrapper_welcome_id").style.display = "none";
    document.getElementById("nav_info_img_id").src = "images/info_branco.png";

  }
}

var display_video_keymap = {
  277709314: " Saber sobre influência mexicana em Mesa.",
  277715449: " Ouvir opinião sobre o muro.",
  277708469: " Falar com Vic sobre 2ª emenda.",
  277692847: " Falar com Ricky sobre armas.",
  277698969: " Falar com Brandon sobre transporte em Mesa.",
  225001839: " Assistir jogo de futebol americano.",
  277672983: " Falar com Caruso sobre cultura do atleta.",
  225002003: " Falar com Ryan e Marcos sobre pessoas da idade deles.",
  225002617: " Saber sobre aposentados em Mesa.",
  277671504: " Saber sobre nativos no Arizona.",
  277671431: " Falar sobre o clima em Mesa.",
  277671318: " Falar sobre conservadores.",
  277704394: " Saber como a cidade mudou em 15 anos.",
  277700826: " Falar com Pam sobre constituição.",
  277691166: " Saber quem são os mormons.",
  277672205: " Saber sobre a influência dos mormons  em Mesa.",
  277696011: " Perguntar para Cait a diferença entre republicanos e democratas.",
  277701979: " Falar com Mr Casillas sobre Dom Quixote.",
  277713981: " Falar com Corbin sobre libertários.",
  277693843: " Falar com Vic sobre conservadores.",
  277713981: " Falar com Corbin sobre libertários.",
  277671346: " Falar com EJ sobre eleições de 2016.",
  277671386: " Falar com Jan sobre carro.",
  277698969: " Falar com Brandon sobre transporte em Mesa.",
  277707280: " Saber como é a lei de armas em Arizona"
};


var  preview_videos = {
  226354540: "hanny",
  226353399: "corbin",
  226353447: "kristen",
  226353387: "cait",
  226353434: "casillas",
  226368841: "jan",
  226354563: "igrejas",
  253042771: "volta",
  225001757: "highschool",
  226357094: "shootingrang",
  225001970: "gym",
  225002041: "retirementhome",
  226364472: "rodeo",
  226354643: "westernpark",
  226354838: "fronteira"
};


var places_display_videos_map = [
  ["kristen",[277671431]],
  ["corbin",[277671318]],
  ["hanny", [277700826,277698969]],
  ["cait", [277696011]],
  ["casillas", [277701979]],
  ["jan", [277671386]],
  ["volta", [277704394]],
  ["igrejas", [277691166,277672205]],
  ["rodeo", [277671346]],
  ["highschool",[225001839,277672983]],
  ["gym", [225002003]],
  ["retirementhome", [225002617]],
  ["westernpark", [277671504]],
  ["shootingrange",[277692847,277707280,277708469]],
  ["fronteira",[277709314,277715449]]
];

var places_colors_map = [
  ["highschool","#466e00"],
  ["shootingrange", "#5a5a5a"],
  ["rodeo","#ff9100"],
  ["igrejas", "#f0d2b4"],
  ["fronteira", "#a09632"],
  ["westernpark","#ffcf2f"],
  ["jan","#ece5cd"],
  ["kristen","#ece5cd"],
  ["hanny","#ece5cd"],
  ["cait","#ece5cd"],
  ["casillas","#ece5cd"],
  ["corbin","#ece5cd"],
  ["retirementhome", "#969696"],
  ["volta","#f0d2b4"]
];


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

//google earth gave inverse coordinates
var cruzes_lnglat= [
  [-111.914678, 33.242369],
  [-111.893291, 33.219059],
  [-111.831087, 33.201189],
  [-111.801719, 33.202835],
  [-111.721501, 33.201497],
  [-111.8284857278424,33.1952269246762],
  [-111.706660666166,33.19103220422536],
  [-111.8539336003988,33.18799131199808],
  [-111.7672289418609,33.1958411371838],
  [-111.8843692839386,33.18579855887123],
  [-111.8144819589648,33.18567557133039],
  [-111.8860505957851,33.18426598605882],
  [-111.8760872042752,33.18265329273919],
  [-111.8061137033521,33.17764734187717],
  [-111.7508686670715,33.18257170887765],
  [-111.8966584731419,33.18263488551556],
  [-111.8931201263278,33.17940516014692],
  [-111.8796079654241,33.17833580985322],
  [-111.8264922533458,33.17734546690347],
  [-111.8578703592441,33.17327733869762],
  [-111.7966294074715,33.17032235958276],
  [-111.772620506501,33.17143009838068],
  [-111.7225928435861,33.17534045243146],
  [-111.8903096214586,33.17532651011636],
  [-111.8484753105347,33.17048160874265],
  [-111.8185020904728,33.17085592369655],
  [-111.8409159267859,33.17051953104971],
  [-111.8534709823863,33.16249210247049],
  [-111.7681428663241,33.15323494483651],
  [-111.7236649153739,33.15668590458702]
];

var cruz_height = 0.0025;
var cruz_width = 0.003;

cruzes_lnglat.forEach (function (item, index) {
    cruzes_bounds.push( { north: item[1], south: (item[1]-cruz_height), west: (item[0]-cruz_width), east: item[0]});
  }
);
