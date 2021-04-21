
// document.cookie="username=John Doe; path=/; secure";
// sessionStorage.setItem("lastname", "Smith");

// $("#sess").text(document.cookie);
// $("#sess").text(sessionStorage.getItem("lastname"))
// let username = sessionStorage.getItem("lastname");
// sessionStorage.removeItem("key");
// sessionStorage.clear();
// Encode/ decode base-64 => window.btoa(str) / window.atob(enc)

$(document).ready(function(){

    let $tableTopFavoris = $('#tableTopFavoris');
    let $bestMember = $('#bestMember');
    let $quoteauthor = $('#quoteauthor');
    let $favouriteauthor = $("#favouriteauthor");
    let $anonymCitations = $("#anonymCitations");
    let $badge = $('.badge');
    let $accessStatDenied = $('#accessStatDenied');

    $badge.hide();
    $tableTopFavoris.hide();

    if ( sessionStorage.getItem("sid") !== null ) {

        $accessStatDenied.html("");

        // GET TOP 3
        $.ajax({
            type: 'GET',
            url: _URL + 'citation/stats/top3citation',
            dataType: "json",
            contentType: "application/json",
            crossDomain: false,
            headers: {
                Accept: "application/json",
                Authorization: "Basic " + sessionStorage.getItem("sid")
            },
            statusCode: {
                200: function (citations) {
                    $.each(citations, function (index, citation) {
                        let auteur = citation.author;
                        let citatio = citation.citation;
                        let fav = citation.savedInFavorites;
                        $tableTopFavoris.append('<tr><td>' + auteur + '</td><td>' + citatio + '</td><td>' + fav + '</td></tr>');
                    });
                    $badge.show();
                    $tableTopFavoris.show();
                },
                401: function () {
                    $badge.hide();
                    $tableTopFavoris.hide();
                    $accessStatDenied.html("Vous avez été déconnecté");
                }
            }
        });

        // GET BEST USER

        $.ajax({
            type: 'GET',
            url: _URL + 'citation/stats/bestlogin',
            dataType: "json",
            crossDomain: false,
            headers: {
                Accept: "application/json",
                Authorization: "Basic " + sessionStorage.getItem("sid")
            },
            statusCode: {
                200: function (citations) {
                    $.each(citations, function (index, citation) {
                        let id = citation._id;
                        let nombre = citation.count;
                        $bestMember.append('<p></span>' + id + ' est le membre le plus actif avec un total de ' + nombre + ' citations mises en favoris</p>');
                    });
                    $badge.show();
                    $tableTopFavoris.show();
                },
                401: function () {
                    $badge.hide();
                    $tableTopFavoris.hide();
                    $accessStatDenied.html("Vous avez été déconnecté");
                }
            }
        });

        // GET BEST QUOTED AUTHOR

        $.ajax({
            type: 'GET',
            url: _URL + 'citation/stats/topquotedauthor',
            dataType: "json",
            crossDomain: false,
            headers: {
                Accept: "application/json",
                Authorization: "Basic " + sessionStorage.getItem("sid")
            },
            statusCode: {
                200: function (citations) {
                    $.each(citations, function (index, citation) {
                        let id = citation._id;
                        let nombre = citation.count;
                        $quoteauthor.append('<p> L\'auteur le plus cité est ' + id + ' avec un total de ' + nombre + ' citations</p>');
                    });
                    $badge.show();
                    $tableTopFavoris.show();
                },
                401: function () {
                    $badge.hide();
                    $tableTopFavoris.hide();
                    $accessStatDenied.html("Vous avez été déconnecté");
                }
            }
        });

        // GET AUTHOR TOP FAVORITE QUOTE

        $.ajax({
            type: 'GET',
            url: _URL + 'citation/stats/favouriteauthor',
            dataType: "json",
            crossDomain: false,
            headers: {
                Accept: "application/json",
                Authorization: "Basic " + sessionStorage.getItem("sid")
            },
            statusCode: {
                200: function (citations) {
                    $.each(citations, function (index, citation) {
                        let id = citation._id;
                        let nombre = citation.nbLikers;
                        $favouriteauthor.append('<p> L\'auteur le plus mis en favoris est ' + id + ' qui a été ' + nombre + '  fois mis en favoris</p>');
                    });
                    $badge.show();
                    $tableTopFavoris.show();
                },
                401: function () {
                    $badge.hide();
                    $tableTopFavoris.hide();
                    $accessStatDenied.html("Vous avez été déconnecté");
                }
            }
        });

        // GET NB ANONYM QUOTES

        $.ajax({
            type: 'GET',
            url: _URL + 'citation/stats/anonymCitations',
            dataType: "json",
            crossDomain: false,
            headers: {
                Accept: "application/json",
                Authorization: "Basic " + sessionStorage.getItem("sid")
            },
            statusCode: {
                200: function (citations) {
                    $.each(citations, function (index, citation) {
                        //let id = citation._id;
                        let nombre = citation.nbCitationSansAuteur;
                        $anonymCitations.append('<p> Il y a ' + nombre + ' citations anonymes</p>');
                    });
                    $badge.show();
                    $tableTopFavoris.show();
                },
                401: function () {
                    $badge.hide();
                    $tableTopFavoris.hide();
                    $accessStatDenied.html("Vous avez été déconnecté");
                }
            }
        });
    }
    // when sessionStorage is empty
    else {
        $badge.hide();
        $tableTopFavoris.hide();
        $accessStatDenied.html("L'accès à cette ressource est réservée aux personnes connctées");
    }
});
