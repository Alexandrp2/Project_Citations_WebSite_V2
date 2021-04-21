
let $tableCitationsMonEspace = $('#tableCitationsMonEspace');
let $loginInput = $('#login');
let $passwordInput = $('#password');
let $LoginInstruction = $('#loginInstruction');
let $passwordInstruction = $('#passwordInstruction');
let $msgConnection = $('#msgConnect');
let $loginActive = $('#loginActive');
let $loginNonActive = $('#loginNonActive');
let $toastInfoMonEspaceMessage = $('#toastInfoMonEspaceMessage');
let $toastInfoMonEspace = $('#toastInfoMonEspace');
let $msgNoContentToShow = $('#msgNoContentToShow');

// Form new citation
let $formNewCitationLabelAuteur = $('#auteurLabel');
let $formNewCitationInputAuteur = $('#auteurInput');
let $formNewCitationLabelAnnee = $('#anneeLabel');
let $formNewCitationInputAnnee = $('#anneeInput');
let $formNewCitationLabelNationalite = $('#nationaliteLabel');
let $formNewCitationInputNationalite = $('#nationaliteInput');
let $formNewCitationLabelCitation = $('#citationLabel');
let $formNewCitationInputCitation = $('#citationInput');
let $ButtonAddNewCitation = $('#ButtonAddNewCitation');

$(document).ready(function(){

    $LoginInstruction.hide();
    $passwordInstruction.hide();
    $msgConnection.hide();
    hideformNewCitation();
    $tableCitationsMonEspace.hide();

    welcomeMessage();

    $loginInput.on({
        focus: function(){
            $msgConnection.hide();
            $LoginInstruction.show();
        },
        mouseleave: function(){
            $LoginInstruction.hide();
        }
    });
    $passwordInput.on({
        focus: function(){
            $msgConnection.hide();
            $passwordInstruction.show();
        },
        mouseleave: function(){
            $passwordInstruction.hide();
        }
    });

    $("#validateRegister").click(function(){

        let login = escapeHtmlSpecialChars($loginInput.val());
        let pwd = escapeHtmlSpecialChars($passwordInput.val());
        let msgFailure = "";

        $passwordInstruction.hide();
        $LoginInstruction.hide();

        if (login.length < 5) {
            msgFailure = msgFailure + "Le login ne respecte pas la contrainte de longueur.</br>";
        }
        if (pwd.length < 8 || pwd.length > 64 || !isPasswordMatchingConstraints(pwd)) {
            msgFailure = msgFailure + "Le mot de passe ne respecte pas les contraintes.";
        }

        if( msgFailure.length > 0) {
            $msgConnection.html(msgFailure);
            $msgConnection.show();
        } else {
            $msgConnection.html('')
            const jsonData = {"login": login, "pwd": pwd};

            $.ajax({
                type: 'POST',
                url: _URL + 'register',
                dataType: 'json',
                contentType: 'application/json',
                crossDomain: false,
                headers: {
                    Accept: "application/json"
                },
                data: JSON.stringify(jsonData),
                statusCode: {
                    201: function(response) {
                        status20xLoginAndRegister(login, response);
                    },
                    403: function() {
                        $msgConnection.html("Vous n'avez pas pu être enregistré(e) car ce pseudo existe déjà.");
                        $msgConnection.show();
                    }
                }
            });
        }
    });

    $("#validateLogin").click(function(){

        let login = escapeHtmlSpecialChars($loginInput.val());
        let pwd = escapeHtmlSpecialChars($passwordInput.val());
        let msgFailure = "";

        $passwordInstruction.hide();
        $LoginInstruction.hide();

        if( login.length < 5 && pwd.length < 8) {
            msgFailure = "Identifiants incorrects"
            $msgConnection.html(msgFailure);
            $msgConnection.show();
        } else {
            $msgConnection.html('')
            const jsonData = {"login": login, "pwd": pwd};

            $.ajax({
                type: 'POST',
                url: _URL + 'login',
                dataType: 'json',
                contentType: 'application/json',
                crossDomain: false,
                headers: {
                    Accept: "application/json"
                },
                data: JSON.stringify(jsonData),
                statusCode: {
                    202: function(response) {
                        status20xLoginAndRegister(login, response);
                    },
                    403: function() {
                        status400Login(msgFailure);
                    },
                    404: function() {
                        status400Login(msgFailure)
                    }
                }
            });
        }

    });

    $("#validateLogout").click(function(){

        if( sessionStorage.getItem("pseudo") === null ) {
            alert("Vous n'êtes pas connecté");
        } else {
            let login =  atob(sessionStorage.getItem("pseudo"))
            const jsonData = {"login": login};

            $.ajax({
                type: 'POST',
                url: _URL + 'logout',
                dataType: 'json',
                contentType: 'application/json',
                crossDomain: false,
                headers: {
                    Accept: "application/json",
                    Authorization: "Basic " +  sessionStorage.getItem("sid")
                },
                data: JSON.stringify(jsonData),
                statusCode: {
                    200: function() {
                        sessionStorage.clear();
                        alert("Vous êtes maintenant déconnecté");
                        $("#ongletCitations").click();
                        welcomeMessage();
                    }
                }
            });
        }

    });

    $("#ongletCitations").click(function(){

        $("#ongletFavoris").prop("class", "nav-link");
        $("#ongletCitations").prop("class", "nav-link active");
        $("#ongletCitationsPostees").prop("class", "nav-link");
        $("#ongletNewCitation").prop("class", "nav-link");

        $tableCitationsMonEspace.hide();
        hideformNewCitation();
        $("td").remove();
        $msgNoContentToShow.html('');

        if ( sessionStorage.getItem("sid") !== null ){

            // Send request
            // GET ALL CITATIONS
            $.ajax({
                type: 'GET',
                url: _URL + 'citations',
                dataType: 'json',
                crossDomain: false,
                headers: {
                    Accept: "application/json",
                    Authorization: "Basic " +  sessionStorage.getItem("sid")
                },
                statusCode: {
                    200: function(citations) {
                        status200MonEspace(citations, "ongletCitations");
                    },
                    401: function() {
                        $tableCitationsMonEspace.hide();
                        hideformNewCitation();
                        endSession();
                    }
                }
            });
        } else {
            $tableCitationsMonEspace.hide();
        }

    });

    $("#ongletFavoris").click(function(){

        $("#ongletFavoris").prop("class", "nav-link active");
        $("#ongletCitations").prop("class", "nav-link");
        $("#ongletCitationsPostees").prop("class", "nav-link");
        $("#ongletNewCitation").prop("class", "nav-link");

        $tableCitationsMonEspace.hide();
        hideformNewCitation();
        $("td").remove();
        $msgNoContentToShow.html('');

        if ( sessionStorage.getItem("sid") !== null ){

            // Send request
            // GET ALL LOGIN FAVORITES
            const jsonData = {"Poster": atob(sessionStorage.getItem("pseudo"))};
            $.ajax({
                type: 'POST',
                url: _URL + 'citation/favoris/mesCitations',
                dataType: "json",
                contentType: 'application/json',
                crossDomain: false,
                headers: {
                    Accept: "application/json",
                    Authorization: "Basic " +  sessionStorage.getItem("sid")
                },
                data: JSON.stringify(jsonData),
                statusCode: {
                    200: function(citations) {
                        status200MonEspace(citations, "ongletFavoris");
                    },
                    401: function() {
                        $tableCitationsMonEspace.hide();
                        hideformNewCitation();
                        endSession();
                    }
                }
            });
        }
    });

    $("#ongletCitationsPostees").click(function(){

        $("#ongletFavoris").prop("class", "nav-link");
        $("#ongletCitations").prop("class", "nav-link");
        $("#ongletCitationsPostees").prop("class", "nav-link active");
        $("#ongletNewCitation").prop("class", "nav-link");

        $tableCitationsMonEspace.hide();
        hideformNewCitation();
        $("td").remove();
        $msgNoContentToShow.html('');

        if ( sessionStorage.getItem("sid") !== null ){

            // Send request
            // GET ALL LOGIN FAVORITES
            const jsonData = {"Poster": atob(sessionStorage.getItem("pseudo"))};
            $.ajax({
                type: 'POST',
                url: _URL + 'citation/post/mesCitations',
                dataType: "json",
                contentType: 'application/json',
                crossDomain: false,
                headers: {
                    Accept: "application/json",
                    Authorization: "Basic " +  sessionStorage.getItem("sid")
                },
                data: JSON.stringify(jsonData),
                statusCode: {
                    200: function(citations) {
                        status200MonEspace(citations, "ongletPost");
                    },
                    401: function() {
                        $tableCitationsMonEspace.hide();
                        hideformNewCitation();
                        endSession();
                    }
                }
            });
        }
    });

    $("#ongletNewCitation").click(function(){

        $("#ongletFavoris").prop("class", "nav-link");
        $("#ongletCitations").prop("class", "nav-link");
        $("#ongletCitationsPostees").prop("class", "nav-link");
        $("#ongletNewCitation").prop("class", "nav-link active");

        $tableCitationsMonEspace.hide();
        hideformNewCitation();
        $("td").remove();
        $msgNoContentToShow.html('');

        if ( sessionStorage.getItem("sid") !== null ){

            $.ajax({
                type: 'GET',
                url: _URL + 'authorization',
                dataType: 'json',
                contentType: 'application/json',
                crossDomain: false,
                headers: {
                    Accept: "application/json",
                    Authorization: "Basic " +  sessionStorage.getItem("sid")
                },
                statusCode: {
                    200: function() {
                        showformNewCitation();
                    },
                    401: function() {
                        $tableCitationsMonEspace.hide();
                        hideformNewCitation();
                        endSession();
                    }
                }
            });
        }
    });

    $("#ButtonAddNewCitation").click(function(){;

        if ( sessionStorage.getItem("sid") !== null ){

            let author = $formNewCitationInputAuteur.val();
            let annee = $formNewCitationInputAnnee.val();
            let nationalite =$formNewCitationInputNationalite.val();
            let citation =$formNewCitationInputCitation.val();

            if ( citation.length === 0 ) {
                alert("La citation est obligatoire");
            } else {
                // Send request
                // CREATE A NEW CITATION
                const jsonData = {
                    "author": author,
                    "citation": citation,
                    "year": annee,
                    "nationality": nationalite,
                    "Poster" : atob(sessionStorage.getItem("pseudo"))
                };
                $.ajax({
                    type: 'POST',
                    url: _URL + 'citation/ajouter',
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
                            $toastInfoMonEspaceMessage.html('La citation a été ajoutée');
                            $toastInfoMonEspace.toast('show');
                        },
                        401: function() {
                            alert("La citation n'a pas pû être ajoutée");
                        }
                    }
                });

                emptyFormAddCitation();
            }

        } else {
            alert("La citation n'a pas pû être ajoutée");
        }
    });
});
