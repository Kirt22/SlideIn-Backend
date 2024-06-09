const axios = require("axios");
const { createWorker } = require("tesseract.js");
const dotenv = require("dotenv");
dotenv.config();

// Initialize Tesseract.js worker
let worker; // Declare worker globally

// Function to initialize worker
async function initializeWorker() {
    worker = await createWorker();
}

// Function to fetch image from URL and perform OCR
async function performOCR(imageUrl) {
    try {

        await initializeWorker();
        //await initializeWorker();
        // Fetch the image as a buffer
        console.log("entered axios, Image URL:", imageUrl);
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // Recognize text from image buffer
        const { data: { text } } = await worker.recognize(imageBuffer);
        console.log("Extracted text:", text);
        return text;
    } catch (error) {
        console.error("Error performing OCR:", error);
        return null;
    }
}

// Usage example
async function verifyImage(imageUrl) {
    try {
        // Perform OCR on the image
        const extractedText = await performOCR(imageUrl);
        console.log("Extracted text:", extractedText);
        return extractedText;
    } catch (error) {
        console.error("Error verifying image:", error);
    }
}

// Initialize worker and call verifyImage
// (async () => {
//     try {
//         await performOCR("https://slidein-data-store.s3.eu-north-1.amazonaws.com/665cc198a55bbde3d29a5f31/665d6ad7a55bbde3d29a5f3c.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXUCE2HCDBJP33RIF%2F20240608%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20240608T134159Z&X-Amz-Expires=3600&X-Amz-Signature=ca8e696a5dfa1c50a0342ce514b5081687899e1db681a12005cdb404c965d312&X-Amz-SignedHeaders=host&x-id=GetObject");
//         //await performOCR("https://d3banoqa8runj6.cloudfront.net/665cc198a55bbde3d29a5f31/665d6ad7a55bbde3d29a5f3c.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXUCE2HCDBJP33RIF%2F20240608%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20240608T132651Z&X-Amz-Expires=3600&X-Amz-Signature=4e1ad0aa90d26a707890214da500ae307c0d768b168681503abcb2c5fb0a8a02&X-Amz-SignedHeaders=host&x-id=GetObject");
//     } catch (error) {
//         console.error("Error initializing worker:", error);
//     }
// })();

module.exports = { performOCR };