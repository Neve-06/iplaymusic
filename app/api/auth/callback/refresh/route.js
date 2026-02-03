import next from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;


export async function GET(request) {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(CLIENT_ID + ":" + CLIENT_SECRET)}`
        },
        body: `grant_type=refresh_token&refresh_token=${cookies().get("IPM_RT")?.value}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    });

    return NextResponse.json(await response.json());
}