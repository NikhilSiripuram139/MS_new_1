const fs = require('fs');

const config = {
    myurl: process.env.myurl,
    api: process.env.api,
    CLIENT_ID: process.env.CLIENT_ID,
    OBJECT_ID: process.env.OBJECT_ID,
    TENANT_ID: process.env.TENANT_ID,
    REDIRECT_URI: process.env.REDIRECT_URI,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_SECRET_ID: process.env.CLIENT_SECRET_ID
};

fs.writeFileSync('./src/assets/config.json', JSON.stringify(config));
console.log('config.json has been generated with environment variables.');