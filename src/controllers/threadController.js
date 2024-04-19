const OpenAI = require("openai");
// const cloudinary = require("cloudinary").v2;

const threadModel = require("../models/thread.js");
const userModel = require("../models/user.js");
const generatedResponseModel = require("../models/generatedResponse.js")
const dotenv = require("dotenv");
const user = require("../models/user.js");
dotenv.config();

// const { verifyImage } = require("../verificationModule/verification");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// cloudinary.config({
//   cloud_name: "your_cloud_name",
//   api_key: "your_api_key",
//   api_secret: "your_api_secret",
// });

// Provide context about the tool's purpose and the AI model being used
const toolContext =
    "You are a pickup line generation tool. Assist the user in creating a personalized pickup line. You are taking the prompts given by the users from a dating app, you need to generate a response such that it leads to a potential match for the user. The specific senario being:";

const getThreads = async (req, res) => {
    try {
        const sessions = await threadModel.find({ userId: req.userId });
        res.status(200).json(sessions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getGeneratedResponses = async (req, res) => {
    try {
        // Modify the code so that we get inputPromptModles _id directly in req.body
        // check in android if this is posssible
        const id = req.params.id;

        const sessions = await generatedResponseModel.find({ promptId: id });

        res.status(200).json(sessions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const generateResponse = async (req, res) => {
    // Extract parameters from the request body
    const { userPrompt, tweakingParameters } = req.body;
    const userId = req.userId;
    let generatedResponse;

    // Generate a ChatGPT response
    try {
        // Build the input string with the refined context and tweaking parameter levels
        const chatGPTInput = `${toolContext}\n${userPrompt} and the tweaking parameter levels are (from):\n1) Flirty: ${tweakingParameters.flirty}\n2) Insulting: ${tweakingParameters.rude}\n3) Cheezy: ${tweakingParameters.cheezy}\n4) Naughty: ${tweakingParameters.naughty}\n(The response generated should not exceed 120 charaters and should not be enclosed in double quotes)`;

        // Make a request to OpenAI's Chat API
        const chatGPTResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: chatGPTInput }],
        });

        // Extract the generated response from the API result
        generatedResponse = chatGPTResponse.choices[0].message.content;

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }

    try {

        let newThread;
        let newThreadId;

        const result = await threadModel.findOne({
            inputPrompt: userPrompt,
            userId: userId
        });
        if (!result) {
            newThread = await threadModel.create({
                inputPrompt: userPrompt,
                userId: userId,
            });
            newThreadId = newThread._id;
        } else {
            newThreadId = result._id;
        }

        let newGeneratedResponse = await generatedResponseModel.create({
            tweakingParameters: tweakingParameters,
            generatedResponse: generatedResponse,
            promptId: newThreadId,
        });

        return res.status(201).json(newGeneratedResponse);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// Maybe add it
/*const generateTweakedRes = (req, res) => {

}*/

const deleteThread = async (req, res) => {
    const id = req.params.id;
    try {
        const query1 = { promptId: id };
        const query2 = { _id: id };

        const generatedResponse = await generatedResponseModel.deleteMany(query1);
        const Thread = await threadModel.deleteOne(query2);

        res.status(202).json({ Thread, generatedResponse });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const deleteAllThread = async (req, res) => {

    id = req.params.id;
    try {
        // Find all threads associated with the userId
        const threads = await Thread.find({ id });

        // Iterate over each thread and delete associated generated responses
        for (const thread of threads) {
            await GeneratedResponse.deleteMany({ promptId: thread._id });
        }

        // Delete all threads associated with the userId
        const acknowledgement = await Thread.deleteMany({ userId });

        res.status(202).Json({message: acknowledgement});

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const getLeaderBoard = async (req, res) => {
    try {
        // Fetch all users
        const users = await userModel.find();

        // Extract username and score properties from each user
        const usersData = users.map((user) => ({
            username: user.username,
            score: user.score,
        }));

        return usersData;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

const updateUserScore = async (req, res) => {
    // Upload the image to Cloudinary
    // const uploaded = await cloudinary.uploader.upload(req.file.buffer.toString('base64'), {
    //   folder: 'user_images', // Specify the folder in Cloudinary
    // });

    // // Update user score or perform other processing with the Cloudinary URL (result.url)
    // const imageUrl = uploaded.url;

    // get the image
    // verify the image
    // update the score
    // get the user from the userId
    // get the current score
    // increment it by 1

    const id = req.params.id;

    // Also reconsider this, I dont think you need a increment value because
    // it is always gonna be 1, also it would be better if I have a request
    // that just fetches the userdata
    const { increment } = req.body;

    let imgFile;

    // Reconsider this case, I dont think image file can be null
    if (req.file) {
        imgFile = req.file.path;
    } else {
        console.log("File not found");
        res.status(500).json({ message: "File not found" });
    }

    // Verify the image
    let result;
    try {
        result = await verifyImage(imgFile);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unexpected error" });
    }

    if (result.similarity) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(
                id,
                { $inc: { score: increment } },
                { new: true }
            );
            res.status(200).json({ message: "Score Updated!" }, updatedUser);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    } else {
        res.status(400).json({ message: "Verification Failed" });
    }
};

module.exports = {
    getThreads,
    generateResponse,
    deleteThread,
    getLeaderBoard,
    updateUserScore,
    getGeneratedResponses
};
