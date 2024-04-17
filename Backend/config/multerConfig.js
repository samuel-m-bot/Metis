const multer = require('multer');
const path = require('path');

// Check file type
const fileFilter = (req, file, cb) => {
    // Allowed ext
    const filetypes = /stp|step|igs|iges|dwg|dxf|obj|stl|jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        cb(null, true);
    } else {
        cb(new Error('Error: Invalid file type!'), false);
    }
};

// Set storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1000000 },  // 1MB limit
    fileFilter: fileFilter
});

module.exports = upload;
