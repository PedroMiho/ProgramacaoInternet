const nota1 = document.getElementById("nota1")
const nota2 = document.getElementsByClassName("nota2")[0]
const nota3 = document.querySelector("#nota3")

const botao = document.querySelector("#btnSomar")
const resultado = document.getElementsByTagName("p")[0]

botao.addEventListener("click" , () => {

    let valor1 = Number(nota1.value);
    let valor2 = Number(nota2.value)
    let valor3 = Number(nota3.value)

    console.log(valor1 , valor2 , valor3);
    

    let soma = valor1 + valor2 + valor3

    resultado.innerHTML = "Resultado: " + soma
})