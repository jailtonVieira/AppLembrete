import Pessoa from "./Pessoa";


export default class Lembrete {
    static listLembretes = [];
    constructor (pessoa,titulo,texto) {
        this.codigo = crypto.randomUUID();
        this.pessoa = pessoa;
        this.titulo = titulo;
        this.texto = texto;
        this.estLembrete = true;
        this.data = null;
        this.dCriacão = null;
        this.dalarme = null;

        Lembrete.listLembretes.push(this);
    }
// get e setter
    get codigo() {
        return this._codigo;
    }
    set codigo(valor) {
        this._codigo = valor;
    }

    get pessoa(){
        return this._pessoa;
    }
    set pessoa(valor) {
        this._pessoa = valor;
    }

    get titulo() {
        return this._titulo;
    }
    set titulo(valor) {
        this._titulo = valor;
    }

    get texto() {
        return this._texto;
    }
    set texto(valor) {
        this._texto = valor;
    }

    get estLembrete() {
        return this._estLembrete;
    }
    set estLembrete(valor){
        this._estLembrete = valor;
    }

    get data() {
        return this._data;
    }
    set data(valor) {
        this._data = valor;
    }

    get dCriacao() {
        return this._dCriacão;
    }
    set dCriacao(valor) {
        this._dCriacão = valor;
    }

    get dalarme() {
        return this._dalarme;
    }
    set dalarme(valor) {
        this._dalarme = valor;
    }


// Editar titulo
    editarTitulo(novoTitulo,) {
        if(this._estLembrete){
            this._titulo = novoTitulo;
            alert("Troca completa")
        }
        else {
            throw new Error("Não foi encontradado")
        }
    }

    editarTexto(novoTexto){
        if(this.estLembrete){
            this._texto = novoTexto;
        }
        else{
            throw new Error("")
        }
}

    adicionarTexto(textoExtra){
        if(this.estLembrete){
            this._texto = (this._texto || "") + textoExtra;
        }
        else{
            throw new Error("")
        }
}

    removerTexto(parteTexto){
        if(this.estLembrete) {
            this._texto = this._texto.replaceAll(parteTexto, "");
        }
        else{
            throw new Error("")
        }
}
}