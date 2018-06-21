
var current_form_page = 0;


function confirm() {

  if (current_form_page<8) {
  current_form_page = current_form_page + 1;

  document.getElementById('question').innerHTML = form_responses_questions[current_form_page][0];
  document.getElementById('question-count').innerHTML = (current_form_page+1);

  document.getElementById('form-left-0').style.gridRow = "2 / span "+(form_responses_questions[current_form_page][1].length + 1);
  //console.log(form_responses_questions[current_form_page][1][0]+" "+form_responses_questions[current_form_page][1].length );
  //console.log(current_form_page);

  for (j=0;j<9;j++) {


    if (form_responses_questions[current_form_page][1][j]==undefined) {
      document.getElementById('form-right-'+j).style.display="none";
      document.getElementById('form-right-'+j).style.borderBottom="none";
    } else {
      document.getElementById('form-right-'+j).style.display="block";
      document.getElementById('label'+j).innerHTML = form_responses_questions[current_form_page][1][j];
      document.getElementById('form-right-'+j).style.borderBottom="1px solid #000000";
      cleanForm();
    }
  }

} else {

  //process results
  //console.log(document.getElementById("form_id").elements);
  document.getElementById("form_id").submit();

}
}

function cleanForm(checkboxNum) {
  if (checkboxNum != 0) document.getElementById("question_"+current_form_page).value = checkboxNum;

  for (i=0;i<9;i++) {
      if ((form_responses_questions[current_form_page][1][i]!=undefined)&&(i!=checkboxNum)) {
        document.getElementById('checkboxG'+i).checked=false;

      }

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
