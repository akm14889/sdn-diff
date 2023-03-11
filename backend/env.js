export const ENV = {
    DATA_SOURCE: {
        "UK": {
            URL: "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1141733/UK_Sanctions_List.xml",
            FILE: "./data/published/UK_LIST.json",
            DIFF_FILE: "./data/diff/UK_DIFF.json"
        },
        "US": {
            URL: "https://www.treasury.gov/ofac/downloads/sdn.xml",
            FILE: "./data/published/US_LIST.json",
            DIFF_FILE: "./data/diff/US_DIFF.json"
        },
        "UN": {
            URL: "https://scsanctions.un.org/resources/xml/en/consolidated.xml",
            FILE: "./data/published/UN_LIST.json",
            DIFF_FILE: "./data/diff/UN_DIFF.json"

        },
        "EU": {
            URL: "https://webgate.ec.europa.eu/fsd/fsf/public/files/xmlFullSanctionsList_1_1/content?token=dG9rZW4tMjAxNw",
            FILE: "./data/published/EU_LIST.json",
            DIFF_FILE: "./data/diff/EU_DIFF.json",
        }
    },
    PELICAN_FILE: "./data/currentPelicanList/list.csv",
};
