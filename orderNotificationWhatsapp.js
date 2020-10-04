require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken); 
 
client.messages 
      .create({ 
         body: 'I haven\'t written this message man, idk from where this has come.', 
         from: 'whatsapp:+919713996866',       
         to: 'whatsapp:+917909857898' 
       }) 
      .then(message => console.log(`Message sent SID : ${message.sid}`)) 
      .done();