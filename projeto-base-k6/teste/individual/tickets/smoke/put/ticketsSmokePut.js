import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import {BaseChecks, BaseRest, BaseService, ENDPOINTS, testeConfig} from '../../../../../support/base/baseTest.js'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const base_uri = testeConfig.environments.hml.url;
const baseRest = new BaseRest(base_uri);
const baseChecks = new BaseChecks();

export const options = testeConfig.options.SmokeThresholds;

const data_tickets = new SharedArray('movies', function () {
    const jsonData = JSON.parse(open('../../../../../../projeto-base-k6/data/dynamic/tickets.json'));
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
    //console.log("Criando um novo tickets: ", tickets);
    tickets_array.push(tickets)
  });
  return {tickets_array}
}

export default function () {
  const {tickets_array} = setup();
  const resGetTickets = baseRest.get(ENDPOINTS.TICKETS);
  
  const jsonData = JSON.parse(resGetTickets.body);
  const idsArray = jsonData.map(item => item._id);

  // console.log(idsArray);

  const randomId = randomItem(idsArray);
  const random_payload_tickets = randomItem(tickets_array);
  // console.log(randomId);
  // console.log(random_payload_tickets);

  const res = baseRest.put(ENDPOINTS.TICKETS + "/" + `${randomId}`, random_payload_tickets, { monitor: false , 'Content-Type': 'application/json' });

  //console.log(res.json())
  baseChecks.checkStatusCode(res, 200);
  baseChecks.checkResponseTime(res, 2000);

  sleep(1);
}