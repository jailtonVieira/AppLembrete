import crypto from "crypto";
import bcrypt from "bcrypt";
const bcrypt = require('bcrypt');


export default class Pessoa {
  static listUsuarios = [];
  constructor () {
      this.id = crypto.randomUUID();
      this.nome = null;
      this.email = null;
      this.senha = null;
      this.estConta = false;

      Pessoa.listUsuarios.push(this);
    }

  // GETTERS (ler valores)
  get id() {
    return this._id;
  }    
  get nome() {
    return this._nome;
  }

  get email() {
    return this._email;
  }

  get senha() {
    return this._senha;
  }

  get estConta() {
    return this._estConta;
  }

  // SETTERS (alterar valores com controle)
  set id(valor) {
    this._id = valor;
  }
  set nome(valor) {
    this._nome = valor;
  }

  set email(valor) {
    this._email = valor;
  }

  set senha(valor) {
    if (!valor || valor.length < 6) {
      throw new Error("Senha muito fraca");
    }
    this._senha = valor;
  }

  set estConta(valor) {
    this._estConta = valor;
  }

  //Atualizar tudo daqui pra baixo

//CADASTRO
static async cadastro (nome, email,senha) {
    if (nome && email && senha) {
        const senhaHash = await bcrypt.hash(senha,10);
        pessoa.nome = nome;
        pessoa.email = email;
        pessoa.senha = senhaHash;
        pessoa.estConta = true;
    }
    else {
        throw new Error("Preemcha com os dados pedidos")
    }
    try {
      const response = await fetch("http://192.168.0.104:3000/cadastro", {
        method: 'POST' ,
        headers: {
          'content-Type' : 'application/json'
        },

        body: JSON.stringify({
          nome,
          email,
          senha
        })
      })
      const pessoa = new Pessoa;
    
      
      const data = await response.json();
      console.log(data);
      return data;
} 
catch (error) {
  console.log(error);
}}

async login (nome, senha){
  const senhaCorreta = await bcrypt.compare(senha,this._senha);

    if(this._nome == nome && senhaCorreta && this._estConta == true) {
        alert("Login Completo")
    }
    else {
        alert("Algum dado foi prenchido errado")
    }
} 
// Vou tentar fazer o a criptografia com hash
// Aqui é as function para trocas

// Troca nome
async trocaNome(Pessoa, nome, newNome) {
    if(this._nome == nome) {
        this._nome = newNome;
        alert("Troca comcluida")
    }
    else{
        alert("Digite o nome novamente")
    }
}
// Troca EMAIL
async trocaEmail(Pessoa, email, newEmail) {
    if(this._email == email) {
        this._email = newEmail;
        alert("Troca comcluida")
    }
    else{
        alert("Digite o nome novamente")
    }
}
// Troca SENHA
async trocaSenha(Pessoa, senha, newSenha) {
  const senhaCorreta = await bcrypt.compare(senha,this._senha);
    if(senhaCorreta) {
      const novasenha = await bcrypt.hash(newSenha,10)
        this._senha = novasenha;
        alert("Troca comcluida")
    }
    else{
        alert("Digite o nome novamente")
    }
}
// Deletar conta
async apagarConta(pessoa, nome , email, senha,id) {
  const senhaCorreta = await bcrypt.compare(senha,this._senha);
    if (this._nome == nome && this._email == email && senhaCorreta) {
      const indice = Pessoa.listUsuarios.indexOf(this);

      if (indice !== -1) {
        Pessoa.listUsuarios.splice(indice, 1);
        alert("Conta deletada")
      }
      else{
        alert("Conta não encontrada")
      }
    }
}}
