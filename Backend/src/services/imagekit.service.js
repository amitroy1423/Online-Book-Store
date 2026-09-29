const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const uploadImage = async (file) => {
    try {
        const response = await imagekit.files.upload({
            file: file.buffer.toString("base64"),
            fileName: file.originalname,
            folder: "book-store-images",
        });

        return response.url;
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
};

module.exports = {
    uploadImage,
};