function openSession(login, response){
    sessionStorage.setItem("pseudo", btoa(login));
    sessionStorage.setItem("sid", btoa(response.sid));
}

function endSession() {
    sessionStorage.clear();
    alert("Votre session a exipirée, vous avez été déconnecté");
    $("#ongletCitations").click();
    welcomeMessage();
}
