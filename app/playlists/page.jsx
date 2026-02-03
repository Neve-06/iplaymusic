import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";

export default async function PlaylistsPage(props) {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("IPM_AT");

    if (!accessTokenCookie) {
        return (
            <>
                <div>
                    Please log in to view playlists.
                </div>
                <button className="rounded-3xl p-3 border-2 border-black">
                    <a href="/login">Log in with spotify</a>
                </button>
            </>
        )
    }

    const searchParams = await props.searchParams;
    const limit = 20; // Spotify allows up to 50; smaller for UI
    const offset = Math.max(0, parseInt(searchParams?.offset ?? "0", 10) || 0);

    const response = await fetch(
        `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
        {
            headers: {
                Authorization: `Bearer ${accessTokenCookie.value}`,
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        console.log(response);
        return <div>Failed to fetch playlists.</div>;
    }

    const data = await response.json();
    const playlists = data.items || [];
    const hasPrev = offset > 0 && !!data.previous;
    const hasNext = !!data.next;

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent p-1">All Playlists</h1>
            </div>
            <div className="w-full">
                <ul>
                    {playlists.map((pl) => (
                        <li key={pl.id}>
                            <Link className="flex items-center gap-3" href={`/playlists/${pl.id}`}>
                                {pl.images && pl.images[0] ? (
                                    <Image
                                        className="rounded-2xl border-2"
                                        src={pl.images[0].url}
                                        alt={pl.name}
                                        width={50}
                                        height={50}
                                        loading="lazy"
                                    />
                                ) : null}
                                <div className="flex-column ml-6">
                                    <p>{pl.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {pl.owner?.display_name} • {pl.tracks?.total} tracks
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center gap-4 mt-6">
                    {hasPrev && (
                        <Link
                            className="px-3 py-2 border rounded"
                            href={`/playlists?offset=${Math.max(0, offset - limit)}`}
                        >
                            Previous
                        </Link>
                    )}
                    {hasNext && (
                        <Link
                            className="px-3 py-2 border rounded"
                            href={`/playlists?offset=${offset + limit}`}
                        >
                            Next
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}