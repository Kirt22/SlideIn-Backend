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

module.exports = { performOCR };