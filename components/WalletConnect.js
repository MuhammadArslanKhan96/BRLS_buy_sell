"use client";

import { useContext } from "react";
import { RxCross2 } from "react-icons/rx";
import { useAccount } from "wagmi";
import { Context } from "./Context";
import Metamask from "../public/images/MetaMask.png";
import WalletonnectLogo from "../public/images/walletconnect.png";
import Image from "next/image";
import { useWeb3Modal } from "@web3modal/react";

export default function WalletConnect({ setModel, getWalletFunction }) {
    const { setWallet } = useContext(Context);

    const { address } = useAccount();
    const { open } = useWeb3Modal();

    setWallet(address);

    return (
        <>
            <div>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                    <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 bg-[#000C28] shadow-2xl">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <div>
                                <div className="flex justify-between mb-3">
                                    <h5 className=" text-base font-semibold text-white lg:text-xl">Connect wallet</h5>
                                    <button onClick={() => setModel(false)}>
                                        <RxCross2 color="#FFFFFF" />
                                    </button>
                                </div>
                                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    <p>Connect with one of our available wallet providers or create a new one.</p>
                                </p>
                                <div className="my-4 space-y-3">
                                    <button
                                        className="w-full group flex items-center justify-between rounded-lg bg-[#133B5480] p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:text-white dark:hover:bg-gray-500"
                                        onClick={() => {
                                            getWalletFunction();
                                            setModel(false);
                                        }}
                                    >
                                        <span className="ml-3 flex items-center text-white gap-x-2 whitespace-nowrap">
                                            <Image
                                                src={Metamask}
                                                alt=""
                                                width={30}
                                                height={30}
                                                className="w-[30px] h-[30px]"
                                            />
                                            MetaMask
                                        </span>
                                        <span className="ml-3 flex items-center justify-center rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                            <p>Popular</p>
                                        </span>
                                    </button>
                                    <div>
                                        <button
                                            onClick={() => open()}
                                            className="w-full group flex items-center rounded-lg bg-[#133B5480] p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:text-white dark:hover:bg-gray-500"
                                        >
                                            <span className="ml-3 flex items-center text-white gap-x-2 whitespace-nowrap">
                                                <Image
                                                    src={WalletonnectLogo}
                                                    alt=""
                                                    width={30}
                                                    height={30}
                                                    className="w-[30px] h-[30px]"
                                                />
                                                Wallet Connect
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
