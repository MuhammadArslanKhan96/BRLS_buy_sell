import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import Swap from "@/components/Swap";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const chains = [polygon, polygonMumbai];

    // 1. Get projectId
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

    const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

    const wagmiConfig = createConfig({
        autoConnect: true,
        connectors: w3mConnectors({ version: 2, projectId, chains }),
        publicClient,
    });

    const ethereumClient = new EthereumClient(wagmiConfig, chains);

    return (
        <>
            <WagmiConfig config={wagmiConfig}>
                <Header />
                <div className="px-4 bg scrollStyle">
                    <Swap />
                </div>
            </WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </>
    );
}
