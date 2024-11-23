import multer from 'multer'
import fs from 'fs';
import path from 'path';

// Cấu hình Multer
const handler = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.resolve('./dist/file/image');
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath); 
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
        const extension = file.originalname.split('.').pop(); 
        cb(null, `image-${uniqueSuffix}.${extension}`);
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, 
    },
    fileFilter: (req, file, cb) => {
      const fileType = file.mimetype.split('/')[0];
      if (fileType !== 'image' && fileType !== 'svg') {
        cb(new Error('Chỉ hỗ trợ tệp hình ảnh (jpg|jpeg|png|webp|gif|svg)'));
      } else {
        cb(null, true);
      }
    },
  });

export default defineEventHandler(async (event) => {
  try {
    // @ts-expect-error
    await callNodeListener(handler.single('image'), event.node.req, event.node.res)
    const file = event.node.req.file
    console.log(file);
    
    const url = `/file/${file.filename}`
    return resp(event, { message: 'Tải hình ảnh thành công', result: url })
  }
  catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})

