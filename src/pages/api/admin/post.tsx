
import { NextApiRequest, NextApiResponse } from "next"
import { userModel } from "@/model/user.model"
import connectMongoDB from "@/connect/database/mogoseDB"
import { isDataType } from "@/type/resultType"
import { postModel } from "@/model/post.model"
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
        const post = await postModel.findOne({ "_id": query.id })
        const workplace = post?.workplace
        const currentfacility = await facilityModel.findOne({ "_id": workplace })
        const currentworks = currentfacility?.work
        const facility = await facilityModel.findOne({ "_id": body.workplace })
        const works = facility?.work
        const user = await userModel.findOne({ "_id": id })
        const position = user && user.position

        const host = post && post.host && post.host._id
        if (id) {
            if (position === "admin") {

                switch (method) {
                    case "GET":
                        await postModel.find()
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
                        await postModel.create(body)
                            .catch((error: Error) => {
                                result.success = false
                                result.message = error.message
                                res.send(result)
                                throw error.message
                            }).then(async (data: any) => {
                                await facilityModel.updateOne({ "_id": body.workplace }, { work: [...works, data._id] })
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
                            })
                        break;
                    case "PUT":
                        if (host.toString() === id.toString()) {
                            body.host = id
                            await postModel.updateOne({ "_id": query.id }, body)
                                .catch((error: Error) => {
                                    result.success = false
                                    result.message = error.message
                                    res.send(result)
                                    throw error.message
                                }).then(async (data: any) => {
                                    currentworks && await facilityModel.updateOne({ "_id": workplace }, { work: [...currentworks.filter((w: any) => w != query.id)] })
                                    await facilityModel.updateOne({ "_id": body.workplace }, { work: [...works.filter((w: any) => w != query.id), query.id] })
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
                                })
                        }
                        break;
                    case "DELETE":
                        if (host.toString() === id.toString()) {
                            await postModel.deleteOne({ "_id": query.id })
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