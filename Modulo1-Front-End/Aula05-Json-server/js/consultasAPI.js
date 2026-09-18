import api from "./api.js"

const consulta = {
    async mostrarProdutos(){
        try{
            const produtos = await api.buscaProdutos()
            console.log(produtos);
            verificaProdutos(produtos)
            listarProdutos(produtos)
        }catch(erro){
            alert("deu ruim")
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
    }
}

function listarProdutos(produtos){
    const tabela = document.querySelector("#mostrarProdutos")

    produtos.forEach(produto => {

        const tr = document.createElement("tr")

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