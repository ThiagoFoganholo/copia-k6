export const testeConfig = {

    environments: {
        hml: {
            url: "http://localhost:3000",
            urlEC2: "http://3.234.254.252:3000"
        }
    },
    options: {
        SmokeThresholds: {
            vus: 1, // Key for Smoke test. Keep it at 2, 3, max 5 VUs
            duration: '1s', // This can be shorter or just a few iterations
            thresholds: {
                http_req_duration: ['p(95) < 2000'],
                http_req_failed : ['rate < 0.01']
            }
        },

        LoadThresholds: {
            vus: 30, // Key for Smoke test. Keep it at 2, 3, max 5 VUs
            duration: '1s', // This can be shorter or just a few iterations
            thresholds: {
                http_req_duration: ['p(95) < 2000'],
                http_req_failed : ['rate < 0.01']
            }
        },
        
        Stresshresholds: {
            vus: 100, // Key for Smoke test. Keep it at 2, 3, max 5 VUs
            duration: '1s', // This can be shorter or just a few iterations

            thresholds: {
                http_req_duration: ['p(95) < 2000'],
                http_req_failed : ['rate < 0.01']
            }
        },
    }
}