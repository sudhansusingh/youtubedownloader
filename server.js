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
