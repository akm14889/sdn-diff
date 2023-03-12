# SND Diff tool
Tool to get missing entity/person from pelican list and which are present in sanction list published by US, UK, UN, EU.

## Data Source
| Website URL                                                                                                                             | XML URL                                                                                                                             |
|-----------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| [UK](https://www.gov.uk/government/publications/the-uk-sanctions-list)                                                                  | [UK](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1141733/UK_Sanctions_List.xml) |
| [US](https://home.treasury.gov/policy-issues/financial-sanctions/specially-designated-nationals-list-data-formats-data-schemas)         | [US](https://www.treasury.gov/ofac/downloads/sdn.xml)                                                                               |
| [EU](https://data.europa.eu/data/datasets/consolidated-list-of-persons-groups-and-entities-subject-to-eu-financial-sanctions?locale=en) | [EU](https://webgate.ec.europa.eu/fsd/fsf/public/files/xmlFullSanctionsList_1_1/content?token=dG9rZW4tMjAxNw)                       |
| [UN](https://www.un.org/securitycouncil/content/un-sc-consolidated-list)                                                                | [UN](https://scsanctions.un.org/resources/xml/en/consolidated.xml)                                                                  |

## How to Run
### Dependencies
1. Install NodeJS on machine, Windows machine : [Download](https://nodejs.org/dist/v18.15.0/node-v18.15.0-x86.msi) and install.
2. Download this package
3. Before Running this program make sure that URL to download XML of data from above site is upto date, You can update this list by changing content in this file for [UK](https://github.com/akm14889/sdn-diff/blob/main/backend/env.js#L4), [US](https://github.com/akm14889/sdn-diff/blob/main/backend/env.js#L9), [UN](https://github.com/akm14889/sdn-diff/blob/main/backend/env.js#L14), [EU](https://github.com/akm14889/sdn-diff/blob/main/backend/env.js#L20)
4. Make sure to replace this [file](https://github.com/akm14889/sdn-diff/blob/main/backend/data/currentPelicanList/list.csv), with the latest exported pelican data, please name that file as `list.csv` 
5. Install Program dependencies 
```
cd backend
```
```
npm install
```
```
node index.js

```
