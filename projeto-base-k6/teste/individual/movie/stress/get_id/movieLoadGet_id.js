import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import {BaseChecks, BaseRest, BaseService, ENDPOINTS, testeConfig} from '../../../../../support/base/baseTest.js'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const base_uri = testeConfig.environments.hml.url;
const baseRest = new BaseRest(base_uri);
const baseChecks = new BaseChecks();

const data_movies = new SharedArray('movie', function () {
    const jsonData = JSON.parse(open('../../../../../../projeto-base-k6/data/dynamic/movie.json'));
    return jsonData; // must be an array
});

export const options = testeConfig.options.Stresshresholds;

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
}
let array_id = []
export function setup (){
    const res = (baseRest.get(ENDPOINTS.MOVIES));

    const jsonData = JSON.parse(res.body);
    const idsArray = jsonData.map(item => item._id);

    return {idsArray}
}

export default () => {
    
    const {idsArray} = setup();

    const randomID = randomItem(idsArray);
    //console.log(randomID);

    const res = baseRest.get(ENDPOINTS.MOVIES + "/" + `${randomID}`);
    // console.log(res.status);

    baseChecks.checkStatusCode(res, 200);
    baseChecks.checkResponseTime(res, 2000);

    sleep(1);
}