const chatModel = require('../models/chatModel');

const getChatView = async (req, res) => {
    try {
        const messages = await chatModel.getChatMessages();
        res.render('chatView', { user: req.user, messages });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};

module.exports = {
    getChatView
}