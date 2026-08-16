const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist dynamically
const ensureUploadDir = (dirName) => {
    const dirPath = path.join(__dirname, '../../public/uploads', dirName);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    return dirPath;
};

// Factory function to create multer instance for a specific table/folder
const getUploadMiddleware = (folderName) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = ensureUploadDir(folderName);
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });

    const fileFilter = (req, file, cb) => {
        // Accept images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else if (file.mimetype === 'application/pdf') { // For CV or documents
            cb(null, true);
        } else {
            cb(new Error(`Định dạng file không được hỗ trợ cho ${file.fieldname}`), false);
        }
    };

    return multer({ 
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
    });
};

const uploadProfile = getUploadMiddleware('profile');
const uploadProjects = getUploadMiddleware('projects');
const uploadPosts = getUploadMiddleware('posts');
const uploadSkills = getUploadMiddleware('skills');
const uploadTechnologies = getUploadMiddleware('technologies');

module.exports = {
    uploadProfile,
    uploadProjects,
    uploadPosts,
    uploadSkills,
    uploadTechnologies,
    getUploadMiddleware
};
