const {Storage,} = require('@google-cloud/storage')
const path = require('path')

const googleStorage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: `${path.resolve(__dirname, '..') + process.env.GCLOUD_APPLICATION_CREDENTIALS}`
})


module.exports =  googleStorage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL)
