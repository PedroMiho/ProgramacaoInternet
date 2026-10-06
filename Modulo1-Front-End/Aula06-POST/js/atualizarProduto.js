// Lê os novos valores e atualiza o produto pelo ID.
export async function editarProduto(produto){
    const nome = prompt("Nome do produto:", produto.nome)
    if (nome === null) return false

    const categoria = prompt("Categoria: computadores, perifericos, audio ou gamer", produto.categoria)
    if (categoria === null) return false

    const precoTexto = prompt("Preço do produto:", produto.preco)
    if (precoTexto === null) return false

    const estoqueTexto = prompt("Quantidade em estoque:", produto.estoque)
    if (estoqueTexto === null) return false

    const descricao = prompt("Descrição do produto:", produto.descricao ?? "")
    if (descricao === null) return false

    const preco = Number(precoTexto.trim().replace(",", "."))
    const estoque = Number(estoqueTexto)
    const categorias = ["computadores", "perifericos", "audio", "gamer"]

    if (!nome.trim() || !categorias.includes(categoria.trim())){
        alert("Informe um nome e uma categoria válida.")
        return false
    }

    if (!precoTexto.trim() || !Number.isFinite(preco) || preco < 0 ||
        !estoqueTexto.trim() || !Number.isInteger(estoque) || estoque < 0){
        alert("Informe um preço válido e um estoque inteiro, ambos maiores ou iguais a zero.")
        return false
    }

    const produtoAtualizado = {
        ...produto,
        nome: nome.trim(),
        categoria: categoria.trim(),
        preco: preco,
        estoque: estoque,
        descricao: descricao.trim()
    }

    try {
        await atualizarProduto(produto.id, produtoAtualizado)
        alert("Produto atualizado com sucesso!")
        return true
    } catch (erro){
        alert("Não foi possível atualizar. Verifique se o JSON Server está em execução.")
        return false
    }
}

// Usada somente neste arquivo, por isso não precisa de export.
async function atualizarProduto(id, produto){
    const response = await fetch(
        `http://localhost:3000/produtos/${encodeURIComponent(id)}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        }
    )

    if (!response.ok){
        throw new Error("Erro ao atualizar produto")
    }
}
