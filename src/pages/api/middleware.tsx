import { csrfProtection, cookieParser } from '../../lib/csrf';
import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextApiHandler } from 'next';
export async function middleware(req: any, res: any, next: any) {
    cookieParser()(req, res, () => {
        csrfProtection(req, res, (err) => {
            if (err) {
                return res.status(403).json({ message: 'CSRF token validation failed' });
            }
            next();
        });
    });
}
