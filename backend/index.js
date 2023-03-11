import {saveAndParseList} from "./helper/downloader.js"

console.log("______________________________________")
const ukStatus = await saveAndParseList("UK");
console.log("______________________________________")
console.log("\n______________________________________")
const usStatus = await saveAndParseList("US");
console.log("______________________________________")
console.log("\n______________________________________")
const unStatus = await saveAndParseList("UN");
console.log("______________________________________")
console.log("\n______________________________________")
const euStatus = await saveAndParseList("EU");
console.log("______________________________________")
console.log("\n\n");

