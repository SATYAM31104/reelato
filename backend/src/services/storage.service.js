const ImageKit = require("imagekit");

let imagekit = null;

function getImageKit() {
    if (!imagekit) {
        console.log('Initializing ImageKit with:', {
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? 'Found' : 'Missing',
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? 'Found' : 'Missing',
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ? 'Found' : 'Missing'
        });
        
        imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });
    }
    return imagekit;
}

async function uploadFile(file, fileName) {
    const imagekitInstance = getImageKit();
    const result = await imagekitInstance.upload({
        file: file,
        fileName: fileName
    });
    return result;
}

module.exports = {
    uploadFile
};