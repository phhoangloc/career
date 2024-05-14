import { NextResponse } from 'next/server'
import { NextApiRequest } from 'next';

const allowedIPs = ['192.168.1.1'];

export default function middleware(req: NextApiRequest) {

    if (!allowedIPs.includes('192.168.1.1')) {
        return NextResponse.redirect(new URL('/error', req.url))
    } else {
        return NextResponse.next()
    }
}
export const config = {
    matcher: '/admin/:path*',
}
