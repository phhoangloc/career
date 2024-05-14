import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { ImageModel } from '@/model/image.model'
import { isDataType } from '@/type/resultType'
const jwt = require('jsonwebtoken')

const image = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {

    connectMongoDB()

    const query = req.query
    const method = req.method
    const result: isDataType = { success: false }


    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]
    const id = await jwt.verify(token, 'secretToken').id
    const image = await ImageModel.findOne({ "_id": query.id })
    const host = image && image.host && image.host._id
    switch (method) {
        case "GET":
            ImageModel.find()
                .find(query.id ? { "_id": query.id } : {})
                .find(query.search ? { "name": { $regex: query.search } } : {})
                .sort({ "createDate": -1 })
                .skip(query.skip)
                .sort(query.sort ? query.sort : {})
                .limit(query.limit ? query.limit : {})
                .catch((error: Error) => {
                    result.success = false
                    result.message = error.message
                    res.json(result)
                })
                .then((data: any) => {
                    result.success = true
                    result.data = data
                    res.json(result)

                })
    }
}


export default image