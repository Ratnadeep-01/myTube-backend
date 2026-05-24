import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) {
            console.log("file path not found");
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath,
            {
                resource_type: "auto"
            }
        )
        console.log("file uploaded successfully on cloudinary", response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove temporary file locally saved as upload failure
        return null;
    }
}

export {uploadCloudinary};

// const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        })