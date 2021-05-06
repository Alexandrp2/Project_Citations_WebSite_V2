/*
 * INDEX
 */

function hideTablesinIndex(){
    $tableCitations.hide();
    $tableCitationsRecherche.hide();
}

function status200Citations(citations){
    $.each(citations, function(index, citation) {
        let cit = new Citation(citation._id.$oid, citation.author, citation.year, citation.citation, citation.nationality, citation.profession);
        cit.treatNullValue();
        $tableCitationsRecherche.append(cit.appendTable_Complete());
        $tableCitationsRecherche.show();
    });
}

function status204Citations(){
    hideTablesinIndex();
    $('#noResultMsg').text('Aucun résultat correspondant à votre recherche');
}

function cleanMonEspaceOnChangeTab() {
    $tableCitationsMonEspace.hide();
    hideformNewCitation();
    hideFormComplete();
    $LoginInstruction.hide();
    $passwordInstruction.hide();
    $("td").remove();
    $(".newLine").html('');
    $msgNoContentToShow.html('');
    $errorMsg.html('');
}

function formInstructionsHandler() {
    $formIdentificationinputPseudoInput.on({
        focus: function(){
            $msgConnection.hide();
            $LoginInstruction.show();
        },
        mouseleave: function(){
            $LoginInstruction.hide();
        }
    });
    $formIdentificationNewPwdInput.on({
        focus: function(){
            $msgConnection.hide();
            $passwordInstruction.show();
        },
        mouseleave: function(){
            $passwordInstruction.hide();
        }
    });
}

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

function showformNewCitation(){
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

function welcomeMessage() {

    if ( sessionStorage.getItem("pseudo") === null) {
        $loginActive.hide();
        $loginNonActive.show();
    } else {
        $loginNonActive.hide();
        $loginActive.html("Bienvenue dans votre espace <b>"
            + atob(sessionStorage.getItem("pseudo"))
            + "</b>"
        );
    }
}

function status20xLoginAndRegister() {
    $loginInput.val('');
    $passwordInput.val('');
    $errorMsg.html('');
    $msgConnection.hide();
    $loginActive.show();
    $("#ongletCitations").click();
    $loginNonActive.hide("slow", function(){
        alert("Vous pouvez maintenant naviguer dans votre espace");
    });
    $loginActive.html("Bienvenue dans votre espace <b>" + atob(sessionStorage.getItem("pseudo")) + "</b>");
}

function status400Login(msgFailure) {
    msgFailure = "Identifiants incorrects"
    $msgConnection.html(msgFailure);
    $msgConnection.show();
}

function status200MonEspace(citations, onglet){

    // check if the server response is empty or not
    let stringCitations = JSON.stringify(citations)
    if (stringCitations.length > 2) {

        $msgNoContentToShow.html('');

        $.each(citations, function (index, citation) {

            let cit = new Citation(citation._id.$oid, citation.author, citation.year, citation.citation, citation.nationality, citation.profession);
            cit.treatNullValue();

            if (onglet === "ongletCitations") {
                $tableCitationsMonEspace.append('<tr>' +
                    '<td>' + cit.citation + '</td>' +
                    '<td>' + cit.annee + '</td>' +
                    '<td>' + cit.auteur + '</td>' +
                    '<td><button class="btn btn-outline-info" onclick="addFavori(\'' + cit.id + '\')">Ajouter aux favoris</button></td></tr>');
            } else if (onglet === "ongletFavoris") {
                $tableCitationsMonEspace.append('<tr>' +
                    '<td>' + cit.citation + '</td>' +
                    '<td>' + cit.annee + '</td>' +
                    '<td>' + cit.auteur + '</td>' +
                    '<td><button class="btn btn-outline-info" onclick="removeFavori(\'' + cit.id + '\')">Supprimer le favori</button></td></tr>');
            } else if (onglet === "ongletPost") {
                $tableCitationsMonEspace.append('<tr>' +
                    '<td>' + cit.citation + '</td>' +
                    '<td>' + cit.annee + '</td>' +
                    '<td>' + cit.auteur + '</td>' +
                    '<td><button class="btn btn-outline-info" onclick="removeCitation(\'' + cit.id + '\')">Supprimer la citation</button></td></tr>');
            }
        });

        $tableCitationsMonEspace.show();

    } else {
        $tableCitationsMonEspace.hide();
        $msgNoContentToShow.html('Pas de contenu à afficher pour l\'instant ...');
    }
}
/*
function sendAddDeleteRequests(idCitation, operation){
    let url_path = "";
    let $simulateClick = null;
    let toastMsg = "";

    switch (operation) {
        case "addFavori":
            url_path = url_path + 'citation/favoris/add';
            toastMsg = toastMsg + "Citation ajoutée aux favoris";
            break;
        case "removeFavori":
            url_path = url_path + "citation/favoris/del";
            toastMsg = toastMsg + "Citation supprimée des favoris";
            $simulateClick = $("#ongletFavoris");
            break;
        case 'removeCitation':
            url_path = url_path + 'citation/delete/macitation';
            toastMsg = toastMsg + "Citation supprimée";
            $simulateClick = $("#ongletCitationsPostees");
            break;
    }

    if ( sessionStorage.getItem("sid") !== null ){

        if(idCitation === null || idCitation.length === 0){
            $("#toastMissiingId").toast('show');
        } else {
            // Send request
            // ADD A FAVORITE
            const jsonData = {"citationId": idCitation, "Poster": atob(sessionStorage.getItem("pseudo"))};
            $.ajax({
                type: 'POST',
                url: _URL + url_path,
                dataType: "json",
                contentType: 'application/json',
                crossDomain: false,
                headers: {
                    Accept: "application/json",
                    Authorization: "Basic " +  sessionStorage.getItem("sid")
                },
                data: JSON.stringify(jsonData),
                statusCode: {
                    200: function() {
                        $toastInfoMonEspaceMessage.html(toastMsg);
                        $toastInfoMonEspace.toast('show');
                        if ( $simulateClick !== null ){
                            $simulateClick.click();
                        }

                    },
                    401: function() {
                        alert("Identifiez-vous avant d'ajouter des favoris");
                    }
                }
            });
        }

    } else {
        alert("Identifiez-vous avant d'ajouter des favoris");
    }
}
function removeCitation(idCitation){
    sendAddDeleteRequests(idCitation, "removeCitation");
}
async function removeFavori(idCitation){
    await sendAddDeleteRequests(idCitation, "removeFavori");
}
function addFavori(idCitation){
    sendAddDeleteRequests(idCitation, "addFavori");
}
*/
function emptyFormAddCitation() {
    $formNewCitationInputAuteur.val("");
    $formNewCitationInputAnnee.val("");
    $formNewCitationInputNationalite.val("");
    $formNewCitationInputCitation.val("");
}

function hideFormComplete() {
    $formIdentificationinputPseudoLabel.hide();
    $formIdentificationinputPseudoInput.hide();
    $formIdentificationCurrentPwdLabel.hide();
    $formIdentificationCurrentPwdInput.hide();
    $formIdentificationNewPwdLabel.hide();
    $formIdentificationNewPwdInput.hide();
    $formIdentificationNewPwdConfirmLabel.hide();
    $formIdentificationNewPwdConfirmInput.hide();
    $formIdentificationEmailLabel.hide();
    $formIdentificationEmailInput.hide();
    $formIdentificationValidateButton.hide();
    $titreIdentificationForm.hide();
}

function showFormChangePassword() {
    emptyFormComplete();
    $errorMsg.html('');
    $(".newLine").html('');
    $formIdentificationinputPseudoLabel.show();
    $formIdentificationinputPseudoInput.show();
    $formIdentificationCurrentPwdLabel.show();
    $formIdentificationCurrentPwdInput.show();
    $formIdentificationNewPwdLabel.show();
    $formIdentificationNewPwdInput.show();
    $formIdentificationNewPwdConfirmLabel.show();
    $formIdentificationNewPwdConfirmInput.show();
    $formIdentificationEmailLabel.show();
    $formIdentificationEmailInput.show();
    $formIdentificationValidateButton.html('Changer mon mot de passe');
    $formIdentificationValidateButton.show();
    $(".newLine").html('<br>');
}

function showFormResetPassword() {
    emptyFormComplete();
    $errorMsg.html('');
    $(".newLine").html('');
    $formIdentificationinputPseudoLabel.show();
    $formIdentificationinputPseudoInput.show();
    $formIdentificationCurrentPwdLabel.hide();
    $formIdentificationCurrentPwdInput.hide();
    $formIdentificationNewPwdLabel.hide();
    $formIdentificationNewPwdInput.hide();
    $formIdentificationNewPwdConfirmLabel.hide();
    $formIdentificationNewPwdConfirmInput.hide();
    $formIdentificationEmailLabel.show();
    $formIdentificationEmailInput.show();
    $formIdentificationValidateButton.html('Envoyez-moi un email avec mon nouveau mot de passe');
    $formIdentificationValidateButton.show();
    $(".newLine").html('<br>');

}

function showFormRegister() {
    emptyFormComplete();
    $errorMsg.html('');
    $(".newLine").html('');
    $formIdentificationinputPseudoLabel.show();
    $formIdentificationinputPseudoInput.show();
    $formIdentificationCurrentPwdLabel.hide();
    $formIdentificationCurrentPwdInput.hide();
    $formIdentificationNewPwdLabel.show();
    $formIdentificationNewPwdInput.show();
    $formIdentificationNewPwdConfirmLabel.show();
    $formIdentificationNewPwdConfirmInput.show();
    $formIdentificationEmailLabel.show();
    $formIdentificationEmailInput.show();
    $formIdentificationValidateButton.html('Je m\'inscris');
    $formIdentificationValidateButton.show();
    $(".newLine").append('<br>');
}

function emptyFormComplete() {
    $formIdentificationinputPseudoInput.val('');
    $formIdentificationCurrentPwdInput.val('');
    $formIdentificationNewPwdInput.val('');
    $formIdentificationNewPwdConfirmInput.val('');
    $formIdentificationEmailInput.val('');
}


