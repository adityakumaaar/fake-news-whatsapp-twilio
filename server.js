const express = require('express');
const bodyParser = require('body-parser')
const Jimp = require('jimp');
const { MessagingResponse } = require('twilio').twiml;

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
    let bgImages = ['https://i.ibb.co/SVLWnrs/Basic-Template-RED.png', 
                    'https://i.ibb.co/vxV2CYd/Basic-Template-GREEN.png', 
                    'https://i.ibb.co/r4Gzdds/Basic-Template-EMBER.png'];

    
    let fakePercent = randomInteger(0,100);
    let selectedImage;
    let verdict;
    if(fakePercent < 20){
        selectedImage = bgImages[1];
        verdict = "GENUINE 🟢";
    }
    else if(fakePercent >=20 && fakePercent<=70){
        selectedImage = bgImages[2];
        verdict = "MISLEADING 🟡";
    }
    else{
        selectedImage = bgImages[0];
        verdict = "FAKE 🔴";
    }    
    const background = await Jimp.read(selectedImage);
    
    background.print(font32, 360, 110, fakePercent);

    let curDate = new Date().toLocaleDateString();
    let curTime = new Date().toLocaleTimeString();
    console.log(fakePercent + " " + curDate + " " + curTime);
    const font16 = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    background.print(font32, 180, 540, curDate+" "+curTime);

    await background.writeAsync('./public/tempimg/newImage.png');

    return verdict;
}

app.post("/", async(req,res)=>{
    let message;

    console.log(req.body.Body);
    if(isValidURL(req.body.Body)){
        let verdict = await createImage().catch(console.error);
        message = new MessagingResponse().message("Here is our verdict: " + verdict + " for \n" + req.body.Body + "\n\n" + "Please add the number +91-1234567890 to verify viral news!");
        message.media('https://whatsapp-fakenews-twilio.herokuapp.com/tempimg/newImage.png');
    }else{
        message = new MessagingResponse()
        .message("Please provide a valid url with http(s)");
    }
    
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(message.toString());   
})


app.listen(process.env.PORT || 80,()=>{
    console.log(`Server started`);
})