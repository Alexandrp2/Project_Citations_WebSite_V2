/*
 * Comment of the following line if you use the distant Flask API (hosted in Azure)
 */
const _URL = 'http://localhost:5000/';

/*
 * Remove the comment of the following line if you use the distant Flask API (hosted in Azure)
 */
// const _URL = 'https://apicitations.azurewebsites.net/';

$(document).ready(function(){

    var $tableTopFavoris = $('#tableTopFavoris');
    var $bestMember = $('#bestMember');
    var $quoteauthor = $('#quoteauthor');
    var $favouriteauthor = $("#favouriteauthor");
    var $anonymCitations = $("#anonymCitations");


    // GET TOP 3
    $.ajax({
        type: 'GET',
        url: _URL + 'citation/stats/top3citation',
        dataType: 'json',
        cache: false,
        success: function(citations) {
            $.each(citations, function(index, citation) {

                let id = citation._id.$oid;
                let citatio = citation.citation;
                let Fav = citation.savedInFavorites;
                $tableTopFavoris.append('<tr><td>' + id + '</td><td>'+ citatio + '</td><td>'+ Fav + '</td></tr>');

            });
        }
    });

    // GET BEST USER

    $.ajax({
        type: 'GET',
        url: _URL + 'citation/stats/bestlogin',
        dataType: 'json',
        cache: false,
        success: function(citations) {
            $.each(citations, function(index, citation) {

                let id = citation._id;
                let nombre = citation.count;
                $bestMember.append('<p></span>' + id + ' est le membre le plus actif avec un total de '+ nombre + ' citations mises en favoris</p>');
            });
        }
    });

    // GET BEST QUOTED AUTHOR

    $.ajax({
        type: 'GET',
        url: _URL + 'citation/stats/topquotedauthor',
        dataType: 'json',
        cache: false,
        success: function(citations) {
            $.each(citations, function(index, citation) {

                let id = citation._id;
                let nombre = citation.count;
                $quoteauthor.append('<p> L\'auteur le plus cité est ' + id + ' avec un total de '+ nombre + ' citations</p>');

            });
        }
    });

    // GET AUTHOR TOP FAVORITE QUOTE

    $.ajax({
        type: 'GET',
        url: _URL + 'citation/stats/favouriteauthor',
        dataType: 'json',
        cache: false,
        success: function(citations) {
            $.each(citations, function(index, citation) {

                let id = citation._id;
                let nombre = citation.nbLikers;

                $favouriteauthor.append('<p> L\'auteur le plus mis en favoris est ' + id + ' qui a été '+ nombre + '  fois mis en favoris</p>');

            });
        }
    });

    // GET NB ANONYM QUOTES

    $.ajax({
        type: 'GET',
        url: _URL + 'citation/stats/anonymCitations',
        dataType: 'json',
        cache: false,
        success: function(citations) {
            $.each(citations, function(index, citation) {

                //let id = citation._id;
                let nombre = citation.nbCitationSansAuteur;

                $anonymCitations.append('<p> Il y a '+ nombre + ' citations anonymes</p>');

            });
        }
    });
});

/*function postData() {
    var jsonData = {"numberPlacesTot":1000,"numberPlacesAvailable":1000,"villeDepart":"monTestJS","villeArrivee":"Lille","heureDepart":1140};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       document.getElementById("demo").innerHTML = this.responseText;
      }
    };
    xhttp.open("GET", "ajax_info.txt", true);
    xhttp.send();
  }*/
