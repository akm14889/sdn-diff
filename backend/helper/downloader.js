import { ENV } from "../env.js";
import axios from 'axios';
import {promises as fs} from 'fs';
import { parseStringPromise } from "xml2js";
import pkg from "csvtojson";

const { Converter } = pkg;

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
        console.log("|    Downloading " + listSource + " sdn list  \u{2935} \u{2935}                                            |");
        printWait();
        let dataSource = ENV.DATA_SOURCE[listSource];
        const XML_Response = await axios.get(dataSource.URL);
        stopPrintWait();
        console.log("|    "+ listSource + " sdn list downloaded   \u{1F973} \u{1F973}                                          |");
        console.log("|    Parsing " + listSource + " sdn list      \u{1F687} \u{1F687}                                          |");
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
            await new Promise(resolve => setTimeout(resolve, 2000));
            stopPrintWait();
            console.log("|    " + listSource + " sdn list parsed       \u{1F973} \u{1F973}                                          |");
        } catch (exp) {
            stopPrintWait();
            console.log(exp);
            console.log("|    Error Parsing "+ listSource + " sdn list                                                    |");
            return false;
        }
    } catch (exp) {
        stopPrintWait();
        console.log(exp);
        return false;
    }
}

export async function parserCSV() {
    try {
        console.log("|    Parsing Pelican data     \u{1F687} \u{1F687}                                          |");
        let converter = new Converter({});
        let pelicanData = await converter.fromFile(ENV.PELICAN_FILE);
        console.log("|    Pelican data parsed      \u{1F973} \u{1F973}                                          |");
        await fs.writeFile( ENV.PARSED_PELICAN_FILE, JSON.stringify(pelicanData, null, 4), 'utf8');
    } catch (exp) {
        console.error(exp);
        console.error();
    }
}

