import "../styles/globals.css"
import "../styles/index.css"
import { MoralisProvider } from "react-moralis"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"
import "moralis-v1"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>CrowdFunded</title>
                <meta name="description" content="Crowdfunding Website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
                        <Navbar />
                    </div>

                    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
                        <div className="sm:flex hidden mr-10 relative">
                            <Sidebar />
                        </div>
                        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
                            <Component {...pageProps} />
                        </div>
                    </div>
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
