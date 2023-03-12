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
    console.log("|    Total Diff       "+ diffData.length + "               \u{1F4D6} \u{1F4D6}                              |");
    console.log("|    Output Generated at : " + ENV.OUTPUT_FILE_CSV + "    \u{1F4BE} \u{1F4BE}               |");
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
            personToAdd.List = "UK";
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
    usDiff = JSON.parse(usDiff);
    for (const sanctionedPerson of usDiff) {
        let personToAdd = null;
        if (sanctionedPerson.lastName) {
            personToAdd = {};
            personToAdd.Name = sanctionedPerson.lastName;
            personToAdd.DOB = "";
            personToAdd.DateAdded = "";
            personToAdd.List = "US";
            if (sanctionedPerson.dateOfBirthList && sanctionedPerson.dateOfBirthList.dateOfBirthItem) {
                if (Array.isArray(sanctionedPerson.dateOfBirthList.dateOfBirthItem)) {
                    for (const personDob of sanctionedPerson.dateOfBirthList.dateOfBirthItem) {
                        if (personDob.mainEntry) {
                            personToAdd.DOB = personDob.dateOfBirth;
                            break;
                        }
                    }

                } else {
                    personToAdd.DOB = sanctionedPerson.dateOfBirthList.dateOfBirthItem.dateOfBirth;
                }
            }
            if (personToAdd) {
                diffData.push(personToAdd);
            }
        }
    }
}

async function transformAndGetUnDiff() {
    let unDiff = await fs.readFile(ENV.DATA_SOURCE.UN.DIFF_FILE, "utf8");
    unDiff = JSON.parse(unDiff);
    for (const sanctionedPerson of unDiff) {
        let personToAdd = null;
        let oSanctionedPersonName = "";
        if (sanctionedPerson && sanctionedPerson.FIRST_NAME) {
            oSanctionedPersonName += sanctionedPerson.FIRST_NAME;
        }
        if (sanctionedPerson && sanctionedPerson.SECOND_NAME) {
            oSanctionedPersonName += " " + sanctionedPerson.SECOND_NAME;
        }
        if (sanctionedPerson && sanctionedPerson.THIRD_NAME) {
            oSanctionedPersonName += " " + sanctionedPerson.THIRD_NAME;
        }
        if (sanctionedPerson && sanctionedPerson.FOURTH_NAME) {
            oSanctionedPersonName += " " + sanctionedPerson.FOURTH_NAME;
        }
        if (oSanctionedPersonName) {
            personToAdd = {};
            personToAdd.Name = oSanctionedPersonName;
            personToAdd.DateAdded = sanctionedPerson.LISTED_ON;
            personToAdd.DOB = "";
            personToAdd.List = "UN"
            if (sanctionedPerson.INDIVIDUAL_DATE_OF_BIRTH) {
                if (Array.isArray(sanctionedPerson.INDIVIDUAL_DATE_OF_BIRTH)) {
                    for (const personDob of sanctionedPerson.INDIVIDUAL_DATE_OF_BIRTH) {
                        personToAdd.DOB = personDob.DATE || personDob.YEAR;
                        if (personDob.TYPE_OF_DATE == "EXACT") {
                            personToAdd.DOB = personDob.DATE || personDob.YEAR;
                            break;
                        }
                    }
                } else {
                    personToAdd.DOB = sanctionedPerson.INDIVIDUAL_DATE_OF_BIRTH.DATE || sanctionedPerson.INDIVIDUAL_DATE_OF_BIRTH.YEAR;
                }
            }
        }

        if (personToAdd) {
            diffData.push(personToAdd);
        }
    }
}

async function transformAndGetEuDiff() {
    let euDiff = await fs.readFile(ENV.DATA_SOURCE.EU.DIFF_FILE, "utf8");
    euDiff = JSON.parse(euDiff);
    for (const sanctionedPerson of euDiff) {
        let personToAdd = null;
        let oSanctionedPersonNameAliases = sanctionedPerson.nameAlias;
        if (oSanctionedPersonNameAliases) {
            personToAdd = {};
            let personName = "";
            if (Array.isArray(oSanctionedPersonNameAliases)) {
                for(const oSanctionedPersonName of oSanctionedPersonNameAliases) {
                    let oScantionPersonName = oSanctionedPersonName["$"];
                    personName = oScantionPersonName.wholeName;
                    personToAdd.Name = personName;
                    if (personName) {
                        break;
                    }
                }
            } else {
                personName = oSanctionedPersonNameAliases["$"] &&
                    oSanctionedPersonNameAliases["$"].wholeName;
                personToAdd.Name = personName;
            }
            personToAdd.DOB = "";
            if (sanctionedPerson &&
                sanctionedPerson.birthdate
            ) {
                if (Array.isArray(sanctionedPerson.birthdate)) {
                    for(const personDob of sanctionedPerson.birthdate) {
                        let personDateOfBirth = personDob["$"];
                        if(personDateOfBirth.year) {
                            personToAdd.DOB = personDateOfBirth.year;
                        }
                        if (personDateOfBirth.birthdate) {
                            personToAdd.DOB = personDateOfBirth.birthdate;
                            break;
                        }
                    }
                } else {
                    let personDateOfBirth = sanctionedPerson.birthdate["$"];
                    if(personDateOfBirth.year) {
                        personToAdd.DOB = personDateOfBirth.year;
                    }
                    if (personDateOfBirth.birthdate) {
                        personToAdd.DOB = personDateOfBirth.birthdate;
                    }
                }
            }
            personToAdd.DateAdded = "";
            if (sanctionedPerson &&
                sanctionedPerson.regulation &&
                sanctionedPerson.regulation["$"] &&
                sanctionedPerson.regulation["$"].publicationDate
            ) {
                personToAdd.DateAdded = sanctionedPerson.regulation["$"].publicationDate;
            }
            personToAdd.List = "EU";
        }
        if (personToAdd) {
            diffData.push(personToAdd);
        }
    }
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
