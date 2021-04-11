/*
 * Comment of the following line if you use the distant Flask API (hosted in Azure)
 */
const _URL = 'http://localhost:5000/';

/*
 * Remove the comment of the following line if you use the distant Flask API (hosted in Azure)
 */
// const _URL = 'https://apicitations.azurewebsites.net/';

let login = "";
let $tableCitations = $('#tableCitations');
// Form
let $formNewCitationLabelAuteur = $('#auteurLabel');
let $formNewCitationInputAuteur = $('#auteurInput');
let $formNewCitationLabelAnnee = $('#anneeLabel');
let $formNewCitationInputAnnee = $('#anneeInput');
let $formNewCitationLabelNationalite = $('#nationaliteLabel');
let $formNewCitationInputNationalite = $('#nationaliteInput');
let $formNewCitationLabelCitation = $('#citationLabel');
let $formNewCitationInputCitation = $('#citationInput');
let $ButtonAddNewCitation = $('#ButtonAddNewCitation');

function hideformNewCitation(){
    $formNewCitationLabelAuteur.hide();
    $formNewCitationInputAuteur.hide();
    $formNewCitationLabelAnnee.hide();
    $formNewCitationInputAnnee.hide();
    $formNewCitationLabelNationalite.hide();
    $formNewCitationInputNationalite.hide();
    $formNewCitationLabelCitation.hide();
    $formNewCitationInputCitation.hide();
    $ButtonAddNewCitation.hide();
}


$(document).ready(function(){

    $("#formAddFavori").hide();
    $("#validateFavori").hide();

    $("#formDeleteFavori").hide();
    $('#deleteFavori').hide();

    $("#formDeleteCitation").hide();
    $('#deleteCitation').hide();

    hideformNewCitation();

    $tableCitations.hide();

    
    $("#validateLogin").click(function(){

        login = $('#login').val();
        if (login.length > 0){
            $("#loginNonActive").hide("slow", function(){
                alert("Vous pouvez maintenant naviguer dans votre espace");
            });
            $("#loginActive").html("Bienvenue dans votre espace " + login);
        }

    });

    $("#ongletCitations").click(function(){

        $("#ongletFavoris").prop("class", "nav-link");
        $("#ongletCitations").prop("class", "nav-link active");
        $("#ongletCitationsPostees").prop("class", "nav-link");
        $("#ongletNewCitation").prop("class", "nav-link");

        $("td").remove();

        if (login.length > 0){
            $("#formAddFavori").show();
            $("#validateFavori").show();

            $("#formDeleteFavori").hide();
            $('#deleteFavori').hide()

            $("#formDeleteCitation").hide();
            $('#deleteCitation').hide();

            $tableCitations.show();
            hideformNewCitation();

            // Send request
            // GET ALL CITATIONS
            $.ajax({
                type: 'GET',
                url: _URL + 'citations',
                dataType: 'json',
                cache: false,
                success: function(citations) {
                    $.each(citations, function(index, citation) {
                        let id = citation._id.$oid;
                        let auteur = citation.author;
                        let annee = citation.year;
                        let citatio = citation.citation;

                        if (auteur === undefined  || auteur === null || auteur.length === 0 ) {
                            auteur='Inconnu';
                        }
                        if (annee === undefined  || annee === null || annee.length === 0 ) {
                            annee="N/A";
                        }

                        $tableCitations.append('<tr><td>' + id + '</td><td>'+ citatio + '</td><td>'+ auteur +  '</td><td>'+ annee + '</td></tr>');
                    });
                }
            });


        } else {
            $("#formAddFavori").hide();
            $("#validateFavori").hide();
            
            $("#formDeleteFavori").hide();
            $('#deleteFavori').hide();

            $("#formDeleteCitation").hide();
            $('#deleteCitation').hide();

            $tableCitations.hide();
            hideformNewCitation();
        }

    });

    $("#ongletFavoris").click(function(){

        $("#ongletFavoris").prop("class", "nav-link active");
        $("#ongletCitations").prop("class", "nav-link");
        $("#ongletCitationsPostees").prop("class", "nav-link");
        $("#ongletNewCitation").prop("class", "nav-link");

        $("td").remove();

        if( login.length === 0) {
            $("#formDeleteFavori").hide();
            $('#deleteFavori').hide();

            $("#formDeleteCitation").hide();
            $('#deleteCitation').hide();

            $("#formAddFavori").hide();
            $("#validateFavori").hide();

            $tableCitations.hide();
            hideformNewCitation();

        } else {
            $("#formDeleteFavori").show();
            $('#deleteFavori').show();

            $("#formDeleteCitation").hide();
            $('#deleteCitation').hide();

            $("#formAddFavori").hide();
            $("#validateFavori").hide();

            $tableCitations.show();
            hideformNewCitation();

            // Send request
            // GET ALL LOGIN FAVORITES
            const jsonData = {"Poster": login};
            $.ajax({
                type: 'POST',
                url: _URL + 'citation/favoris/mesCitations',
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(jsonData),
                success: function(citations) {
                    $.each(citations, function(index, citation) {
                        let id = citation._id.$oid;
                        let auteur = citation.author;
                        let annee = citation.year;
                        let citatio = citation.citation;

                        if (auteur === undefined  || auteur === null || auteur.length === 0 ) {
                            auteur='Inconnu';
                        }
                        if (annee === undefined  || annee === null || annee.length === 0 ) {
                            annee="N/A";
                        }

                        $tableCitations.append('<tr><td>'+ id + '</td><td>' + citatio + '</td><td>'+ auteur +  '</td><td>'+ annee + '</td></tr>');
                    });
                }
            });
        }
    });

    $("#ongletCitationsPostees").click(function(){

        $("#ongletFavoris").prop("class", "nav-link");
        $("#ongletCitations").prop("class", "nav-link");
        $("#ongletCitationsPostees").prop("class", "nav-link active");
        $("#ongletNewCitation").prop("class", "nav-link");

        $("td").remove();

        if( login.length === 0) {
            $("#formDeleteFavori").hide();
            $('#deleteFavori').hide();

            $("#formDeleteCitation").hide();
            $('#deleteCitation').hide();

            $("#formAddFavori").hide();
            $("#validateFavori").hide();

            $tableCitations.hide();
            hideformNewCitation();

        } else {
            $("#formDeleteFavori").hide();
            $('#deleteFavori').hide();

            $("#formDeleteCitation").show();
            $('#deleteCitation').show();

            $("#formAddFavori").hide();
            $("#validateFavori").hide();

            $tableCitations.show();
            hideformNewCitation();

            // Send request
            // GET ALL LOGIN FAVORITES
            const jsonData = {"Poster": login};
            $.ajax({
                type: 'POST',
                url: _URL + 'citation/post/mesCitations',
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(jsonData),
                success: function(citations) {
                    $.each(citations, function(index, citation) {
                        let id = citation._id.$oid;
                        let auteur = citation.author;
                        let annee = citation.year;
                        let citatio = citation.citation;

                        if (auteur === undefined  || auteur === null || auteur.length === 0 ) {
                            auteur='Inconnu';
                        }
                        if (annee === undefined  || annee === null || annee.length === 0 ) {
                            annee="N/A";
                        }

                        $tableCitations.append('<tr><td>'+ id + '</td><td>' + citatio + '</td><td>'+ auteur +  '</td><td>'+ annee + '</td></tr>');
                    });
                }
            });
        }
    });

    $("#ongletNewCitation").click(function(){

        $("#ongletFavoris").prop("class", "nav-link");
        $("#ongletCitations").prop("class", "nav-link");
        $("#ongletCitationsPostees").prop("class", "nav-link");
        $("#ongletNewCitation").prop("class", "nav-link active");

        $("td").remove();

        if( login.length === 0) {
            $("#formDeleteFavori").hide();
            $('#deleteFavori').hide();

            $("#formDeleteCitation").hide();
            $('#deleteCitation').hide();

            $("#formAddFavori").hide();
            $("#validateFavori").hide();

            $tableCitations.hide();

        } else {
            $("#formDeleteFavori").hide();
            $('#deleteFavori').hide();

            $("#formDeleteCitation").hide();
            $('#deleteCitation').hide();

            $("#formAddFavori").hide();
            $("#validateFavori").hide();

            $tableCitations.hide();

            $formNewCitationLabelAuteur.show();
            $formNewCitationInputAuteur.show();
            $formNewCitationLabelAnnee.show();
            $formNewCitationInputAnnee.show();
            $formNewCitationLabelNationalite.show();
            $formNewCitationInputNationalite.show();
            $formNewCitationLabelCitation.show();
            $formNewCitationInputCitation.show();
            $ButtonAddNewCitation.show();

        }
    });

    $("#validateFavori").click(function(){
        if (login.length > 0){
            let citationId = $('#inputAddFavori').val();

            if(citationId === null || citationId.length === 0){
                $("#toastMissiingId").toast('show');
            } else {
                // Send request
                // ADD A FAVORITE
                const jsonData = {"citationId": citationId, "Poster": login};
                $.ajax({
                    type: 'POST',
                    url: _URL + 'citation/favoris/add',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(jsonData),
                    success: function() {
                        $("#toastAjout").toast('show');
                    }
                });
            }

        } else {
            alert("Identifiez-vous avant d'ajouter des favoris");
        }
    });

    $("#deleteFavori").click(function(){
        if (login.length > 0){
            let citationId = $('#inputDeleteFavori').val();

            if(citationId === null || citationId.length === 0){
                $("#toastMissiingId").toast('show');
            } else {
                // Send request
                // DELETE A FAVORITE
                const jsonData = {"citationId": citationId, "Poster": login};
                $.ajax({
                    type: 'POST',
                    url: _URL + 'citation/favoris/del',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(jsonData),
                    success: function() {
                        $("#toastDeleteFavori").toast('show');
                    }
                });
            }

        } else {
            alert("Identifiez-vous avant de supprimer des favoris");
        }
    });

    $("#deleteCitation").click(function(){
        if (login.length > 0){
            let citationId = $('#inputDeleteCitation').val();

            if(citationId === null || citationId.length === 0){
                $("#toastMissiingId").toast('show');
            } else {
                // Send request
                // DELETE A CITATION
                const jsonData = {"citationId": citationId, "Poster": login};
                $.ajax({
                    type: 'DELETE',
                    url: _URL + 'citation/delete/macitation',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(jsonData),
                    success: function() {
                        $("#toastDeleteCitation").toast('show');
                    }
                });
            }

        } else {
            alert("Identifiez-vous avant de supprimer des citations");
        }
    });

    $("#ButtonAddNewCitation").click(function(){
        if (login.length > 0){

            let author = $formNewCitationInputAuteur.val();
            let annee = $formNewCitationInputAnnee.val();
            let nationalite =$formNewCitationInputNationalite.val();
            let citation =$formNewCitationInputCitation.val();

            if(citation.length === 0){
                alert("La citation est obligatoire");
            } else {
                //author === null ? "null": author;
                //annee === null ? "null": annee;
                //nationalite.length === 0 ? "null": nationalite;
                //citation.length === 0 ? "null": citation;

                // Send request
                // CREATE A NEW CITATION
                const jsonData = {
                    "author": author,
                    "citation": citation,
                    "year": annee,
                    "nationality": nationalite,
                    "Poster" : login
                };
                $.ajax({
                    type: 'POST',
                    url: _URL + 'citation/ajouter',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(jsonData),
                    success: function() {
                        $("#toastDeleteCitation").toast('show');
                    }
                });

                $formNewCitationInputAuteur.val("");
                $formNewCitationInputAnnee.val("");
                $formNewCitationInputNationalite.val("");
                $formNewCitationInputCitation.val("");
            }

        } else {
            alert("La citation n'a pas pû être ajoutée");
        }
    });
});
