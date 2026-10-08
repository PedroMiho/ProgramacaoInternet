import { atualizarListaAposCadastro } from "./consultasAPI.js"

const formulario = document.querySelector(".product-form")
const botaoCadastrar = formulario.querySelector('button[type="submit"]')
const mensagemCadastro = document.querySelector("#mensagemCadastro")

// Executa o cadastro ao clicar no botão ou pressionar Enter.
formulario.addEventListener("submit", async (evento) => {
    if (evento.defaultPrevented || formulario.dataset.modo === "editar") {
        return
    }

    evento.preventDefault()

    if (botaoCadastrar.disabled || !formulario.reportValidity()) {
        return
    }

    const produto = {
        nome: document.querySelector("#nome").value.trim(),
        categoria: document.querySelector("#categoria").value,
        preco: Number(document.querySelector("#preco").value),
        estoque: Number(document.querySelector("#estoque").value),
        descricao: document.querySelector("#descricao").value.trim()
    }

    if (!produto.nome) {
        mensagemCadastro.className = "alert alert-danger"
        mensagemCadastro.textContent = "Informe o nome do produto."
        return
    }

    botaoCadastrar.disabled = true
    mensagemCadastro.className = "alert d-none"

    try {
        // Recebe o produto cadastrado, incluindo o ID gerado.
        const produtoCadastrado = await cadastrarProduto(produto)

        console.log("Produto cadastrado:", produtoCadastrado)
        console.log("ID gerado:", produtoCadastrado.id)

        formulario.reset()

        mensagemCadastro.className = "alert alert-success"
        mensagemCadastro.textContent =
            `Produto cadastrado com sucesso! ID: ${produtoCadastrado.id}`

        // Limpa a busca e atualiza a tabela e os cards.
        await atualizarListaAposCadastro()

    } catch (erro) {
        console.error(erro)

        mensagemCadastro.className = "alert alert-danger"
        mensagemCadastro.textContent =
            "Não foi possível cadastrar. Verifique se o JSON Server está em execução."

    } finally {
        botaoCadastrar.disabled = false
    }
})

// Envia o produto e retorna a resposta da API com o ID.
async function cadastrarProduto(produto) {
    const resposta = await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    })

    if (!resposta.ok) {
        throw new Error("Erro ao cadastrar produto")
    }

    return await resposta.json()
}