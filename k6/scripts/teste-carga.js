import http from 'k6/http'
import { check, sleep } from 'k6'

// Configurações chave para o teste de carga
export const options = {
    stages: [
        // acesso de 500 usuários em 5s
        { duration: '5s', target: 500 },

        // platô de 500 usuários por 20s
        { duration: '20s', target: 500 },

        // redução para 0 usuários em 5s
        { duration: '5s', target: 0 }
    ],
    thresholds: {
        // gera erro caso as falhas de http forem maiores que 1%
        http_req_failed: ['rate<0.01'],

        // gera erro se mais de 95% das solicitações levarem mais de 20 segundos
        http_req_duration: ['p(95)<20000']
    }
}

export default function() {
    const response = http.get('http://test-carga_api:3000/pix/token/abc')
    check(response, { "status is ok": (r) => r.status === 200 })
    sleep(.300)
}
