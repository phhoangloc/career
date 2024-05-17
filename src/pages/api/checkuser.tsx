import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { userModel } from '@/model/user.model'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const query = req.query
    const method = req.method
    const body = req.body

    connectMongoDB()
    switch (method) {

        case "GET":
            await userModel
                .find(query.username ? { "username": query.username } : {})
                .find(query.email ? { "email": query.email } : {})
                .catch((error: Error) => {
                    res.json(false)
                    throw error.message
                })
                .then((data: any) => {
                    data[0] ? res.json(true) : res.json(false)
                })
    }
}