const express = require('express');
const bodyparser = require('body-parser');
const multiparty = require('connect-multiparty');
const { error } = require('console');
const cors = require('cors')
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');
const httpolyglot = require('httpolyglot');

// Config ==========================================
const ipServer = "http://localhost:30249";
const portServer = 30249;
const MaxLimitFile = "25mb";
var key = fs.readFileSync(__dirname + '/../selfsigned.key');
var cert = fs.readFileSync(__dirname + '/../selfsigned.crt');
var options = {
    key: key,
    cert: cert
};
// =================================================

const PORT = process.env.PORT || portServer;
const app = express();
app.use(cors())


const MuiltiPartyMiddleware = multiparty({ uploadDir: `./images` });
app.use(bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: MaxLimitFile,
    extended: true
}));
app.use(bodyparser.json());


app.get('/', (req, res) => {
    res.status(200).json({
        message: "Ready . . ."
    })
});



app.use(express.static("uploads"));
app.post('/upload', MuiltiPartyMiddleware, (req, res) => {
    console.log("==========================================")
    console.log(moment().tz("Asia/Bangkok").format('YYYY-MM-DD HH:mm:SS'), " ==>> ")
    console.log(req.files);
    console.log("==========================================")

    let TempFile = req.files.upload;
    let dateTime = moment().tz("Asia/Bangkok").format('YYYY-MM-DD')

    pathNewImages = `storage/${dateTime}`

    console.log("Path save  images: ", pathNewImages)
    if (!fs.existsSync(pathNewImages)) {
        console.log("Create folder: ", pathNewImages)
        fs.mkdirSync(pathNewImages, { recursive: true });
    }

    let oldPathFile = String(TempFile.path)
    console.log(oldPathFile)
    let newPathFile = String(oldPathFile).replace('images', `${pathNewImages}`);
    console.log(newPathFile)

    fs.rename(oldPathFile, newPathFile, err => {
        // let urlReturn = `${ipServer}/${String(newPathFile).replaceAll("storage", "images").replaceAll("\\", "/")}`
        let urlReturn = `/${String(newPathFile).replaceAll("storage", "api/news/images").replaceAll("\\", "/")}`
        res.status(200).json({
            uploaded: true,
            url: urlReturn
        });

        if (err) {
            // console.log("Error ===>>> ")
            // return console.log(err);
            res.status(400).json({
                uploaded: false,
                url: ''
            });
        }
    })
})

app.get('/images/:folder/:filename', function (req, res) {
    const filename = req.params.filename
    const foldername = req.params.folder
    res.sendFile(path.join(__dirname, "./storage/" + `${foldername}/` + filename), function (err) {
        if (err) {
            res.status(404).send("Error: ENOENT: No such file or directory.");
        }
        else {
            console.log("==========================================")
            console.log(moment().tz("Asia/Bangkok").format('YYYY-MM-DD HH:mm:SS'), " ==>> ")
            console.log('Get images:', `${foldername}/` + filename);
            console.log("==========================================")
        }
    });
});


// app.listen(PORT, console.log(`Server Started at PORT :${PORT}`))

var server = httpolyglot.createServer(options, app);
server.listen(PORT, () => {
    console.log("httpolyglot server listening on port: " + PORT)
});
