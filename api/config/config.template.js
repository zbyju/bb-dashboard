const config = {
    database: {
        host: "IP-ADDRESS",
        port: "27017",
        name: "bb-dashboard-v2",
        options: {
            authSource: "NAME",
            auth: {
                user: "NAME",
                password: "PASSWORD"
            },
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }
    },
    port: 3000,
    jwt: {
        secret: "SECRET",
        options: {
            //expiresIn: "7d"
        }
    },
    storage: {
        path: "../frontend/src/assets/uploads"
    },
    email: {
        smtp: "SMTP-ADDRESS",
        port: 465,
        user: "EMAIL TO USE",
        password: "PASSWORD"
    }
}

module.exports = config;
