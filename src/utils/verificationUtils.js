const fs = require("fs");
const { createWorker } = require("tesseract.js");
const dotenv = require("dotenv");
dotenv.config();

// Initialize Tesseract.js worker
let worker; // Declare worker globally

// Function to initialize worker
async function initializeWorker() {
    worker = await createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
}

// Function to perform OCR on an image file
async function performOCR(imagePath) {
    try {
        // Load the image
        const imageBuffer = fs.readFileSync(imagePath);

        // Recognize text from image
        const { data: { text } } = await worker.recognize(imageBuffer);
        
        return text;
    } catch (error) {
        console.error("Error performing OCR:", error);
        return null;
    }
}

// Usage example
async function verifyImage(imagePath) {
    try {
        // Perform OCR on the image
        const extractedText = await performOCR(imagePath);

        // Process the extracted text as needed
        console.log("Extracted text:", extractedText);
        
        // Perform further processing and validation based on the extracted text
        // (e.g., checking for specific keywords indicating a match)
    } catch (error) {
        console.error("Error verifying image:", error);
    }
}

// Initialize worker and call verifyImage
(async () => {
    try {
        await initializeWorker();
        await verifyImage("/Users/kirtansolanki/Desktop/SlideIn Backend/src/assets/bumble true img.jpeg");
        await verifyImage("/Users/kirtansolanki/Desktop/SlideIn Backend/src/assets/false img.jpeg");
        await verifyImage("/Users/kirtansolanki/Desktop/SlideIn Backend/src/assets/hinge true img.jpeg");
    } catch (error) {
        console.error("Error initializing worker:", error);
    }
})();


//module.exports = { verifyImage };



// const fs = require("fs");
// const OpenAI = require("openai");
// const dotenv = require("dotenv");
// dotenv.config();

// const openai = new OpenAI({
//     apiKey: process.env.API_KEY
// });

// const image1Path = "/Users/kirtansolanki/Downloads/image1.jpeg";
// const image2Path = "/Users/kirtansolanki/Downloads/image2.jpeg";

// const image1Buffer = fs.readFileSync(image1Path);
// const image2Buffer = fs.readFileSync(image2Path);

// const base64Img1 = Buffer.from(image1Buffer).toString("base64");
// const base64Img2 = Buffer.from(image2Buffer).toString("base64");

// async function verifyImage(image) {

//     try {
//         // Read File
//         const imageBuffer = fs.readFileSync(image);
//         const base64Img = Buffer.from(imageBuffer).toString("base64");

//         // Generate GPT response
//         const completion = await openai.chat.completions.create({
//             model: "gpt-4-vision-preview",
//             messages: [
//                 {
//                     role: "user",
//                     content: [
//                         {
//                             type: "text",
//                             text: "Given to you are three images, the first two images are used to compare with the third image. The third image has to be in a similar style of that of the first two images if it is not then return false else return the name on the profile. the response has to be in a json format response { similarity : true, name : xyz (if similarity is true) }"
//                         },
//                         {
//                             type: "image_url",
//                             image_url: {
//                                 "url": base64Img1,
//                                 "detail": "low"
//                             }
//                         },
//                         {
//                             type: "image_url",
//                             image_url: {
//                                 "url": base64Img2,
//                                 "detail": "low"
//                             }
//                         },
//                         {
//                             type: "image_url",
//                             image_url: {
//                                 "url": base64Img,
//                                 "detail": "low"
//                             }
//                         }
//                     ]
//                 }
//             ]
//         });

//         response = completion.choices[0].message.content;

//         // Convert response to JSON format
//         try {
//             const jsonObject = JSON.parse(response);
//             return jsonObject;
//         } catch (error) {
//             console.error('Error parsing JSON:', error.message);
//         }

//     } catch (error) {
//         console.log(error);
//         return error;
//     }
// }

// module.exports = { verifyImage };