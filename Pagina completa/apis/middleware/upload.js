const multer = require("multer");

// Usar memoryStorage: los archivos se mantienen en RAM como Buffer luego se convierten a Base64 en el controller.
const storage = multer.memoryStorage();

// Filtro de archivos: solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Tipo de archivo no permitido. Solo se aceptan: JPEG, PNG, WEBP",
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por archivo
    files: 5, // Máximo 5 archivos
  },
});

module.exports = upload;
