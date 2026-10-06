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

O botão Excluir solicita confirmação e envia DELETE. O botão Editar permanece para uma aula futura.

## Organização dos arquivos

- `js/api.js`: requisição GET para busca e paginação.
- `js/consultasAPI.js`: exibição dos produtos e atualização da lista.
- `js/cadastroProduto.js`: método POST, leitura do formulário e mensagens de cadastro.

Todo o cadastro fica em `cadastroProduto.js`: validação, leitura dos campos, função POST e tratamento do envio. `cadastrarProduto()` não usa `export`, pois é chamada nesse mesmo arquivo. A listagem permanece separada em `consultasAPI.js`; somente `atualizarListaAposCadastro()` é exportada e importada pelo cadastro para atualizar a tabela após o POST.

## Exclusão com DELETE

- `js/excluirProduto.js`: confirmação, requisição `DELETE /produtos/{id}` e mensagens.
- `consultasAPI.js` importa a função e conecta o botão Excluir ao ID do produto.
- Após excluir, a tabela volta à primeira página mantendo a busca. Isso evita ficar em uma última página que deixou de existir.
- Durante a operação, o botão fica desabilitado. Ao cancelar ou ocorrer erro, a listagem não é atualizada.
- Não é necessário adicionar outra tag script ao HTML: o módulo é carregado pelo import.
