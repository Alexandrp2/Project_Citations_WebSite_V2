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

function escapeHtmlSpecialChars(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(txt) {
        return map[txt];
    });
}


/*
 * MONESPACE
 */

/*
 * Password OWASP Recommendation
 *  -  Minimum length of the passwords should be enforced by the application.
 *     Passwords shorter than 8 characters are considered to be weak (NIST SP800-63B).
 *  - Maximum password length should not be set too low, as it will prevent users from creating passphrases.
 *    A common maximum length is 64 characters due to limitations in certain hashing algorithms
 *
 * At least 8 characters and max 64, with a minimum of 1 letter Uppercase, 1 letter lowercase1 digit, 1 special char (!#$%&?"<>*)
 */

function isPasswordMatchingConstraints(pwd) {
    let pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/g;
    let resultCheckMatching = pattern.test(pwd);
    return resultCheckMatching;
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

function status20xLoginAndRegister(login, response) {
    sessionStorage.setItem("pseudo", btoa(login));
    sessionStorage.setItem("sid", btoa(response.sid));
    $loginInput.val('');
    $passwordInput.val('');
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

function emptyFormAddCitation() {
    $formNewCitationInputAuteur.val("");
    $formNewCitationInputAnnee.val("");
    $formNewCitationInputNationalite.val("");
    $formNewCitationInputCitation.val("");
}

function endSession() {
    sessionStorage.clear();
    alert("Votre session a exipirée, vous avez été déconnecté");
    welcomeMessage();
}

/*
  * ***********   NOTE  **************
  * This scrypt feature is available only
  * - in secure contexts (HTTPS),
  * - in some or all supporting browsers.
 */

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/*
 * STATISTIQUES
 */

