import { cookies } from "next/headers"
import Image from "next/image"
import { playTrack } from "../../lib/spotify"
import { MdPlayArrow } from "react-icons/md"
import Link from "next/link"

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export default async function ArtistPage(props) {
    const { id } = await props.params;
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("IPM_AT");

    if (!accessTokenCookie) {
        return (
            <>
                <div>Please log in to view artist.</div>
                <button className="rounded-3xl p-3 border-2 border-black">
                    <a href="/login">Log in with spotify</a>
                </button>
            </>
        ) 
    }

    // Fetch artist details
    const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
        headers: {
            Authorization: `Bearer ${accessTokenCookie.value}`
        },
        next: { revalidate: 3600 },
        cache: 'force-cache'
    });

    if (!artistResponse.ok) {
        if (artistResponse.status === 429) {
            const retryAfter = artistResponse.headers.get('retry-after');
            const waitMinutes = retryAfter ? Math.ceil(retryAfter / 60) : 'unknown';
            return (
                <div className="p-8">
                    <h1 className="text-2xl font-bold mb-4">Rate Limit Exceeded</h1>
                    <p className="mb-2">Spotify API rate limit reached. Please wait {waitMinutes} minutes before trying again.</p>
                    <p className="text-sm text-gray-600">This happens when too many requests are made in a short time.</p>
                </div>
            );
        }
        console.log(artistResponse)
        return <div>Failed to fetch artist.</div>;
    }

    const artist = await artistResponse.json();

    // Fetch artist's top tracks
    const tracksResponse = await fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`, {
        headers: {
            Authorization: `Bearer ${accessTokenCookie.value}`
        },
        next: { revalidate: 3600 },
        cache: 'force-cache'
    });

    if (!tracksResponse.ok) {
        if (tracksResponse.status === 429) {
            const retryAfter = tracksResponse.headers.get('retry-after');
            const waitMinutes = retryAfter ? Math.ceil(retryAfter / 60) : 'unknown';
            return (
                <div className="p-8">
                    <h1 className="text-2xl font-bold mb-4">Rate Limit Exceeded</h1>
                    <p className="mb-2">Spotify API rate limit reached. Please wait {waitMinutes} minutes before trying again.</p>
                    <p className="text-sm text-gray-600">This happens when too many requests are made in a short time.</p>
                </div>
            );
        }
        console.log(tracksResponse)
        return <div>Failed to fetch artist tracks.</div>;
    }

    const tracksData = await tracksResponse.json();

    const playArtistTracks = async () => {
        "use server";
        const cookieStore = await cookies();
        const token = cookieStore.get("IPM_AT")?.value;
        const deviceId = cookieStore.get("IPM_DEVICE_ID")?.value;
        if (token) {
            try {
                await playTrack(token, {
                    context_uri: `spotify:artist:${id}`,
                    device_id: deviceId
                });
            } catch (error) {
                console.error("Play artist error:", error);
                throw new Error(`Failed to play artist: ${error.message}`);
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
                    {artist.images[0]?.url ? (
                        <Image
                            src={artist.images[0]?.url}
                            alt={artist.name}
                            fill
                            className="absolute object-cover"
                            sizes="100vw"
                            loading="lazy"
                        />
                    ) : null}

                    {/* Dark overlay for text legibility */}
                    <div className="absolute inset-0 bg-linear-to-br from-transparent via-black/50 to-black/80" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
                        <h1 className="text-4xl font-bold text-white mb-2">{artist.name}</h1>
                        <p className="text-gray-300 text-sm mb-6">Popularity: {artist.popularity}%</p>
                        <form action={playArtistTracks}>
                            <button type="submit" className="px-6 py-2 text-white bg-linear-to-br from-pink-600 to-orange-600 rounded-full hover:from-pink-700 hover:to-orange-700 w-fit">
                                Play Artist
                            </button>
                        </form>
                    </div>
                </div>

                <h2>Top Songs</h2>
                <ul>
                    {tracksData.tracks.map((track) => (
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
    )
}