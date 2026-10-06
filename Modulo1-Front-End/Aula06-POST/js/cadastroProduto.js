import { atualizarListaAposCadastro } from "./consultasAPI.js"

// Envia os dados do formulário para cadastrar um novo produto.
async function cadastrarProduto(produto){
    const response = await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    })

    if (!response.ok){
        throw new Error("Erro ao cadastrar produto")
    }

    return await response.json()
}

// O submit também funciona quando o aluno pressiona Enter no formulário.
const formulario = document.querySelector(".product-form")
const botaoCadastrar = formulario.querySelector('button[type="submit"]')
const mensagemCadastro = document.querySelector("#mensagemCadastro")

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault()
    if (botaoCadastrar.disabled || !formulario.reportValidity()) return

    const produto = {
        nome: document.querySelector("#nome").value.trim(),
        categoria: document.querySelector("#categoria").value,
        preco: Number(document.querySelector("#preco").value),
        estoque: Number(document.querySelector("#estoque").value),
        descricao: document.querySelector("#descricao").value.trim()
    }

    if (!produto.nome){
        mensagemCadastro.className = "alert alert-danger"
        mensagemCadastro.textContent = "Informe o nome do produto."
        return
    }

    botaoCadastrar.disabled = true
    mensagemCadastro.className = "alert d-none"

    try {
        await cadastrarProduto(produto)
        formulario.reset()
        mensagemCadastro.className = "alert alert-success"
        mensagemCadastro.textContent = "Produto cadastrado com sucesso!"

        // Limpa a busca e atualiza a tabela após o cadastro.
        await atualizarListaAposCadastro()
    } catch (erro){
        mensagemCadastro.className = "alert alert-danger"
        mensagemCadastro.textContent = "Não foi possível cadastrar. Verifique se o JSON Server está em execução."
    } finally {
        botaoCadastrar.disabled = false
    }
})
