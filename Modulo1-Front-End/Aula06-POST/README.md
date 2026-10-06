# Aula 06 — Cadastro de produtos com POST

Esta aula continua a Aula 05, mantendo a busca por nome e a paginação.

## Executar

1. Abra um terminal na pasta `back-end`.
2. Execute `npm ci` e depois `npm start` (Node.js 22.12 ou superior).
3. Abra `index.html` com o Live Server do VS Code.
4. Preencha o formulário e clique em **Cadastrar produto**.

## Fluxo do cadastro

- O evento `submit` captura o envio do formulário.
- `preventDefault()` evita que a página seja recarregada.
- Os campos formam um objeto JavaScript; preço e estoque são convertidos em números.
- `cadastrarProduto(produto)`, em `js/cadastroProduto.js`, envia uma requisição `POST /produtos`.
- `Content-Type: application/json` informa o formato dos dados.
- `JSON.stringify(produto)` transforma o objeto em JSON.
- O JSON Server gera o ID e grava o produto em `back-end/db.json`.
- Após o sucesso, o formulário e a busca são limpos e a listagem é atualizada.

Nome, categoria, preço e estoque são obrigatórios. Descrição é opcional. O botão fica desabilitado enquanto o cadastro está em andamento.

Os botões de editar e excluir permanecem como parte da interface para aulas futuras.

## Organização dos arquivos

- `js/api.js`: requisição GET para busca e paginação.
- `js/consultasAPI.js`: exibição dos produtos e atualização da lista.
- `js/cadastroProduto.js`: método POST, leitura do formulário e mensagens de cadastro.
