let $tableCitations = $("#tableCitations");
let $tableCitationsRecherche = $('#tableCitationsRecherche');
let $searchMsg = $('#searchMsg');

// METHODE AJAX

$(document).ready(function(){

  hideTablesinIndex();

  // GET ALL CITATIONS

  $.ajax({
    type: "GET",
    url: _URL + "citations",
    dataType: "json",
    crossDomain: false,
    headers: {
      Accept: "application/json"
    },
    statusCode: {
      200: function(citations) {
        status200Citations(citations);
      }
    }
  });

  // GET ALL CITATIONS BY Auteur AND/OR String

  $("#buttonSearch").click(function(){

    let authorToSearch = escapeHtmlSpecialChars($('#auteur').val());
    let stringToSearch = escapeHtmlSpecialChars($('#chaineARechercher').val());

    hideTablesinIndex();
    $("input:text").val("");
    $('#noResultMsg').text("");
    $("td").remove();


    // Author  AND NO  string
    if( (authorToSearch.length > 0) && (stringToSearch.length === 0 || stringToSearch === null) )
    {
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
        dataType: "json",
        contentType: 'application/json',
        crossDomain: false,
        headers: {
          Accept: "application/json"
        },
        data: JSON.stringify(jsonData),
        statusCode: {
          200: function(citations) {
            status200Citations(citations);
          },
          204: function() {
            status204Citations();
          }
        }
      });
    }

    // String  AND NO  author
    else if( (stringToSearch.length > 0) && (authorToSearch.length == 0 || authorToSearch === null))
    {

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
        dataType: 'json',
        contentType: 'application/json',
        crossDomain: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        data: JSON.stringify(jsonData),
        statusCode: {
          200: function(citations) {
            status200Citations(citations);
          },
          204: function() {
            status204Citations();
          }
        }
      });
    }

    // Author  AND  string
    else if ( (authorToSearch.length > 0) && (stringToSearch.length > 0) )
    {

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
        dataType: 'json',
        contentType: 'application/json',
        crossDomain: false,
        headers: {
          Accept: "application/json"
        },
        data: JSON.stringify(jsonData),
        statusCode: {
          200: function(citations) {
            status200Citations(citations);
          },
          204: function() {
            status204Citations();
          }
        }
      });
    }
    else{
      hideTablesinIndex();
      alert('Rafraichissez la page, ou renseignez au moins l\'un des 2 champs');
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


