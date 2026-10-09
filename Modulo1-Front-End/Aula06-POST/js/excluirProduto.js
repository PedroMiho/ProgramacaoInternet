export async function excluirProduto(id){
    
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        
        buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
        title: "Você tem certeza que deseja excluir",
        text: "Você tem certeza, essa ação é irreversível",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, quero remover",
        cancelButtonText: "Não, cancelar",
        reverseButtons: true
        }).then((result) => {
        if (result.isConfirmed) swalWithBootstrapButtons.fire({
            title: "Removido!",
            text: "Produto removido",
            icon: "success"
        });
        else if (result.dismiss === Swal.DismissReason.cancel){

            /* Read more about handling dismissals below */
            swalWithBootstrapButtons.fire({
                title: "Remoção cancelada",
                text: "Produto não foi removido",
                icon: "error"
            });
            return false
        }
    });
    
    try{
        const response = await fetch(`http://localhost:3000/produtos/${encodeURIComponent(id)}` , {
            method :"DELETE"
        })

        if (!response.ok){
            throw new Error("Erro ao excluir produto")
        }

        alert("Produto excluído com sucesso")
        return true
    } catch (erro){
        alert("Servidor desligado")
        return false
    }
}