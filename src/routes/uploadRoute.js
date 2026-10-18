// src/routes/uploadRoute.js
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder in your Cloudinary accounta
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024, files: 1 } });

router.post('/upload', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });
    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: req.file.path,
    });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

export default router;
