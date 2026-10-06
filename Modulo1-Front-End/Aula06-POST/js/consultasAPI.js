import api from "./api.js"

let paginaAtual = 1
let produtosPorPagina = 5
let nomeBusca = ""
let ultimaConsulta = 0
let totalPaginas = 1

const botaoAnterior = document.querySelector("#anterior")
const numeroPagina = document.querySelector("#paginaAtual")
const botaoProxima = document.querySelector("#proxima")
const campoBusca = document.querySelector("#search")

// Uma nova busca começa na primeira página.
campoBusca.addEventListener("input", () => {
    nomeBusca = campoBusca.value.trim()
    consulta.mostrarProdutos(1)
})

botaoAnterior.addEventListener("click" , () => {
    consulta.mostrarProdutos(paginaAtual - 1);
})

botaoProxima.addEventListener("click" , () => {
    consulta.mostrarProdutos(paginaAtual + 1);
})

const consulta = {
    async mostrarProdutos(paginaDesejada=paginaAtual){

        const numeroConsulta = ++ultimaConsulta

        //Evita novos cliques durante a requisição
        botaoAnterior.disabled = true
        botaoProxima.disabled = true

        try{
            const produtos = await api.buscaProdutos(paginaDesejada,produtosPorPagina,nomeBusca)

            // Ignora respostas antigas quando o usuário digita rapidamente.
            if (numeroConsulta !== ultimaConsulta) return

            totalPaginas = produtos.pages
            console.log(produtos);
            listarProdutos(produtos.data)
            
            paginaAtual=paginaDesejada
            numeroPagina.textContent = paginaAtual
            
            botaoAnterior.disabled = paginaAtual === 1
            botaoProxima.disabled = paginaAtual >= produtos.pages
            
        }catch(erro){
            if (numeroConsulta !== ultimaConsulta) return
            alert("Não foi possível buscar os produtos. Verifique o JSON Server.")
            botaoAnterior.disabled = paginaAtual === 1
            botaoProxima.disabled = paginaAtual >= totalPaginas
        }
    }
}

function verificaProdutos(produtos){
    let produtoCadatrados = produtos.length
    let nenhumProduto = document.querySelector("#verificaProduto")
    
    if (produtoCadatrados > 0){
        nenhumProduto.style.display = "none"
    } else {
        nenhumProduto.style.display = "table-cell"
        nenhumProduto.querySelector("h3").textContent = nomeBusca
            ? "Nenhum produto encontrado"
            : "Nenhum produto cadastrado"
        nenhumProduto.querySelector("p").textContent = nomeBusca
            ? "Tente buscar por outro nome."
            : "Cadastre seu primeiro produto utilizando o formulário abaixo."
    }
}

function listarProdutos(produtos){
    const tabela = document.querySelector("#mostrarProdutos")
    verificaProdutos(produtos)

    tabela.querySelectorAll(".linha-produto").forEach(linha => {
        linha.remove()
    })


    produtos.forEach(produto => {

        const tr = document.createElement("tr")
        tr.classList.add("linha-produto")

        const tdProduto = document.createElement("td")
        const tdCategoria = document.createElement("td")
        const tdPreco = document.createElement("td")
        const tdEstoque = document.createElement("td")
        const tdStatus = document.createElement("td")
        const tdAcoes = document.createElement("td")

        tdProduto.textContent = produto.nome
        tdCategoria.textContent = produto.categoria
        tdPreco.textContent = "R$ " + produto.preco
        tdEstoque.textContent = produto.estoque
        tdStatus.textContent = produto.estoque > 0 ? "Disponível" : "Esgotado";

        const botaoEditar = document.createElement("button")
        botaoEditar.classList.add("btn", "btn-warning", "btn-sm" , "me-2")
        botaoEditar.textContent = "Editar"

        botaoEditar.addEventListener("click" , async () => {
            await editarProduto(produto)
        })
        
        const botaoExcluir = document.createElement("button")
        botaoExcluir.classList.add("btn", "btn-danger", "btn-sm")
        botaoExcluir.textContent = "Excluir"
        
        botaoExcluir.addEventListener("click" , async () => {
            await excluirProduto(produto.id)
        })

        tdAcoes.appendChild(botaoEditar)
        tdAcoes.appendChild(botaoExcluir)

        tr.appendChild(tdProduto)
        tr.appendChild(tdCategoria)
        tr.appendChild(tdPreco)
        tr.appendChild(tdEstoque)
        tr.appendChild(tdStatus)
        tr.appendChild(tdAcoes)

        tabela.appendChild(tr)
        


    });

}

consulta.mostrarProdutos()

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
        await api.cadastrarProduto(produto)
        formulario.reset()
        mensagemCadastro.className = "alert alert-success"
        mensagemCadastro.textContent = "Produto cadastrado com sucesso!"

        // Limpa a busca e atualiza a tabela após o cadastro.
        campoBusca.value = ""
        nomeBusca = ""
        await consulta.mostrarProdutos(1)
    } catch (erro){
        mensagemCadastro.className = "alert alert-danger"
        mensagemCadastro.textContent = "Não foi possível cadastrar. Verifique se o JSON Server está em execução."
    } finally {
        botaoCadastrar.disabled = false
    }
})
