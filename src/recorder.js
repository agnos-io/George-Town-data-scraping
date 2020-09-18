const path = require("path");
createCsvWriter = require("csv-writer").createObjectCsvWriter;

class Recorder {
  csvWriter;
  type;
  constructor(type, file_name) {
    this.type = type;
    let output_file_path, header;
    output_file_path = path.join(__dirname, `../output/GeorgeTown_Alumni/${file_name}.csv`);
    switch (type) {
      case "data": {
        header = [
          { id: "Title", title: "Title" },
          { id: "First Name", title: "First Name" },
          { id: "Middle Name", title: "Middle Name" },
          { id: "Last Name", title: "Last Name" },
          { id: "Email", title: "Email" },
          { id: "Other Email", title: "Other Email" },
          { id: "Street Address", title: "Street Address" },
          { id: "City", title: "City" },
          { id: "State/Region", title: "State/Region" },
          { id: "Country", title: "Country" },
          { id: "Postal Code", title: "Postal Code" },
          { id: "Mobile Phone Number", title: "Mobile Phone Number" },
          { id: "Phone Number", title: "Phone Number" },
          { id: "WebsiteAddress1", title: "WebsiteAddress1" },
          { id: "Professional Summary", title: "Professional Summary" },
          { id: "Skills", title: "Skills" },
          {
            id: "Past Experience Position 1",
            title: "Past Experience Position 1",
          },
          {
            id: "Past Experience Company 1",
            title: "Past Experience Company 1",
          },
          {
            id: "Past Experience Position 2",
            title: "Past Experience Position 2",
          },
          {
            id: "Past Experience Company 2",
            title: "Past Experience Company 2",
          },
          { id: "School", title: "School" },
          { id: "Graduation Date", title: "Graduation Date" },
          { id: "Major", title: "Major" },
          { id: "Degree", title: "Degree" },
          { id: "Other Education 1", title: "Other Education 1" },
          {
            id: "Graduation for Other Education 1",
            title: "Graduation for Other Education 1",
          },
          { id: "Other Education 2", title: "Other Education 2" },
          { id: "Job Title", title: "Job Title" },
          { id: "Company name", title: "Company name" },
          { id: "work Email", title: "work Email" },
          { id: "Work Phone", title: "Work Phone" },
          { id: "all data", title: "ALL Data" },
        ];
        break;
      }
      case "logger": {
        header = [
          { id: "log_type", title: "LOG TYPE" },
          { id: "message", title: "MESSAGE" },
          { id: "log", title: "LOG" },
        ];
        break;
      }
      case "profileUrl": {
        header = [{ id: "address", title: "ADDRESS" }];
      }
    }
    this.csvWriter = createCsvWriter({ path: output_file_path, header });
  }
  record(data) {
    if(this.type === 'profileUrl'){
      // console.log('addresses: ',data);     
      this.csvWriter.writeRecords(data);
    }
    else{
      this.csvWriter
        .writeRecords([data]) // returns a promise
        .then(() => {
          if (this.type === "data")
            console.log("Data Recorded for ", data["First Name"]);
          else console.log(data.log_type, " logged");
        })
        .catch((err) => console.log(err));
    }
  }
}

module.exports = Recorder;
