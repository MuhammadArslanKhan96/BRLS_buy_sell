import React, { useContext, useEffect, useState } from "react";
import { Context, WEB3_Contract } from "./Context";
import { BsCheckCircle } from "react-icons/bs";
import Wallet from "./Wallet";
import { ethers } from "ethers";
import ABI from "../Contracts/ABI.json";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { formatEther } from "ethers/lib/utils";
import getPlans from "@/pages/api/getPlans";
import Image from "next/image";
import MakerLogo from "@/public/images/tokenmakerx.png";
import Maker3DLogo from "@/public/images/tokenmakerx3D.png";
import Web3 from "web3";

export default function Plans() {
    const { wallet } = useContext(Context);
    const { web3Obj } = useContext(WEB3_Contract);

    const [tokenBalance, setTokenBalance] = useState();
    const [tokenBal, setTokenBal] = useState();
    const [loadings, setLoadings] = useState(false);
    const [planPrice, setPlanPrice] = useState({});

    const router = useRouter();

    const [provider, setProvider] = useState(null);
    // const [network, setNetwork] = useState("");

    const [price, setPrice] = useState();
    const api = "https://api.dexscreener.com/latest/dex/tokens/0x1ed02954d60ba14e26c230eec40cbac55fa3aeea";

    // const contractAddress = "0x707Ef067146026e481558Ce2c2BC3A085Ce9304B";

    const receiverAddress = "0x4DA21707a86F29033F26c0adBd70E9D105299467";

    const initializeProvider = async () => {
        if (window.ethereum) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
        }
    };

    // const getNetwork = async () => {
    //     if (provider) {
    //         const network = await provider.getNetwork();
    //         setNetwork(network.name);
    //     }
    // };

    useEffect(() => {
        initializeProvider();
        //eslint-disable-next-line
    }, []);

    const tokenDetails = async () => {
        try {
            const response = await fetch(api);
            const jsonData = await response?.json();
            const data = jsonData;
            const price = data?.pairs[0]?.priceUsd;
            setPrice(price);
        } catch (err) {
            console.log(err);
        }
    };

    const balanceWeb3 = async () => {
        try {
            const { contract } = web3Obj;
            const balance = await contract.methods.balanceOf(wallet).call();
            const weitoeth = Web3.utils.fromWei(balance, "ether");
            const num = Number(weitoeth).toFixed(2);
            setTokenBal(num);
        } catch (error) {
            console.log(error);
        }
    };

    // const balance = async () => {
    //     try {
    //         // if (wallet) {
    //         const signer = provider.getSigner();
    //         const myContract = new ethers.Contract(web3Obj?.contract?._address, ABI, signer);
    //         const balance = await myContract
    //             .balanceOf(receiverAddress)
    //             .then((data) => setTokenBalance(Number(formatEther(data._hex))));
    //         // }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    const transfer = async (e) => {
        try {
            if (wallet) {
                setLoadings(true);
                const signer = provider.getSigner();
                const gasPrice = await provider.getGasPrice();
                const myContract = new ethers.Contract(web3Obj?.contract?._address, ABI, signer);

                const mul = e.target.value / price;
                const weitoeth = ethers.utils.parseEther(mul.toString());

                console.log(tokenBal, ethers.utils.parseEther(mul.toString()));

                if (tokenBal >= weitoeth) {
                    const transfer = await myContract
                        .transfer(receiverAddress, weitoeth, {
                            gasPrice: gasPrice,
                            gasLimit: "200000",
                        })
                        .then((data) => console.log(data));
                    myContract.on("Transfer", (wallet, receiverAddress, weitoeth) => {
                        let transfer = {
                            from: wallet,
                            to: receiverAddress,
                            value: weitoeth,
                            eventData: event,
                        };
                        console.log(JSON.stringify(transfer, null, 4));
                        router.push({
                            pathname: router.query.redirect,
                        });
                    });
                } else toast("Insuffient Funds");
                setLoadings(false);
            } else toast("!Wallet not Connected");
        } catch (err) {
            console.log(err);
            toast(err);
            setLoadings(false);
        }
    };

    const plans = async () => {
        try {
            await getPlans().then((data) => setPlanPrice(data[0].plans));
        } catch (err) {
            console.log(err);
        }
    };

    if (wallet) {
        const timeout = setTimeout(function () {
            balanceWeb3();
        }, 5000);
    }

    useEffect(() => {
        tokenDetails();
        plans();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if ("/") {
            var id = new Date().getTime();
            router.replace({
                pathname: "/",
                query: { redirect: "https://www.google.com/" },
            });
            console.log(router);
        }
        //eslint-disable-next-line
    }, []);

    const id = router.query.redirect;
    console.log(id);

    const SubscriptionPlans = [
        {
            Type: "Starter",
            Features: [
                "2 bots to be created",
                "1 bots running simultaneously",
                "1 exchanges",
                "10 ticker presets",
                "Value of the base order up to 100",
                "Total value traded up to 1000",
            ],
            Amount: `${(planPrice?.basic / price).toFixed(2)}`,
            value: planPrice?.basic,
        },
        {
            Type: "Pro",
            Features: [
                "5 bots to be created",
                "3 bots running simultaneously",
                "3 exchanges",
                "20 ticker presets",
                "Value of the base order up to 250",
                "Total value traded up to 5000",
            ],
            Amount: `${(planPrice?.standard / price).toFixed(2)}`,
            value: planPrice?.standard,
        },
        {
            Type: "Premium",
            Features: [
                "10 bots to be created",
                "6 bots running simultaneously",
                "10 exchanges",
                "100 ticker presets",
                "Value of the base order up to 10000",
                "Total value traded up to 1000000",
            ],
            Amount: `${(planPrice?.premium / price).toFixed(2)}`,
            value: planPrice?.premium,
        },
    ];

    return (
        <>
            <div className="container mx-auto">
                <div className="flex gap-2 justify-between max-sm:flex-col flex-wrap">
                    <Wallet />
                    <div className="border border-[#a5f1fc] rounded-[20px] p-4 w-fit mt-4 bg-[radial-gradient(83.21%_186.29%_at_12.42%_13.72%,rgba(0,12,40,.9)0%,rgba(0,12,40,.2)99.99%)]">
                        <p className="text-[20px] max-sm:text-[16px] font-medium text-white">MakerX Token Price</p>
                        <div className="flex items-center gap-x-2 mt-2">
                            <Image src={MakerLogo} alt="" width={30} height={30} className="w-[30px] h-[30px]" />
                            <p className="text-[18px] max-sm:text-[14px] font-normal flex text-white">${price}</p>
                        </div>
                    </div>

                    {wallet && (
                        <div className="border border-[#a5f1fc] rounded-[20px] p-4 w-fit mt-4 bg-[radial-gradient(83.21%_186.29%_at_12.42%_13.72%,rgba(0,12,40,.9)0%,rgba(0,12,40,.2)99.99%)]">
                            <p className="text-[20px] max-sm:text-[16px] font-medium text-white">MakerX Balance</p>
                            <div className="flex items-center gap-x-2 mt-2">
                                <Image src={MakerLogo} alt="" width={30} height={30} className="w-[30px] h-[30px]" />
                                <p className="text-[18px] max-sm:text-[14px] font-normal flex text-white">
                                    {tokenBal ? tokenBal : "0"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex gap-x-4 justify-center mt-4 max-xl:justify-start overflow-x-scroll scrollStyle">
                    {SubscriptionPlans?.map((item, idx) => (
                        <div
                            className="border border-[#a5f1fc] hover:border-[#3FB7FF] min-w-[200px] px-4 py-2 pb-6 rounded-[20px] mt-4 mb-4 cursor-default bg-[radial-gradient(83.21%_186.29%_at_12.42%_13.72%,rgba(0,12,40,.9)0%,rgba(0,12,40,.2)99.99%)] shadow-2xl"
                            key={idx}
                        >
                            <div className="flex flex-col h-full justify-between">
                                <div className="flex flex-col">
                                    <p className="text-center font-bold text-[20px] text-white">{item?.Type}</p>
                                    <p className="flex items-center gap-x-2 justify-center text-center font-semibold text-white pb-2">
                                        <Image src={Maker3DLogo} alt="" width={20} height={20} />

                                        {item?.Amount}
                                    </p>
                                    <hr />
                                    {item?.Features?.map((item, idx) => (
                                        <p className="flex items-center gap-x-2 mt-3 text-white" key={idx}>
                                            <BsCheckCircle color="#00FF00" size={20} className="min-w-[20px]" />
                                            {item}
                                        </p>
                                    ))}
                                </div>
                                <div className="flex">
                                    <button
                                        type="button"
                                        value={item.value}
                                        onClick={transfer}
                                        className="flex justify-center items-center bg-[#4096FF] w-full hover:bg-[#4096FF80] font-normal text-[#FFFFFF] px-6 py-1 rounded-[10px] mt-4"
                                    >
                                        {loadings ? (
                                            <svg
                                                aria-hidden="true"
                                                class="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentFill"
                                                />
                                            </svg>
                                        ) : (
                                            "Buy"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
