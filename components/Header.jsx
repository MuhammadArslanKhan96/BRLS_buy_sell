import { Button, Typography } from "antd";
import React, { useContext } from "react";
import { Context } from "./Context";

export default function Header() {
    const { wallet, setWallet } = useContext(Context);

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

    return (
        <div className="flex justify-between py-6 px-8 max-sm:px-4 max-sm:py-3 items-center border-b bg-[#000C28] h-[10vh]">
            <div className="container mx-auto flex justify-between items-center">
                <p className="font-bold text-xl text-[#FFFFFF] max-sm:text-sm">MakerX Payment Gateway</p>
                {wallet === "" ? (
                    <Button onClick={getWalletFunction} className="text-[#FFFFFF]">
                        Connect Wallet
                    </Button>
                ) : (
                    <Typography className="font-bold text-[#FFFFFF]">Connected</Typography>
                )}
            </div>
        </div>
    );
}
