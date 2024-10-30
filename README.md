## Image Upload App

This is a Node.js application allows users to upload, display image files stored in MongoDB. It supports image uploads with file size limits, accepts specific formats (JPEG, PNG, GIF), and provides a simple interface for viewing and editing the uploaded image filenames, also validate file types and sizes before upload.



<h3> To run this application </h3>

##

you need:
- **Node.js**
- **MongoDB Atlas Account** (or local MongoDB instance)
- **Git**

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shahdHesham13/Image-Upload-App
   cd Image-Upload-App
   ```

2. **Install dependencies**:
   ```bash
   npm install express mongoose multer ejs dotenv body-parser fs path
   ```
    ```
    npm install --save-dev nodemon
    ```

3. **Set up MongoDB**:
   - If using MongoDB Atlas, create a free cluster and obtain the connection string.
   - Update `mongoose.connect()` in `app.js` with your MongoDB URI:
     ```javascript
     mongoose.connect('your-mongodb-connection-string');
     ```

4. **Run the Application**:
   ```bash
   nodemon app.js
   ```

5. **Access the Application**:
   - Open your browser and go to `http://localhost:3000`.


#
###  Notes
- Static assets are served from the `public` directory.
- Ensure your connection string is correct, and your MongoDB Atlas cluster IP access list includes your IP address.
- If you're working on the code and have doubts about where the error might be, run `connect.js` so it can help you confirm the database connection status
- Ensure the image meets format and size requirements (max 5MB; JPEG, PNG, GIF only).



---

## Extract Images

This script `extract-images.js` extract the images from MongoDB database and save them to a local directory. It connects to a MongoDB database, retrieves images stored with a predefined schema, and writes the images to the file system. it automatically creates a directory named `extracted_images` in the project root to store the extracted images if it doesn't already exist. 
<br>
- The `extractImages` function retrieves all images from the database, saves them to the output directory with the appropriate file extension, and logs the progress to the console.
- The `extractSingleImage` function allows for extracting a specific image by its ID, saving it to the output directory.




###  Setup Instructions
1. **Set up MongoDB**:
   - Update `mongoose.connect()` line with your MongoDB URI:
    
     ```javascript
     mongoose.connect('your-mongodb-connection-string');
     ```
2. **Run the Script**: 
   - Execute the script to extract all images by calling `extractImages()`. 
   - To extract a single image, uncomment the call to `extractSingleImage('your_image_id')` and replace `'your_image_id'` with the actual ID of the image you want to extract.




