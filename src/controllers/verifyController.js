const { performOCR } = require('../utils/OCRUtils');
const generatedResponseModel = require("../models/generatedResponse.js")
const OpenAI = require("openai");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECERT_KEY,
    },
});

const JsonFormat = "\'{\"verify\": \"true/flase\"}\'";

const verify = async (req, res) => {

    const { generatedResponseID } = req.body;
    const userId = req.userId;
    let extractedText = "";
    let generatedLine = "";
    let chatGPTInput = "";

    try {

        // get image URL from AWS S3
        const imageURL = await getImageURL(userId, generatedResponseID);

        // get extracted text from image
        extractedText = await performOCR(imageURL);

        // get generated response from DB
        const result = await generatedResponseModel.findOne({ _id: generatedResponseID });
        generatedLine = result.generatedResponse;

        // from chatGPT input
        chatGPTInput = `Return a JSON response in the following format ${JsonFormat}, if you find \'${generatedLine}\' in the following text: \'${extractedText}\'. Only return the JSON object without any additional formatting or text.`;

    } catch (error) {
        console.error(error);
    }

    try {

        // get response from chatGPT
        const chatGPTResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: chatGPTInput }],
        });

        console.log(chatGPTResponse.choices[0].message.content);
        const JSONresponse = JSON.parse(chatGPTResponse.choices[0].message.content);

        // change isVerified status in DB
        if (JSONresponse.response) {
            const result = generatedResponseModel.update(
                { _id : generatedResponseID}, 
                {
                    $set: {
                        isVerified: true
                    }
                }
            );
            console.log(result);
        }

        // todo: update user score

        res.status(200).json(JSONresponse);


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const getPresignedURL = async (req, res) => {
    //returns presigned url
    const userId = req.userId;
    const generatedResponseId = req.body;

    try {

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userId}/${generatedResponseId.id}.jpeg`,
            contentType: "image/jpeg"
        });

        const presignedURL = await getSignedUrl(s3Client, command, {
            expiresIn: 3600
        });

        res.json({ presignedURL });

    } catch (error) {
        console.error(error);
    }

}

async function getImageURL(userId, key) {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userId}/${key}.jpeg`,
        });

        const url = await getSignedUrl(s3Client, command, {
            expiresIn: 3600
        });
        
        // get cloudFrot url from s3 url

        console.log(url);

        return url;

    } catch (error) {
        console.error(error);
    }
}

// (async () => {
//     try {
//         getImageURL("665cc198a55bbde3d29a5f31", "665d6ad7a55bbde3d29a5f3c");
//     } catch (error) {
//         console.error(error);
//     }
// })();

module.exports = { verify, getPresignedURL };