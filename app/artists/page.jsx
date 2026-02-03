import { cookies } from "next/headers";
import Link from "next/link";

/**
 * ArtistsPage Component
 * 
 * Server-side rendered page displaying user's top artists based on listening history.
 * Features:
 *   - "Artist of the Month" section highlighting the #1 top artist
 *   - Grid view of top 20 artists with long-term listening data
 * 
 * Requires user-top-read scope for Spotify API access.
 */
export default async function ArtistsPage() {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("IPM_AT");

    // Redirect to login if not authenticated
    if (!accessTokenCookie) {
        return (
            <>
                <div>Please log in to view your top artists.</div>
                <button className="rounded-3xl p-3 border-2 border-black">
                    <a href="/login">Log in with spotify</a>
                </button>
            </>
        )
    }

    // Fetch user's top artists; /artists requires ids and returns 400 without them
    const response = await fetch("https://api.spotify.com/v1/me/top/artists?limit=20&time_range=long_term", {
        headers: {
            Authorization: `Bearer ${accessTokenCookie.value}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Artists fetch failed:", response.status, errorText);
        const message = response.status === 403
            ? "Missing user-top-read scope. Log out/in to grant permissions."
            : `Failed to fetch artists. Status: ${response.status}`;
        return <div className="p-4 text-red-500">{message}</div>;
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];
    console.log("Artists data:", items.length, "artists found");
    const topArtist = items[0];

    return (
        <>
        
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">All Artists</h1>
            </div>
        <main className="col-span-full lg:col-span-3 p-4">

            {topArtist ? (
                <section className="mb-8 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white/80 dark:bg-gray-900/70 shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-center">
                    <Link className="flex items-center gap-4" href={`/artists/${topArtist.id}`}>

                        {topArtist.images?.[0] && (
                            <img
                                src={topArtist.images[0].url}
                                alt={topArtist.name}
                                loading="lazy"
                                className="w-full md:w-40 aspect-square object-cover rounded-xl"
                            />
                        )}
                    </Link>
                    <div className="space-y-2">
                        <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Artist of the Month</p>
                        <h2 className="text-2xl font-semibold">{topArtist.name}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Based on your listening, this artist is leading your charts right now.</p>
                    </div>
                </section>
            ) : (
                <p className="mb-8 text-gray-600 dark:text-gray-400">No artists found yet. Listen more to see your top picks.</p>
            )}

            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((artist) => (
                    <li key={artist.id} className="flex flex-col items-center gap-2">
                        <Link href={`/artists/${artist.id}`} className="flex flex-col items-center gap-2">
                            {artist.images[0] && (
                                <img
                                    src={artist.images[0].url}
                                    alt={artist.name}
                                    loading="lazy"
                                    className="w-full aspect-square object-cover rounded-lg"
                                />
                            )}
                            <p className="text-center font-medium">{artist.name}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
        </>
    )
}