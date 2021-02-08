const bucket = require('../../storage/storage')

async function urlFromGoogleCloud(fileName){
    const url = await bucket.file(fileName).getSignedUrl({
        action: 'read',
        expires:  '03-09-2491'
    })
    return url[0]
}

module.exports = urlFromGoogleCloud