import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Plans from "@/components/Plans";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

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
                <Header wagmiConfig={wagmiConfig} chains={chains} projectId={projectId} />
                <div className="px-4 bg scrollStyle">
                    <Plans />
                </div>
            </WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </>
    );
}
