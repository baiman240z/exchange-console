import {RateSender} from "./classes/rate-sender";

const code = 'USDJPY';
const sender: RateSender = new RateSender();

sender.send(code).then((result) => {
    console.log(result);
    process.exit(0);
});
