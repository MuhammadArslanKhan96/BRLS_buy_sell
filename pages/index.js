import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Plans from "@/components/Plans";
import { WagmiConfig, useAccount } from "wagmi";
import { createWeb3Modal, defaultWagmiConfig, useWeb3Modal } from "@web3modal/wagmi/react";
import { polygon, polygonMumbai } from "viem/chains";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const chains = [polygon, polygonMumbai];

    // 1. Get projectId
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

    // 2. Create wagmiConfig
    const metadata = {
        name: "Web3Modal",
        description: "Web3Modal Example",
        url: "https://web3modal.com",
        icons: ["https://avatars.githubusercontent.com/u/37784886"],
    };
    const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

    return (
        <>
            <WagmiConfig config={wagmiConfig}>
                <Header wagmiConfig={wagmiConfig} chains={chains} projectId={projectId} />
                <div className="px-4 bg scrollStyle">
                    <Plans />
                </div>
            </WagmiConfig>
        </>
    );
}
