import axios from "axios";
import sharp from "sharp";

export async function getImageDataFromUrl(imageUrl: string) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    const processedImageBuffer = await sharp(imageBuffer).toBuffer();
    const base64Image = processedImageBuffer.toString('base64');
    return base64Image;
  } catch (error) {
    console.error('Error fetching or processing the image:', error);
    throw new Error('Image data issue');
  }
}
