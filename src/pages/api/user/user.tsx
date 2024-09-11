import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { userModel } from '@/model/user.model'
import { isDataType } from '@/type/resultType'
const jwt = require('jsonwebtoken')
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const query = req.query
    const method = req.method
    const body = req.body
    let result: isDataType = { success: false };
    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]
    const id = token && await jwt.verify(token, 'secretToken').id

    connectMongoDB()
    if (id) {
        switch (method) {
            case "GET":
                await userModel
                    .find({ "_id": id })
                    .catch((error: Error) => {
                        result.success = false
                        result.message = error.message
                        res.send(result)
                        throw error.message
                    }).then(async (data: any) => {
                        result.success = true
                        result.data = data
                        res.json(result)
                    })
                break;
            case "PUT":
                await userModel
                    .updateOne({ "_id": id }, body)
                    .catch((error: Error) => {
                        res.json(result)
                        throw error.message
                    })
                    .then((data: any) => {
                        result.success = true
                        result.data = data
                        res.json(result)
                    })
                break
        }
    } else {
        result.success = false
        result.message = "ログインしていません"
        res.json(result)
    }
}