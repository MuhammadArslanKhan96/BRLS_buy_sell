import ABI from "@/Contracts/ABI.json";
import BRLSStable from "@/Contracts/BRLSStable.json";
import { Tabs } from "antd";
import * as ethers from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./Context";
import Wallet from "./Wallet";

export default function Swap() {
  const { wallet } = useContext(Context);
  const [keys, setKeys] = useState("1");
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState({
    in: "1",
    for: "1",
  });

  // const CONTRACT_ADDRESS = "0x707Ef067146026e481558Ce2c2BC3A085Ce9304B";
  // const CONTRACT_ADDRESS = "0x1a2281c0829E8bE077a03cbdcBC0b6F7073fc65E";
  const CONTRACT_ADDRESS = "0xb527D69B32E3c3B82D08371aeEb8D822445d2a9E";
  // const BRLS = "0xA2d95b31D6d8EfdB2b06F95cE0b94934056306e5";
  const BRLS = "0x3E810dfd43Fc09B1b070d46c503CaAa607ae6c2a"; //vusd

  const BRLS_Address = new ethers.Wallet(
    process.env.NEXT_PUBLIC_BRLS_PRIVATE_KEY
  );
  const PIX_Address = new ethers.Wallet(
    process.env.NEXT_PUBLIC_PIX_PRIVATE_KEY
  );
  console.log(wallet);

  const buy = async () => {
    try {
      if (wallet) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");
        const signer = provider.getSigner();
        const gasPrice = await provider.getGasPrice();
        const myContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        const amount = ethers.utils.parseEther(value?.in?.toString());
        const balance = await myContract.balanceOf(wallet);
        // .then((data) => console.log(Number(formatEther(data._hex))));
        const bal = Number(formatEther(balance._hex));
        const to = PIX_Address.address;
        console.log(to, bal, value);
        if (bal >= value?.in) {
          const transfer = await myContract
            .transfer(to, amount, {
              gasPrice: gasPrice,
              gasLimit: "200000",
            })
            .then(async (data) => {
              const provider = new ethers.providers.JsonRpcProvider(
                "https://data-seed-prebsc-1-s3.binance.org:8545/"
              );
              const signer1 = new ethers.Wallet(
                process.env.NEXT_PUBLIC_BRLS_PRIVATE_KEY,
                provider
              );
              const myContract1 = new ethers.Contract(
                BRLS,
                BRLSStable,
                signer1
              );
              const amount1 = ethers.utils.parseEther(value?.in?.toString());

              const mint = await myContract1.mint(
                wallet,
                "0",
                amount1,
                "0x3078354233384461366137303163353638353435644366634230334663423837",
                {
                  gasPrice: gasPrice,
                  gasLimit: "200000",
                }
              );
              toast.success("Successfully Transfer");
            });
          console.log(transfer);
          myContract.on("Transfer", async (wallet, to, amount) => {
            let transfer = {
              from: wallet,
              to: to,
              value: amount,
              eventData: event,
            };
            console.log(JSON.stringify(transfer, null, 4));
            // const provider = new ethers.providers.JsonRpcProvider(
            //     "https://data-seed-prebsc-1-s3.binance.org:8545/"
            // );
            // const signer1 = new ethers.Wallet(process.env.NEXT_PUBLIC_BRLS_PRIVATE_KEY, provider);
            // const gasPrice = await signer1.getGasPrice();
            // const myContract1 = new ethers.Contract(BRLS, BRLSStable, signer1);
            // // const balance = await myContract1.balanceOf(BRLS_Address.address, "0");
            // // console.log(balance);
            // const amount1 = ethers.utils.parseEther(value?.in?.toString());

            // const mint = await myContract1.mint(
            //     wallet,
            //     "0",
            //     amount1,
            //     "0x3078354233384461366137303163353638353435644366634230334663423837",
            //     {
            //         gasPrice: gasPrice,
            //         gasLimit: "200000",
            //     }
            // );
            // console.log(mint);
            // myContract1.on("TransferSingle", async (from, wallet, amount) => {
            //     let mint = {
            //         from: from,
            //         to: wallet,
            //         value: amount,
            //         data: event,
            //     };
            //     toast.success("Successfully Buy");
            //     console.log("minted");
            // });
            // console.log(JSON.stringify(transfer, null, 4));
          });
        } else {
          toast.error("Insufficient funds");
        }
      } else {
        toast.error("Wallet not available!");
      }
    } catch (err) {
      console.error(err || "Something went wrong");
    }
  };

  const sell = async () => {
    try {
      if (wallet) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");
        const signer = provider.getSigner();
        const gasPrice = await provider.getGasPrice();
        const myContract = new ethers.Contract(BRLS, BRLSStable, signer);
        const amount = ethers.utils.parseEther(value?.in?.toString());
        const balance = await myContract.balanceOf(wallet, "0");
        const bal = Number(formatEther(balance._hex));

        const to = BRLS_Address.address;

        if (bal >= value?.in) {
          const transfer = await myContract
            .safeTransferFrom(
              wallet,
              to,
              "0",
              amount,
              "0x3078354233384461366137303163353638353435644366634230334663423837",
              {
                gasPrice: gasPrice,
                gasLimit: "200000",
              }
            )
            .then(async (data) => {
              // burn start
              const provider2 = new ethers.providers.JsonRpcProvider(
                "https://data-seed-prebsc-1-s3.binance.org:8545/"
              );
              const signer1 = new ethers.Wallet(
                process.env.NEXT_PUBLIC_BRLS_PRIVATE_KEY,
                provider2
              );
              const myContract2 = new ethers.Contract(
                BRLS,
                BRLSStable,
                signer1
              );
              const amount1 = ethers.utils.parseEther(value?.in?.toString());
              console.log(myContract2);

              const burn = await myContract2.burn(
                BRLS_Address.address,
                "0",
                amount1,
                {
                  gasPrice: gasPrice,
                  gasLimit: "200000",
                }
              );
              console.log(burn);
              // burn end

              // pix transfer start
              const provider1 = new ethers.providers.JsonRpcProvider(
                "https://data-seed-prebsc-1-s3.binance.org:8545/"
              );
              const signer = new ethers.Wallet(
                process.env.NEXT_PUBLIC_BRLS_PRIVATE_KEY,
                provider1
              );
              const myContract1 = new ethers.Contract(
                CONTRACT_ADDRESS,
                ABI,
                signer
              );
              const amount2 = ethers.utils.parseEther(value?.in?.toString());

              const transfe1 = await myContract1.transfer(wallet, amount2, {
                gasPrice: gasPrice,
                gasLimit: "200000",
              });
              // pix transfer end
              toast.success("Successfully Transfer");
            });
          console.log(transfer);
          myContract.on("TransferSingle", async (wallet, to, amount) => {
            let transfer = {
              from: wallet,
              to: to,
              value: amount,
            };
            console.log(transfer);
            // const provider = new ethers.providers.JsonRpcProvider(
            //     "https://data-seed-prebsc-1-s3.binance.org:8545/"
            // );
            // const signer1 = new ethers.Wallet(process.env.NEXT_PUBLIC_BRLS_PRIVATE_KEY, provider);
            // const gasPrice = await signer1.getGasPrice();
            // const myContract1 = new ethers.Contract(BRLS, BRLSStable, signer1);
            // // const balance = await myContract1.balanceOf(BRLS_Address.address, "0");
            // // console.log(balance);
            // const amount1 = ethers.utils.parseEther(value?.in?.toString());
            // console.log(myContract1);

            // const burn = await myContract1.burn(BRLS_Address.address, "0", amount1, {
            //     gasPrice: gasPrice,
            //     gasLimit: "200000",
            // });
            // console.log(burn);
            // myContract1.on("TransferSingle", async (from, wallet, amount) => {
            //     let burn = {
            //         from: from,
            //         to: wallet,
            //         value: amount,
            //         data: event,
            //     };
            //     const provider = new ethers.providers.JsonRpcProvider(
            //         "https://data-seed-prebsc-1-s3.binance.org:8545/"
            //     );
            //     const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_BRLS_PRIVATE_KEY, provider);
            //     const gasPrice = await provider.getGasPrice();
            //     const myContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
            //     const amount1 = ethers.utils.parseEther(value?.in?.toString());
            //     // const balance = await myContract.balanceOf(PIX_Address.address);

            //     // console.log(balance);

            //     const transfer = await myContract.transfer(wallet, amount1, {
            //         gasPrice: gasPrice,
            //         gasLimit: "200000",
            //     });
            //     myContract.on("Transfer", async (wallet, receiverAddress, amount) => {
            //         let transfer = {
            //             from: wallet,
            //             to: receiverAddress,
            //             value: amount,
            //         };
            //         toast.success("Successfully Sell");
            //         console.log("burned");
            //     });
            // });
            // console.log(JSON.stringify(transfer, null, 4));
          });
        } else {
          toast.error("Insufficient funds");
        }
      } else {
        toast.error("Wallet not available!");
      }
    } catch (err) {
      console.error(err || "Something went wrong");
    }
  };

  const onChange = (key) => {
    setKeys(key);
  };

  const items = [
    {
      key: "1",
      label: "Buy",
    },
    {
      key: "2",
      label: "Sell",
    },
  ];

  return (
    <>
      <div>
        <Wallet />
        {/* <Balance /> */}
      </div>
      <div className="flex justify-center mt-4">
        <div className="bg-[linear-gradient(180deg,#201f2b,rgba(32,31,43,.3))] rounded-[10px] p-[32px] max-w-[500px]">
          <p className="flex justify-center text-[24px] font-semibold text-white">
            {keys === "1" ? "Buy" : "Sell"} BRLS
          </p>
          <div className="w-full [&>div>div>div>div>div]:!text-white">
            <Tabs
              defaultActiveKey="1"
              items={items}
              onChange={onChange}
              centered
              size="large"
              tabBarStyle={{ color: "#FFFFFF" }}
            />
          </div>
          <div>
            {keys === "1" ? (
              <>
                {/* IN */}
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[24px] font-semibold text-white">Pix</p>
                  </div>
                  <div className="flex items-center rounded-[12px] bg-[#403a52] border border-[#3e5060] p-2 focus:ring-[#8356e8] focus:border-[#8356e8]">
                    <p className="font-medium text-white">$</p>
                    <input
                      className="bg-transparent placeholder:text-[18px] text-white placeholder:font-extrabold w-full outline-none px-2"
                      placeholder="Enter a value"
                      type="number"
                      value={value.in}
                      onChange={(e) =>
                        setValue({ ...value, in: e.target.value })
                      }
                    />
                  </div>
                  {!value?.in && (
                    <p className="text-[#ff6868] text-[14px]">
                      Enter a value greater than $0.00
                    </p>
                  )}
                </div>
                {/* FOR */}
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[24px] font-semibold text-white">
                      BRLSStable
                    </p>
                  </div>
                  <div className="flex items-center rounded-[12px] bg-[#403a52] border border-[#3e5060] p-2 focus:ring-[#8356e8] focus:border-[#8356e8]">
                    <p className="font-medium text-white">$</p>
                    <input
                      className="bg-transparent placeholder:text-[18px] text-white placeholder:font-extrabold w-full outline-none px-2"
                      placeholder="Enter a value"
                      type="number"
                      disabled
                      value={value?.in}
                      // onChange={(e) => setValue({ ...value, for: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={buy}
                    className="flex items-center justify-center w-full font-medium bg-[#8356e8] hover:bg-[#5b3ca2] gap-x-2 rounded-[10px] text-[18px] text-white px-[22px] py-[12px] shadow-[rgba(0,0,0,0.2)0px_3px_1px_-2px,rgba(0,0,0,0.14)0px_2px_2px_0px,rgba(0,0,0,0.12)0px_1px_5px_0px]"
                  >
                    Buy
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* FOR */}
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[24px] font-semibold text-white">
                      BRLSStable
                    </p>
                  </div>
                  <div className="flex items-center rounded-[12px] bg-[#403a52] border border-[#3e5060] p-2 focus:ring-[#8356e8] focus:border-[#8356e8]">
                    <p className="font-medium text-white">$</p>
                    <input
                      className="bg-transparent placeholder:text-[18px] text-white placeholder:font-extrabold w-full outline-none px-2"
                      placeholder="Enter a value"
                      type="number"
                      value={value?.in}
                      onChange={(e) =>
                        setValue({ ...value, in: e.target.value })
                      }
                    />
                  </div>
                </div>
                {/* IN */}
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[24px] font-semibold text-white">Pix</p>
                  </div>
                  <div className="flex items-center rounded-[12px] bg-[#403a52] border border-[#3e5060] p-2 focus:ring-[#8356e8] focus:border-[#8356e8]">
                    <p className="font-medium text-white">$</p>
                    <input
                      className="bg-transparent placeholder:text-[18px] text-white placeholder:font-extrabold w-full outline-none px-2"
                      placeholder="Enter a value"
                      type="number"
                      disabled
                      value={value.in}
                      onChange={(e) =>
                        setValue({ ...value, in: e.target.value })
                      }
                    />
                  </div>
                  {!value?.in && (
                    <p className="text-[#ff6868] text-[14px]">
                      Enter a value greater than $0.00
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    onClick={sell}
                    className="flex items-center justify-center w-full font-medium bg-[#8356e8] hover:bg-[#5b3ca2] gap-x-2 rounded-[10px] text-[18px] text-white px-[22px] py-[12px] shadow-[rgba(0,0,0,0.2)0px_3px_1px_-2px,rgba(0,0,0,0.14)0px_2px_2px_0px,rgba(0,0,0,0.12)0px_1px_5px_0px]"
                  >
                    Sell
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
