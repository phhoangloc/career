

import { userModel } from '@/model/user.model';
import type { NextApiRequest, NextApiResponse } from 'next'
import { isDataType } from '@/type/resultType';
import connectMongoDB from '@/connect/database/mogoseDB';
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'h-loc@astem-co.co.jp',
        pass: 'zkwe vmxt gkxc ixts'
    },
});

const createUser = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    connectMongoDB()
    // await userModel.collection.dropIndex('userNumber_1');
    // await userModel.collection.dropIndex('nickname_1');
    if (req.method === 'POST') {
        const body = req.body;
        const salt = bcrypt.genSaltSync(10);
        const mahoa_password = req.body.password && bcrypt.hashSync(req.body.password.toString(), salt);
        body.password = mahoa_password
        const result: isDataType = { success: false }

        await userModel.create(body)
            .catch((error: Error) => {
                result.success = false
                result.message = error.message
                throw error.message
            })

        const mainOptions = {
            from: 'astem (astem@gmail.com) <no-reply>',
            to: req.body.email,
            subject: 'アカウントを有効にするように',
            html: `
        <p style="text-align:center">ご登録いただきありがとうございます！<p>
        <p style="text-align:center">アカウントを有効にするには<a style="font-weight:bold;color:green" href="${process.env.HOMEPAGE_URL}api/active?email=${req.body.email}">ここ</a>をクリックしてください<p>`
        };

        await transporter.sendMail(mainOptions)
            .catch((error: Error) => {
                result.success = false
                result.message = error.message
                res.send(result)
                throw error.message
            }).then(() => {
                result.success = true
                result.message = "アカウントを有効にするためにメールを確認してください"
                res.json(result)
            })
    } else {
        res.json({
            success: false,
            message: "リクエストメソッドは提供されていません"
        })
    }
}

export default createUser