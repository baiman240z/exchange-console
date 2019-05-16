import admin from 'firebase-admin';
import {RateSender} from "./classes/rate-sender";
import {Util} from "./classes/util";


const configDir = __dirname + '/../config';
const config = Util.config();

admin.initializeApp({
    credential: admin.credential.cert(require(`${configDir}/sdk.json`)),
    databaseURL: config['fb-databaseURL']
});

async function sendMessage(code: string) {
    let sender: RateSender = new RateSender();
    let rate: any = await sender.rate(code);

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

const code = 'USDJPY';
sendMessage(code);
