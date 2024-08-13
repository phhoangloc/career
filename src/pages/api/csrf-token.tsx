import type { NextApiRequest, NextApiResponse } from 'next';
import { csrfProtection, cookieParser } from '../../lib/csrf';

const handler = (req: any, res: any) => {
    // Sử dụng cookieParser và csrfProtection để xử lý CSRF token
    cookieParser()(req, res, () => {
        csrfProtection(req, res, () => {
            // Trả về CSRF token cho client
            res.status(200).json({ csrfToken: req.csrfToken() });
        });
    });
};

export default handler;