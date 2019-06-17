var CONFIG = {
    
    //开发环境
    DEVELOPMENT: {
        HOST: '127.0.0.1',
        PORT: 8888,
        DB: {
            user: 'admin',
            password: '123456',
            server: '70YA1G4TYULFOD0',
            port: 11433,
            database: 'test',
            options: {
                encrypt: false
            }
        }
    },

    //生产环境
    PRODUCTION: {
        HOST: '127.0.0.1',
        PORT: 8888,
        DB: {
            user: 'analysis',
            password: 'Analysis',
            server: '10.159.10.183',
            port: 1433,
            database: 'test',
            options: {
                encrypt: false
            }
        }
    }
};

module.exports = CONFIG;