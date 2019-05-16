import fs from "fs";
import YAML from "yaml";

export class Util {
    static async sleep(sec: number): Promise<void> {
        await this._sleep(sec);
    }

    private static async _sleep(sec: number): Promise<void> {
        return new Promise(
            resolve => {
                setTimeout(resolve, sec * 1000);
            }
        );
    }

    static config(name: string = 'application'): any {
        const configDir = __dirname + '/../../config';
        const yamlString = fs.readFileSync(`${configDir}/${name}.yaml`, 'utf8');
        return YAML.parse(yamlString);
    }
}
