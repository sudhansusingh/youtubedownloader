const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});
const youtubeDownloader = require("ytdl-core");

app.get("/download", async (req,res)=>{

    const videoId = req.query.url.split('v=')[1];
    const info = await youtubeDownloader.getInfo(req.query.url);

    let data ={
		url: "https://www.youtube.com/embed/" + videoId,
        info: info.formats.sort((a, b) => {
            return a.mimeType < b.mimeType;
        })
    };

    let urlToSend = [];
    urlToSend = data.info.filter((el)=>{ 
        if(el.hasAudio && el.container == "mp4"){
            // console.log(el)
            return el.url;
        }
     });

    data.info = urlToSend;
    urlToSend = urlToSend.map(e => e.url)
    return res.render("./download", data);
})

let PORT = process.env.PORT || 30000;
app.listen(PORT, () => {
    console.log(`🚒 Server is running on port ${PORT} 🤠🛑`);
})




const back = require('androidjs').back;

back.on('get-data', async function(url){

    
    const videoId = url.split("v=")[1];
    const info = await youtubeDownloader.getInfo(url);

    let data ={
		url: "https://www.youtube.com/embed/" + videoId,
        info: info.formats.sort((a, b) => {
            return a.mimeType < b.mimeType;
        })
    };

    let urlToSend = [];
    urlToSend = data.info.filter((el)=>{ 
        if(el.hasAudio && el.container == "mp4"){
            // console.log(el)
            return el.url;
        }
     });

    data.info = urlToSend;
    urlToSend = urlToSend.map(e => e.url);
    back.send('get-data-result', data);
    // return res.render("./download", data);
})

const axios = require("axios");
app.post("/mail", async (req,res)=>{
    const sendAxiosRequest = function(){

        const MJ_APIKEY_PUBLIC = 'a48cd27d4c54c1e0d64774a3566c69be';
        const MJ_APIKEY_PRIVATE = '8bd16d922d00208797e1f4d66ba0433c';
        
        const data = {
          FromEmail: 'parasnarula8@gmail.com',
          FromName: 'Paras',
          Subject: 'Your email flight plan!',
          'Text-part': 'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
          'Html-part': '<h3>Dear passenger, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!<br />May the delivery force be with you!',
          Recipients: [{ Email: 'sudhansu@ith.tech' }]
        };
        
        axios.post('https://api.mailjet.com/v3/send', data, {
          auth: {
            username: MJ_APIKEY_PUBLIC,
            password: MJ_APIKEY_PRIVATE
          },
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            console.log('Response:', response.data);
          })
          .catch(error => {
            console.error('Error:', error.response.data);
          });
    }
    return res.send("Done")
})