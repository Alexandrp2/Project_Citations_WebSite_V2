
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
let $msgFormComplete = $('#msgFormComplete');
let $errorMsg = $('.MsgFailureToConnect');

// Form Inscription / New Password / Reset Password
let $formIdentificationinputPseudoLabel = $('#formIdentificationPseudoLabel');
let $formIdentificationinputPseudoInput = $('#formIdentificationPseudoInput');
let $formIdentificationCurrentPwdLabel = $('#formIdentificationCurrentPwdLabel');
let $formIdentificationCurrentPwdInput = $('#formIdentificationCurrentPwdInput');
let $formIdentificationNewPwdLabel = $('#formIdentificationNewPwdLabel');
let $formIdentificationNewPwdInput = $('#formIdentificationNewPwdInput');
let $formIdentificationNewPwdConfirmLabel = $('#formIdentificationNewPwdConfirmLabel');
let $formIdentificationNewPwdConfirmInput = $('#formIdentificationNewPwdConfirmInput');
let $formIdentificationEmailLabel = $('#formIdentificationEmailLabel');
let $formIdentificationEmailInput = $('#formIdentificationEmailInput');
let $formIdentificationValidateButton = $('#formIdentificationValidateButton');
let $titreIdentificationForm = $('#titreIdentificationForm');

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

    cleanMonEspaceOnChangeTab();
    welcomeMessage();
    formInstructionsHandler();

    $("#register").click(function(){
        showFormRegister();
    });

    $("#changePwd").click(function(){
        showFormChangePassword();
    });

    $("#forgotPwd").click(function(){
        showFormResetPassword();
    });

    $formIdentificationValidateButton.click(function(){

        let actionType = $formIdentificationValidateButton.text()

        let form_pseudo = escapeHtmlSpecialChars($formIdentificationinputPseudoInput.val());
        let form_currentPwd = escapeHtmlSpecialChars($formIdentificationCurrentPwdInput.val());
        let form_newPwd = escapeHtmlSpecialChars($formIdentificationNewPwdInput.val());
        let form_newPwdConfirm = escapeHtmlSpecialChars($formIdentificationNewPwdConfirmInput.val());
        let form_email = escapeHtmlSpecialChars($formIdentificationEmailInput.val());

        // Cas : Changer le mot passe
        if( actionType.includes("Changer") ) {
            let checkInputs = checkFormChangePwd(form_pseudo, form_currentPwd, form_newPwd, form_newPwdConfirm, form_email);
            if ( checkInputs.length > 0 ){
                $msgFormComplete.html(checkInputs);
            } else {
                $msgFormComplete.html('')
                const jsonData = {"login": form_pseudo, "currentPwd": form_currentPwd, "newPwd": form_newPwd, "mailUser": form_email};

                $.ajax({
                    type: 'POST',
                    url: _URL + 'updatepassword',
                    dataType: 'json',
                    contentType: 'application/json',
                    crossDomain: false,
                    headers: {
                        Accept: "application/json"
                    },
                    data: JSON.stringify(jsonData),
                    statusCode: {
                        200: function(response) {
                            emptyFormComplete();
                            $(".newLine").html('');
                            $msgFormComplete.html('');
                            hideFormComplete();
                            alert('Opération effectuée avec succés');
                            //openSession(login, response);
                            //status20xLoginAndRegister();
                        },
                        403: function() {
                            $msgFormComplete.html("Vous n'avez pas pu être enregistré(e) car ce pseudo existe déjà.");
                            $msgFormComplete.show();
                        },
                        404: function() {
                            $msgFormComplete.html("Identifiants non trouvés.");
                            $msgFormComplete.show();
                        }
                    }
                });
            }
        }

        // Cas : oubli du mot de passe
        if( actionType.includes("nouveau") ) {
            let checkInputs = checkFormForgotPwd(form_pseudo, form_email);
            if ( checkInputs.length > 0 ){
                $msgFormComplete.html(checkInputs);
            } else {

                $msgFormComplete.html('')
                const jsonData = {"login": form_pseudo, "mailUser": form_email};

                $.ajax({
                    type: 'POST',
                    url: _URL + 'resetpassword',
                    dataType: 'json',
                    contentType: 'application/json',
                    crossDomain: false,
                    headers: {
                        Accept: "application/json"
                    },
                    data: JSON.stringify(jsonData),
                    statusCode: {
                        200: function(response) {
                            emptyFormComplete();
                            $(".newLine").html('');
                            $msgFormComplete.html('');
                            hideFormComplete();
                            alert('Un mot de passe vient de vous être envoyé à votre addresse email');
                            //openSession(login, response);
                            //status20xLoginAndRegister();
                        },
                        204: function() {
                            $msgFormComplete.html("Identifiants non trouvés.");
                            $msgFormComplete.show();
                        }
                    }
                });
            }
        }

        // Cas : register
        if( actionType.includes("inscris") ) {
            let checkInputs = checkFormRegister(form_pseudo, form_newPwd, form_newPwdConfirm, form_email);
            if ( checkInputs.length > 0 ){
                $msgFormComplete.html(checkInputs);
            } else {
                $msgFormComplete.html('')
                const jsonData = {"login": form_pseudo, "pwd": form_newPwd, "mail": form_email};

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
                            emptyFormComplete();
                            $(".newLine").html('');
                            $msgFormComplete.html('');
                            hideFormComplete();
                            alert('Votre inscription est validée, vous pouvez maintenant vous connecter');
                            //openSession(login, response);
                            //status20xLoginAndRegister();
                        },
                        403: function() {
                            $msgFormComplete.html("Vous n'avez pas pu être enregistré(e) car ce pseudo existe déjà.");
                            $msgFormComplete.show();
                        }
                    }
                });
            }
        }

    });

    $("#validateRegister").click(function(){

        let login = escapeHtmlSpecialChars($loginInput.val());
        let pwd = escapeHtmlSpecialChars($passwordInput.val());
        let msgFailure = "";

        $passwordInstruction.hide();
        $LoginInstruction.hide();
        hideFormComplete();
        $(".newLine").html('');

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
                        openSession(login, response);
                        status20xLoginAndRegister();
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
        hideFormComplete();
        $errorMsg.html('');
        $(".newLine").html('');

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
                        openSession(login, response);
                        status20xLoginAndRegister();
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

        hideFormComplete();
        $(".newLine").html('');

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

        cleanMonEspaceOnChangeTab();

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

        cleanMonEspaceOnChangeTab();

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

        cleanMonEspaceOnChangeTab();

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

        cleanMonEspaceOnChangeTab();

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
                            $tableCitationsMonEspace.hide();
                            hideformNewCitation();
                            endSession();
                            $("#ongletCitations").click();
                            welcomeMessage();
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
