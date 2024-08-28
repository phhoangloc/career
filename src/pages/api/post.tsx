import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { postModel } from '@/model/post.model'
import { isDataType } from '@/type/resultType'
import { facilityModel } from '@/model/facility.model'


const post = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {

    connectMongoDB()

    const query = req.query

    const result: isDataType = { success: false }

    const facility = query.wp ? await facilityModel.findOne({ "name": query.wp }, "_id") : undefined

    const facilityId = facility?._id.toString()

    await postModel.find()
        .find(query.id ? { "_id": query.id } : {})
        .find(query.archive ? { "archive": query.archive } : {})
        .find(query.slug ? { "slug": query.slug } : {})
        .find(query.search ? { "title": { $regex: query.search } } : {})
        .find(query.wt ? { "worktype": query.wt } : {})
        .find(query.ws ? { "workstatus": query.ws } : {})
        .populate("image")
        .populate({ path: "workplace" })
        // .find({ "workplace": null })
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
            data = query.wp ? data.filter((d: any) => d.workplace?.name === query.wp) : data
            data = query.lo ? data.filter((d: any) => d.workplace?.location === query.lo) : data
            // data = query.wt ? data.filter((d: any) => d.workplace?.worktype === query.wt) : data
            result.success = true
            result.data = data
            res.json(result)

        })
}


export default post