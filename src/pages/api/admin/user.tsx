import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { userModel } from '@/model/user.model'
import { isDataType } from '@/type/resultType'
import { facilityModel } from '@/model/facility.model'
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
    const user = await userModel.findOne({ "_id": id })
    const position = user && user.position
    connectMongoDB()
    if (id) {
        if (position === "admin") {
            switch (method) {
                case "GET":
                    await facilityModel.find()
                    await userModel
                        .find(query.id ? { "_id": query.id } : {})
                        .populate("facilities")
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
                        .updateOne({ "_id": query.id }, body)
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
                case "DELETE":
                    await userModel
                        .deleteOne({ "_id": query.id })
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
                default:
                    res.send("")
            }
        } else {
            result.success = false
            result.message = "アドミニストレーターではありません"
            res.json(result)
        }
    } else {
        result.success = false
        result.message = "ログインしていません"
        res.json(result)
    }
}