import { parserCSV, saveAndParseList } from "./helper/downloader.js"
import {
    missingPersonInUKList,
    missingPersonInUsList,
    missingPersonInUnList,
    missingPersonInEuList
} from "./helper/matchIndividual.js"
import { compileOutput } from "./helper/output.js"
(async function() {
    console.log("______________________________________________________________________________");
    const parserStatus = await parserCSV();
    console.log("______________________________________________________________________________");

    console.log("\n______________________________________________________________________________");
    const ukStatus = await saveAndParseList("UK");
    console.log("______________________________________________________________________________");

    console.log("\n______________________________________________________________________________");
    const ukDiffList = await missingPersonInUKList();
    console.log("______________________________________________________________________________");

    console.log("\n______________________________________________________________________________");
    const usStatus = await saveAndParseList("US");
    console.log("______________________________________________________________________________");

    console.log("\n______________________________________________________________________________");
    const usDiffList = await missingPersonInUsList();
    console.log("______________________________________________________________________________");

    console.log("\n______________________________________________________________________________");
    const unStatus = await saveAndParseList("UN");
    console.log("______________________________________________________________________________");

    console.log("\n______________________________________________________________________________");
    const unDiffList = await missingPersonInUnList();
    console.log("______________________________________________________________________________");

    console.log("\n______________________________________________________________________________");
    const euStatus = await saveAndParseList("EU");
    console.log("______________________________________________________________________________");

    console.log("\n______________________________________________________________________________");
    const euDiffList = await missingPersonInEuList();
    console.log("______________________________________________________________________________");

    console.log("\n______________________________________________________________________________");
    const outputStatus = await compileOutput();
    console.log("______________________________________________________________________________");

    console.log("\n\n");
})();

