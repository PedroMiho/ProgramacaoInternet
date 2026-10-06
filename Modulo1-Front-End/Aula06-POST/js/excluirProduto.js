// Confirma e exclui um produto pelo ID.
export async function excluirProduto(id){
    const confirmou = confirm("Deseja excluir este produto?")
    if (!confirmou) return false

    try {
        const response = await fetch(
            `http://localhost:3000/produtos/${encodeURIComponent(id)}`,
            { method: "DELETE" }
        )

        if (!response.ok){
            throw new Error("Erro ao excluir produto")
        }

        alert("Produto excluído com sucesso!")
        return true
    } catch (erro){
        alert("Não foi possível excluir. Verifique se o JSON Server está em execução.")
        return false
    }
}
