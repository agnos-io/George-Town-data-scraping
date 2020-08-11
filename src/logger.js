const path = require("path");
const output_file_path = path.join(__dirname, "logs.csv");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: output_file_path,
  header: [
    { id: "log_type", title: "LOG TYPE" },
    { id: "log", title: "LOG" }
  ],
});

const record_data_to_CSV = (data) => {
  csvWriter
    .writeRecords([data]) // returns a promise
    .then(() => {
      console.log("logged");
    }).catch(err => console.log(err));
};

const logger = (log_type, log) => {
record_data_to_CSV({log_type,log})
}

module.exports = logger