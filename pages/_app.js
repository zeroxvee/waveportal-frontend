import { useState, useEffect } from "react"
import "../styles/globals.css"
import { WagmiConfig, createClient, configureChains, chain } from "wagmi"
import { ConnectKitProvider, getDefaultClient } from "connectkit"
import { publicProvider } from "wagmi/providers/public"

const { chains, provider, webSocketProvider } = configureChains(
    [chain.hardhat, chain.goerli],
    [publicProvider()]
)

const client = createClient(
    getDefaultClient({
        appName: "Wave-Portal",
        autoConnect: true,
        chains,
        provider,
        webSocketProvider,
    })
)

function MyApp({ Component, pageProps }) {
    const [showing, setShowing] = useState(false)

    useEffect(() => {
        setShowing(true)
    }, [])

    if (!showing) {
        return null
    }

    if (typeof window === "undefined") {
        return <></>
    } else {
        return (
            <WagmiConfig client={client}>
                <ConnectKitProvider>
                    <Component {...pageProps} />
                </ConnectKitProvider>
            </WagmiConfig>
        )
    }
}

export default MyApp
