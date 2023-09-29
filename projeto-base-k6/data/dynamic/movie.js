const { faker } = require('@faker-js/faker');
const fs = require('fs');

faker.location = 'pt_BR';

let quantidadeDeUsuarios = process.argv[2] || 1;
let movies = [];

for (let index = 0; index < quantidadeDeUsuarios; index++) {
    let numeroAleatorio = Math.floor(Math.random() * 101);
    movies.push({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        launchdate : faker.date.anytime(),
        showtimes: [
                    faker.date.anytime()
                   ]
    });
}

// Converta o array de usuários para JSON
const usersJSON = JSON.stringify(movies, null, 2);

// Escreva os dados no arquivo JSON
fs.writeFileSync('movie.json', usersJSON);

console.log('Dados de usuários foram salvos em movie.json');
