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

function isMailMatchingConstraints(email) {
    let pattern = /^[A-Za-z0-9._-]{2,}@[a-z]{2,}\.[a-z]{2,}$/;
    let resultCheckMatching = pattern.test(email);
    return resultCheckMatching;
}

function checkFormChangePwd(pseudo, currentPwd, newPwd, newPwdConfirm, email) {

    let msgReturned = "";

    if (pseudo.length === 0 || currentPwd.length === 0 || newPwd.length === 0 || newPwdConfirm.length === 0 || email.length === 0)
    {
        msgReturned = msgReturned + "Tous les champs ne sont pas remplis.</br>";
    }

    if (pseudo.length < 5){
        msgReturned = msgReturned + "Le pseudo ne respecte pas la longueur requise.</br>";
    }

    if (!isMailMatchingConstraints(email)){
        msgReturned = msgReturned + "Le mail n\est pas conforme.</br>";
    }

    if(newPwd.length < 8 || newPwd.length > 64 || !isPasswordMatchingConstraints(newPwd)){
        msgReturned = msgReturned + "Le mot de passe ne respecte pas les contraintes.</br>";
    }

    if (newPwd !== newPwdConfirm){
        msgReturned = msgReturned + "Votre nouveau mot de passe et sa confirmation, ne correspondent pas.</br>";
    }

    return msgReturned;
}

function checkFormForgotPwd(pseudo, email) {

    let msgReturned = "";

    if (pseudo.length === 0 || email.length === 0) {
        msgReturned = msgReturned + "Tous les champs ne sont pas remplis.</br>";
    }

    if (pseudo.length < 5){
        msgReturned = msgReturned + "Le pseudo ne présente pas une forme correcte.</br>";
    }

    if (!isMailMatchingConstraints(email)){
        msgReturned = msgReturned + "Le mail ne présente pas une forme correcte.</br>";
    }

    return msgReturned;

}

function checkFormRegister(pseudo, newPwd, newPwdConfirm, email) {

    let msgReturned = "";

    if (pseudo.length === 0 || newPwd.length === 0 || newPwdConfirm.length === 0 || email.length === 0)
    {
        msgReturned = msgReturned + "Tous les champs ne sont pas remplis.</br>";
    }

    if (pseudo.length < 5){
        msgReturned = msgReturned + "Le pseudo ne respecte pas la longueur requise.</br>";
    }

    if (!isMailMatchingConstraints(email)){
        msgReturned = msgReturned + "Le mail n\est pas conforme.</br>";
    }

    if(newPwd.length < 8 || newPwd.length > 64 || !isPasswordMatchingConstraints(newPwd)){
        msgReturned = msgReturned + "Le mot de passe ne respecte pas les contraintes.</br>";
    }

    if (newPwd !== newPwdConfirm){
        msgReturned = msgReturned + "Votre nouveau mot de passe et sa confirmation, ne correspondent pas.</br>";
    }

    return msgReturned;
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
