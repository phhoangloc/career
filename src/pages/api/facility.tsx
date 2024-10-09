import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { isDataType } from '@/type/resultType'
import { facilityModel } from '@/model/facility.model'
import { ImageModel } from '@/model/image.model'
import { postModel } from '@/model/post.model'
import { japanRegions } from '@/lib/area'
const interview = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {

    connectMongoDB()

    const query = req.query
    const result: isDataType = { success: false }
    await ImageModel.find()
    await postModel.find()
    await facilityModel.find()
        .find(query.id ? { "_id": query.id } : {})
        .find(query.archive ? { "archive": query.archive } : {})
        .find(query.slug ? { "slug": query.slug } : {})
        .find(query.search ? { "name": { $regex: query.search } } : {})
        .find(query.area ? { "area": query.area } : {})
        .find(query.lo ? { "location": query.lo } : {})
        .find(query.host ? { "host": query.host } : {})
        .populate("image")
        .populate("work")
        .skip(query.skip)
        .sort(query.ws ? { "createDate": -1 } : {})
        .limit(query.limit ? query.limit : {})
        .exec()
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


export default interview