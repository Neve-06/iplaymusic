const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;

/**
 * LoginPage Component
 * 
 * Displays the Spotify login button and initiates OAuth flow.
 * Requests necessary scopes for playlist access, playback control, and user data.
 * 
 * Scopes requested:
 *   - playlist-read-private: Access user's private playlists
 *   - user-read-playback-state: Read current playback state
 *   - user-modify-playback-state: Control playback (play, pause, skip)
 *   - user-read-currently-playing: Read currently playing track
 *   - streaming: Use Web Playback SDK
 *   - user-read-email: Access user's email
 *   - user-read-private: Access user profile info
 *   - user-top-read: Access user's top artists/tracks
 */
export default function LoginPage() {
	const scopes = [
		"playlist-read-private",
		"user-read-playback-state",
		"user-modify-playback-state",
		"user-read-currently-playing",
		"streaming",
		"user-read-email",
		"user-read-private",
		"user-top-read"
	].join("%20");

	return (
		<>
				<div className="bg-linear-to-br from-pink-600 to-orange-600 rounded-3xl p-0.5 mt-90">
					<button className="bg-white dark:bg-black rounded-3xl px-6 py-3 w-full">
						<a href={`https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&show_dialog=true&scope=${scopes}`}>Log in with Spotify</a>
					</button>
				</div>
		</>
	);
}