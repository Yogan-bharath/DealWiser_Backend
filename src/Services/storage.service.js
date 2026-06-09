import { ImageKit } from "@imagekit/nodejs/client.js";

const client = new ImageKit({
    privateKey:process.env.IMAGE_KIT
})

const uploadFileToImageKit =async (file)=>{
    const result = await client.files.upload({
        file,
        fileName:`product_${Date.now()}`
    })
    return result;
}

export default uploadFileToImageKit