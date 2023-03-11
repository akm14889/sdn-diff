import { ENV } from "../env.js";
import axios from 'axios';
import {promises as fs} from 'fs';
import { parseStringPromise } from "xml2js";

const spinner = ['|', '/', '-', '\\'];
let interval = "";

/**
 * Show wait animation
 */
function printWait() {
    let i = 0;
    interval = setInterval(() => {
        process.stdout.write(`\r${spinner[i++ % spinner.length]}`);
    }, 100);
}

/**
 * Stop wait animation
 */
function stopPrintWait() {
    clearInterval(interval);
    interval = "";
    process.stdout.write('\r\r');
}

/**
 *
 * @param listSource {string}
 * @returns {Promise<boolean>}
 */
export async function saveAndParseList(listSource) {
    try {
        console.log("|    Downloading " + listSource + " sdn list  \u{2935} \u{2935}    |");
        printWait();
        let dataSource = ENV.DATA_SOURCE[listSource];
        const XML_Response = await axios.get(dataSource.URL);
        stopPrintWait();
        console.log("|    "+ listSource + " sdn list downloaded   \u{1F942}\u{1F942}   |");
        console.log("|    Parsing " + listSource + " sdn list      \u{1F684}\u{1F684}   |");
        printWait();
        /**
        * Write XML file for test
        */
        //await fs.writeFile( "./data/" + listSource + "_LIST.xml", XML_Response.data)
        try {
            let result = await parseStringPromise(XML_Response.data, {
                trim: true,
                explicitArray: false,
                ignoreAttrs: false
            });
            await fs.writeFile( dataSource.FILE, JSON.stringify(result, null, 4), 'utf8');
            stopPrintWait();
            console.log("|    " + listSource + " sdn list parsed       \u{1F942}\u{1F942}   |");
        } catch (exp) {
            stopPrintWait();
            console.log(exp);
            console.log("|    Error Parsing "+ listSource + " sdn list       |");
            return false;
        }
    } catch (exp) {
        stopPrintWait();
        console.log(exp);
        return false;
    }
}

