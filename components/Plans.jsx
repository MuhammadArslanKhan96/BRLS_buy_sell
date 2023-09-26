import React, { useContext, useEffect, useState } from "react";
import { Context, WEB3_Contract } from "./Context";
import { BsCheckCircle } from "react-icons/bs";
import Wallet from "./Wallet";
import { ethers } from "ethers";
import ABI from "../Contracts/ABI.json";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default function Plans() {
    const { wallet } = useContext(Context);
    const { web3Obj } = useContext(WEB3_Contract);

    const [provider, setProvider] = useState(null);
    const [network, setNetwork] = useState("");

    const [price, setPrice] = useState();
    const api = "https://api.dexscreener.com/latest/dex/tokens/0x1ed02954d60ba14e26c230eec40cbac55fa3aeea";

    const contractAddress = "0x707Ef067146026e481558Ce2c2BC3A085Ce9304B";

    const receiverAddress = "0x4DA21707a86F29033F26c0adBd70E9D105299467";

    const initializeProvider = async () => {
        if (window.ethereum) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
        }
    };

    const getNetwork = async () => {
        if (provider) {
            const network = await provider.getNetwork();
            setNetwork(network.name);
        }
    };

    useEffect(() => {
        initializeProvider();
        getNetwork();
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

    const getOwner = async () => {
        try {
            const { contract } = web3Obj;
            const get_Owner = await contract.methods.name().call();
            console.log(get_Owner);
        } catch (error) {
            console.log(error);
        }
    };

    const transfer = async (e) => {
        try {
            if (wallet) {
                const signer = provider.getSigner();
                const gasPrice = await provider.getGasPrice();
                const myContract = new ethers.Contract(contractAddress, ABI, signer);

                const mul = e.target.value / price;
                const weitoeth = ethers.utils.parseEther(mul.toString());

                const transfer = await myContract.transfer(receiverAddress, weitoeth, {
                    gasPrice: gasPrice,
                    gasLimit: "200000",
                });
            } else toast("!Wallet not Connected");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        tokenDetails();
        getOwner();
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <div className="flex gap-2 justify-between max-sm:flex-col">
                <Wallet />
                <div className="border border-[#a5f1fc] rounded-[20px] p-4 w-fit mt-4 bg-[radial-gradient(83.21%_186.29%_at_12.42%_13.72%,rgba(0,12,40,.9)0%,rgba(0,12,40,.2)99.99%)] backdrop-blur-sm">
                    <p className="text-[20px] font-semibold text-white">MakerX Token Price</p>
                    <p className="text-[18px] font-medium mt-2 flex text-white">${price}</p>
                </div>
            </div>
            <div className="flex gap-x-4 justify-center items-center max-sm:justify-start max-sm:overflow-x-scroll scrollStyle">
                {SubscriptionPlans.map((item, idx) => (
                    <div
                        className="border border-[#a5f1fc] hover:border-[#3FB7FF] min-w-[200px] px-4 py-2 pb-6 rounded-[20px] mt-4 mb-4 cursor-default bg-[radial-gradient(83.21%_186.29%_at_12.42%_13.72%,rgba(0,12,40,.9)0%,rgba(0,12,40,.2)99.99%)] backdrop-blur-sm shadow-2xl"
                        key={idx}
                    >
                        <div>
                            <p className="text-center font-bold text-[20px] text-white">{item.Type}</p>
                            <p className="text-center font-semibold text-white pb-2">{item.Amount}</p>
                            <hr />
                            {item.Features.map((item, idx) => (
                                <p className="flex items-center gap-x-2 mt-3 text-white" key={idx}>
                                    <BsCheckCircle color="#00FF00" />
                                    {item}
                                </p>
                            ))}
                            <button
                                type="primary"
                                value={item.value}
                                onClick={transfer}
                                className="bg-[#4096FF] w-full hover:bg-[#4096FF80] font-medium text-[#FFFFFF] px-6 py-1 rounded-[10px] mt-4"
                            >
                                Buy
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

const SubscriptionPlans = [
    {
        Type: "Basic",
        Features: ["Features", "Features", "Features", "Features", "Features", "Features"],
        Amount: "$29 /month",
        value: 29,
    },
    {
        Type: "Standard",
        Features: ["Features", "Features", "Features", "Features", "Features", "Features"],
        Amount: "$59 /month",
        value: 59,
    },
    {
        Type: "Premium",
        Features: ["Features", "Features", "Features", "Features", "Features", "Features"],
        Amount: "$99 /month",
        value: 99,
    },
];
