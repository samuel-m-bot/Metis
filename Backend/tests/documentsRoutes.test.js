const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { upload, uploadFileToStorage } = require('../config/multerConfig');
const documentsController = require('../controllers/documentsController');
const verifyJWT = require('../middleware/verifyJWT');
const mongoose = require('mongoose');
require('dotenv').config();
const { Readable } = require('stream');
// Mock Google Cloud Storage and Multer
jest.mock('@google-cloud/storage', () => {
    return {
        Storage: jest.fn().mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    createWriteStream: () => {
                        const stream = new (require('stream')).Writable();
                        process.nextTick(() => {
                            stream.emit('finish');
                        });
                        stream.write = (chunk, encoding, callback) => {
                            callback();
                        };
                        return stream;
                    }
                })
            })
        }))
    };
});

jest.mock('../config/multerConfig', () => ({
    upload: {
        single: () => (req, res, next) => {
            req.file = { // Simulate multer adding a file to the request
                originalname: 'testfile.pdf',
                mimetype: 'application/pdf',
                buffer: Buffer.from('This is a test file content')
            };
            next();
        }
    },
    uploadFileToStorage: jest.fn().mockResolvedValue('https://storage.googleapis.com/bucket/testfile.pdf')
}));


// Mocking the verifyJWT middleware to inject a user and log the operation
jest.mock('../middleware/verifyJWT', () => {
    return (req, res, next) => {
        // Setting up req.user with predefined values
        req.user = {
            email: 'test@example.com',
            _id: '6622c5614d79ae6e24475f64', // Ensure this ID is a valid MongoDB ObjectId string
            roles: ['admin']
        };

        console.log('Mock verifyJWT executed: req.user set', req.user);

        next(); // Proceed to the next middleware or route handler
    };
});



// Setup express app as per your actual setup
const app = express();
app.use(bodyParser.json());
app.get('/documents/:id/download', verifyJWT, documentsController.downloadDocumentFile);

app.post('/documents', upload.single('documentFile'), async (req, res, next) => {
    if (req.file) {
        try {
            const fileUrl = await uploadFileToStorage(req.file);
            req.fileUrl = fileUrl;  // Attach the URL to the request object to be used in the next middleware
            next();  // Proceed to create the new document
        } catch (error) {
            res.status(500).json({ message: 'Failed to upload file', error: error.message });
        }
    } else {
        next();  // No file to upload, proceed to create the document
    }
}, documentsController.createNewDocument);

describe('Document Routes - File Upload', () => {
    const mongoose = require('mongoose');

    beforeAll(async () => {
        // Ensure MongoDB is connected
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        // Disconnect MongoDB
        await mongoose.disconnect();
    });

    test('File upload and document creation', async () => {
        const response = await request(app)
            .post('/documents')
            .send({
                projectId: new mongoose.Types.ObjectId(),
                title: 'Test Document',
                type: 'Design', // Ensure this matches schema enum
                description: 'Description of the test document',
                revisionNumber: 'A.1',
                authors: [new mongoose.Types.ObjectId()],
                status: 'Draft',
                classification: 'Confidential'
            });

        if (response.statusCode !== 201) {
            console.error('Error response:', response.error, response.body);
        }

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(uploadFileToStorage).toHaveBeenCalled();
    }, 30000); // Increase timeout for this test to 30 seconds
});

// // Assume Document is your Mongoose model for documents, you need to mock it for the test
// const Document = require('../models/Document');
// jest.mock('../models/Document', () => ({
//     findById: jest.fn().mockImplementation(id => {
//         return Promise.resolve({
//             _id: id,
//             attachment: {
//                 filePath: 'https://storage.googleapis.com/metis_bucket_1/somefile.pdf',
//                 fileName: 'somefile.pdf'
//             }
//         });
//     })
// }));

// describe('Document Routes - Download', () => {
//     test('File download for an existing document', async () => {
//         const response = await request(app)
//             .get('/documents/6622c5614d79ae6e24475f64/download')
//             .set('Authorization', 'Bearer valid-token');  // Assuming you have a way to handle this

//         expect(response.status).toBe(200);
//         expect(response.headers['content-type']).toBe('application/pdf');
//     });

//     test('File download for a non-existent document', async () => {
//         Document.findById.mockResolvedValue(null);  // Simulate no document found

//         const response = await request(app)
//             .get('/documents/nonexistent/download')
//             .set('Authorization', 'Bearer valid-token');

//         expect(response.status).toBe(404);
//         expect(response.body.message).toBe('Document not found or no attachment present');
//     });
// });


