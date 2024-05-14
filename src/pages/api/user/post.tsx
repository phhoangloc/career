
import { NextApiRequest, NextApiResponse } from "next"
import { userModel } from "@/model/user.model"
import connectMongoDB from "@/connect/database/mogoseDB"
import { isDataType } from "@/type/resultType"
import { postModel } from "@/model/post.model"
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
        const host = post && post.host && post.host._id
        if (id) {

            switch (method) {
                case "GET":
                    await postModel.find()
                        .find({ "host": id })
                        .find(query.id ? { "_id": query.id } : {})
                        .find(query.slug ? { "slug": query.slug } : {})
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
                            const user = await userModel.findOne({ "_id": id }, "posts")
                            const posts = user.posts
                            await userModel.updateOne({ "_id": id }, { posts: [...posts, data._id] })
                            result.success = true
                            result.message = "ポストが更新しました。"
                            res.json(result)
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
                                result.success = true
                                result.message = "ポストが更新しました。"
                                res.json(result)
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
            res.send("ログインしていません")
        }
    }

export default Post