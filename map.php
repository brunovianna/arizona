
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Arizona</title>
<link rel="stylesheet" type="text/css" href="css/map.css">
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
<script src="arizona.js"></script>
</head>

<body >

    <div id="map"></div>
    <div class="title"><span class="futura-18-bold">Mesa, </span><span  class="futura-18-bold">ARIZONA</span></div>




<div class="wrapper_wrapper" id="wrapper_vimeo_id">
  <div class="video_title" id="video_title_id">Western Park</div>
  <div class="video_wrapper" id="video_wrapper_id">
    <iframe
     src="https://player.vimeo.com/video/226354643?autoplay=1&title=0&byline=0&background=1" id="vimeo_id"
     frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
 </div>
 <div class="video_arrow"><img src="images/seta_video.png"></div>
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

<div class="fence_us" id="fence_us_id"><span class="futura-18">Estados Unidos</span></div>
<div class="fence" id="fence_id" onmouseover="show_fence_text();" onmouseout="hide_fence_text();" onclick="click_fence();">
  <img src="images/fronteira_amarela.png">
</div>
<div class="fence_mexico"  id="fence_mexico_id"><span class="futura-18">México</span></div>


<div class="wrapper_fronteira" id="wrapper_wrapper_fronteira_id">
<iframe src="https://player.vimeo.com/video/226354838?autoplay=0&title=0&byline=0&portrait=0" id="video_fronteira"
width="800" height="340" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

</div>

 <div class="screenplay" id="screenplay_id">
 <div class="screenplay_wrapper_left">
     <div class="screenplay_screenplay" id="screenplay_screenplay_id"><br>ROTEIRO<br>
       Baseado em suas respostas, recomendamos que você visite as seguintes localidades em Mesa:<br><br>
       1 Skyland highschool<br>
       2 Casa de Kristen Lax<br>
       3 Western Park<br>
       4 Academia de Ryan Ehler<br>
       5 Fronteira do México<br>
     </div>
 </div>
 <div class="screenplay_title"><img src="images/menuscreenplay.png" onclick="screenplay_close();">
 </div>

 </div>

   <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDJ1BJ5R6eyVAvq0oAyjkCPW46uS4e6MnI&callback=initMap">
   </script>


</body>
</html>
