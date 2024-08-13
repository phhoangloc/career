import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from '@/connect/database/mogoseDB'
import { CategoryModel } from '@/model/category.model'
import { csrfProtection, cookieParser } from '../../lib/csrf';

export default async function handler(
    req: any,
    res: any
) {

    const query = req.query
    const method = req.method
    const body = req.body
    const result: any = { success: false }
    connectMongoDB()
    cookieParser()(req, res, () => {
        csrfProtection(req, res, async () => {
            switch (method) {
                case "GET":
                    await CategoryModel
                        .find(query.search ? { "name": { $regex: query.search } } : {})
                        .skip(query.skip)
                        .limit(query.limit ? query.limit : {})
                        .catch((error: Error) => {
                            res.json(result)
                            throw error.message
                        })
                        .then((data: any) => {
                            result.success = true
                            result.name = "カテゴリー"
                            result.data = data
                            res.json(result)
                        })
            }
        });
    });

}