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

export const options = testeConfig.options.Stresshresholds;

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
}
export default () => {

    const res = baseRest.get(ENDPOINTS.MOVIES);

    //console.log((res.json())[usersIndex]._id);

    baseChecks.checkStatusCode(res, 200);
    baseChecks.checkResponseTime(res, 2000);

    sleep(1);
}