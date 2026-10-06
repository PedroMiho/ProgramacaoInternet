import { atualizarListaAposCadastro } from "./consultasAPI.js"

const formulario = document.querySelector(".product-form")
const botaoSalvar = formulario.querySelector('button[type="submit"]')
const botaoLimpar = formulario.querySelector('button[type="reset"]')
const titulo = document.querySelector(".form-header h2")
const subtitulo = document.querySelector(".form-header p")
const mensagem = document.querySelector("#mensagemCadastro")
let produtoEmEdicao = null

export function editarProduto(produto){
    if (botaoSalvar.disabled) return
    produtoEmEdicao = { ...produto }
    formulario.dataset.modo = "editar"
    for (const campo of ["nome", "categoria", "preco", "estoque", "descricao"]){
        document.querySelector("#" + campo).value = produto[campo] ?? ""
    }
    titulo.textContent = "Editar produto"
    subtitulo.textContent = "Altere os dados e salve as alterações."
    botaoSalvar.textContent = "Salvar alterações"
    botaoLimpar.textContent = "Cancelar edição"
    mensagem.className = "alert d-none"
    formulario.scrollIntoView({ behavior: "smooth", block: "center" })
    document.querySelector("#nome").focus({ preventScroll: true })
}

function voltarAoCadastro(){
    produtoEmEdicao = null
    delete formulario.dataset.modo
    titulo.textContent = "Cadastrar produto"
    subtitulo.textContent = "Preencha os dados para cadastrar um novo produto."
    botaoSalvar.textContent = "Cadastrar produto"
    botaoLimpar.textContent = "Limpar"
}

formulario.addEventListener("reset", (evento) => {
    if (botaoSalvar.disabled){
        evento.preventDefault()
        return
    }
    voltarAoCadastro()
    mensagem.className = "alert d-none"
})

formulario.addEventListener("submit", async (evento) => {
    if (formulario.dataset.modo !== "editar") return
    evento.preventDefault()
    if (botaoSalvar.disabled || !formulario.reportValidity()) return

    const produto = {
        ...produtoEmEdicao,
        nome: document.querySelector("#nome").value.trim(),
        categoria: document.querySelector("#categoria").value,
        preco: Number(document.querySelector("#preco").value),
        estoque: Number(document.querySelector("#estoque").value),
        descricao: document.querySelector("#descricao").value.trim()
    }

    if (!produto.nome || !Number.isFinite(produto.preco) || produto.preco < 0 ||
        !Number.isInteger(produto.estoque) || produto.estoque < 0){
        mensagem.className = "alert alert-danger"
        mensagem.textContent = "Informe nome, preço válido e estoque inteiro não negativo."
        return
    }

    botaoSalvar.disabled = true
    botaoLimpar.disabled = true
    mensagem.className = "alert d-none"

    try {
        await atualizarProduto(produto.id, produto)
        // O reset é liberado somente após terminar o PUT.
        botaoSalvar.disabled = false
        formulario.reset()
        mensagem.className = "alert alert-success"
        mensagem.textContent = "Produto atualizado com sucesso!"
        await atualizarListaAposCadastro()
    } catch (erro){
        mensagem.className = "alert alert-danger"
        mensagem.textContent = "Não foi possível atualizar. Verifique o JSON Server."
    } finally {
        botaoSalvar.disabled = false
        botaoLimpar.disabled = false
    }
})

async function atualizarProduto(id, produto){
    const response = await fetch(
        `http://localhost:3000/produtos/${encodeURIComponent(id)}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        }
    )
    if (!response.ok) throw new Error("Erro ao atualizar produto")
}
