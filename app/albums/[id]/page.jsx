import { cookies } from "next/headers";
import { playTrack } from "../../lib/spotify";
import Link from "next/link";
import Image from "next/image";
import { MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious } from "react-icons/md";

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export default async function AlbumPage(props) {
    const { id } = await props.params;
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("IPM_AT");

    if (!accessTokenCookie) {
        return (<>
            <div>Please log in to view album.</div>;
            <button className="rounded-3xl p-3 border-2 border-black">
                <a href="/login">Log in with spotify</a>
            </button>
        </>)
    }

    const url = `https://api.spotify.com/v1/albums/${id}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessTokenCookie.value}`
        },
        next: { revalidate: 3600 },
        cache: 'force-cache'
    });

    if (!response.ok) {
        if (response.status === 429) {
            const retryAfter = response.headers.get('retry-after');
            const waitMinutes = retryAfter ? Math.ceil(retryAfter / 60) : 'unknown';
            return (
                <div className="p-8">
                    <h1 className="text-2xl font-bold mb-4">Rate Limit Exceeded</h1>
                    <p className="mb-2">Spotify API rate limit reached. Please wait {waitMinutes} minutes before trying again.</p>
                    <p className="text-sm text-gray-600">This happens when too many requests are made in a short time.</p>
                </div>
            );
        }
        console.log(response);
        return <div>Failed to fetch album.</div>;
    }

    const album = await response.json();

    const playAlbum = async () => {
        "use server";
        const cookieStore = await cookies();
        const token = cookieStore.get("IPM_AT")?.value;
        const deviceId = cookieStore.get("IPM_DEVICE_ID")?.value;
        if (token) {
            try {
                await playTrack(token, {
                    context_uri: `spotify:album:${id}`,
                    device_id: deviceId
                });
            } catch (error) {
                console.error("Play album error:", error);
                throw new Error(`Failed to play album: ${error.message}`);
            }
        }
    };

    const playSingleTrack = async (formData) => {
        "use server";
        const trackUri = formData.get("trackUri");
        const cookieStore = await cookies();
        const token = cookieStore.get("IPM_AT")?.value;
        const deviceId = cookieStore.get("IPM_DEVICE_ID")?.value;
        if (token && trackUri) {
            try {
                await playTrack(token, {
                    uris: [trackUri],
                    device_id: deviceId
                });
            } catch (error) {
                console.error("Play track error:", error);
                throw new Error(`Failed to play track: ${error.message}`);
            }
        }
    };

    return (
        <>
            <div>
                {/* Header with background image covering */}
                <div className="relative h-96 overflow-hidden rounded-lg -mx-8 w-screen max-w-none mb-6">
                    {/* Background cover image */}
                    {album.images[0]?.url ? (
                        <Image
                            src={album.images[0]?.url}
                            alt={album.name}
                            fill
                            className="absolute object-cover"
                            sizes="100vw"
                            priority
                        />
                    ) : null}

                    {/* Dark overlay for text legibility */}
                    <div className="absolute inset-0 bg-linear-to-br from-transparent via-black/50 to-black/80" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
                        <h1 className="text-4xl font-bold text-white mb-2">{album.name}</h1>
                        <p className="text-gray-200 mb-4">Artists: {album.artists.map(artist => artist.name).join(', ')}</p>
                        <p className="text-gray-300 text-sm mb-6">Total Tracks: {album.total_tracks}</p>
                        <form action={playAlbum}>
                            <button type="submit" className="px-6 py-2 text-white bg-linear-to-br from-pink-600 to-orange-600 rounded-full hover:from-pink-700 hover:to-orange-700 w-fit">
                                Play Album
                            </button>
                        </form>
                    </div>
                </div>

                <h2>All Songs</h2>
                <ul>
                    {album.tracks.items.map((track) => (
                        <li key={track.id} className="flex items-center gap-2 mb-2">
                            <Link href="/player">
                                <button className="text-white bg-linear-to-br from-pink-600 to-orange-600 rounded-full p-2 hover:from-pink-700 hover:to-orange-700">
                                    <MdPlayArrow />
                                </button>
                            </Link>
                            <span>{track.name} - {track.artists.map(artist => artist.name).join(', ')}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
