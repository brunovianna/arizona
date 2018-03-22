
var current_form_page = 0;

//form stuff
function confirm() {
  if (current_form_page<9) {
  current_form_page = current_form_page + 1;
  document.getElementById('question').innerHTML = form_responses_questions[current_form_page][0];
  document.getElementById('question-count').innerHTML = (current_form_page+1);


  for (j=0;j<9;j++) {


    if (form_responses_questions[current_form_page][1][j]==undefined) {
      console.log(current_form_page+" "+j);
      document.getElementById('label'+j).style.display="none";
      document.getElementById('form-right-'+j).style.borderBottom="none";
    } else {
      document.getElementById('label'+j).style.display="block";
      document.getElementById('label'+j).innerHTML = form_responses_questions[current_form_page][1][j];
      document.getElementById('form-right-'+j).style.borderBottom="1px solid #000000";
    }
  }

} else {

  //process results
    document.getElementById('form_id').style.display = 'none';
    document.getElementById('screenplay_id').style.left = 0;

}
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
  [["Você se considera:"], ["Branco", "Indígena", "Negro", "Latino", "Oriental", "Duas ou mais", "Nenhuma das anteriores / outro"]],
  [["Qual é a sua preferência climática?"],["Calor, verão", "Frio, inverno", "Ameno, sem variações", "Quatro estações bem definidas", "Sem preferência"]],
  [["Como você se locomove no dia a dia?"],["Carro individual", "Transporte público: ônibus; metrô; trem", "Transporte particular: táxi ou motoristas privados","Bicicleta","Caminhada"]],
  [["Como você lida com mudanças em geral?"],["Gosto de mudanças e inovações","São bem-vindas quando necessárias","Não gosto de mudanças abruptas","Não gosto e me posiciono contra","Indiferente"]],
  [["Qual a importância da religião em sua vida?"],["Muito importante", "Importante","Razoavelmente importante","Pouco importante","Nenhuma importância"]],
  [["Politicamente, como você se define?"],["Conservador, à direita", "Centro, moderado ou neutro", "Progressista, à esquerda", "Liberal", "Conservador", "Extrema direita", "Socialmente progressista, economicamente conservador", "Extrema esquerda", "Não me importo ou não tenho posição"]],
  [["Quanto ao porte legal de armas e a possibilidade de armamento civil, como você se posiciona?"],["A favor", "A favor, mas com restrições (checagem de antecedentes criminais, idade, formação, etc.)", "Contra", "Contra em todas as instâncias da sociedade (inclusive na policia e nos organismos de defesa)","Indiferente"]],
  [["Como você enxerga a migração entre países?"],["Sou absolutamente contra", "Sou contra, salvo exceções", "Favorável, desde que se cumpra certos requisitos governamentais", "Amplamente favorável", "Indiferente"]]
];
