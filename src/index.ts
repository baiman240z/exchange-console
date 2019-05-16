import fs from 'fs';
import admin from 'firebase-admin';
import https from "https";
import url from "url";
import YAML from "yaml";

const configDir = __dirname + '/../config';
const yamlString = fs.readFileSync(`${configDir}/application.yaml`, 'utf8');
const config = YAML.parse(yamlString);

admin.initializeApp({
    credential: admin.credential.cert(require(`${configDir}/sdk.json`)),
    databaseURL: config['fb-databaseURL']
});

function sendMessage(rates: any[], code: String): void {
    let rate: any = {};
    for (let val of rates) {
        if (val['currencyPairCode'] == code) {
            rate = val;
            break;
        }
    }

    let message = {
        notification: {
            title: `${code.substr(0, 3)} -> ${code.substr(3)}`,
            body: `bid:${rate['bid']} ask:${rate['ask']}`
        },
        data: {
            url: '/rates',
            click_action: "FLUTTER_NOTIFICATION_CLICK"
        },
        topic: `${code}`
    };

    admin.messaging().send(message).then((response) => {
        console.log('Successfully sent message:', response);
        process.exit(0);
    }).catch((error) => {
        console.log('Error sending message:', error);
        process.exit(0);
    });
}

let options = url.parse(config['rate-url']);
let req = https.request(options, (response) => {
    response.setEncoding('utf8');
    let responseBody = '';
    response.on('data', (chunk) => {
        responseBody += chunk;
    });
    response.on('end', () => {
        let decoded = JSON.parse(responseBody);
        sendMessage(decoded['quotes'], 'USDJPY');
    });
});

req.end();
