
const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;
    pokemon.types = pokeDetail.types.map(typeSlot => typeSlot.type.name);
    pokemon.type = pokemon.types[0];
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    // Infomação do status
    const stats = pokeDetail.stats;
    pokemon.hp = stats.find(stat => stat.stat.name === 'hp').base_stat;
    pokemon.attack = stats.find(stat => stat.stat.name === 'attack').base_stat;
    pokemon.defense = stats.find(stat => stat.stat.name === 'defense').base_stat;
    pokemon.specialAttack = stats.find(stat => stat.stat.name === 'special-attack').base_stat;
    pokemon.specialDefense = stats.find(stat => stat.stat.name === 'special-defense').base_stat;
    pokemon.speed = stats.find(stat => stat.stat.name === 'speed').base_stat;

    return pokemon;
}



// Função para obter detalhes de um Pokémon específico
pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then(response => response.json())
        .then(convertPokeApiDetailToPokemon);
};

// Função para obter uma lista de Pokémons
pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    return fetch(url)
        .then(response => response.json())
        .then(jsonBody => jsonBody.results)
        .then(pokemons => pokemons.map(pokeApi.getPokemonDetail))
        .then(detailRequests => Promise.all(detailRequests));
};

// Função para buscar detalhes de Pokémon pelo ID
function fetchPokemonDetails(pokemonId) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(pokemonData => {
            displayPokemonDetails(pokemonData);
        })
        .catch(error => {
            console.error('Fetching Pokemon details failed:', error);
        });
}



// Função CSS da nova pagina
function displayPokemonDetails(pokemonData) {
    const newWindow = window.open('', '_blank');


    const styles = `
                <style>
                body, html {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    font-family: 'Arial', sans-serif;
                    background-color: #e77272;
                    color: #333;
                }

                .pokemon-details {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    text-align: center;
                    padding: 20px;
                    font-size: 50px;
                    text-transform: uppercase;
                }
                

                img {
                    width: 50vw;
                    max-width: 600px;
                    height: auto;
                    border-radius: 50%;
                    margin-bottom: 1100px;
                    z-index: 2;
                }

                .status-container {
                    background-color: white;
                    padding: 15% 10 10% 10;
                    border-radius: 49px;
                    box-shadow: 14px 14px 8px 9px rgba(0, 0, 0, 0.2);
                    width: 90%;
                    font-size: 50px;
                    max-width: 667px;
                    margin: auto;
                    position: absolute;
                    z-index: 1;
                }

                .status-item {
                    margin-bottom: 10px;
                    text-align-last: justify;
                    padding: 0 20px 0 20px;
                }

                .status-label {
                    font-weight: bold;
                    color: #000000;
                }

                /* Media query para telas menores (dispositivos móveis) */
                @media (max-width: 600px) {
                    img {
                        width: 70vw; 
                    }

                    .status-container {
                        width: 100%; 
                    }
                }
            </style>



    `;

    newWindow.document.write(styles);
    newWindow.document.write(`
        <div class="pokemon-details">
            <h1>${pokemonData.name}</h1>
            <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
            <div class="status-container">
    `);

    pokemonData.stats.forEach(stat => {
        newWindow.document.write(`
            <div class="status-item">
                <span class="status-label">${stat.stat.name.toUpperCase()}: </span>
                <span>${stat.base_stat}</span>
            </div>
        `);
    });

    newWindow.document.write('</div></div>');
    newWindow.document.close();
}
