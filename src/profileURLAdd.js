const db=require('../dbconfiguration/db');
const mongoose = require('mongoose');
const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
const path = require("path");
const occupationMap={
    "620000":'HealthCare'
    // "lhh":'HealthLaw',
    // "hmhe":'Hematology',
    // "lhiv":'HIV_AIDS Law',
    // "720000":'Hospitality',
    // "hmim":'Immunology',
    // "hdim":'Implantology',
    // "hmid":'Infectious Diseases'
};
const stateMap={
    // 'us':'USA',
    //  'AE':'Armed Services New York',
    //  'AK':'Alaska',
     'AL':'Alabama',
    //  'AP':'Armed Services California',
    //  'AR':'Arkansas',
    //  'AS':'American Samoa',
    //  'AZ':'Arizona',
    //  'BC':'British Columbia',
    //  'CA':'California',
    //  'CO':'Colorado',
    //  'CT':'Connecticut',
    //  'DC':'District of Columbia',
    //  'DE':'Delaware',
    //  'FL':'Florida',
    //  'HI':'Hawaii',
    //  'IA':'Iowa',
    //  'ID':'Idaho',
    //  'IL':'Illinois',
    //  'IN':'Indiana',
    //  'KS':'Kansas',
    //  'LA':'Louisiana',
    //  'LB':'Labrador',
    //  'MA':'Massachusetts',
    //  'MB':'Manitoba',
    //  'MD':'Maryland',
    //  'ME':'Maine',
    //  'MI':'Michigan',
    //  'MN':'Minnesota',
    //  'MP':'Northern Mariana Islands',
    //  'MS':'Mississippi',
    //  'ca':'Canada',
    //  'MT':'Montana',
    //  'NB':'New Brunswick',
    //  'NC':'North Carolina',
    //  'ND':'North Dakota',
    //  'NE':'Nebraska',
    //  'NJ':'New Jersey',
    //  'NM':'New Mexico',
    //  'NS':'Nova Scotia',
    //  'NV':'Nevada',
    //  'NY':'New York',
    //  'OH':'Ohio',
    //  'OK':'Oklahoma',
    //  'ON':'Ontario',
    //  'OR':'Oregon',
    //  'PA':'Pennsylvania',
    //  'cy':'Cyprus',
    //  'QC':'Quebec',
    //  'RI':'Rhode Island',
    //  'SC':'South Carolina',
    //  'SD':'South Dakota',
    //  'SK':'Saskatchewan',
    //  'TN':'Tennessee',
    //  'TX':'Texas',
    //  'UT':'Utah',
    //  'VA':'Virginia',
    //  'VI':'US Virgin Islands',
    //  'VT':'Vermont',
     'WA':'Washington'
    //  'WI':'Wisconsin',
    //  'WV':'West Virginia',
    //  'gm':'Germany',
    //  'gy':'Guyana',
    //  'ha':'Haiti',
    //  'ho':'Honduras',
    //  'mx':'Mexico',
    //  'nu':'Nicaragua',
    //  'pn':'Panama',
    //  'ns':'Suriname',
    //  've':'Venezuela'
    };
async  function addProfileData(occupation ,states,filePath){
    return new Promise((resolve,reject)=>{
    console.log('adding profile data')
    const ProfileURL=db.ProfileURL;
    const addresses = []
    let inputStream=Fs.createReadStream(filePath,'utf8');
    inputStream
        .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data',async  (row)=> {
            if(row[0]!="ADDRESS"){
                addresses.push(row[0])
            }
        })
        .on('end', function (data) {
            (async () => {
                console.log('Data Fetching Started');
                for (var i = 0; i < addresses.length; i++) {
                    var data=new ProfileURL({url:addresses[i],mid:addresses[i].split("&")[4].split("=")[1],index:i+1,occupationCode:occupation,stateCode:states});
                    console.log(data)
                    // console.log("Doing for:-",i+1)
                    // console.log(occupation)
                    // console.log(states)
                    // console.log(addresses);
                    // console.log(addresses[i].split("&")[4].split("=")[1])
                    await data.save();
                }
                resolve(0);
            })();
        });
        
    })
}
(async () => {
        
        for(var occupation of Object.keys(occupationMap)){
            for(var states of Object.keys(stateMap)){
                console.log(states);
                let filePath = path.join(__dirname, `../output/George_Town/${occupationMap[occupation]}/${states}/${states}_ProfileUrlAddresses.csv`);
                if(Fs.existsSync(filePath)){
                    console.log('file checking');
                    await addProfileData(occupation,states,filePath)
                    console.log('profildata recorded')
                }
                // var data=new Occupation({occupationCode:occupation,occupationName:occupationMap[occupation]});
                // console.log(await data.save());
            }
        }
})()