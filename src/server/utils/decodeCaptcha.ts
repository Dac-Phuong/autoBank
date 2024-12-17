const MIME_PNG = 'image/png';
import Tesseract from "tesseract.js";
import replaceColor from "replace-color";

const decodeCaptcha = async function (captchaRes: any): Promise<string | null> {
  try {
    let captchaBuffer = Buffer.from(captchaRes.imageString, "base64");

    const captchaImagePRCLine1 = await replaceColor({
      image: captchaBuffer,
      colors: {
        type: "hex",
        targetColor: "#847069",
        replaceColor: "#ffffff"
      }
    })
    captchaBuffer = await captchaImagePRCLine1.getBufferAsync(MIME_PNG)
    const captchaImagePRCLine2 = await replaceColor({
      image: captchaBuffer,
      colors: {
        type: "hex",
        targetColor: "#ffe3d5",
        replaceColor: "#ffffff",
      }
    })

    captchaBuffer = await captchaImagePRCLine2.getBufferAsync(MIME_PNG)
    const { data: { text } } = await Tesseract.recognize(
      captchaBuffer,
      'eng',
    );
    const captchaContent = text.replace(/\s+/g, '').slice(0, 6);
    if (captchaContent.length !== 6 || !/^[a-z0-9]+$/i.test(captchaContent)) return null;
    return captchaContent;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}
export default decodeCaptcha