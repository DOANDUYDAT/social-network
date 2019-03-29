const multer = require('multer');
const path = require('path');


// cấu hình và cài đặt 
// upload nhiều ảnh lên
// Set The Storage Engine
const storageAvatar = multer.diskStorage({
	destination: path.join(__dirname, '../public/uploads/avatars/'),
	filename: function (req, file, cb) {
		cb(null, file.fieldname + new Date().toISOString().replace(/:/g, '-') + file.originalname);
	}
});
const storagePost = multer.diskStorage({
	destination: path.join(__dirname, '../public/uploads/posts/'),
	filename: function (req, file, cb) {
		cb(null, file.fieldname + new Date().toISOString().replace(/:/g, '-') + file.originalname);
	}
});

// Init Upload
const uploadAvatar = multer({
	storage: storageAvatar,
	limits: { fileSize: 1024 * 1024 },
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	}
}).single('avatar');

const uploadPost = multer({
	storage: storagePost,
	limits: { fileSize: 1024 * 1024 * 10 },
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	}
}).array('photos', 10); // upload tối đa 10 ảnh cùng lúc

// Check File Type
function checkFileType(file, cb) {
	// Allowed ext
	const filetypes = /jpeg|jpg|png|gif/;
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		return cb(new Error('Images Only!'));
	}
}


module.exports = {
	uploadAvatar: uploadAvatar,
	uploadPost: uploadPost
}