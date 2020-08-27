const db=require('../dbconfiguration/db')
const mongoose = require('mongoose');
const occupationMap={
    "620000":'HealthCare'
    // "lhh":'HealthLaw',
    // "hmhe":'Hematology',
    // "lhiv":'HIV_AIDS Law',
    // "720000":'Hospitality',
    // "hmim":'Immunology',
    // "hdim":'Implantology',
    // "hmid":'Infectious Diseases'
}
const statesMap={
    "TX" : 'TX',
    "us":'US',
    // us
    'AE':'AE',
    'AK':'AK',
    'AL':'AL',
    'AP':'AP',
    'AR':'AR',
    'AS':'AS',
    'AZ':'AZ',
    'BC':'BC',
    'CA':'CA',
    'CO':'CO',
    'CT':'CT',
    'DC':'DC',
    'DE':'DE',
    'FL':'FL',
    'HI':'HI',
    'IA':'IA',
    'ID':'ID',
    'IL':'IL',
    'IN':'IN',
    'KS':'KS',
    'LA':'LA',
    'LB':'LB',
    'MA':'MA',
    'MB':'MB',
    'MD':'MD',
    'ME':'ME',
    'MI':'MI',
    'MN':'MN',
    'MP':'MP',
    'MS':'MS',
    'ca':'ca',
    'MT':'MT',
    'NB':'NB',
    'NC':'NC',
    'ND':'ND',
    'NE':'NE',
    'NJ':'NJ',
    'NM':'NM',
    'NS':'NS',
    'NV':'NV',
    'NY':'NY',
    'OH':'OH',
    'OK':'OK',
    'ON':'ON',
    'OR':'OR',
    'PA':'PA',
    'cy':'cy',
    'QC':'QC',
    'RI':'RI',
    'SC':'SC',
    'SD':'SD',
    'SK':'SK',
    'TN':'TN',
    'UT':'UT',
    'VA':'VA',
    'VI':'VI',
    'VT':'VT',
    'WA':'WA',
    'WI' : 'WI', 
 'WV' : 'WV' ,
 'gm' : 'gm' ,
 'gy' : 'gy' ,
 'ha' : 'ha' ,
 'ho' : 'ho' ,
 'mx' : 'mx' ,
 'nu' : 'nu' ,
 'pn' : 'pn' ,
 'ns' : 'ns' ,
 've' : 've', 
};
const newMap={
'us':'USA',
 'AE':'Armed Services New York',
 'AK':'Alaska',
 'AL':'Alabama',
 'AP':'Armed Services California',
 'AR':'Arkansas',
 'AS':'American Samoa',
 'AZ':'Arizona',
 'BC':'British Columbia',
 'CA':'California',
 'CO':'Colorado',
 'CT':'Connecticut',
 'DC':'District of Columbia',
 'DE':'Delaware',
 'FL':'Florida',
 'HI':'Hawaii',
 'IA':'Iowa',
 'ID':'Idaho',
 'IL':'Illinois',
 'IN':'Indiana',
 'KS':'Kansas',
 'LA':'Louisiana',
 'LB':'Labrador',
 'MA':'Massachusetts',
 'MB':'Manitoba',
 'MD':'Maryland',
 'ME':'Maine',
 'MI':'Michigan',
 'MN':'Minnesota',
 'MP':'Northern Mariana Islands',
 'MS':'Mississippi',
 'ca':'Canada',
 'MT':'Montana',
 'NB':'New Brunswick',
 'NC':'North Carolina',
 'ND':'North Dakota',
 'NE':'Nebraska',
 'NJ':'New Jersey',
 'NM':'New Mexico',
 'NS':'Nova Scotia',
 'NV':'Nevada',
 'NY':'New York',
 'OH':'Ohio',
 'OK':'Oklahoma',
 'ON':'Ontario',
 'OR':'Oregon',
 'PA':'Pennsylvania',
 'cy':'Cyprus',
 'QC':'Quebec',
 'RI':'Rhode Island',
 'SC':'South Carolina',
 'SD':'South Dakota',
 'SK':'Saskatchewan',
 'TN':'Tennessee',
 'TX':'Texas',
 'UT':'Utah',
 'VA':'Virginia',
 'VI':'US Virgin Islands',
 'VT':'Vermont',
 'WA':'Washington',
 'WI':'Wisconsin',
 'WV':'West Virginia',
 'gm':'Germany',
 'gy':'Guyana',
 'ha':'Haiti',
 'ho':'Honduras',
 'mx':'Mexico',
 'nu':'Nicaragua',
 'pn':'Panama',
 'ns':'Suriname',
 've':'Venezuela'
};
(async () => {
    const Occupation=db.Occupation;
    for(var occupation of Object.keys(occupationMap)){
        var data=new Occupation({occupationCode:occupation,occupationName:occupationMap[occupation]});
        console.log(await data.save());

    }
})()