import React, { useContext, useEffect, useState } from "react";
import { Context } from "./Context";
import ABI from "@/Contracts/ABI.json";
import BRLSStable from "@/Contracts/BRLSStable.json";
import { ethers } from "ethers";

export default function Balance() {
    const { wallet } = useContext(Context);
    const [pix, setPix] = useState();

    const CONTRACT_ADDRESS = "0x1a2281c0829E8bE077a03cbdcBC0b6F7073fc65E";
    const BRLS = "0xA2d95b31D6d8EfdB2b06F95cE0b94934056306e5";
    const pixBal = async () => {
        const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s3.binance.org:8545/");
        const signer = provider.getSigner();
        const myContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        // console.log(signer);
        const balance = await myContract.balanceOf(wallet);
        console.log(myContract);
        // .then((data) => console.log(Number(formatEther(data._hex))));
        // console.log(balance);
        const bal = Number(formatEther(balance._hex));
    };

    // useEffect(() => {
    if (wallet) {
        pixBal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <div>
            <div className="mt-4 flex justify-between max-sm:flex-col gap-4">
                <div className="border border-[#a5f1fc] rounded-[20px] p-4 w-fit h-fit bg-[radial-gradient(83.21%_186.29%_at_12.42%_13.72%,rgba(0,12,40,.9)0%,rgba(0,12,40,.2)99.99%)] backdrop-blur-sm">
                    <p className="text-[20px] max-sm:text-[16px] font-medium text-white">PIX Balance</p>
                    <p className="text-[18px] font-normal mt-2 text-white"></p>
                </div>
            </div>
        </div>
    );
}
