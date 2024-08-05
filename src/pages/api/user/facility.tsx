
import { NextApiRequest, NextApiResponse } from "next"
import { userModel } from "@/model/user.model"
import connectMongoDB from "@/connect/database/mogoseDB"
import { isDataType } from "@/type/resultType"
// import { facilityModel } from "@/model/interview.model"
import { facilityModel } from "@/model/facility.model"
const jwt = require('jsonwebtoken')

const Post =
    async (
        req: NextApiRequest,
        res: NextApiResponse
    ) => {

        let result: isDataType = { success: false };
        let method = req.method
        let body = req.body
        let query = req.query

        connectMongoDB()

        const authorization = req.headers['authorization']
        const token = authorization && authorization.split(" ")[1]
        const id = await jwt.verify(token, 'secretToken').id
        const facility = await facilityModel.findOne({ "_id": query.id })
        const user = await userModel.findOne({ "_id": id })
        const position = user && user.position
        const host = facility && facility.host && facility.host._id
        if (id) {
            if (position === "admin") {
                switch (method) {
                    case "GET":
                        await facilityModel.find()
                            .find({ "host": id })
                            .find(query.id ? { "_id": query.id } : {})
                            .find(query.archive ? { "archive": query.archive } : {})
                            .find(query.slug ? { "slug": query.slug } : {})
                            .skip(query.skip)
                            .sort(query.sort ? query.sort : {})
                            .limit(query.limit ? query.limit : {})
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
                    case "POST":
                        body.host = id
                        await facilityModel.create(body)
                            .catch((error: Error) => {
                                result.success = false
                                result.message = error.message
                                res.send(result)
                                throw error.message
                            }).then(async (data: any) => {
                                result.success = true
                                result.message = "ポストが作成出来ました。"
                                res.json(result)
                            })
                        break;
                    case "PUT":
                        if (host.toString() === id.toString()) {
                            body.host = id
                            await facilityModel.updateOne({ "_id": query.id }, body)
                                .catch((error: Error) => {
                                    result.success = false
                                    result.message = error.message
                                    res.send(result)
                                    throw error.message
                                }).then(async (data: any) => {
                                    result.success = true
                                    result.message = "ポストが更新出来ました。"
                                    res.json(result)
                                })
                        }
                        break;
                    case "DELETE":
                        if (host.toString() === id.toString()) {
                            await facilityModel.deleteOne({ "_id": query.id })
                                .catch((error: Error) => {
                                    result.success = false
                                    result.message = error.message
                                    res.send(result)
                                    throw error.message
                                }).then(async (data: any) => {
                                    result.success = true
                                    result.message = "あなたのメソッドは無効です"
                                    res.json(result)
                                })
                        }
                        break;
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

export default Post