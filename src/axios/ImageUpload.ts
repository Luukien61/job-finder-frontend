import axios from "axios";

type Props = {
    image: string | null
};
//const rawImageUrl ='data:image/jpeg;base64'
const imageUpload = async ({image}: Props): Promise<string | null> => {
    const rawImageRegex = /^data:image\/\w+/;

    // const rawRegex= `^https:\\/\\/res\\.cloudinary\\.com\\/${cloudName}\\/image\\/upload\\/v`;
    // const regex = new RegExp(rawRegex);
    let url: string | null = null;

    if (!image) return url;

    if(!rawImageRegex.test(image)){
        return image;
    }
    const cloudName : string = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'unsigned_preset');
    try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
        url = response.data.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
    return url;
};

const pdfUpload = async (file : string | null): Promise<string | null> => {

    let url: string | null = null;
    if(!file) return null;
    const cloudName : string = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_preset');
    try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
        url = response.data.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
    return url;;
}

export default imageUpload;
