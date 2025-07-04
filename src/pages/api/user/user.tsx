import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { userModel } from '@/model/user.model'
import { isDataType } from '@/type/resultType'
import { facilityModel } from '@/model/facility.model'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const query = req.query
    const method = req.method
    const body = req.body
    let result: isDataType = { success: false };
    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]
    const id = token && await jwt.verify(token, 'secretToken').id

    connectMongoDB()
    if (id) {
        switch (method) {
            case "GET":
                await facilityModel.find()
                await userModel
                    .find({ "_id": id })
                    .populate("facilities")
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
            case "PUT":
                const salt = bcrypt.genSaltSync(10);
                const mahoa_password = req.body.password && bcrypt.hashSync(req.body.password.toString(), salt);
                body.password = mahoa_password
                await userModel
                    .updateOne({ "_id": id }, body)
                    .catch((error: Error) => {
                        res.json(result)
                        throw error.message
                    })
                    .then((data: any) => {
                        result.success = true
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