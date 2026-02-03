import "./globals.css";
import Link from "next/link";
import { TbBroadcast } from "react-icons/tb";
import { TbActivityHeartbeat } from "react-icons/tb";
import { FaMicrophoneAlt } from "react-icons/fa";
import { BsCircleHalf } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { Providers } from "../providers";
import { cookies } from "next/headers";
import { PlayerProvider } from "./context/PlayerContext";
import Player from "./_components/Player";
import Header from "./_components/Header";

export const metadata = {
  title: {
    template: "%s | iPlayMusic",
    default: "iPlayMusic"
  },
  description: "iPlayMusic is a spotify clone - but better :D",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("IPM_AT")?.value;

  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <body className="antialised sm:mx-auto grid lg:grid-cols-4 pr-8 pl-8 bg-white dark:bg-zinc-800">
        <Providers>
          <PlayerProvider>
            <Header />
            {children}
            {/* <Player accessToken={accessToken} /> */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-800 p-4 flex justify-center gap-4" >
              <ul className="flex w-full justify-center gap-4">
              <div className="bg-linear-to-r from-orange-500 to-pink-600 rounded-full p-2">
                <Link href="/albums">
                  <TbActivityHeartbeat size={20} className="text-white" />
                </Link>
              </div>
              <div className="bg-linear-to-r from-orange-500 to-pink-600 rounded-full p-2">
                <Link href="/artists">
                  <FaMicrophoneAlt size={20} className="text-white"/>
                </Link>
              </div>
              <div className="bg-linear-to-br from-pink-600 to-orange-600 rounded-full p-2">
                <Link href="/"><TbBroadcast className="text-white" size={20}/></Link>
              </div>
              <div className="bg-linear-to-r from-orange-500 to-pink-600 rounded-full p-2">
                <Link href="/playlists">
                  <BsCircleHalf size={20} className="text-white"/>
                </Link>
              </div>
              <div className="bg-linear-to-r from-orange-500 to-pink-600 rounded-full p-2">
                <Link href="/settings">
                  <IoMdSettings size={20} className="text-white" />
                </Link>
              </div>
              </ul>
            </footer>
          </PlayerProvider>
        </Providers>
      </body>
    </html>
  );
}

