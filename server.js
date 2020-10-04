const express = require('express');
const bodyParser = require('body-parser')
const Jimp = require('jimp');
const axios = require('axios').default;
const { MessagingResponse } = require('twilio').twiml;

// const MessagingResponse = require('twilio').twiml.MessagingResponse;

// async function getData(link) {
//     const encodedLink = encodeURIComponent(link);
//     try {
//         let urlStr = 'https://api.factmata.com/api/v0.1/score/url?url='+encodedLink+'&include_content=false';
//         // console.log(urlStr);
//         const response = await axios.get(urlStr);
//         // console.log(response.data);

//         const dataRecieved = response.data;
        
//         const title = response.data.title;

//         console.log(dataRecieved);
//         console.log(title);
//         return new Promise((resolve, reject)=>{
//             resolve([title, dataRecieved]);
//         });
//     } 
//     catch (error) {
//         console.error(error);
//     }
// }

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  };
  

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let createImage = async ()=> {
    const font32 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    let bgImages = ['https://i.ibb.co/vP0qHsK/Basic-Template-RED.png', 
                    'https://i.ibb.co/NVmwkjs/Basic-Template-GREEN.png', 
                    'https://i.ibb.co/Lkms9nG/Basic-Template-EMBER.png'];

    
    let fakePercent = randomInteger(0,100);
    let selectedImage;
    if(fakePercent < 20){
        selectedImage = bgImages[1];
    }
    else if(fakePercent >=20 && fakePercent<=70){
        selectedImage = bgImages[2];
    }
    else{
        selectedImage = bgImages[0];
    }    
    const background = await Jimp.read(selectedImage);
    
    background.print(font32, 360, 110, fakePercent);

    let curDate = new Date().toLocaleDateString();
    let curTime = new Date().toLocaleTimeString();
    console.log(fakePercent + " " + curDate + " " + curTime);
    const font16 = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    background.print(font32, 180, 540, curDate+" "+curTime);

    await background.writeAsync('./public/tempimg/newImage.png');
}

app.post("/", async(req,res)=>{
    let message;

    console.log(req.body.Body);
    if(isValidURL(req.body.Body)){
        message = new MessagingResponse().message("Here is our verdict.");
        message.media('http://a1f0b53681a8.ngrok.io/tempimg/newImage.png');
        await createImage().catch(console.error);
    }else{
        message = new MessagingResponse().message("Please provide a valid url with http(s)");
    }
    
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(message.toString());   
})


app.listen(process.env.PORT || 80,()=>{
    console.log(`Server started`);
})