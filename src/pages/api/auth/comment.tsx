
import { NextApiRequest, NextApiResponse } from "next"
import { userModel } from "@/model/user.model"
import connectMongoDB from "@/connect/database/mogoseDB"
import { isDataType } from "@/type/resultType"
import { postModel } from "@/model/post.model"
import { commentModel } from "@/model/comment"
import { transporter } from "../signup"
import { productModel } from "@/model/product.model"
const jwt = require('jsonwebtoken')

const Comment =
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

        const comment = await commentModel.findOne({ "_id": query.id })
        const nicknameId = comment && comment.nicknameId && comment.nicknameId._id


        switch (method) {
            case "GET":
                await commentModel.find()
                    .find(query.id ? { "_id": query.id } : {})
                    .find(query.postId ? { "postId": query.postId } : {})
                    .populate("postId nicknameId", "title nickname")
                    .sort({ "createDate": -1 })
                    .skip(query.skip)
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
                body.nicknameId = id
                if (body.postId) {
                    const userComment = await userModel.findOne({ "_id": id })
                    const post = body.postId && await postModel.findOne({ "_id": body.postId })
                    const userPostId = post.nicknameId
                    const comments = post.comments
                    const userPost = await userModel.findOne({ "_id": userPostId })
                    const emailPost = userPost.email
                    const emailComment = userComment.email
                    const nicknameComment = userComment.nickname
                    const postContent = post.content
                    await commentModel.create(body)
                        .catch((error: Error) => {
                            result.success = false
                            result.message = error.message
                            res.send(result)
                            throw error.message
                        }).then(async (data: any) => {

                            await postModel.updateOne({ "_id": body.postId }, { comments: [...comments, data._id] })

                            const mainOptions = {
                                from: '掲示板 (astem@gmail.com) <no-reply>',
                                to: emailPost,
                                subject: 'コメントについて',
                                html:
                                    `こんばんは！<br>
                                    こんにちは。掲示板 の ${nicknameComment} さんはあなたの掲示板にコメントしました。<br>
                                    <br>
                                    イメールから    ${emailComment}<br>
                                    <br>
                                    コンテンツ  ${body.content}<br>
                                    <br>
                                    上記の内容を確認するには、<a href="${process.env.HOMEPAGE_URL + "post/" + body.postId}" target="_blank">${process.env.HOMEPAGE_URL} </a>にアクセスしてください。

                                    `
                            };

                            await transporter.sendMail(mainOptions)
                                .catch((error: Error) => {
                                    result.success = false
                                    result.message = error.message
                                    res.send(result)
                                    throw error.message
                                }).then(() => {
                                    result.success = true
                                    result.message = "your comment is created"
                                    res.json(result)
                                })
                        })
                }
                if (body.productId) {
                    const product = body.productId && await productModel.findOne({ "_id": body.productId })
                    const comments = product.comments
                    await commentModel.create(body)
                        .catch((error: Error) => {
                            result.success = false
                            result.message = error.message
                            res.send(result)
                            throw error.message
                        }).then(async (data: any) => {

                            await productModel.updateOne({ "_id": body.productId }, { comments: [...comments, data._id] })
                                .catch((error: Error) => {
                                    result.success = false
                                    result.message = error.message
                                    res.send(result)
                                    throw error.message
                                }).then(() => {
                                    result.success = true
                                    result.message = "your comment is created"
                                    res.json(result)
                                })
                        })
                }
                break;
            case "PUT":
                // console.log(query.id)
                if (nicknameId.toString() === id.toString()) {
                    body.nicknameId = id
                    await commentModel.updateOne({ "_id": query.id }, body)
                        .catch((error: Error) => {
                            result.success = false
                            result.message = error.message
                            res.send(result)
                            throw error.message
                        }).then(async (data: any) => {
                            result.success = true
                            result.message = "your comment is update"
                            res.json(result)
                        })
                }
                break;
            case "DELETE":

                if (nicknameId.toString() === id.toString()) {
                    await commentModel.deleteOne({ "_id": query.id })
                        .catch((error: Error) => {
                            result.success = false
                            result.message = error.message
                            res.send(result)
                            throw error.message
                        }).then(async (data: any) => {
                            result.success = true
                            result.message = "your comment is delete"
                            res.json(result)
                        })
                }
                break;
            default:
                res.send("your method is not supplied")
        }
    }

export default Comment