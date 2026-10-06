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
    }
}

export default api
