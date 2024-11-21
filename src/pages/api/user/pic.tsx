import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { ImageModel } from '@/model/image.model'
import { isDataType } from '@/type/resultType'
const jwt = require('jsonwebtoken')
const formidable = require('formidable');
const ftp = require("basic-ftp");
const stream = require("stream");
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false, // Tắt bodyParser để sử dụng formidable
    },
};

const image = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {

    connectMongoDB()

    const query = req.query
    const method = req.method
    const result: isDataType = { success: false }


    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]
    const id = await jwt.verify(token, 'secretToken').id
    const image = await ImageModel.findOne({ "_id": query.id })
    const host = image && image.host

    switch (method) {
        case "GET":
            await ImageModel
                .find({ "host": id })
                .find(query.id ? { "_id": query.id } : {})
                .find(query.search ? { "name": { $regex: query.search } } : {})
                .sort({ "createDate": -1 })
                .skip(query.skip)
                .sort(query.sort ? query.sort : {})
                .limit(query.limit ? query.limit : {})
                .catch((error: Error) => {
                    result.success = false
                    result.message = error.message
                    res.json(result)
                })
                .then((data: any) => {
                    result.success = true
                    result.data = data
                    res.json(result)

                })
            break
        case "POST":
            const form = new formidable.IncomingForm();
            await form.parse(req, async (err: Error, fields: any, files: any) => {
                if (err) {
                    throw err
                } else {
                    const uploadFile = files && files.file;

                    const client = new ftp.Client();
                    client.ftp.timeout = 60 * 1000
                    await client.access({
                        host: "www57.onamae.ne.jp",
                        user: "shift@sccj-86th.onamaeweb.jp",
                        password: "_bNY9ABcR8inREh",
                        secure: false // True nếu sử dụng FTPS
                    });


                    await client.uploadFrom(uploadFile[0].filepath, `/keiho-oc.com/img/career/${uploadFile[0].originalFilename}`);

                    const file = await ImageModel.create({ host: id, name: uploadFile[0].originalFilename })

                    res.json(file)
                }
            })
            break
        case "DELETE":
            const image = await ImageModel.findOne({ "_id": query.id })

            if (id.toString() === image.host.toString()) {


                const client = new ftp.Client();

                await client.access({
                    host: "www57.onamae.ne.jp",
                    user: "shift@sccj-86th.onamaeweb.jp",
                    password: "_bNY9ABcR8inREh",
                    secure: false // True nếu sử dụng FTPS
                });

                const result = await client.remove("/keiho-oc.com/img/career/" + image.name);
                if (result) {
                    await ImageModel.deleteOne({ "_id": query.id })
                    res.json({ success: true })
                } else {
                    res.json({ success: false })
                }
                break;
            } else {
                res.json({
                    msg: "この画像はあなたの画像ではありません。",
                    success: false
                })

            }
    }
}


export default image