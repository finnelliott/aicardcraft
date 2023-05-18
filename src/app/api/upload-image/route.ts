import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

export async function POST(request: Request) {
    const { base64img } = await request.json();
    const spacesEndpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com');
    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        region: 'ams3',
        accessKeyId: process.env.DO_SECRET_ID,
        secretAccessKey: process.env.DO_SECRET
    });
    async function fetchAndUpload(base64img: string) {
        try {
  
            const uploadParams = {
                Bucket: 'uniquegreetings',
                Key: uuid() + ".png",
                Body: Buffer.from(base64img, 'base64'),
                ContentType: "image/png",
                ACL: 'public-read' // Optional: Set this if you want the file to be publicly accessible
            };
    
            const data = await s3.upload(uploadParams).promise();
  
            console.log(data)
  
            return data["Location"]
        } catch (error) {
            console.error('Error fetching or uploading the file:', error);
            throw error;
        }
    }
    const url = await fetchAndUpload(base64img);
    return new Response(JSON.stringify({ url }));
}