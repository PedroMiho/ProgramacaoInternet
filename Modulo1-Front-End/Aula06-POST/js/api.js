const api = {
    async buscaProdutos(pagina=1,produtosPorPagina=6,nome=""){
        const parametros = new URLSearchParams({
            _page: pagina,
            _per_page: produtosPorPagina
        })

        // Busca por parte do nome, mantendo a paginação.
        if (nome.trim() !== ""){
            parametros.set("nome:contains", nome.trim())
        }

        const response = await fetch(`http://localhost:3000/produtos?${parametros}`)

        if (!response.ok){
            throw new Error("Erro ao buscar produtos")
        }

        return await response.json()
    },

    // Envia os dados do formulário para cadastrar um novo produto.
    async cadastrarProduto(produto){
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
}

export default api
