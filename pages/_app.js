import { useState, useEffect } from "react"
import "../styles/globals.css"
import { WagmiConfig, createClient, configureChains, chain } from "wagmi"
import { ConnectKitProvider, getDefaultClient } from "connectkit"
import { publicProvider } from "wagmi/providers/public"

const localChain = {
    id: 31337,
    name: "hardhat",
    network: "hardhat",
    nativeCurrency: {
        decimals: 18,
        name: "go",
        symbol: "GO",
    },
    rpcUrls: {
        default: "http://127.0.0.1:8545/",
    },
    testnet: true,
}

const { chains, provider, webSocketProvider } = configureChains(
    [localChain, chain.hardhat],
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
