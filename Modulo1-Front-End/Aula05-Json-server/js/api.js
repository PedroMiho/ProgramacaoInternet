const api = {
    async buscaProdutos(){
        try {
            const response = await fetch("http://localhost:3000/produtos")
            return await response.json()

        }
        catch (error){
            alert("erro ao buscar produto")
        }
    }
}

export default api