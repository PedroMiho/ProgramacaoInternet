//DOM
const cep = document.querySelector("#cep")

async function buscaCep(cep) {

    let mensagemErro = document.querySelector("#erro")

    mensagemErro.innerHTML = ""

    try {
        let urlCEP = `https://viacep.com.br/ws/${cep}/json/`
        let promisseCep = await fetch(urlCEP)
        console.log(promisseCep)
        
        let responseJson = await promisseCep.json();
        console.log(responseJson);
        
        if (responseJson.erro) {
            apagaCampos()
            throw Error("CEP INEXISTENTE"); 
        }

        preencheCampos(responseJson)
 
        return responseJson
        
    } catch (erro) {
        apagaCampos()
        mensagemErro.innerHTML = "CEP inválido, tente novamente"
    }
}


function preencheCampos(camposCep){
    let rua = document.querySelector("#rua")
    let bairro = document.querySelector("#bairro")
    let cidade = document.querySelector("#cidade")
    let estado = document.querySelector("#estado")


    rua.value = camposCep.logradouro
    bairro.value = camposCep.bairro
    cidade.value = camposCep.localidade
    estado.value = camposCep.estado

}

function apagaCampos(){
    let rua = document.querySelector("#rua")
    let bairro = document.querySelector("#bairro")
    let cidade = document.querySelector("#cidade")
    let estado = document.querySelector("#estado")


    rua.value = ""
    bairro.value = ""
    cidade.value = ""
    estado.value = ""

}

//Adiciona um evento no elemento
cep.addEventListener("change" ,  (evento) => {
    //Impede que a página seja recarregada
    let cep = evento.target

    //Captura o valor do CEP digitado
    console.log(cep.value);
    buscaCep(cep.value)
})
