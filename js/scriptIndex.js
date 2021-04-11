/*
 * Comment of the following line if you use the distant Flask API (hosted in Azure)
 */
const _URL = 'http://localhost:5000/';

/*
 * Remove the comment of the following line if you use the distant Flask API (hosted in Azure)
 */
// const _URL = 'https://apicitations.azurewebsites.net/';

let $tableCitations = $('#tableCitations');
let $tableCitationsRecherche = $('#tableCitationsRecherche');
let $searchMsg = $('#searchMsg');

// METHODE AJAX

$(document).ready(function(){

  $tableCitations.show();
  $tableCitationsRecherche.hide();

  // GET ALL CITATIONS

  $.ajax({
    type: 'GET',
    url: _URL + 'citations',
    dataType: 'json',
    cache: false,
    success: function(citations) {
      $.each(citations, function(index, citation) {
        let auteur = citation.author;
        let annee = citation.year;
        let citatio = citation.citation;

        if (auteur === undefined  || auteur === null || auteur.length === 0 ) {
          auteur='Inconnu';
        }
        if (annee === undefined  || annee === null || annee.length === 0 ) {
          annee="N/A";
        }

        $tableCitations.append('<tr><td>'+ citatio + '</td><td>'+ auteur +  '</td><td>'+ annee + '</td></tr>');
      });
    }
  });

  // GET ALL CITATIONS BY Auteur AND/OR String

  $("#buttonSearch").click(function(){

    let authorToSearch = $('#auteur').val();
    let stringToSearch = $('#chaineARechercher').val();

    $("input:text").val("");
    $("td").remove();

    // Author  AND NO  string
    if( (authorToSearch.length > 0) && (stringToSearch.length === 0 || stringToSearch === null))
    {
      $tableCitations.hide();
      $tableCitationsRecherche.show();

      $searchMsg.html(
          "<i>Votre recherche : auteur contenant <b>"
          + authorToSearch
          + "</b></i>"
      );

      // Send request
      const jsonData = {"authorToSearch": authorToSearch};
      $.ajax({
        type: 'POST',
        url: _URL + 'citations/recherche/auteur',
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify(jsonData),
        success: function(citations) {
          $.each(citations, function(index, citation) {
            let auteur = citation.author;
            let annee = citation.year;
            let citatio = citation.citation;

            if (auteur === undefined  || auteur === null || auteur.length === 0 ) {
              auteur='Inconnu';
            }
            if (annee === undefined  || annee === null || annee.length === 0 ) {
              annee="N/A";
            }

            $tableCitationsRecherche.append('<tr><td>'+ citatio + '</td><td>'+ auteur +  '</td><td>'+ annee + '</td></tr>');
          });
        }
      });
    }

    // String  AND NO  author
    else if( (stringToSearch.length > 0) && (authorToSearch.length == 0 || authorToSearch === null))
    {

      $tableCitations.hide();
      $tableCitationsRecherche.show();

      $searchMsg.html(
          "<i>Votre recherche : citation contenant <b>"
          + stringToSearch
          + "</b></i>"
      );

      // Send request
      const jsonData = {"stringToSearch": stringToSearch};
      $.ajax({
        type: 'POST',
        url: _URL + 'citations/recherche/string',
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify(jsonData),
        success: function(citations) {
          $.each(citations, function(index, citation) {
            let auteur = citation.author;
            let annee = citation.year;
            let citatio = citation.citation;

            if (auteur === undefined  || auteur === null || auteur.length === 0 ) {
              auteur='Inconnu';
            }
            if (annee === undefined  || annee === null || annee.length === 0 ) {
              annee="N/A";
            }

            $tableCitationsRecherche.append('<tr><td>'+ citatio + '</td><td>'+ auteur +  '</td><td>'+ annee + '</td></tr>');
          });
        }
      });
    }

    // Author  AND  string
    else if ( (authorToSearch.length > 0) && (stringToSearch.length > 0) )
    {

      $tableCitations.hide();
      $tableCitationsRecherche.show();

      $searchMsg.html(
          "<i>Votre recherche : auteur contenant <b>"
          + authorToSearch
          + "</b> et citation contenant <b>"
          + stringToSearch
          + "</b></i>"
      );

      // Send request
      const jsonData = {"authorToSearch": authorToSearch, "stringToSearch": stringToSearch};
      $.ajax({
        type: 'POST',
        url: _URL + 'citations/recherche/auteuretstring',
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify(jsonData),
        success: function(citations) {
          $.each(citations, function(index, citation) {
            let auteur = citation.author;
            let annee = citation.year;
            let citatio = citation.citation;

            if (auteur === undefined  || auteur === null || auteur.length === 0 ) {
              auteur='Inconnu';
            }
            if (annee === undefined  || annee === null || annee.length === 0 ) {
              annee="N/A";
            }

            $tableCitationsRecherche.append('<tr><td>'+ citatio + '</td><td>'+ auteur +  '</td><td>'+ annee + '</td></tr>');
          });
        }
      });
    }
    else{
      alert('Rechargez la page ou renseignez au moins un des 2 champs');
      $tableCitations.show();
      $tableCitationsRecherche.hide();
      $searchMsg.html("");
    }

  });
});



// METHODE POSTMAN

/*
var settings = {
  "url": "http://localhost:8080/products",
  "method": "GET",
  "timeout": 0,
};

$.ajax(settings).done(function (response) {
  console.log(response);
});
*/

// METHODE FETCH
/*
let dataObject;

fetch('http://localhost:8080/products')
.then(data => data.json())
.then(data => {
    var x = "";
    dataObject = data;
    // console.log(data);
    for (i in data) {
        console.log(dataObject[i].type);
        x += data[i].type;
    }
    document.getElementById("demo").innerHTML = "couccou";
    //console.log(data[0].type);
    
}).catch(error => {
    dataObject = {};
    console.log(error);
})
*/


