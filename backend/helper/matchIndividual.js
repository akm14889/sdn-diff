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
        if (oSanctionedPerson.Names.Name &&
            Array.isArray(oSanctionedPerson.Names.Name)) {
            if (personMissing === false) {
                break;
            }
            for (const oSanctionedPersonName of oSanctionedPerson.Names.Name) {
                if (personMissing === false) {
                    break;
                }
                let nameInUkList = "";
                nameInUkList = updateName(nameInUkList, oSanctionedPersonName);
                nameInUkList = nameInUkList.toLowerCase();
                for(const oPerson of oPelicanData) {
                    const oPersonName = oPerson.Entity && oPerson.Entity.toLowerCase();
                    if (oPersonName && oPersonName.indexOf(nameInUkList) != -1) {
                        personMissing = false;
                        break;
                    }
                }
            }
        }
        else {
            /**
             * @todo find which name to pick picking Name6 for now
             */
            if (oSanctionedPerson.Names.Name &&
                oSanctionedPerson.Names.Name.NameType &&
                oSanctionedPerson.Names.Name.NameType.toLowerCase() === "primary name") {
                let nameInUkList = "";
                nameInUkList = updateName(nameInUkList, oSanctionedPerson.Names.Name);
                nameInUkList = nameInUkList.toLowerCase();
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
        let oScantionedPersonAliases = oSanctionedPerson.akaList &&
            oSanctionedPerson.akaList.aka;
        if (oScantionedPersonAliases) {
            if (Array.isArray(oScantionedPersonAliases)) {
                for (const alias of oScantionedPersonAliases ) {
                    if (personMissing === false) {
                        break;
                    }
                    let oSanctionedPersonAliasName = alias.lastName && alias.lastName.toLowerCase();
                    for(const oPerson of oPelicanData) {
                        const oPersonName = oPerson.Entity && oPerson.Entity.toLowerCase();
                        if (oPersonName && oPersonName.indexOf(oSanctionedPersonAliasName) != -1) {
                            personMissing = false;
                            break;
                        }
                    }
                }
            } else {
                let oSanctionedPersonAliasName = oScantionedPersonAliases.lastName && oScantionedPersonAliases.lastName.toLowerCase();
                for(const oPerson of oPelicanData) {
                    const oPersonName = oPerson.Entity && oPerson.Entity.toLowerCase();
                    if (oPersonName && oPersonName.indexOf(oSanctionedPersonAliasName) != -1) {
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
        if (oSanctionedPerson && oSanctionedPerson.FOURTH_NAME) {
            oSanctionedPersonName += " " + oSanctionedPerson.FOURTH_NAME;
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

export async  function missingPersonInEuList() {
    console.log("|    Getting missing entity/person from EU list   \u{1F973} \u{1F973}                      |");
    printWait();
    let oEUSDNData = await fs.readFile(ENV.DATA_SOURCE.EU.FILE, "utf8");
    oEUSDNData = JSON.parse(oEUSDNData);
    const diffData = [];
    oEUSDNData = oEUSDNData &&
        oEUSDNData.export &&
        oEUSDNData.export.sanctionEntity;

    for ( const oSanctionedPerson of oEUSDNData ) {
        let personMissing = true;
        let oSanctionedPersonNameAliases = oSanctionedPerson.nameAlias;
        if (oSanctionedPersonNameAliases &&
            Array.isArray(oSanctionedPersonNameAliases)) {
            for(const oSanctionedPersonName of oSanctionedPersonNameAliases) {
                if (personMissing === false) {
                    break;
                }
                let oScantionPersonName = oSanctionedPersonName["$"];
                oScantionPersonName = oScantionPersonName.wholeName.toLowerCase();
                for(const oPerson of oPelicanData) {
                    const oPersonName = oPerson.Entity && oPerson.Entity.toLowerCase();
                    if (oPersonName && oPersonName.indexOf(oScantionPersonName) != -1) {
                        personMissing = false;
                        break;
                    }
                }
            }
        } else if (oSanctionedPersonNameAliases) {
            let oScantionPersonName = oSanctionedPersonNameAliases["$"];
            oScantionPersonName = oScantionPersonName.wholeName.toLowerCase();
            for(const oPerson of oPelicanData) {
                const oPersonName = oPerson.Entity && oPerson.Entity.toLowerCase();
                if (oPersonName && oPersonName.indexOf(oScantionPersonName) != -1) {
                    personMissing = false;
                    break;
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
    console.log("|    Full List size:       " + oEUSDNData.length + "                   \u{1F4D5} \u{1F4D5}                      |");
    const fileWritten = await fs.writeFile( ENV.DATA_SOURCE.EU.DIFF_FILE, JSON.stringify(diffData, null, 4), 'utf8');
    console.log("|    Saved missing entity/person from EU list     \u{1F4BE} \u{1F4BE}                      |");
}

function updateName(currentName, oName) {
    function update(curName, NewPart) {
        if (curName) {
            curName += " " + NewPart;
        } else {
            curName += NewPart;
        }
        return curName;
    }
    if (oName.Name1) {
        currentName = update(currentName, oName.Name1);
    }
    if (oName.Name2) {
        currentName = update(currentName, oName.Name2);
    }
    if (oName.Name3) {
        currentName = update(currentName, oName.Name3);
    }
    if (oName.Name4) {
        currentName = update(currentName, oName.Name4);
    }
    if (oName.Name5) {
        currentName = update(currentName, oName.Name5);
    }
    if (oName.Name6) {
        currentName = update(currentName, oName.Name6);
    }
    return currentName;
}
