const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const profileUploadDir = path.join(__dirname, '../../public/uploads/profile');
if (!fs.existsSync(profileUploadDir)) {
    fs.mkdirSync(profileUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // We can check file fieldname to put in different folders if needed later, 
        // but for now, both avatar and cv go to profile/
        cb(null, profileUploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'avatar' || file.fieldname === 'cover_photo') {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error(`Chỉ chấp nhận file ảnh (jpg, jpeg, png) cho ${file.fieldname}`), false);
        }
    } else if (file.fieldname === 'cv') {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file PDF cho CV'), false);
        }
    } else {
        cb(null, true); // For other potential files
    }
};

const uploadProfile = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = {
    uploadProfile
};
