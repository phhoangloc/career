
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
        const facilites = user.facilities
        const position = user && user.position
        const host = facility && facility.host && facility.host._id
        if (id) {
            switch (method) {
                case "GET":
                    await facilityModel.find()
                //     .find(query.id ? { "_id": query.id } : {})
                //     .find(query.archive ? { "archive": query.archive } : {})
                //     .find(query.search ? { "name": { $regex: query.search } } : {})
                //     .find(query.slug ? { "slug": query.slug } : {})
                //     .find(query.area ? { "area": query.area } : {})
                //     .find(query.lo ? { "location": query.lo } : {})
                //     .skip(query.skip)
                //     .sort(query.sort ? query.sort : {})
                //     .limit(query.limit ? query.limit : {})
                //     .catch((error: Error) => {
                //         result.success = false
                //         result.message = error.message
                //         res.send(result)
                //         throw error.message
                //     }).then(async (data: any) => {
                //         var array: any[] = []
                //         facilites.map((f: any) => data.map((d: any) => {
                //             if (d._id.toString() === f.toString()) { array = [...array, d] }
                //         }))
                //         result.success = true
                //         result.data = array
                //         res.json(result)
                //     })
                // break;
                case "GET":
                    await facilityModel
                        .find({ "host": id })
                        .collation({ locale: 'ja' })
                        .find(query.id ? { "_id": query.id } : {})
                        .find(query.archive ? { "archive": query.archive } : {})
                        .find(query.slug ? { "slug": query.slug } : {})
                        .find(query.search ? { "name": { $regex: query.search } } : {})
                        .find(query.lo ? { "location": query.lo } : {})
                        .find(query.area ? { "area": query.area } : {})
                        .skip(query.skip)
                        .sort(query.sort ? { "name": Number(query.sort) } : {})
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
                            result.message = "施設が作成出来ました。"
                            res.json(result)
                        })
                    break;
                case "PUT":
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

                    break;
                default:
                    res.send("")
            }

        } else {
            result.success = false
            result.message = "ログインしていません"
            res.json(result)
        }
    }

export default Post