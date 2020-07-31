const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express');
const formidable = require('formidable');
const fs = require('fs').promises;
const Jimp = require('jimp');

const app = express();

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    // allows download from a page
    res.set('Content-Disposition', 'attachment');
    next();
});
app.use(cors())
app.use(express.static('transformed'))
app.use(bodyParser.urlencoded({extended: false}))

app.listen(8081)

app.post('/transform', async (req, res, next) => {
    const supportedImageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp'];
    const imageTypeToExtensionHash = {
        'image/png': 'png',
        'image/jpg': 'jpg',
        'image/jpeg': 'jpeg',
        'image/bmp': 'bmp',
    }
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.send({error: 'something wrong with form'});
            return
        }
        if (supportedImageTypes.indexOf(files.image.type) === -1) {
            res.send({error: 'file type not supported'});
            return
        }
        if (!files.image) {
            res.send({error: 'no image here'});
            return
        }
        if (!fields.ext) {
            res.send({error: 'no extension'});
            return
        }

        let originalFilePath = `${__dirname}/files/${files.image.name}`;

        let jimpObject = await Jimp.read(files.image.path);
        // get extensions we want to transform to
        let transformedFileExtensions = imageTypeToExtensionHash[fields.ext];
        //save path
        let transformedFilePath = `${(new Date()).getTime().toString(36)}.${transformedFileExtensions}`;
        await jimpObject.writeAsync(`transformed/${transformedFileExtensions}/${transformedFilePath}`);
        res.send({url: `${req.protocol}://${req.headers.host}/${transformedFileExtensions}/${transformedFilePath}`});
    });
})
