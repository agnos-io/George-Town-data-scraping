const path = require("path");
const fs = require('fs');

function createDirectoryForOccupation(occupationName){
    let dir=path.join(__dirname, `../output/George_Town/${occupationName}/`)
    console.log(dir);
    if (!fs.existsSync(dir)){
        console.log('in if')
        fs.mkdirSync(dir);
    }
}

module.exports = createDirectoryForOccupation;