const OpenAI = require("openai");
const threadModel = require("../models/thread.js");
const generatedResponseModel = require("../models/generatedResponse.js")
const dotenv = require("dotenv");
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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
            model: "gpt-4o",
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

module.exports = {
    getThreads,
    generateResponse,
    deleteThread,
    getGeneratedResponses,
    deleteAllThread
};
