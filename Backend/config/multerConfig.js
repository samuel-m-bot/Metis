const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');

// Google Cloud Storage setup
const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    projectId: 'metis-421507'
});

const bucket = storage.bucket('metis_bucket_1');

// Multer upload storage configuration
const multerStorage = multer.memoryStorage();

// File filter to check if uploaded file is valid
const fileFilter = (req, file, cb) => {
    const filetypes = /stp|step|igs|iges|dwg|dxf|obj|stl|jpeg|jpg|png|gif|doc|docx|pdf|xls|xlsx|ppt|pptx|txt|csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        cb(null, true);
    } else {
        cb(new Error('Error: Invalid file type!'), false);
    }
};

// Initialize upload variable
const upload = multer({ 
    storage: multerStorage,
    limits: { fileSize: 1000000 },  // 1MB limit
    fileFilter: fileFilter
});

// Middleware to upload file to Google Cloud Storage
const uploadFileToStorage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }

        let newFileName = `${Date.now()}_${file.originalname}`;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
            // Public URL that can be used to directly access the file via HTTP.
            const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
};

module.exports = { upload, uploadFileToStorage };