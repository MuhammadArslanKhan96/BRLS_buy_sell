import { Context, WEB3_Contract } from "@/components/Context";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import ABI from "@/Contracts/ABI.json";
import { getWeb3Instance } from "@/Contracts/Web3Instance";
import { Slide, ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }) {
    const [wallet, setWallet] = useState("");
    const [web3, setWeb3] = useState("");
    const [user, setUser] = useState();

    // const MAINNET_ID = 137;
    const MAINNET_ID = 80001;
    // const contractAddress = "0x1ed02954d60ba14e26c230eec40cbac55fa3aeea";
    const contractAddress = "0x707Ef067146026e481558Ce2c2BC3A085Ce9304B";

    const initContract = async (networkId = MAINNET_ID) => {
        try {
            const web3 = await getWeb3Instance(networkId);
            const contract = new web3.eth.Contract(ABI, contractAddress, wallet);
            setWeb3({ web3, contract });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        initContract();
        //eslint-disable-next-line
    }, []);

    return (
        <Context.Provider value={{ wallet, setWallet, user, setUser }}>
            <WEB3_Contract.Provider value={{ web3Obj: web3, contractAddress }}>
                <ToastContainer transition={Slide} newestOnTop />
                <Component {...pageProps} />
            </WEB3_Contract.Provider>
        </Context.Provider>
    );
}
