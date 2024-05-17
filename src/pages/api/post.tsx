import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { postModel } from '@/model/post.model'
import { isDataType } from '@/type/resultType'


const post = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {

    connectMongoDB()

    const query = req.query
    const result: isDataType = { success: false }
    postModel.find()
        .find(query.id ? { "_id": query.id } : {})
        .find(query.slug ? { "slug": query.slug } : {})
        .find(query.search ? { "title": { $regex: query.search } } : {})
        .find(query.wp ? { "workplace": query.wp } : {})
        .find(query.wt ? { "worktype": query.wt } : {})
        .find(query.ws ? { "workstatus": query.ws } : {})
        .find(query.lo ? { "location": query.lo } : {})
        .populate("image")
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


export default post