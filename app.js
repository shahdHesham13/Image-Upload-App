const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();
//app.use(express.static('public'));

// Connect to MongoDB Atlas
mongoose.connect('your-mongodb-connection-string')
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

//image schema
const imageSchema = new mongoose.Schema({
    filename: String,
    originalname: String,
    contentType: String,
    data: Buffer,
    uploadDate: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);

//multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('I said image files!'));
    }
});

// ejs file as the view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // public folder for static files


/////// Routes
// get and display all files from the database to the main page
app.get('/', async (req, res) => {
    try {
        const files = await Image.find({}, 'filename originalname uploadDate');
        res.render('index', { files, message: '' });
    } catch (error) {
        res.render('index', { files: [], message: 'Error fetching images' });
    }
});
//upload a new image and saves it in the database
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('select an image to upload');
        }

        const customFilename = req.body.filename || req.file.originalname;
        
        const newImage = new Image({
            filename: customFilename,
            originalname: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer
        });

        await newImage.save();
        res.redirect('/');
    } catch (error) {
        const files = await Image.find({}, 'filename originalname uploadDate');
        res.render('index', { files, message: error.message });
    }
});
//update the database with user filename using the id
app.post('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { newFilename } = req.body;
        
        await Image.findByIdAndUpdate(id, { filename: newFilename });
        res.redirect('/');
    } catch (error) {
        const files = await Image.find({}, 'filename originalname uploadDate');
        res.render('index', { files, message: 'Error updating filename' });
    }
});
//display the images
app.get('/image/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        res.contentType(image.contentType);
        res.send(image.data);
    } catch (error) {
        res.status(404).send('Image not found');
    }
});
//start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});