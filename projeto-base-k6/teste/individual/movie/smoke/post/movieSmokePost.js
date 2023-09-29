import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import {BaseChecks, BaseRest, BaseService, ENDPOINTS, testeConfig} from '../../../../../support/base/baseTest.js'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';


const base_uri = testeConfig.environments.hml.url;
const baseRest = new BaseRest(base_uri);
const baseChecks = new BaseChecks();

export const options = testeConfig.options.SmokeThresholds;

const data_movies = new SharedArray('movie', function () {
    const jsonData = JSON.parse(open('../../../../../../projeto-base-k6/data/dynamic/movie.json'));
    return jsonData; // must be an array
});

let movies_array = []
export function setup(){
  data_movies.forEach(movies =>{
    //console.log(__VU + " \n")
    //console.log("Criando um novo movie: ", movies);
    movies_array.push(movies);
  });
  return {movies_array}
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export default function () {

  const {movies_array} = setup();

  const randomMovie = randomItem(movies_array);

  //console.log(randomMovie)

  const res = baseRest.post(ENDPOINTS.MOVIES, randomMovie, { monitor: false , 'Content-Type': 'application/json' });
       
  console.log(res);

  baseChecks.checkStatusCode(res, 201);
  baseChecks.checkResponseTime(res, 300);

  sleep(1);
}