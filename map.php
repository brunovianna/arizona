
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Arizona</title>
<link rel="stylesheet" type="text/css" href="css/map.css">
<link type="text/css" href="css/jquery.jscrollpane.css" rel="stylesheet" media="all" />
<link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Mono" rel="stylesheet">
<script src="https://player.vimeo.com/api/player.js"></script>

<script type="text/javascript">
var question = [];
question.push( <?php echo $_POST["question_0"]; ?> );
question.push( <?php echo $_POST["question_1"]; ?> );
question.push( <?php echo $_POST["question_2"]; ?> );
question.push( <?php echo $_POST["question_3"]; ?> );
question.push( <?php echo $_POST["question_4"]; ?> );
question.push( <?php echo $_POST["question_5"]; ?> );
question.push( <?php echo $_POST["question_6"]; ?> );
question.push( <?php echo $_POST["question_7"]; ?> );
question.push( <?php echo $_POST["question_8"]; ?> );

</script>

<!-- latest jQuery direct from jQuery CDN -->
<script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>

<!-- the mousewheel plugin -->
<script type="text/javascript" src="mwheelIntent.js"></script>
<!-- the mousewheel plugin -->
<script type="text/javascript" src="jquery.mousewheel.js"></script>
<!-- the jScrollPane script -->
<script type="text/javascript" src="jquery.jscrollpane.min.js"></script>

<script type="text/javascript" src="arizona.js"></script>
</head>

<body >

    <div id="map"></div>
    <div class="title"><span class="futura-18-bold">Mesa, </span><span  class="futura-18-bold">ARIZONA</span></div>




<div class="wrapper_wrapper" id="wrapper_vimeo_id"><!-- mouse behaviours are defined in the js file -->
  <div class="video_title" id="video_title_id">Western Park</div>
  <div class="video_wrapper" id="video_wrapper_id">
    <iframe
     src="https://player.vimeo.com/video/226354643?autoplay=1&title=0&byline=0&background=1" id="vimeo_id"
     frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
 </div>
 <div class="video_arrow"><img src="images/seta_video.png"></div>
</div>


<div class="wrapper_navigation">
  <div class="nav_info"  onclick="toggle_welcome();">
    <img src="images/info_cinza.png" id="nav_info_img_id">
  </div>
  <div class="nav_screenplay"  onclick="toggle_screenplay();">
    <img src="images/roteiro_branco.png"  id="nav_screenplay_img_id">
  </div>
  <div class="nav_credits">
    <img src="images/creditos_branco.png">
  </div>
  <div class="nav_home" onclick="toggle_confirm_restart();">
    <img src="images/home_branco.png" id="nav_home_img_id">
  </div>
</div>


<div class="wrapper_wind_rose">
  <div class="las_vegas">
    <span class="georgia-12-bold">
    LAS VEGAS
    </span>
  </div>
  <div class="california">
    <span class="georgia-12-bold">
    CALIFORNIA
  </span>
  </div>
  <div class="wind_rose">
    <img src="images/rosadosventos.png">
  </div>
  <div class="texas">
    <span class="georgia-12-bold">
    TEXAS
  </span>
  </div>
  <div class="mexico">
    <span class="georgia-12-bold">
    MÉXICO
  </span>
  </div>
</div>

<div class="wrapper_welcome" id="wrapper_welcome_id">
  <div class="welcome_text">
  <span class="georgia-bold">
        BEM-VINDO(A) A MESA, ARIZONA.<br><br>
  </span>
  <span class="georgia">
    Com uma população de quase 500 mil habitantes, Mesa é a 36a maior cidade dos Estados Unidos. É maior que Miami, abrangendo uma área de 345 km². <br><br>
    Mesa era originalmente uma terra dos povos nativo-americanos e fazia parte do território do México. Hoje, Mesa é permeada por reservas indígenas, que compõem cerca de 27 % do território do Arizona. <br><br>
    Em 1848, com o fim da Guerra Mexicano-Americana, os Estados Unidos “adquiriu” o território do Arizona e Mesa se tornou estadunidense. Quase 30% da sua população atual é de origem hispânica.  Poucos anos depois, em 1877, os mórmons chegaram, fazendo com que a cidade tenha hoje sua 5a maior população do país. <br><br>
    Durante a Segunda Guerra Mundial, a cidade passou por um boom populacional motivado por dois fatos importantes. O primeiro foi a vinda de pilotos de Força Aérea para treinar em suas bases aéreas, trazendo junto suas famílias. O segundo foi a popularização do ar-condicionado como bem de consumo de massa, que permitiu que a população vivesse nas altas temperaturas do deserto. Em alguns períodos do ano, a temperatura da cidade chega a 40 graus Celsius.<br><br>
    Segundo um estudo realizado pelas universidades do MIT e da UCLA, essa é a cidade grande (com mais de 250.000 habitantes) mais conservadora dos Estados Unidos.<br><br>
    Baseado em suas respostas do questionário, foi desenvolvido um roteiro de lugares de interesse em Mesa, e pessoas com quem você pode conversar. No entanto, você também pode explorar outros lugares do mapa livremente. <br><br>
    Aproveite a sua estadia!<br><br>
  </span>
  </div>
  <div class="welcome_close" onclick="close_welcome();">
    <img src="images/close_cinza.png"  >
  </div>
  <div class="welcome_button" onclick="close_welcome();">
    <span class="georgia-bold">
      NAVEGAR
    </span>
  </div>
</div>

<div class="wrapper_reiniciar" id="wrapper_reiniciar_id">
  <div class="reiniciar_text"><div class="reiniciar_content"><span class="georgia-bold">TEM CERTEZA DE QUE DESEJA REINICIAR O ROTEIRO?</span></div></div>
  <div class="yellow_on_black reiniciar_button" onclick="confirm_restart();"><div class="reiniciar_content"><span class="georgia-bold">SIM</span></div></div>
  <div class="yellow_on_black reiniciar_button" onclick="close_restart();"><div class="reiniciar_content"><span class="georgia-bold">NÃO</span></div></div>
</div>

<div class="box_fronteira" id="box_fronteira_id">
  <div class="box_fronteira_text" id="box_fronteira_text_id">
    <span class="box_fronteira_title">INCIDENTES DE FRONTEIRA</span><br><br>
    A cada ano, uma média de 140 corpos de imigrantes são encontrados nos desertos da região sul do Arizona. A causa de morte mais comum é hipertermia. No entanto, muitas vezes não é possível determinar a causa da morte, pois são encontrados apenas esqueletos ou restos em decomposição avançada.
    <br><br>Mais informações: http://www.humaneborders.info/app/map.asp
  </div>
  <div class="box_fronteira_close" id="box_fronteira_close_id">
    <img src="images/close_branco.png" onclick="close_box_fronteira();">
  </div>

</div>

<div class="fence_us" id="fence_us_id"><span class="georgia-18">ESTADOS UNIDOS</span></div>
<div class="fence" id="fence_id" onmouseover="show_fence_text();" onmouseout="hide_fence_text();" onclick="click_fence();">
  <img src="images/fronteira_amarela.png">
</div>
<div class="fence_mexico"  id="fence_mexico_id"><span class="georgia-18">MÉXICO</span></div>


<div class="wrapper_fronteira" id="wrapper_wrapper_fronteira_id">
<iframe src="https://player.vimeo.com/video/226354838?autoplay=0&title=0&byline=0&portrait=0" id="video_fronteira"
width="800" height="340" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

</div>


 <div class="wrapper_screenplay" id="wrapper_screenplay_id">
   <div class="screenplay" id="screenplay_id"><br>ROTEIRO<br>
     Baseado em suas respostas, recomendamos que você visite as seguintes localidades em Mesa:<br><br>
     1 Skyland highschool<br>
     2 Casa de Kristen Lax<br>
     3 Western Park<br>
     4 Academia de Ryan Ehler<br>
     5 Fronteira do México<br>
   </div>
   <div class="screenplay_close">
     <img src="images/close_cinza.png" onclick="close_screenplay();">
   </div>
 </div>

   <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDJ1BJ5R6eyVAvq0oAyjkCPW46uS4e6MnI&callback=initMap">
   </script>


</body>
</html>
