import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { NewModel } from '@/model/news.model'
const jwt = require('jsonwebtoken')

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const query = req.query
    const method = req.method
    const body = req.body
    let result: any = { success: false };
    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]
    const id = token && await jwt.verify(token, 'secretToken').id

    connectMongoDB()

    if (id) {
        switch (method) {
            case "GET":
                await NewModel
                    .find(query.archive ? { "archive": query.archive } : {})
                    .find(query.slug ? { "slug": query.slug } : {})
                    .find(query.category ? { "category": query.category } : {})
                    .find(query.search ? { "title": { $regex: query.search } } : {})
                    // .populate("category")
                    .sort(query.sort === "title" ? { "title": -1 } : {})
                    .sort(query.sort === "editDate" ? { "editeDate": -1 } : { "createDate": -1 })
                    .sort({ "editDate": -1 })
                    .skip(query.skip)
                    .limit(query.limit ? query.limit : {})
                    .catch((error: Error) => {
                        res.json(result)
                        throw error.message
                    })
                    .then((data: any) => {
                        result.success = true
                        result.name = "ニュース"
                        result.data = data
                        res.json(result)
                    })
                break
            case "POST":
                await NewModel
                    .create(body)
                    .catch((error: Error) => {
                        res.json(result)
                        throw error.message
                    })
                    .then((data: any) => {
                        result.success = true
                        result.name = "ニュース"
                        result.data = data
                        res.json(result)
                    })
                break
            case "PUT":
                await NewModel
                    .updateOne({ "_id": query.id }, body)
                    .catch((error: Error) => {
                        res.json(result)
                        throw error.message
                    })
                    .then((data: any) => {
                        result.success = true
                        result.name = "ニュース"
                        result.data = data
                        res.json(result)
                    })
                break
            case "DELETE":
                await NewModel
                    .deleteOne({ "_id": query.id })
                    .catch((error: Error) => {
                        res.json(result)
                        throw error.message
                    })
                    .then((data: any) => {
                        result.success = true
                        result.name = "ニュース"
                        result.data = data
                        res.json(result)
                    })
                break
        }
    } else {
        result.success = false
        result.message = "you haven't logged in yet"
        res.json(result)
    }
}