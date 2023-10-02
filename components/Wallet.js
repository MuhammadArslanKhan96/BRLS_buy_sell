import React, { useContext } from "react";
import { Context } from "./Context";

export default function Wallet() {
    const { wallet } = useContext(Context);

    return (
        <div className="mt-4 flex justify-between max-sm:flex-col gap-4">
            <div className="border border-[#a5f1fc] rounded-[20px] p-4 w-fit h-fit bg-[radial-gradient(83.21%_186.29%_at_12.42%_13.72%,rgba(0,12,40,.9)0%,rgba(0,12,40,.2)99.99%)] backdrop-blur-sm">
                <p className="text-[20px] max-sm:text-[16px] font-medium text-white">Wallet Address</p>
                <p className="text-[18px] max-sm:text-[14px] font-normal mt-2 hidden max-sm:flex text-white">{`${wallet?.slice(
                    0,
                    8
                )}...${wallet?.slice(wallet?.length - 6, wallet?.length)}`}</p>
                <p className="text-[18px] font-normal mt-2 flex max-sm:hidden text-white">{wallet}</p>
            </div>
        </div>
    );
}
