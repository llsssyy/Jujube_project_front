export const SERVER_URL = {
    DEV_URL: () => { // 개발용
        return 'http://localhost:3001'
    },
    PORD_URL: () => { // 배포용
        return 'http://3.39.103.84:3001'
    },
}