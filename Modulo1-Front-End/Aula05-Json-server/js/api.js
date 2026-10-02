const api = {
    async buscaProdutos(pagina=1,produtosPorPagina=6){
        try {
            const response = await fetch(`
                http://localhost:3000/produtos?_page=${pagina}&_per_page=${produtosPorPagina}`)
            
                let responseJson = await response.json()
                console.log(responseJson);
                console.log(responseJson.data);

                return responseJson
                
                

        }
        catch (error){
            alert("erro ao buscar produto")
        }
    }
}

export default api