import multer from 'multer';

export const dpMiddleware = multer().single("avatar"); //avatar = attribute of the file input field in the form
