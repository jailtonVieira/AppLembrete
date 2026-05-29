import crypto from "crypto";
import bcrypt from "bcrypt";

export default class Pessoa {
  static listUsuarios = [];

  constructor() {
    this.id = crypto.randomUUID();
    this.nome = null;
    this.email = null;
    this.senha = null;
    this.estConta = false;
    Pessoa.listUsuarios.push(this);
  }

  // Getters
  get id() { return this._id; }
  get nome() { return this._nome; }
  get email() { return this._email; }
  get senha() { return this._senha; }
  get estConta() { return this._estConta; }

  // Setters
  set id(valor) { this._id = valor; }
  set nome(valor) { this._nome = valor; }
  set email(valor) { this._email = valor; }
  set senha(valor) {
    if (!valor || valor.length < 6) throw new Error("Senha muito fraca");
    this._senha = valor;
  }
  set estConta(valor) { this._estConta = valor; }

  // Cadastro — cria uma nova pessoa e envia para o servidor
  static async cadastro(nome, email, senha) {
    if (!nome || !email || !senha) throw new Error("Preencha com os dados pedidos");
    try {
      const pessoa = new Pessoa();
      const senhaHash = await bcrypt.hash(senha, 10);
      pessoa.nome = nome;
      pessoa.email = email;
      pessoa.senha = senhaHash;
      pessoa.estConta = true;

      const response = await fetch("http://192.168.0.104:3000/cadastro", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  // Login — verifica nome e senha
  async login(nome, senha) {
    const senhaCorreta = await bcrypt.compare(senha, this._senha);
    if (this._nome === nome && senhaCorreta && this._estConta === true) {
      alert("Login completo");
    } else {
      alert("Algum dado foi preenchido errado");
    }
  }

  // Troca o nome do usuário
  async trocaNome(nome, newNome) {
    if (this._nome === nome) {
      this._nome = newNome;
      alert("Troca concluída");
    } else {
      alert("Digite o nome novamente");
    }
  }

  // Troca o email do usuário
  async trocaEmail(email, newEmail) {
    if (this._email === email) {
      this._email = newEmail;
      alert("Troca concluída");
    } else {
      alert("Digite o email novamente");
    }
  }

  // Troca a senha do usuário com verificação da senha atual
  async trocaSenha(senha, newSenha) {
    const senhaCorreta = await bcrypt.compare(senha, this._senha);
    if (senhaCorreta) {
      this._senha = await bcrypt.hash(newSenha, 10);
      alert("Troca concluída");
    } else {
      alert("Senha incorreta");
    }
  }

  // Apaga a conta após verificar todos os dados
  async apagarConta(nome, email, senha) {
    const senhaCorreta = await bcrypt.compare(senha, this._senha);
    if (this._nome === nome && this._email === email && senhaCorreta) {
      const indice = Pessoa.listUsuarios.indexOf(this);
      if (indice !== -1) {
        Pessoa.listUsuarios.splice(indice, 1);
        alert("Conta deletada");
      } else {
        alert("Conta não encontrada");
      }
    }
  }
}