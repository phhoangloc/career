
import { NextApiRequest, NextApiResponse } from "next"
import { userModel } from "@/model/user.model"
import connectMongoDB from "@/connect/database/mogoseDB"
import { isDataType } from "@/type/resultType"
import { postModel } from "@/model/post.model"
import { productModel } from "@/model/product.model"
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
        const nicknameId = post && post.nicknameId && post.nicknameId._id

        switch (method) {
            case "GET":
                await productModel.find()
                    .find(query.id ? { "_id": query.id } : {})
                    .populate({
                        path: 'comments',
                        select: 'content nicknameId',
                        populate: { path: 'nicknameId', select: "nickname" }
                    })
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
                await productModel.create(body)
                    .catch((error: Error) => {
                        result.success = false
                        result.message = error.message
                        res.send(result)
                        throw error.message
                    }).then(async (data: any) => {
                        result.success = true
                        result.message = "your post is created"
                        res.json(result)
                    })
                break;
            case "PUT":
                if (nicknameId.toString() === id.toString()) {
                    body.nicknameId = id
                    await postModel.updateOne({ "_id": query.id }, body)
                        .catch((error: Error) => {
                            result.success = false
                            result.message = error.message
                            res.send(result)
                            throw error.message
                        }).then(async (data: any) => {
                            result.success = true
                            result.message = "your post is update"
                            res.json(result)
                        })
                }
                break;
            case "DELETE":
                await productModel.deleteOne({ "_id": query.id })
                    .catch((error: Error) => {
                        result.success = false
                        result.message = error.message
                        res.send(result)
                        throw error.message
                    }).then(async (data: any) => {
                        result.success = true
                        result.message = "your product is delete"
                        res.json(result)
                    })
                break;
            default:
                res.send("your method is not supplied")
        }
    }

export default Post