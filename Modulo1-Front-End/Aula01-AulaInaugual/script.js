// Variáveis no JS
// var x let 
// var - Escopo variável global
// let - Escopo variável local

// Constantes no JS
// const 

// Selecionando a partir da tag html
let paragrafo = document.getElementsByTagName("p")
console.log(paragrafo[0]);
paragrafo[0].innerHTML = "Texto alterado com sucesso"

// Selecionando a partir do id
let subtitulo = document.getElementById("subtitulo")
subtitulo.innerHTML = "Titulo alterado"

// Selecionando a partir da classe
let umc = document.getElementsByClassName("umc")
console.log(umc)
umc[0].innerHTML = "Sucesso" 
umc[1].innerHTML = "Teste concluído"

// Selecionando a partir do name
let nome = document.getElementsByName("nome")
nome[0].placeholder = "Digite seu nome: "