const { faker } = require('@faker-js/faker');
const fs = require('fs');

faker.location = 'pt_BR';

let tickets = [];
let quantidadeTickets = process.argv[2] || 1;

for (let index = 0; index < quantidadeTickets; index++) {
    tickets.push({
        movieId: faker.commerce.productName(),
        userId: faker.person.fullName(),
        seatNumber: faker.number.int(99),
        price: faker.number.int(60),
        showtime: faker.date.anytime()
    });
}

// Converta o array de usuários para JSON
const usersJSON = JSON.stringify(tickets, null, 2);

// Escreva os dados no arquivo JSON
fs.writeFileSync('tickets.json', usersJSON);

console.log('Dados de usuários foram salvos em tickets.json');
