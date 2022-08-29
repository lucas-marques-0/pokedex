const nomePokemon = document.querySelector(".pokemon_nome");
const numeroPokemon = document.querySelector(".pokemon_numero");
const imagemPokemon = document.querySelector(".pokemon_imagem");
const formulario = document.querySelector(".formulario");
const pesquisa = document.querySelector(".pesquisar");
const botaoPrev = document.querySelector(".botao_anterior");
const botaoNext = document.querySelector(".botao_proximo");
let pesquisarPokemon = 1;

// Função para buscar o pokemon da API ---> vamos criar uma função asincrona (async) que vai esperar (await) o fetch pegar o dado dinâmico (resposta) da API...
const buscarPokemon = async (pokemon) => {
    // precisamos colocar o wait pois o "fetch" é assincrono, não sabemos quanto tempo vai levar para retornar os dados (é só uma "promessa" (promise))...
    const respostaAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    // a url que está dentro do fetch é a "url base" da API que estamos usando, (e devemos colocar qual o pokemon desejado no local certo da url)...


    // quando digitamos um valor referente a um pokemon que exista percebemos (no console) que ele retorna um "status = 200" caso contrário retorna "status = 404", podemos usar isso para nossa verificação...
    if(respostaAPI.status === 200){     
        // para ter acessa as infos/dados do pokemon, precisamos extrair os dados em JSON da resposta/elemento da API (obs: a função "json()" também é assincrona, ela leva um tempo até ser executada, então precisamos aguardar até terminar (por isso o uso do "await" novamente))...
        const dados = await respostaAPI.json();
        return dados;
    }
}

const renderizarPokemon = async (pokemon) => {

    nomePokemon.innerHTML = "Loading..."; // adicionando uma mensagem enquanto os dados não são gerados (sendo eles existindo ou não).

    const dados = await buscarPokemon(pokemon);

    // se o nome/numero que pesquisarmos não existir, esse "dados" vai ser undifined (indefinido), então para evitar erros, nós só vamos mostrar algo se esse algo existir.
    if(dados){ // se tiver os dados vai fazer isso...
        imagemPokemon.style.display = "block";
        nomePokemon.innerHTML = dados.name;
        numeroPokemon.innerHTML = dados.id;
    
        // podemos percorrer um json de uma API usando o "." ou pela forma abaixo, para evitar problemas de entendimento (como o "-v" de "generation-v" por exemplo) ---> então sempre que der algum erro pelo ponto devemos usar desta maneira...
        imagemPokemon.src = dados['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];

        // para que os botões iniciem do id atual do pokemon pesquisado...
        pesquisarPokemon = dados.id;
    } else { // se não tiver vai fazer isso...
        imagemPokemon.style.display = "none";
        nomePokemon.innerHTML = "Not Found :c";
        numeroPokemon.innerHTML = "";
    }
}

// quando o formulario for enviado, executa a função
formulario.addEventListener("submit", (event) => {
    event.preventDefault(); // por ser um formulário precisamos bloquear seu compartamento padrão, para ser resetado a cada pesquisa.

    renderizarPokemon(pesquisa.value.toLowerCase()); // adicionamos a função "toLowerCase()" pois a API só entende o nome do pokemon em minúsculo, assim corrigindo se o usuário contrariar isso...

    pesquisa.value = ""; // limpar o que foi digitado automaticamente
}); 

botaoPrev.addEventListener("click", () => {
    if(pesquisarPokemon > 1){
        pesquisarPokemon -= 1;
        renderizarPokemon(pesquisarPokemon);
    }
});

botaoNext.addEventListener("click", () => {
    pesquisarPokemon += 1;
    renderizarPokemon(pesquisarPokemon);
});

// adicionando o primeiro pokemos para que quendo entrarmos no site mão ficar sem nada
renderizarPokemon(pesquisarPokemon);

// CONSIDEREÇÕES: Nesse projeto vi em prática o uso de uma API, e percebi que usamos os elementos dessa API para formular a lógica do nosso código (como a verificação da resposta ser o "status = 200" ou "status = 404"), como programador devo ficar atento a esses detalhes para construir o código com a API ao meu favor. (obs: toda API é diferente, então a url base e os elementos vão mudar completamente -> por isso é importante ler a documentaão e acessar o site com as informações referentes a API que queremos usar).
