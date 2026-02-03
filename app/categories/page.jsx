
import Image from "next/image";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function CategoryPage() {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("IPM_AT");
    const colors = [
        'rgb(215, 0, 96)',
        'rgb(229, 64, 40)',
        'rgb(241, 141, 5)',
        'rgb(242, 188, 6)',
        'rgb(94, 177, 28)',
        'rgb(58, 118, 52)',
        'rgb(10, 190, 190)',
        'rgb(0, 161, 203)',
        'rgb(17, 87, 147)'
    ];

    if (!accessTokenCookie) {
        return <div>Please log in to view categories.</div>;
    }

    const response = await fetch("https://api.spotify.com/v1/browse/categories", {
        headers: {
            Authorization: `Bearer ${accessTokenCookie.value}`
        }
    });

    if (!response.ok) {

        console.log(response)
        return <div>Failed to fetch categories.</div>;
    }

    const data = await response.json();

    return (
        <div>
            <h1>Category Page</h1>
            <ul>
                {data.categories.items.map((category, index) => {

                    return (

                        <li
                            style={{ backgroundColor: colors[index % colors.length] }}
                            className="p-3 my-2 rounded-lg text-white"
                            key={category.id}
                        >
                            <Link href={`/categories/${category.id}`}><p>{category.name}</p></Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}