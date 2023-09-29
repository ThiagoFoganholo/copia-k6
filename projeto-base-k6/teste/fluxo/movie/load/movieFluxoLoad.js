import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { BaseChecks, BaseRest, BaseService, ENDPOINTS, testeConfig } from '../../../../support/base/baseTest.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const base_uri = testeConfig.environments.hml.url;
const baseRest = new BaseRest(base_uri);
const baseChecks = new BaseChecks();

export const options = testeConfig.options.LoadThresholds;

const data_movies = new SharedArray('movie', function () {
    const jsonData = JSON.parse(open('../../../../../projeto-base-k6/data/dynamic/movie.json'));
    return jsonData; // must be an array
});

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
    };
}
function arraysIgual(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}

let responseData = [];
export function setup() {
    data_movies.forEach((movies) => {
        responseData.push(movies);
    });
    return { responseData };
}

export default function () {
     const {responseData} = setup();
    let movies_cadastrados = [];

    const randomMovie = randomItem(responseData);
    movies_cadastrados.push(randomMovie);

    // POST - CADASTRAR MOVIE
    
    const responsePostMovie = baseRest.post(ENDPOINTS.MOVIES, randomMovie, { monitor: false , 'Content-Type': 'application/json' });
    
    baseChecks.checkStatusCode(responsePostMovie, 201);
    baseChecks.checkResponseTime(responsePostMovie, 3000);

    const resGet = baseRest.get(ENDPOINTS.MOVIES);
    const responseBody = JSON.parse(resGet.body);

    let movieID = [];
    
    //Verifica os movies que foram cadastrados e armazena os seus respectivos id
    for (const cadastrado of movies_cadastrados) {
        for (const responseMovie of responseBody) {
            if (
                cadastrado.title === responseMovie.title &&
                cadastrado.description === responseMovie.description &&
                cadastrado.launchdate === responseMovie.launchdate &&
                arraysIgual(cadastrado.showtimes, responseMovie.showtimes)
                ){
                    movieID.push(responseMovie._id);
                }
        }
    }

    // PUT - Altera os campos title, description, launchdate e showtimes

    const randomId = randomItem(movieID);

    const payloadPutMovie = {
        title: "Title Modficicado",
        description:"Description Modficicado",
        launchdate: "launchdate Modficicado",
        showtimes: [" showtimes modificado"]
    }

    const responsePutMovie = baseRest.put(ENDPOINTS.MOVIES + "/" + `${randomId}`, payloadPutMovie, { monitor: false , 'Content-Type': 'application/json' });    
    baseChecks.checkStatusCode(responsePutMovie, 200);
    baseChecks.checkResponseTime(responsePutMovie, 3000);

    sleep(1); 
    return{movieID}
    
}

export function teardown(){

    //DEL - Deletar todos os movies cadastrados

    const {responseData} = setup();
    let movieID = [];
    //console.log(responseData);

    const resGet = baseRest.get(ENDPOINTS.MOVIES);
    const responseBodyGetMovies = JSON.parse(resGet.body);

    for (const cadastrado of responseData) {
        for (const responseMovie of responseBodyGetMovies) {
            if (
                cadastrado.title === responseMovie.title &&
                cadastrado.description === responseMovie.description &&
                cadastrado.launchdate === responseMovie.launchdate &&
                arraysIgual(cadastrado.showtimes, responseMovie.showtimes)
                ){
                    //console.log(responseMovie._id)
                    movieID.push(responseMovie._id);
                }
                if(
                    responseMovie.title === 'Title Modficicado' &&
                    responseMovie.description === 'Description Modficicado' &&
                    responseMovie.launchdate === 'launchdate Modficicado'
                ){
                    movieID.push(responseMovie._id);
                }
        }
    }
    const arrayMoviesIDSemRepeticoes = [];
    movieID.forEach((id) => {
        if (!arrayMoviesIDSemRepeticoes.includes(id)) {
          arrayMoviesIDSemRepeticoes.push(id);
        }
      });
    //console.log(arrayMoviesIDSemRepeticoes)
    
    arrayMoviesIDSemRepeticoes.forEach(id =>{
        //console.log(id)
        const resDelMovie = baseRest.delete(ENDPOINTS.MOVIES + `/${id}`);
    })
    //.log(responseBody)
    
}