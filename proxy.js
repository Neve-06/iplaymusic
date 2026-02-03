import { NextResponse } from 'next/server';

export default async function proxy(request) {
    console.log("request", request.cookies);
    if (!request.cookies.has('IPM_AT') && request.cookies.has("IPM_RT")) {
        const BASE_URL = process.env.BASE_URL;
        const response = await fetch(`${BASE_URL}/api/auth/callback/refresh`)
        console.log();
        
    }

    if(!request.cookies.has("IPM_AT")) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // if (request.cookies.get('accessToken').value !== "IPM_AT") {
    //     return NextResponse.redirect(new URL('/login', request.url));
    // }
}

export const config = {
    matcher: ['/', '/featured/:path*', '/events/:path*', '/categories/:path*']
}