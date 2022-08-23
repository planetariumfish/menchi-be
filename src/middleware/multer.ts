import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${req.body.id}${path.extname(file.originalname)}`
    );
  },
});

export const upload = multer({ storage });
