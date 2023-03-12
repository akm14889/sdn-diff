import { promises as fs,createReadStream, createWriteStream } from 'fs';
import { ENV } from "../env.js"
import { GetFullName } from "./matchIndividual.js";
import { Transform } from '@json2csv/node';


const spinner = ['|', '/', '-', '\\'];
let interval = "";
const diffData = [];

export async function compileOutput() {
    console.log("|    Generating the diff                  \u{1F973} \u{1F973}                              |");
    printWait();
    await transformAndGetUkDiff();
    await transformAndGetUsDiff();
    await transformAndGetUnDiff();
    await transformAndGetEuDiff();
    await fs.writeFile( ENV.OUTPUT_FILE_JSON, JSON.stringify(diffData, null, 4), 'utf8');
    await new Promise(resolve => setTimeout(resolve, 1000));
    stopPrintWait();
    const input = createReadStream(ENV.OUTPUT_FILE_JSON, { encoding: 'utf8' });
    const output = createWriteStream(ENV.OUTPUT_FILE_CSV, { encoding: 'utf8' });
    const parser = new Transform();
    const processor = input.pipe(parser).pipe(output);
    // parser
    //     .on('header', (header) => console.log(header))
    //     .on('line', (line) => console.log(line));
    console.log("|    Total Diff       "+ diffData.length + "                \u{1F4D6} \u{1F4D6}                              |");
    console.log("|    Output Generated at : " + ENV.OUTPUT_FILE_CSV + "         \u{1F4BE} \u{1F4BE}                              |");
}

async function transformAndGetUkDiff() {
    let ukDiff = await fs.readFile(ENV.DATA_SOURCE.UK.DIFF_FILE, "utf8");
    ukDiff = JSON.parse(ukDiff);
    for (const sanctionedPerson of ukDiff) {
        let personToAdd = null;
        if (sanctionedPerson.Names && sanctionedPerson.Names.Name) {
            personToAdd = {};
            /**
             * Add DateAdded
             */
            personToAdd.DateAdded = sanctionedPerson.DateDesignated;
            /**
             * Add Name
             */
            let nameInUkList = "";
            if (Array.isArray(sanctionedPerson.Names.Name)) {
                for (const sanctionedPersonName of sanctionedPerson.Names.Name) {
                    if (sanctionedPersonName.NameType.toLowerCase() == "primary name") {
                        nameInUkList = GetFullName(nameInUkList, sanctionedPersonName);
                        personToAdd.Name = nameInUkList;
                        break;
                    }
                }
            } else {
                if (sanctionedPerson.Names.Name.NameType.toLowerCase() == "primary name") {
                    nameInUkList = GetFullName(nameInUkList, sanctionedPerson.Names.Name);
                    personToAdd.Name = nameInUkList;
                }
            }
            /**
             * Add DOB
             */
            personToAdd.DOB = "";
            if (sanctionedPerson.IndividualDetails &&
                sanctionedPerson.IndividualDetails.Individual &&
                sanctionedPerson.IndividualDetails.Individual.DOBs &&
                sanctionedPerson.IndividualDetails.Individual.DOBs.DOB) {
                if (Array.isArray(sanctionedPerson.IndividualDetails.Individual.DOBs.DOB)) {
                    let dobs = "";
                    for (const eachDoB of sanctionedPerson.IndividualDetails.Individual.DOBs.DOB) {
                        if (dobs) {
                            dobs += " | " + eachDoB;
                        } else {
                            dobs += eachDoB;
                        }
                    }
                    personToAdd.DOB = dobs;
                } else {
                    personToAdd.DOB = sanctionedPerson.IndividualDetails.Individual.DOBs.DOB;
                }

            }
        }
        if (personToAdd) {
            diffData.push(personToAdd);
        }
    }
}

async function transformAndGetUsDiff() {
    let usDiff = await fs.readFile(ENV.DATA_SOURCE.US.DIFF_FILE, "utf8");

}

async function transformAndGetUnDiff() {
    let unDiff = await fs.readFile(ENV.DATA_SOURCE.UN.DIFF_FILE, "utf8");
}

async function transformAndGetEuDiff() {
    let euDiff = await fs.readFile(ENV.DATA_SOURCE.EU.DIFF_FILE, "utf8");
}


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
