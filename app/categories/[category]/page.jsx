
import Image from "next/image";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function CategoryPage({ params }) {
    const { category } = await params;
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("IPM_AT");

    if (!accessTokenCookie) {
        return <div>Please log in to view categories.</div>;
    }

    const response = await fetch(`https://api.spotify.com/v1/browse/categories/${category}`, {
        headers: {
            Authorization: `Bearer ${accessTokenCookie.value}`
        }
    });

    if (!response.ok) {
        console.log(response)
        return <div>Failed to fetch category.</div>;
    }

    const data = await response.json();

    return (
        <div>
            <h1>{data.name}</h1>
            {data.icons?.[0] && (
                <Image
                    src={data.icons[0].url}
                    alt={data.name}
                    width={100}
                    height={100}
                    loading="lazy"
                />
            )}
        </div>
    );
}