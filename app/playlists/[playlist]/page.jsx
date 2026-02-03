import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdPlayArrow } from "react-icons/md";
import { playTrack } from "../../lib/spotify";

export default async function PlaylistPage({ params }) {
    const { playlist } = await params;

    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("IPM_AT");

    if (!accessTokenCookie) {
        return (
            <>
                <div>Please log in to view this playlist.</div>;
                <button className="rounded-3xl p-3 border-2 border-black">
                    <a href="/login">Log in with spotify</a>
                </button>
            </>
        );
    }

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist}`, {
        headers: {
            Authorization: `Bearer ${accessTokenCookie.value}`
        },
        cache: "no-store"
    });

    if (!response.ok) {
        console.log(response);
        return <div>Failed to fetch this playlist.</div>;
    }

    const playlistData = await response.json();
    const tracks = playlistData.tracks?.items || [];
    const coverImage = playlistData.images?.[0]?.url;

    const playPlaylist = async () => {
        "use server";
        const cookieStore = await cookies();
        const token = cookieStore.get("IPM_AT")?.value;
        if (token) {
            try {
                await playTrack(token, { context_uri: `spotify:playlist:${playlist}` });
            } catch (error) {
                console.error("Play playlist error:", error);
                throw new Error(`Failed to play playlist: ${error.message}`);
            }
        }
    };

    const playSingleTrack = async (formData) => {
        "use server";
        const trackUri = formData.get("trackUri");
        const cookieStore = await cookies();
        const token = cookieStore.get("IPM_AT")?.value;
        if (token && trackUri) {
            try {
                await playTrack(token, { uris: [trackUri] });
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
                    {coverImage ? (
                        <Image
                            src={coverImage}
                            alt={playlistData.name}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            loading="lazy"
                        />
                    ) : null}

                    {/* Dark overlay for text legibility */}
                    <div className="absolute inset-0 bg-linear-to-br from-transparent via-black/50 to-black/80" />

                    {/* Content overlay */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-8">
                        <h1 className="text-4xl font-bold text-white mb-2">{playlistData.name}</h1>
                        {playlistData.description ? (
                            <p className="text-gray-200 mb-4">{playlistData.description}</p>
                        ) : null}
                        <p className="text-gray-300 text-sm mb-6">
                            {playlistData.owner?.display_name ?? "Unknown"} • {playlistData.tracks?.total ?? 0} songs
                        </p>
                        <form action={playPlaylist}>
                            <button type="submit" className="px-6 py-2 text-white bg-linear-to-br from-pink-600 to-orange-600 rounded-full hover:from-pink-700 hover:to-orange-700 w-fit">
                                Play Playlist
                            </button>
                        </form>
                    </div>
                </div>

                <h2>All Songs</h2>
                <ul>
                    {tracks.map((item, index) => {
                        const track = item.track;
                        if (!track) return null;
                        const artists = track.artists?.map((artist) => artist.name).join(", ") || "Unknown artist";

                        return (
                            <li key={track.id || `track-${index}`} className="flex items-center gap-2 mb-2">
                                <Link href="/player">
                                    <button className="text-white bg-linear-to-br from-pink-600 to-orange-600 rounded-full p-2 hover:from-pink-700 hover:to-orange-700">
                                        <MdPlayArrow />
                                    </button>
                                </Link>
                                <span>{track.name} - {artists}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}