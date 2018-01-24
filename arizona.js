// JavaScript Document
var map;

var current_form_page = 0;

var panPath = [];   // An array of points the current panning action will use
var panQueue = [];  // An array of subsequent panTo actions to take
var STEPS = 10;     // The number of steps that each panTo action will undergo
var pan_started = 0;
var allowedBounds;
var lastValidCenter;
var reservationOverlay;

function initMap() {
// Create the map with no initial style specified.
// It therefore has default styling.
map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 33.37, lng: -111.8},
  zoom: 12,
  format: "png",
  mapType: "roadmap",
  mapTypeControl: false,
  streetViewControl: false,
  minZoom: 12,
  maxZoom: 14
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

var casa_1_overlay = new google.maps.GroundOverlay('images/icone_casa.png', casa_1_bounds);
var casa_2_overlay = new google.maps.GroundOverlay('images/icone_casa.png', casa_2_bounds);
var casa_3_overlay = new google.maps.GroundOverlay('images/icone_casa.png', casa_3_bounds);
var casa_4_overlay = new google.maps.GroundOverlay('images/icone_casa.png', casa_4_bounds);
var casa_5_overlay = new google.maps.GroundOverlay('images/icone_casa.png', casa_5_bounds);
var casa_6_overlay = new google.maps.GroundOverlay('images/icone_casa.png', casa_6_bounds);

casa_1_overlay.setMap(map);
casa_2_overlay.setMap(map);
casa_3_overlay.setMap(map);
casa_4_overlay.setMap(map);
casa_5_overlay.setMap(map);
casa_6_overlay.setMap(map);

//igrejas width .002 height .003
var igreja_1_bounds = {  north: 33.431,   south: 33.428,   east: -111.773,  west: -111.775 };
var igreja_2_bounds = {  north: 33.436,   south: 33.433,   east: -111.685,  west: -111.687 };
var igreja_3_bounds = {  north: 33.413,   south: 33.410,   east: -111.836,  west: -111.838 };
var igreja_4_bounds = {  north: 33.413,   south: 33.410,   east: -111.803,  west: -111.805 };
var igreja_5_bounds = {  north: 33.422,   south: 33.419,   east: -111.739,  west: -111.741 };
var igreja_6_bounds = {  north: 33.398,   south: 33.395,   east: -111.795,  west: -111.797 };
var igreja_7_bounds = {  north: 33.398,   south: 33.395,   east: -111.714,  west: -111.716 };
var igreja_8_bounds = {  north: 33.364,   south: 33.361,   east: -111.826,  west: -111.828 };
var igreja_9_bounds = {  north: 33.326,   south: 33.323,   east: -111.781,  west: -111.783 };
var igreja_10_bounds = { north: 33.321,   south: 33.318,  east: -111.699,  west: -111.701 };
var igreja_11_bounds = {  north: 33.297,   south: 33.294,   east: -111.799,  west: -111.801 };

var igreja_1_overlay = new google.maps.GroundOverlay('images/icone_igreja.png', igreja_1_bounds);
var igreja_2_overlay = new google.maps.GroundOverlay('images/icone_igreja.png', igreja_2_bounds);
var igreja_3_overlay = new google.maps.GroundOverlay('images/icone_igreja.png', igreja_3_bounds);
var igreja_4_overlay = new google.maps.GroundOverlay('images/icone_igreja.png', igreja_4_bounds);
var igreja_5_overlay = new google.maps.GroundOverlay('images/icone_igreja.png', igreja_5_bounds);
var igreja_6_overlay = new google.maps.GroundOverlay('images/icone_igreja.png', igreja_6_bounds);
var igreja_7_overlay = new google.maps.GroundOverlay('images/icone_igreja.png', igreja_7_bounds);
var igreja_8_overlay = new google.maps.GroundOverlay('images/icone_igreja.png', igreja_8_bounds);
var igreja_9_overlay = new google.maps.GroundOverlay('images/icone_igreja.png', igreja_9_bounds);
var igreja_10_overlay = new google.maps.GroundOverlay('images/icone_igreja.png', igreja_10_bounds);
var igreja_11_overlay = new google.maps.GroundOverlay('images/icone_igreja.png', igreja_11_bounds);

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

//volta width .004 height .004
var volta_bounds = {  north: 33.392,   south: 33.388,   east: -111.947,  west: -111.951 };
var volta_overlay = new google.maps.GroundOverlay('images/icone_estrada.png', volta_bounds);
volta_overlay.setMap(map);





// bounds of the mesa area -- no panning beyond this
allowedBounds = new google.maps.LatLngBounds(
     new google.maps.LatLng(31.18, -112),
     new google.maps.LatLng(33.45, -111.7)
);
lastValidCenter = map.getCenter();

google.maps.event.addListener(map, 'center_changed', function() {
    //console.log(map.getCenter().lat()+ " "+map.getCenter().lng());
    //console.log(allowedBounds+ " "+map.getCenter().lng());

    if (allowedBounds.contains(map.getCenter())) {
        // still within valid bounds, so save the last valid position
        console.log("center");
        lastValidCenter = map.getCenter();
        return;
    }

    // not valid anymore => return to last valid position
    map.panTo(lastValidCenter);
    console.log("yeah");
});


document.getElementById('highschool').onmouseout = function(){document.getElementById('highschool').style.display="none";};
document.getElementById('wrapper_wrapper_gym_id').style.display="none";

document.getElementById('rectangle_above_id').onmouseout = function () {
  document.getElementById('wrapper_wrapper_gym_id').style.display="none";
  this.style.display="none";
}


//polygons!
var skyland_highschool_rect = new google.maps.Rectangle({
	map: map,
	bounds:
  new google.maps.LatLngBounds(
    new google.maps.LatLng(33.388,-111.753),
    new google.maps.LatLng(33.393, -111.740)),
	strokeWeight: 0,
	fillColor: '#ffcf2f',
	fillOpacity: 1
});

var gym_rect = new google.maps.Rectangle({
	map: map,
	bounds:
  new google.maps.LatLngBounds(
    new google.maps.LatLng(33.438,-111.718),
    new google.maps.LatLng(33.4425,  -111.7125)),
	strokeWeight: 0,
	fillColor: '#ffcf2f',
	fillOpacity: 1
});

var shooting_range_rect = new google.maps.Rectangle({
	map: map,
	bounds:
  new google.maps.LatLngBounds(
    new google.maps.LatLng(33.424,-111.656),
    new google.maps.LatLng(33.431,  -111.642)),
	strokeWeight: 0,
	fillColor: '#ffcf2f',
	fillOpacity: 1
});

var retirement_rect = new google.maps.Rectangle({
	map: map,
	bounds:
  new google.maps.LatLngBounds(
    new google.maps.LatLng(33.3215,-111.823),
    new google.maps.LatLng(33.328,  -111.8085)),
	strokeWeight: 0,
	fillColor: '#ffcf2f',
	fillOpacity: 1
});

var rodeo_rect = new google.maps.Rectangle({
	map: map,
	bounds:
  new google.maps.LatLngBounds(
    new google.maps.LatLng(33.337,-111.704),
    new google.maps.LatLng(33.350,  -111.688)),
	strokeWeight: 0,
	fillColor: '#ffcf2f',
	fillOpacity: 1
});

var western_park_circle = new google.maps.Circle({
	map: map,
	center:
    new google.maps.LatLng(33.2984,-112.0061),
  radius: 650,
	strokeWeight: 0,
	fillColor: '#ffcf2f',
	fillOpacity: 1
});

// CHURCHES behaviours

google.maps.event.addListener(igreja_1_overlay, 'mouseover', igrejaMouseOver  );
google.maps.event.addListener(igreja_1_overlay, 'mouseout', igrejaMouseOut  );
google.maps.event.addListener(igreja_2_overlay, 'mouseover', igrejaMouseOver  );
google.maps.event.addListener(igreja_2_overlay, 'mouseout', igrejaMouseOut  );
google.maps.event.addListener(igreja_3_overlay, 'mouseover', igrejaMouseOver  );
google.maps.event.addListener(igreja_3_overlay, 'mouseout', igrejaMouseOut  );
google.maps.event.addListener(igreja_4_overlay, 'mouseover', igrejaMouseOver  );
google.maps.event.addListener(igreja_4_overlay, 'mouseout', igrejaMouseOut  );
google.maps.event.addListener(igreja_5_overlay, 'mouseover', igrejaMouseOver  );
google.maps.event.addListener(igreja_5_overlay, 'mouseout', igrejaMouseOut  );
google.maps.event.addListener(igreja_6_overlay, 'mouseover', igrejaMouseOver  );
google.maps.event.addListener(igreja_6_overlay, 'mouseout', igrejaMouseOut  );
google.maps.event.addListener(igreja_7_overlay, 'mouseover', igrejaMouseOver  );
google.maps.event.addListener(igreja_7_overlay, 'mouseout', igrejaMouseOut  );
google.maps.event.addListener(igreja_8_overlay, 'mouseover', igrejaMouseOver  );
google.maps.event.addListener(igreja_8_overlay, 'mouseout', igrejaMouseOut  );
google.maps.event.addListener(igreja_9_overlay, 'mouseover', igrejaMouseOver  );
google.maps.event.addListener(igreja_9_overlay, 'mouseout', igrejaMouseOut  );
google.maps.event.addListener(igreja_10_overlay, 'mouseover', igrejaMouseOver  );
google.maps.event.addListener(igreja_10_overlay, 'mouseout', igrejaMouseOut  );
google.maps.event.addListener(igreja_11_overlay, 'mouseover', igrejaMouseOver  );
google.maps.event.addListener(igreja_11_overlay, 'mouseout', igrejaMouseOut  );

function igrejaMouseOver () {
  document.getElementById('place_name_id').innerHTML = "<span class=\"futura-18\">Tour das </span><span  class=\"georgia-18\"><i>igrejas</i></span>";

  document.getElementById('place_name_id').style.display = "inline";
  document.getElementById('wrapper_wrapper_igrejas_id').style.display = "inline";
}

function igrejaMouseOut () {
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('wrapper_wrapper_igrejas_id').style.display = "none";
}

// HOUSES behaviours
google.maps.event.addListener(casa_1_overlay, 'mouseover', function (event) {
	this.setOptions({
		fillColor: '#ff9100',
	});

  document.getElementById('place_name_id').innerHTML = "<span class=\"futura-18\">Casa dos </span><span  class=\"georgia-18\"><i>Hanny</i></span>";
  document.getElementById('place_name_id').style.display = "inline";
  document.getElementById('wrapper_wrapper_casa_1_id').style.display = "inline";
});

google.maps.event.addListener(casa_1_overlay, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#ffcf2f',
	});
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('wrapper_wrapper_casa_1_id').style.display = "none";
});



google.maps.event.addListener(casa_2_overlay, 'mouseover', function (event) {
	this.setOptions({
		fillColor: '#ff9100',
	});

  document.getElementById('place_name_id').innerHTML = "<span class=\"futura-18\">Casa dos </span><span  class=\"georgia-18\"><i>Corbin</i></span>";
  document.getElementById('place_name_id').style.display = "inline";
  document.getElementById('wrapper_wrapper_casa_2_id').style.display = "inline";
});

google.maps.event.addListener(casa_2_overlay, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#ffcf2f',
	});
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('wrapper_wrapper_casa_2_id').style.display = "none";
});


google.maps.event.addListener(casa_3_overlay, 'mouseover', function (event) {
	this.setOptions({
		fillColor: '#ff9100',
	});

  document.getElementById('place_name_id').innerHTML = "<span class=\"futura-18\">Casa da </span><span  class=\"georgia-18\"><i>Kristen</i></span>";
  document.getElementById('place_name_id').style.display = "inline";
  document.getElementById('wrapper_wrapper_casa_3_id').style.display = "inline";
});

google.maps.event.addListener(casa_3_overlay, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#ffcf2f',
	});
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('wrapper_wrapper_casa_3_id').style.display = "none";
});


google.maps.event.addListener(casa_4_overlay, 'mouseover', function (event) {
	this.setOptions({
		fillColor: '#ff9100',
	});

  document.getElementById('place_name_id').innerHTML = "<span class=\"futura-18\">Casa da </span><span  class=\"georgia-18\"><i>Cait</i></span>";
  document.getElementById('place_name_id').style.display = "inline";
  document.getElementById('wrapper_wrapper_casa_4_id').style.display = "inline";
});

google.maps.event.addListener(casa_4_overlay, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#ffcf2f',
	});
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('wrapper_wrapper_casa_4_id').style.display = "none";
});




google.maps.event.addListener(casa_5_overlay, 'mouseover', function (event) {
	this.setOptions({
		fillColor: '#ff9100',
	});

  document.getElementById('place_name_id').innerHTML = "<span class=\"futura-18\">Casa dos </span><span  class=\"georgia-18\"><i>Casillas</i></span>";
  document.getElementById('place_name_id').style.display = "inline";
  document.getElementById('wrapper_wrapper_casa_5_id').style.display = "inline";
});

google.maps.event.addListener(casa_5_overlay, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#ffcf2f',
	});
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('wrapper_wrapper_casa_5_id').style.display = "none";
});



google.maps.event.addListener(casa_6_overlay, 'mouseover', function (event) {
	this.setOptions({
		fillColor: '#ff9100',
	});
  document.getElementById('place_name_id').innerHTML = "<span class=\"futura-18\">Casa dos </span><span  class=\"georgia-18\"><i>Jan</i></span>";
  document.getElementById('place_name_id').style.display = "inline";
  //locate the top of house 6 overlay
  var xy_topright = overlay.getProjection().fromLatLngToContainerPixel(casa_6_overlay.getBounds().getNorthEast());
  // place the video above it
  document.getElementById('wrapper_wrapper_casa_6_id').style.left = (xy_topright.x + 100)+"px";
  document.getElementById('wrapper_wrapper_casa_6_id').style.display = "inline";
  var xy_topright = overlay.getProjection().fromLatLngToContainerPixel(casa_6_overlay.getBounds().getNorthEast());

});

google.maps.event.addListener(casa_6_overlay, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#ffcf2f',
	});
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('wrapper_wrapper_casa_6_id').style.display = "none";
});


// SCHOOL behaviours
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

  document.getElementById('place_name_id').innerHTML = "<span class=\"futura-18\">Skyland </span><span  class=\"georgia-18\"><i>Highschool</i></span>";
  document.getElementById('place_name_id').style.display = "inline";
  document.getElementById('wrapper_wrapper_school_id').style.display = "inline";

});

google.maps.event.addListener(skyland_highschool_rect, 'mouseout', function (event) {
	// Within the event listener, "this" refers to the polygon which
	// received the event.
  	//document.getElementById('highschool').style.display="none";
	this.setOptions({
	fillColor: '#ffcf2f',
	});
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('wrapper_wrapper_school_id').style.display = "none";

});


// GYM behaviours
google.maps.event.addListener(gym_rect, 'mouseover', function (event) {

	this.setOptions({
		fillColor: '#ff9100',
	});


  document.getElementById('place_name_id').innerHTML = "<span class=\"futura-18\">Academia </span><span  class=\"georgia-18\"><i>do Ryan</i></span>";
  document.getElementById('place_name_id').style.display = "inline";
  document.getElementById('wrapper_wrapper_gym_id').style.display = "inline";

});

google.maps.event.addListener(gym_rect, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#ffcf2f',
	});
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('wrapper_wrapper_gym_id').style.display = "none";

});




// SHOOTING RANGE behaviours
google.maps.event.addListener(shooting_range_rect, 'mouseover', function (event) {
	this.setOptions({
		fillColor: '#ff9100',
	});
  document.getElementById('place_name_id').innerHTML = "<span class=\"futura-18\">Shooting </span><span  class=\"georgia-18\"><i>Range</i></span>";
  document.getElementById('place_name_id').style.display = "inline";
  document.getElementById('wrapper_wrapper_shootingrange_id').style.display = "inline";
});

google.maps.event.addListener(shooting_range_rect, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#ffcf2f',
	});
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('wrapper_wrapper_shootingrange_id').style.display = "none";
});

// RETIREMENT behaviours
google.maps.event.addListener(retirement_rect, 'mouseover', function (event) {
	this.setOptions({
		fillColor: '#ff9100',
	});

  document.getElementById('place_name_id').innerHTML = "<span class=\"futura-18\">Retirement </span><span  class=\"georgia-18\"><i>Home</i></span>";
  document.getElementById('place_name_id').style.display = "inline";
  document.getElementById('wrapper_wrapper_retirement_id').style.display = "inline";

});

google.maps.event.addListener(retirement_rect, 'mouseout', function (event) {

	this.setOptions({
	fillColor: '#ffcf2f',
	});
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('wrapper_wrapper_retirement_id').style.display = "none";

});


// RODEO behaviours
google.maps.event.addListener(rodeo_rect, 'mouseover', function (event) {

	this.setOptions({
		fillColor: '#ff9100',
	});

  document.getElementById('place_name_id').innerHTML = "<span class=\"futura-18\">Rodeo</span>";
  document.getElementById('place_name_id').style.display = "inline";
  document.getElementById('wrapper_wrapper_rodeo_id').style.display = "inline";

});

google.maps.event.addListener(rodeo_rect, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#ffcf2f',
	});
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('wrapper_wrapper_rodeo_id').style.display = "none";

});


// WESTERN PARK behaviours
google.maps.event.addListener(western_park_circle, 'mouseover',function (event)  {


  this.setOptions({
    fillColor: '#ff9100',
  });

document.getElementById('place_name_id').innerHTML = "<span class=\"futura-18\">Western </span><span  class=\"georgia-18\"><i>Park</i></span>";
document.getElementById('place_name_id').style.display = "inline";
document.getElementById('wrapper_wrapper_westernpark_id').style.left = "300px";
document.getElementById('wrapper_wrapper_westernpark_id').style.display = "inline";

});


google.maps.event.addListener(western_park_circle, 'mouseout', function (event) {
	this.setOptions({
	fillColor: '#ffcf2f',
	});
  document.getElementById('place_name_id').style.display = "none";
  document.getElementById('wrapper_wrapper_westernpark_id').style.display = "none";

});


/*
below is the code to pan the map to the border. not needed right now

google.maps.event.addListener(skyland_highschool_rect, 'click', function (event) {
	//alert('clicked polygon!');
//		new google.maps.LatLng(31.299159,-112.280684),
//		new google.maps.LatLng(33.828641,-109.180738));

	var mexico_border = new google.maps.LatLngBounds(
		new google.maps.LatLng(29, -113.7),
		new google.maps.LatLng(34.1, -109.2));


	//map.fitBounds ({north: 33.5, south: 31.5, west: -113.7, east: -109.2}); //32.301141, -114.749028
  //map.setZoom(8);
	//map.panTo(new google.maps.LatLng(32.5,-111.5));
  panTo(32.5,-111.5,8);
  //map.setZoom(8);
});

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


//from lat lng to pixel x, pixel y
function copy_map_rectangle_position (my_div, myrectangle ) {

  var ll_topright = myrectangle.getBounds().getNorthEast();
  var ll_bottomleft = myrectangle.getBounds().getSouthWest();

  var xy_topright = overlay.getProjection().fromLatLngToContainerPixel(ll_topright);
  var xy_bottomleft = overlay.getProjection().fromLatLngToContainerPixel(ll_bottomleft);

  //console.log(xy.x);
  my_div.style.left = xy_bottomleft.x+'px';
  my_div.style.top = xy_topright.y+'px';
  my_div.style.width = (xy_topright.x-xy_bottomleft.x)+'px';
  my_div.style.height = (xy_bottomleft.y-xy_topright.y)+'px';

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
      document.getElementById('screenplay_id').style.left = "-250px";
}


//to smoothly pan the map
function panTo(newLat, newLng, newZoom) {
  if (panPath.length > 0) {
    // We are already panning...queue this up for next move
    panQueue.push([newLat, newLng, newZoom]);
  } else {
    // Lets compute the points we'll use
    panPath.push("LAZY SYNCRONIZED LOCK");  // make length non-zero - 'release' this before calling setTimeout
    var curLat = map.getCenter().lat();
    var curLng = map.getCenter().lng();
    var curZoom = map.getZoom();
    var dLat = (newLat - curLat)/STEPS;
    var dLng = (newLng - curLng)/STEPS;
    var dZoom = (newZoom - curZoom)/STEPS;

    for (var i=0; i < STEPS; i++) {
      panPath.push([curLat + dLat * i, curLng + dLng * i, curZoom + dZoom * i]);
    }
    panPath.push([newLat, newLng, newZoom]);
    panPath.shift();      // LAZY SYNCRONIZED LOCK
    pan_started = 1;
    var first = panPath.shift();
    //setTimeout(doPan, 100);

    doPan();
  }
}


function doPan() {

  var next = panPath.shift();
  if (next != null) {
    // Continue our current pan action

    map.panTo( new google.maps.LatLng(next[0], next[1]));
    map.setZoom(Math.round(next[2]));
    setTimeout(doPan, 100);


  } else {
    // We are finished with this pan - check if there are any queue'd up locations to pan to
    pan_started = 0;
    map.setZoom(8);
    var queued = panQueue.shift();
    if (queued != null) {
      panTo(queued[0], queued[1],queued[2]);
    }
  }
}

function vimeo_format(id) {

return (" src=\"https://player.vimeo.com/video/"+id+"?title=0&byline=0&background=1\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen>");

}


var form_responses_videos = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  []
];

var form_responses_questions = [
  [["Qual a sua idade?"], ["Até 25 anos", "De 25 a 40 anos", "De 40 a 55 anos", "Mais de 55 anos"]],
  [["Preferência clima"], ["Quatro estações", "Calor","Inverno",""]],
  [["Transporte"],["Carro individual", "Transporte público", "Bicicleta e/ou caminhado", "Possuo mais de dois carros"]],
  [["Pensando em política hoje, qual a sua posição?"],["Socialmente liberal, economicamente conservador","Liberal","Conservador","Moderado/Neutro"]],
  [["Qual a importância da religião em sua vida?"],["Muito", "Importante","Pouco","Nada"]],
  [["Prioridades e valores"],["Famĺia","Vida Saudável","Trabalho e reconhecimento","Vida financeira estável"]],
  [["Impostos"],["Consumo, pagar pelos serviços que uso","Imposto relativo ao que possui","Primary","Taxar grandes fortunas"]],
  [["Armamento civil"],["A favor","Contra", "A favor mas com restrições","Não ligo"]],
  [["Qual solução os países devem adotar em relação a imigrantes?"],["Acho a ideia de um muro boa","Aceitar todos e dar cidadania, com direitos e deveres","Deportar imigrantes ilegais",""]],
  [["Mudanças"],["Não gosto de mudanças.","Adoro mudanças e inovações ","Não gosto de mudanças abruptas","Aceito quando necessário"]]
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
