import { promises as fs } from 'fs';
import { ENV } from "../env.js"


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

const oPelicanData = await fs.readFile(ENV.PARSED_PELICAN_FILE, "utf8");

export async function missingPersonInUKList() {
    console.log("|    Getting missing entity/person from UK list   \u{1F973} \u{1F973}                      |");
    printWait();
    let oUKSDNData = await fs.readFile(ENV.DATA_SOURCE.UK.FILE, "utf8");
    oUKSDNData = JSON.parse(oUKSDNData);
    const diffData = [];
    oUKSDNData = oUKSDNData && oUKSDNData.Designations && oUKSDNData.Designations.Designation;

    for (const oSanctionedPerson of oUKSDNData) {
        let personMissing = true;
        if (oSanctionedPerson.Names.Name && Array.isArray(oSanctionedPerson.Names.Name)) {
            if (personMissing === false) {
                break;
            }
            for (const oSanctionedPersonName of oSanctionedPerson.Names.Name) {
                if (personMissing === false) {
                    break;
                }
                if (oSanctionedPersonName.NameType.toLowerCase() === "primary name") {
                    let nameInUkList = oSanctionedPersonName.Name6 &&
                        oSanctionedPersonName.Name6.toLowerCase();
                    for(const oPerson of oPelicanData) {
                        const oPersonName = oPerson.Entity && oPerson.Entity.toLowerCase();
                        if (oPersonName && oPersonName.indexOf(nameInUkList) != -1) {
                            personMissing = false;
                            break;
                        }
                    }
                }
            }
        }
        else {
            /**
             * @todo find which name to pick picking Name6 for now
             */
            if (oSanctionedPerson.Names.Name.NameType && oSanctionedPerson.Names.Name.NameType.toLowerCase() === "primary name") {
                let nameInUkList = oSanctionedPerson.Names.Name &&
                    oSanctionedPerson.Names.Name.Name6 &&
                    oSanctionedPerson.Names.Name.Name6.toLowerCase();

                for(const oPerson of oPelicanData) {
                    const oPersonName = oPerson.Entity && oPerson.Entity.toLowerCase();
                    if (oPersonName && oPersonName.indexOf(nameInUkList) != -1) {
                        personMissing = false;
                        break;
                    }
                }
            }
        }
        if (personMissing) {
            diffData.push(oSanctionedPerson);
        }
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    stopPrintWait();
    console.log("|    Diff size:            " + diffData.length + "                   \u{1F4D6} \u{1F4D6}                      |");
    console.log("|    Full List size:       " + oUKSDNData.length + "                   \u{1F4D5} \u{1F4D5}                      |");
    const fileWritten = await fs.writeFile( ENV.DATA_SOURCE.UK.DIFF_FILE, JSON.stringify(diffData, null, 4), 'utf8');
    console.log("|    Saved missing entity/person from UK list     \u{1F4BE} \u{1F4BE}                      |");
}

export async function missingPersonInUsList() {
    console.log("|    Getting missing entity/person from US list   \u{1F973} \u{1F973}                      |");
    printWait();
    let oUSSDNData = await fs.readFile(ENV.DATA_SOURCE.US.FILE, "utf8");
    oUSSDNData = JSON.parse(oUSSDNData);
    const diffData = [];
    oUSSDNData = oUSSDNData &&
        oUSSDNData.sdnList &&
        oUSSDNData.sdnList.sdnEntry;

    for ( const oSanctionedPerson of oUSSDNData ) {
        let personMissing = true;
        let oSanctionedPersonName = oSanctionedPerson.lastName && oSanctionedPerson.lastName.toLowerCase();
        for(const oPerson of oPelicanData) {
            const oPersonName = oPerson.Entity && oPerson.Entity.toLowerCase();
            if (oPersonName && oPersonName.indexOf(oSanctionedPersonName) != -1) {
                personMissing = false;
                break;
            }
        }
        if (personMissing) {
            diffData.push(oSanctionedPerson);
        }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    stopPrintWait();
    console.log("|    Diff size:            " + diffData.length + "                  \u{1F4D6} \u{1F4D6}                      |");
    console.log("|    Full List size:       " + oUSSDNData.length + "                  \u{1F4D5} \u{1F4D5}                      |");
    const fileWritten = await fs.writeFile( ENV.DATA_SOURCE.US.DIFF_FILE, JSON.stringify(diffData, null, 4), 'utf8');
    console.log("|    Saved missing entity/person from UK list     \u{1F4BE} \u{1F4BE}                      |");
}

export async function missingPersonInUnList() {
    console.log("|    Getting missing entity/person from UN list   \u{1F973} \u{1F973}                      |");
    printWait();
    let oUNSDNData = await fs.readFile(ENV.DATA_SOURCE.UN.FILE, "utf8");
    oUNSDNData = JSON.parse(oUNSDNData);
    const diffData = [];
    oUNSDNData = oUNSDNData &&
        oUNSDNData.CONSOLIDATED_LIST &&
        oUNSDNData.CONSOLIDATED_LIST.INDIVIDUALS &&
        oUNSDNData.CONSOLIDATED_LIST.INDIVIDUALS.INDIVIDUAL;

    for ( const oSanctionedPerson of oUNSDNData ) {
        let personMissing = true;
        let oSanctionedPersonName = "";
        if (oSanctionedPerson && oSanctionedPerson.FIRST_NAME) {
            oSanctionedPersonName += oSanctionedPerson.FIRST_NAME;
        }
        if (oSanctionedPerson && oSanctionedPerson.SECOND_NAME) {
            oSanctionedPersonName += " " + oSanctionedPerson.SECOND_NAME;
        }
        if (oSanctionedPerson && oSanctionedPerson.THIRD_NAME) {
            oSanctionedPersonName += " " + oSanctionedPerson.THIRD_NAME;
        }
        oSanctionedPersonName = oSanctionedPersonName && oSanctionedPersonName.toLowerCase();

        for(const oPerson of oPelicanData) {
            const oPersonName = oPerson.Entity && oPerson.Entity.toLowerCase();
            if (oPersonName && oPersonName.indexOf(oSanctionedPersonName) != -1) {
                personMissing = false;
                break;
            }
        }
        if (personMissing) {
            diffData.push(oSanctionedPerson);
        }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    stopPrintWait();
    console.log("|    Diff size:            " + diffData.length + "                    \u{1F4D6} \u{1F4D6}                      |");
    console.log("|    Full List size:       " + oUNSDNData.length + "                    \u{1F4D5} \u{1F4D5}                      |");
    const fileWritten = await fs.writeFile( ENV.DATA_SOURCE.UN.DIFF_FILE, JSON.stringify(diffData, null, 4), 'utf8');
    console.log("|    Saved missing entity/person from UN list     \u{1F4BE} \u{1F4BE}                      |");
}

export async  function missingPersonInEUList() {

}
