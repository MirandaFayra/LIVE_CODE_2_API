import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3333

let pessoasBibliotecarias =[]
let registroAutomatizado = 1


//--------------- CRIAR PESSOA BIBLIOTECÁRIA ----------------

app.post('/bibliotecaria',async(request, response)=>{
    const {nome, senha} = request.body

    if(!nome){
        response.status(400).send(JSON.stringify({ Mensagem: "Favor enviar um nome válido" }))
    }

    if(!senha){
        response.status(400).send(JSON.stringify({ Mensagem: "Favor enviar uma senha válida" }))
    }

    if(nome && senha){ 

        const senhaCriptografada = await bcrypt.hash(senha,10)

        let novaPessoaBibliotecaria = {
            registro : registroAutomatizado,
            nome, 
            senha : senhaCriptografada
        }

        pessoasBibliotecarias.push(novaPessoaBibliotecaria) 

        registroAutomatizado++

        response.status(201).send(JSON.stringify({ Mensagem: `Pessoa bibliotecária cadastrada com sucesso!. Seu número de registro é ${novaPessoaBibliotecaria.registro}` }))

    }else{
        response.status(500).send(JSON.stringify({ Mensagem: "Erro interno. Não foi possível realizar a operação " }))
    }
})

//--------------- LER PESSOA BIBLIOTECÁRIA ------------------

app.get('/bibliotecaria/:registro',(request, response)=>{
    const registro = Number(request.params.registro)

    if(!registro){
        response.status(400).send(JSON.stringify({ Mensagem: "Favor enviar um número de resgistro para consultar a pessoa bibliotecária" }))
    }

    const verificarRegistro = pessoasBibliotecarias.find((pessoa)=> pessoa.registro === registro)

    if(!verificarRegistro){
        response.status(400).send(JSON.stringify({ Mensagem: "Registro não encontrado no nosso banco de dados. Verifique se passou um registro válido" }))
    }

    if(verificarRegistro){
        let nomeEncontrado = verificarRegistro.nome
        response.status(200).send(JSON.stringify({ Mensagem: `A pessoa bibliotecária com esse registro é ${nomeEncontrado}` }))
    }else{
        response.status(500).send(JSON.stringify({ Mensagem: "Erro interno. Não foi possível realizar a operação " }))
    }
})

//--------------- LOGAR PESSOA BIBLIOTECÁRIA -------------

/* 
    CRIE UM ENPOINT DE LOGIN  DA PESSOA BIBLIOTECÁRIA , O MESMO DEVE CONTER 

    - Nome passado pela a pessoa 
    - Senha passada pela pessoa 
    - A senha deve ser criptografada 
    - Todos os itens devem ser validados 
    - Deverá ser utilizado o email como verificador do cadastro em nosso banco de dados 
    - Se o email não existir, enviar para a pessoa usuária 
    - Se a pessoa encotrar o email, e a senha for compativel , fazer o login

*/

app.post('/login-biblioteca',(request, response) => {
   

})



//--------------- DELETAR PESSOA BIBLIOTECÁRIA ----------------

app.delete('/bibliotecaria/:registro',(request, response)=>{
    const registro = Number(request.params.registro)

    const verificarPorRegistro = pessoasBibliotecarias.findIndex((numeroRegistro)=> numeroRegistro.registro === registro)

    if(verificarPorRegistro === -1){
        response
        .status(400)
        .send(JSON.stringify({ Mensagem: "Número de registro não encontrado" }))
    }

    if(verificarPorRegistro !== -1){
        pessoasBibliotecarias.splice(verificarPorRegistro, 1)

        response.status(200).send(JSON.stringify({ Mensagem: `Pessoa bibliotecária deletada com sucesso!` }))

    }

})

//--------------- VERIFICAR SERVIDOR ----------------


app.listen(PORT,()=> console.log('Servidor rodando na porta 3333'))