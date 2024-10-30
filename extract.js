const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect('your-mongodb-connection-string')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

// image schema (same as in app.js)
const imageSchema = new mongoose.Schema({
    filename: String,
    originalname: String,
    contentType: String,
    data: Buffer,
    uploadDate: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);

// create the images directory if it does not exist
const outputDir = path.join(__dirname, 'extracted_images');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Function to extract all images
async function extractImages() {
    try {
        const images = await Image.find({});
        console.log(`Found ${images.length} images`);

        for (const image of images) {
            const extension = image.contentType.split('/')[1];
            const filepath = path.join(outputDir, `${image.filename}.${extension}`);
            
            fs.writeFileSync(filepath, image.data);
            console.log(`Extracted: ${filepath}`);
        }

        console.log('Extraction complete!');
    } catch (error) {
        console.error('Error extracting images:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Extract a single image by ID
async function extractSingleImage(imageId) {
    try {
        const image = await Image.findById(imageId);
        if (!image) {
            console.log('Image not found');
            return;
        }

        const extension = image.contentType.split('/')[1];
        const filepath = path.join(outputDir, `${image.filename}.${extension}`);
        
        fs.writeFileSync(filepath, image.data);
        console.log(`Extracted: ${filepath}`);
    } catch (error) {
        console.error('Error extracting image:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run
//all images
extractImages();

//single image
// extractSingleImage('your_image_id');