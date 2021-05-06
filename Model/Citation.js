class Citation {

    constructor(id, auteur, annee, citation, nationalite, profession) {
        this.id = id;
        this.auteur = auteur;
        this.annee = annee;
        this.citation = citation;
        this.nationalite = nationalite;
        this.profession = profession;
    }

    treatNullValue() {
        this.auteur         = this.isDefined(this.auteur) ? this.auteur : 'Inconnu';
        this.annee          = this.isDefined(this.annee) ? this.annee : '-';
        this.nationalite    = this.isDefined(this.nationalite) ? this.nationalite : '-';
        this.profession     = this.isDefined(this.profession) ? this.profession : '-';

    }

    isDefined(value) {
        return !(value === undefined || value === null || value.length === 0);
    }

    appendTable_Complete() {
        return '<tr>' +
                    '<td>'+ this.citation + '</td>' +
                    '<td>'+ this.annee + '</td>' +
                    '<td>' + this.auteur +  '</td>' +
                    '<td>'+ this.profession + '</td>' +
                    '<td>'+ this.nationalite + '</td>' +
                '</tr>';
    }
}
