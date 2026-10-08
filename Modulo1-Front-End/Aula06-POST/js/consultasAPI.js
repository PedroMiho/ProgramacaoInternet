import api from "./api.js"
import { editarProduto } from "./atualizarProduto.js"
import { excluirProduto } from "./excluirProduto.js"

let paginaAtual = 1
let produtosPorPagina = 5
let nomeBusca = ""
let ultimaConsulta = 0
let totalPaginas = 1

const botaoAnterior = document.querySelector("#anterior")
const numeroPagina = document.querySelector("#paginaAtual")
const botaoProxima = document.querySelector("#proxima")
const campoBusca = document.querySelector("#search")

const cards = document.querySelectorAll(".stats .stat-value")

// Uma nova busca começa na primeira página.
campoBusca.addEventListener("input", () => {
    nomeBusca = campoBusca.value.trim()
    consulta.mostrarProdutos(1)
})

botaoAnterior.addEventListener("click", () => {
    consulta.mostrarProdutos(paginaAtual - 1)
})

botaoProxima.addEventListener("click", () => {
    consulta.mostrarProdutos(paginaAtual + 1)
})

const consulta = {
    async mostrarProdutos(paginaDesejada = paginaAtual) {
        const numeroConsulta = ++ultimaConsulta

        botaoAnterior.disabled = true
        botaoProxima.disabled = true

        try {
            const produtos = await api.buscaProdutos(
                paginaDesejada,
                produtosPorPagina,
                nomeBusca
            )

            // Ignora respostas antigas.
            if (numeroConsulta !== ultimaConsulta) return

            totalPaginas = Math.max(1, produtos.pages || 0)

            listarProdutos(produtos.data)
            atualizarCards(numeroConsulta)

            paginaAtual = paginaDesejada
            numeroPagina.textContent = paginaAtual

            botaoAnterior.disabled = paginaAtual <= 1
            botaoProxima.disabled = paginaAtual >= totalPaginas

        } catch (erro) {
            if (numeroConsulta !== ultimaConsulta) return

            console.error(erro)
            alert(
                "Não foi possível buscar os produtos. Verifique o JSON Server."
            )

            botaoAnterior.disabled = paginaAtual <= 1
            botaoProxima.disabled = paginaAtual >= totalPaginas
        }
    }
}

// Calcula os cards usando todos os produtos.
async function atualizarCards(numeroConsulta) {
    try {
        const resposta = await fetch("http://localhost:3000/produtos")

        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados dos cards")
        }

        const produtos = await resposta.json()

        if (numeroConsulta !== ultimaConsulta) return

        const totalProdutos = produtos.length

        // Conta as categorias diferentes.
        const categorias = new Set(
            produtos
                .map(produto => produto.categoria)
                .filter(Boolean)
        )

        // Soma os preços.
        const somaPrecos = produtos.reduce((total, produto) => {
            return total + (Number(produto.preco) || 0)
        }, 0)

        // Calcula a média sem dividir por zero.
        const valorMedio = totalProdutos > 0
            ? somaPrecos / totalProdutos
            : 0

        cards[0].textContent = totalProdutos
        cards[1].textContent = categorias.size
        cards[2].textContent = formatarMoeda(valorMedio)

    } catch (erro) {
        console.error("Não foi possível atualizar os cards:", erro)
    }
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
}

function verificaProdutos(produtos) {
    const nenhumProduto = document.querySelector("#verificaProduto")

    if (produtos.length > 0) {
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

function listarProdutos(produtos) {
    const tabela = document.querySelector("#mostrarProdutos")

    verificaProdutos(produtos)

    // Remove as linhas da consulta anterior.
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
        tdPreco.textContent = formatarMoeda(produto.preco)
        tdEstoque.textContent = produto.estoque
        tdStatus.textContent = produto.estoque > 0
            ? "Disponível"
            : "Esgotado"

        const botaoEditar = document.createElement("button")
        botaoEditar.type = "button"
        botaoEditar.classList.add(
            "btn", "btn-warning", "btn-sm", "me-2"
        )
        botaoEditar.textContent = "Editar"

        botaoEditar.addEventListener("click", () => {
            editarProduto(produto)
        })

        const botaoExcluir = document.createElement("button")
        botaoExcluir.type = "button"
        botaoExcluir.classList.add(
            "btn", "btn-danger", "btn-sm"
        )
        botaoExcluir.textContent = "Excluir"

        botaoExcluir.addEventListener("click", async () => {
            if (botaoExcluir.disabled) return

            botaoExcluir.disabled = true

            try {
                const excluiu = await excluirProduto(produto.id)

                if (excluiu) {
                    // Mantém a busca e atualiza a tabela e os cards.
                    await consulta.mostrarProdutos(1)
                }
            } catch (erro) {
                console.error(erro)
                alert("Não foi possível excluir o produto.")
            } finally {
                botaoExcluir.disabled = false
            }
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
    })
}

// Atualiza a tabela e os cards após cadastrar.
export async function atualizarListaAposCadastro() {
    campoBusca.value = ""
    nomeBusca = ""
    await consulta.mostrarProdutos(1)
}

// Pode ser chamada após salvar uma edição.
// Mantém a busca e volta à primeira página.
export async function atualizarListaAposEdicao() {
    await consulta.mostrarProdutos(1)
}

// Carrega os produtos e os cards ao abrir a página.
consulta.mostrarProdutos()