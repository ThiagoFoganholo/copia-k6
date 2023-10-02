import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import {BaseChecks, BaseRest, BaseService, ENDPOINTS, testeConfig} from '../../../../../support/base/baseTest.js'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const base_uri = testeConfig.environments.hml.url;
const baseRest = new BaseRest(base_uri);
const baseChecks = new BaseChecks();

const data_movies = new SharedArray('movie', function () {
    const jsonData = JSON.parse(open('../../../../../../projeto-base-k6/data/dynamic/movie.json'));
    return jsonData; // must be an array
});

export const options = testeConfig.options.LoadThresholds;

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
}
export default () => {

    const maxPerPage = 20;
    const res = baseRest.get(ENDPOINTS.MOVIES + `?page=1&pageSize=${maxPerPage}`);
    console.log(JSON.stringify(res.body,2,null));
    //console.log(res.status_text);

    baseChecks.checkStatusCode(res, 200);
    baseChecks.checkResponseTime(res, 100);

    sleep(1);
}