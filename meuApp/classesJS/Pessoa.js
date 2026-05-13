import bcrypt from "bcrypt";

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
        const pessoa = new Pessoa();
        pessoa.nome = nome;
        pessoa.email = email;
        pessoa.senha = senhaHash;
        pessoa.estConta = true;
        return pessoa;

    }
    else {
        throw new Error("Preemcha com os dados pedidos")
    }
}

login (pessoa, nome, senha){
    if(this._nome == nome && this._senha == senha && this._estConta == true) {
        alert("Login Completo")
    }
    else {
        alert("Algum dado foi prenchido errado")
    }
} 
// Vou tentar fazer o a criptografia com hash
// Aqui é as function para trocas

// Troca nome
trocaNome(Pessoa, nome, newNome) {
    if(this._nome == nome) {
        this._nome = newNome;
        alert("Troca comcluida")
    }
    else{
        alert("Digite o nome novamente")
    }
}
// Troca EMAIL
trocaEmail(Pessoa, email, newEmail) {
    if(this._email == email) {
        this._email = newEmail;
        alert("Troca comcluida")
    }
    else{
        alert("Digite o nome novamente")
    }
}
// Troca SENHA
trocaSenha(Pessoa, senha, newSenha) {
    if(this._senha == senha) {
        this._senha = newSenha;
        alert("Troca comcluida")
    }
    else{
        alert("Digite o nome novamente")
    }
}
// Deletar conta
apagarConta(pessoa, nome , email, senha,id) {
    if (this._nome == nome && this._email == email && this._senha == senha) {
      const indice = users.indexOf(this.id);

      if (indice !== -1) {
        users.splice(indice, 1);
        alert("Conta deletada")
      }
      else{
        alert("Conta não encontrada")
      }
    }
}
}