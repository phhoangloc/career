import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { ImageModel } from '@/model/image.model'
import { isDataType } from '@/type/resultType'


const image = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {

    connectMongoDB()

    const query = req.query
    const result: isDataType = { success: false }
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


export default image