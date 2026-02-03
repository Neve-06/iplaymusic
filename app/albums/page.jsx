import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import AlbumCarousel from "../_components/AlbumCarousel";

/**
 * AlbumsPage Component
 * 
 * Server-side rendered page that displays user's albums.
 * Supports two modes:
 *   1. Default: Shows new releases from Spotify
 *   2. Search: Shows search results when a query parameter is present
 * 
 * Requires authentication via IPM_AT cookie.
 */
export default async function AlbumsPage(props) {
    const searchParams = await props.searchParams;
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("IPM_AT");

    // Redirect to login if not authenticated
    if (!accessTokenCookie) {
        return (
            <>
                <div>
                    Please log in to view albums.
                </div>
                <button className="rounded-3xl p-3 border-2 border-black">
                    <a href="/login">Log in with spotify</a>
                </button>
            </>
        );
    }

    // Determine API endpoint based on search query presence
    const q = searchParams?.q;
    let url;
    if (q) {
        // Search for albums matching query
        url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=album`;
    } else {
        // Get new releases
        url = "https://api.spotify.com/v1/browse/new-releases";
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessTokenCookie.value}`
        }
    });

    if (!response.ok) {
        console.log(response);
        return <div>Failed to fetch albums.</div>;
    }

    const data = await response.json();
    const albums = q ? data.albums.items : data.albums.items;  // Both have the same structure

    return (
        <>
            <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">All Albums</h1>
            <AlbumCarousel albums={albums} />
            <div>
                {/* <h1>{q ? `Search Results for "${q}"` : "New Releases"}</h1>
                <form method="get">
                    <input name="q" placeholder="Search albums" defaultValue={q || ""} />
                    <button type="submit">Search</button>
                </form> */}
                {!q && <p><Link href="/albums">Show New Releases</Link></p>}
                <ul>
                    {albums.map((album) => (
                        <li key={album.id}>
                            <Link className="flex items-center gap-4" href={`/albums/${album.id}`}>
                                <Image
                                    className="h-16 w-16 shrink-0 rounded-2xl border-2 object-cover"
                                    loading="lazy"
                                    src={album.images[0]?.url}
                                    alt={album.name}
                                    width={64}
                                    height={64}
                                    sizes="64px"
                                />
                                <div className="flex-column ml-2">
                                    <p>{album.name}</p>
                                    <p>{album.artists.map(artist => artist.name).join(', ')}</p>
                                </div>
                                <p className="ml-auto">{album.total_tracks} songs</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}