import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import {BaseChecks, BaseRest, BaseService, ENDPOINTS, testeConfig} from '../../../../../support/base/baseTest.js'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const base_uri = testeConfig.environments.hml.url;
const baseRest = new BaseRest(base_uri);
const baseChecks = new BaseChecks();

export const options = testeConfig.options.SmokeThresholds;

const data_tickets = new SharedArray('tickets', function () {
    const jsonData = JSON.parse(open('../../../../../../../k6/projeto-base-k6/data/dynamic/tickets.json'));
    return jsonData; // must be an array
});

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
let tickets_array = []
export function setup(){
  data_tickets.forEach(tickets =>{
    //console.log(__VU + " \n")
    //console.log("Criando um novo movie: ", tickets);
    tickets_array.push(tickets);
  });
  return {tickets_array}
}

export default function () {

  const {tickets_array} = setup();

  const randomTickets = randomItem(tickets_array);

  //console.log(randomTickets);

  const res = baseRest.post(ENDPOINTS.TICKETS, randomTickets, { monitor: false , 'Content-Type': 'application/json' });
        
  baseChecks.checkStatusCode(res, 201);
  baseChecks.checkResponseTime(res, 300);
}