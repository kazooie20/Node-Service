var fs = require('fs');
var http = require('http');
const axios = require('axios');
var mkdirp = require('mkdirp');

var API = 'http://www.mocky.io/v2/5d1c274d340000741db5fb46';
var dir = __dirname + '\\' + 'blacklisted';
var list_of_detect = [];
var list_of_image = [];

function FetchFaceData() {

    //Clear array
    list_of_detect = [];
    list_of_image = [];

    //Fetch data from API with Axios
    axios.get(API)
        .then(response => {

            //Loop through JSON Array
            for (var i = 0; i < response.data.length; i++) {
                var obj = response.data[i];

                //console.log(obj.detection_time);
                //console.log(obj.image_base64);
                list_of_detect.push(obj.detection_time);
                list_of_image.push(obj.image_base64);

                var year = obj.detection_time.substring(6,10);
                var month = obj.detection_time.substring(3,5);
                var day = obj.detection_time.substring(0,2);
                var time = obj.detection_time.substring(10,19);
               
                //Convert time
                var converted_time = ReplaceColon(time); 
                
                var dir2 = dir + '\\' + `${year}` ;
                var dir3 = dir2 + '\\' + `${month}` ;
                var dir4 = dir3 + '\\' + `${day}`;
                
                // Add a directory pertaining the necessary info
                if (!fs.existsSync(dir2)) {
                    fs.mkdirSync(dir2);
                }

                if(!fs.existsSync(dir3)){
                    fs.mkdirSync(dir3);
                }

                if(!fs.existsSync(dir4)){
                    fs.mkdirSync(dir4);
                }

                //Write a JPEG file to directory with the name being the detection time to dir4
                fs.writeFile(`${dir4}\\${converted_time}.jpeg`, `${obj.image_base64}`,{encoding: 'base64'}, function (err) {
                    if (err) throw err;
                    console.log('File is created successfully.');
                  });                  
            }
        })
        .catch(error => {
            console.log(error);
            return (error);
        });
}

//setInterval(FetchFaceData,1000);
function ReplaceColon(name) {
    var newname = replaceAll(name, ':', '.');
    return newname;
}

//Create Server on localhost:3066
function CreateServer() {
    http.createServer(function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        //res.write("The date and time are currently: " + dt.myDateTime());
        for (var i = 0; i < list_of_detect.length; i++) {
            res.write(`<h3>${list_of_detect[i]}</h3>`);
            res.write(`<img src="data:image/jpeg;base64,${list_of_image[i]} />`);
        }

        res.end();
    }).listen(3666);
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

FetchFaceData();




