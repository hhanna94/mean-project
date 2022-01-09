const multer = require("multer");

// Helper to get the file extension from the image upload.
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

// Defining where multer should put files which it detects in an incoming request
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // This is validated on the front end as well, but this validates the file type on the back-end.
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null
    }
    cb(error, "server/images")
  },
  filename: (req, file, cb) => {
    // any white space in the name will be replaced with a dash
    const name =  file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  }
});

module.exports = multer({storage: storage}).single("image");
