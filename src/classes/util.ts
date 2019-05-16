export class Util {
    static async sleep(sec: number) {
        await this._sleep(sec);
    }

    private static async _sleep(sec: number) {
        return new Promise(
            resolve => {
                setTimeout(resolve, sec * 1000);
            }
        );
    }
}
