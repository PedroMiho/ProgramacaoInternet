const formulario = document.querySelector(".product-form")
const botaoCadastrar = formulario.querySelector('button[type="submit"]')

//Capturar as informações que estão no formulario
formulario.addEventListener("submit" , async (evento) => {
    evento.preventDefault()

    if (botaoCadastrar.disabled) {
        return
    }

    const nomeProduto = document.querySelector("#nome").value.trim()
    const categoria = document.querySelector("#categoria").value
    const preco = Number(document.querySelector("#preco").value)
    const estoque = Number(document.querySelector("#estoque").value)
    const descricao = document.querySelector("#descricao").value.trim()

    const produto = {
        nome: nomeProduto,
        categoria: categoria,
        preco : preco,
        estoque : estoque,
        descricao : descricao
    }

    botaoCadastrar.disabled = true

    try {
        const produtoCadastrado = await cadastrarProduto(produto)
        console.log("ID do produto " , produto.id);
        
        formulario.reset()
    }

    catch(erro) {
        alert(erro)
    }

    finally {
        botaoCadastrar.disabled = false
    }
})



async function cadastrarProduto(produto){
    const response = await fetch("http://localhost:3000/produtos" , {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(produto)
    }) 

    if (!response.ok){
        throw new Error("Erro ao cadastrar o produto")
    }

    return await response.json()
}