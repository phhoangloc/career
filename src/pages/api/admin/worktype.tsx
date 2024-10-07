import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { worktypeModel } from '@/model/worktype'
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
                await worktypeModel
                    .find(query.search ? { "name": { $regex: query.search } } : {})
                    .skip(query.skip)
                    .limit(query.limit ? query.limit : {})
                    .catch((error: Error) => {
                        res.json(result)
                        throw error.message
                    })
                    .then((data: any) => {
                        result.success = true
                        result.name = "職種"
                        result.data = data
                        res.json(result)
                    })
                break
            case "POST":
                await worktypeModel
                    .create(body)
                    .catch((error: Error) => {
                        res.json(result)
                        throw error.message
                    })
                    .then((data: any) => {
                        result.success = true
                        result.name = "職種"
                        result.data = data
                        res.json(result)
                    })
                break
            case "PUT":
                await worktypeModel
                    .updateOne({ "_id": query.id }, body)
                    .catch((error: Error) => {
                        res.json(result)
                        throw error.message
                    })
                    .then((data: any) => {
                        result.success = true
                        result.name = "職種"
                        result.data = data
                        res.json(result)
                    })
                break
            case "DELETE":
                await worktypeModel
                    .deleteOne({ "_id": query.id })
                    .catch((error: Error) => {
                        res.json(result)
                        throw error.message
                    })
                    .then((data: any) => {
                        result.success = true
                        result.name = "職種"
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