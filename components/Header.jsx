import { Button, Typography } from "antd";
import React, { useContext, useState } from "react";
import { Context } from "./Context";
import WalletConnect from "./WalletConnect";

export default function Header({ wagmiConfig, chains, projectId }) {
    const { wallet, setWallet } = useContext(Context);
    const [model, setModel] = useState(false);

    async function init() {
        try {
            const connector = new WalletConnectProvider({
                infuraId: process.env.NEXT_PUBLIC_INFURA_ID, // Replace with your Infura project ID
            });

            await connector.enable();
            setWallet(connector.accounts[0]);
            setProvider(connector);
            connector.on("accountsChanged", async (newAccounts) => {
                setWallet(newAccounts[0]);
            });

            connector.on("disconnect", () => {
                setWallet("");
            });
            setModel(false);
        } catch (error) {
            console.log(error);
        }
    }

    const getWalletFunction = () => {
        if (window.ethereum) {
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((res) => {
                    const wallet = res.length > 0 && String(res[0]);
                    wallet && setWallet(wallet);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            alert("install metamask extension!!");
        }
    };
    console.log(model);
    return (
        <div className="flex justify-between py-6 px-8 max-sm:px-4 max-sm:py-3 items-center border-b bg-[#000C28] h-[10vh]">
            <div className="container mx-auto flex justify-between items-center">
                <p className="font-bold text-xl text-[#FFFFFF] max-sm:text-sm">CrypZ - Subscribe Using MakerX</p>
                {wallet === "" ? (
                    <Button onClick={() => setModel(!model)} className="text-[#FFFFFF]">
                        Connect Wallet
                    </Button>
                ) : (
                    <Typography className="font-bold text-[#FFFFFF]" onClick={() => setModel(!model)}>
                        Connected
                    </Typography>
                )}
                {model && (
                    <div className="absolute z-10 top-[0%] w-[90%] h-[100%]">
                        <div className="flex justify-center items-center h-full">
                            <WalletConnect
                                model={model}
                                setModel={setModel}
                                getWalletFunction={getWalletFunction}
                                init={init}
                                wagmiConfig={wagmiConfig}
                                chains={chains}
                                projectId={projectId}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
