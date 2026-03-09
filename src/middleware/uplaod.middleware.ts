import multer from 'multer';
import path from 'path';



const storage = multer.diskStorage({
    destination:(_req,_file,cb)=>{
        cb(null,'uploads/students');
    },
    filename: (_req,file,cb)=>{
        const uniqueName = Date.now()+'-'+ Math.round(Math.random()*1e9);

        cb(null,`${file.fieldname}-${uniqueName}${path.extname(file.originalname)}`);
    }
});

export const uploadStudentphoto = multer({
    storage,
    limits:{
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (_req, file, cb)=>{
        const allowTypes = /jpeg|jpg|png/;
        const isValid = allowTypes.test(file.mimetype)&&
        allowTypes.test(path.extname(file.originalname).toLowerCase());

        if (isValid) 
        {
            cb(null, true);
        } else 
        {
            cb(undefined as any, false);
        }
    }
})
