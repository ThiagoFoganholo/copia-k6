import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import {BaseChecks, BaseRest, BaseService, ENDPOINTS, testeConfig} from '../../../../../support/base/baseTest.js'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const base_uri = testeConfig.environments.hml.url;
const baseRest = new BaseRest(base_uri);
const baseChecks = new BaseChecks();

export const options = testeConfig.options.LoadThresholds;

const data_movies = new SharedArray('movies', function () {
    const jsonData = JSON.parse(open('../../../../../../projeto-base-k6/data/dynamic/movie.json'));
    return jsonData; // must be an array
});

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
let movies_array = []
export function setup(){
  data_movies.forEach(movies =>{
    //console.log(__VU + " \n")
    //console.log("Criando um novo movie: ", movies);
    movies_array.push(movies)
  });
  return {movies_array}
}

export default function () {
  let movieArrayID = [];
  const {movies_array} = setup();
  const resGetMovie = baseRest.get(ENDPOINTS.MOVIES);

  const jsonData = JSON.parse(resGetMovie.body);
  const id_array = jsonData.map(item => item._id);  

  const randomId = randomItem(id_array);
  const random_payload_movie = randomItem(movies_array);
  // console.log(randomId);
  // console.log(rando_payload_movie);

  const res = baseRest.put(ENDPOINTS.MOVIES + "/" + `${randomId}`, random_payload_movie, { monitor: false , 'Content-Type': 'application/json' });

  //console.log(res.json())
  baseChecks.checkStatusCode(res, 200);
  baseChecks.checkResponseTime(res, 2000);

  sleep(1);
}