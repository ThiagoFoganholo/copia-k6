import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import {BaseChecks, BaseRest, BaseService, ENDPOINTS, testeConfig} from '../../../../../../k6/projeto-base-k6/support/base/baseTest.js'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const base_uri = testeConfig.environments.hml.url;
const baseRest = new BaseRest(base_uri);
const baseChecks = new BaseChecks();

export const options = testeConfig.options.SmokeThresholds;

const data_tickets = new SharedArray('tickets', function () {
    const jsonData = JSON.parse(open('../../../../../../k6/projeto-base-k6/data/dynamic/tickets.json'));
    return jsonData; // must be an array
});

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
    };
}

export function setup() {

    //POST - CRIAR TICKETS
    let responseData = []

    data_tickets.forEach(tickets =>{
        //console.log("Criando um movie", tickets);
        const res = baseRest.post(ENDPOINTS.TICKETS,tickets);
        baseChecks.checkStatusCode(res, 201);

        responseData.push(res.json());
    });

    return { responseData }
}

export default function () {

    const { responseData } = setup()

    // GET - LISTAR TICKETS

    const res = baseRest.post(ENDPOINTS.TICKETS,tickets);
    baseChecks.checkStatusCode(res, 200);

    //PUT - ALTERAR TICKETS

    const payload_modifica_tickets = {
        userId: "userId modificado",
        seatNumber: 0,
        price: 0,
        showtime: "0",
    }

    const randomTicket = randomItem(responseData);
    
    const resPut = baseRest.put(ENDPOINTS.TICKETS + "/" + `${randomTicket}`, payload_modifica_tickets, { monitor: false , 'Content-Type': 'application/json' });
    baseChecks.checkStatusCode(resPut, 200);

    sleep(1);
}

export function teardown(responseData) {

    // DELETE - DELETAR TICKETS

    const ids = responseData.responseData.map(item => item._id);
    ids.forEach(id =>{
        //console.log(`TearDowns deletando o id : ${id}`)
        const res = baseRest.delete(ENDPOINTS.TICKETS + `/${id}`)
        baseChecks.checkStatusCode(res, 200);
    })
    console.log(id)
}