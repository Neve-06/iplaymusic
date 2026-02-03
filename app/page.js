import { cookies } from "next/headers";
import Link from "next/link";
import AlbumCarousel from "./_components/AlbumCarousel";

export const metadata = {
  title: "Home"
};

export default async function Home() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("IPM_AT")?.value;

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to iPlayMusic</h1>
        <p className="text-xl text-gray-500 dark:text-gray-300">Log in with Spotify to get started</p>
        <Link href="/login">
          <button className="rounded-3xl p-3 px-8 border-2 border-white bg-green-500 text-white font-semibold hover:bg-green-600">
            Log in with Spotify
          </button>
        </Link>
      </div>
    );
  }

  let featuredPlaylists = [];
  let recommendations = [];
  let topArtists = [];
  let newReleases = [];

  try {
    // 1. Featured Playlists/Carousel - use new releases instead for better carousel compatibility
    const featuredRes = await fetch(
      "https://api.spotify.com/v1/browse/new-releases?limit=10",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (featuredRes.ok) {
      const featuredData = await featuredRes.json();
      featuredPlaylists = featuredData.albums.items;
    }

   



    // 9. New Releases (Trending/Popular)
    const newReleasesRes = await fetch(
      "https://api.spotify.com/v1/browse/new-releases?limit=20",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (newReleasesRes.ok) {
      const newReleasesData = await newReleasesRes.json();
      newReleases = newReleasesData.albums.items.slice(10); // Skip first 10 since those are in carousel
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <main className="lg:col-span-3 space-y-12 pb-32">
      <div>
        <h1 className="text-4xl font-bold  text-gray-900 dark:text-white mb-2">Welcome Back!</h1>
        <p className=" text-gray-900 dark:text-white">Discover what's new in music</p>
      </div>

      {featuredPlaylists.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold  text-gray-900 dark:text-white mb-6">Featured Albums</h2>
          <AlbumCarousel albums={featuredPlaylists} />
        </div>
      )}

      {/* 9. New Releases / Trending */}
      {newReleases.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold  text-gray-900 dark:text-white">New Releases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newReleases.map((album) => (
              <Link key={album.id} href={`/albums/${album.id}`}>
                <div className="bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800 transition cursor-pointer">
                  {album.images?.[0] && (
                    <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                      <img
                        src={album.images[0].url}
                        alt={album.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-white truncate">{album.name}</h3>
                  <p className="text-sm text-gray-400 truncate">
                    {album.artists.map(a => a.name).join(', ')}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{album.release_date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
