// ddl Operations in MonEspace : Create, Update, Delete

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
