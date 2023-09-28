import React, { useContext, useEffect, useState } from "react";
import addPlans from "./api/addPlans";
import updatePlans from "./api/updatePlan";
import Image from "next/image";
import MakerxLogo from "@/public/images/tokenmakerx.png";
import { useRouter } from "next/router";
import getPlans from "./api/getPlans";
import { Context } from "@/components/Context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Admin() {
    const { user } = useContext(Context);
    const router = useRouter();

    const [values, setValues] = useState({
        basic: "",
        standard: "",
        premium: "",
    });

    const updatePrice = async () => {
        await updatePlans({
            basic: values.basic,
            standard: values.standard,
            premium: values.premium,
        }).then((data) => toast("Updated"));
    };

    const id = router.query.id;

    useEffect(() => {
        if (!user) {
            try {
                router.push("/signin");
            } catch (err) {
                console.log(err);
                router.push("/signin");
            }
        }
        // getPlan();
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto bg min-h-screen scrollStyle">
                <div className="flex justify-center mb-4">
                    <Image src={MakerxLogo} alt="" width={70} height={70} />
                </div>
                <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 bg-[radial-gradient(83.21%_186.29%_at_12.42%_13.72%,rgba(0,12,40,.9)0%,rgba(0,12,40,.2)99.99%)] shadow-2xl">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Plans Prices
                        </h1>
                        <div>
                            <label for="Basic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Basic Plans Price
                            </label>
                            <input
                                type="number"
                                name="basic"
                                id="basic"
                                className="bg-transparent border border-[#10333D] text-[#FFFFFF80] sm:text-sm rounded-lg block w-full p-2.5"
                                placeholder="$45"
                                required=""
                                value={values.basic}
                                onChange={(e) => setValues((pre) => ({ ...pre, basic: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label
                                for="Standard"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Standard Plans Price
                            </label>
                            <input
                                type="number"
                                name="standard"
                                id="standard"
                                placeholder="$75"
                                className="bg-transparent border border-[#10333D] text-[#FFFFFF80] sm:text-sm rounded-lg block w-full p-2.5"
                                required=""
                                value={values.standard}
                                onChange={(e) => setValues((pre) => ({ ...pre, standard: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label
                                for="Premium"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Premium Plans Price
                            </label>
                            <input
                                type="number"
                                name="premium"
                                id="premium"
                                placeholder="$120"
                                className="bg-transparent border border-[#10333D] text-[#FFFFFF80] sm:text-sm rounded-lg block w-full p-2.5"
                                required=""
                                value={values.premium}
                                onChange={(e) => setValues((pre) => ({ ...pre, premium: e.target.value }))}
                            />
                        </div>
                        <button
                            onClick={updatePrice}
                            type="button"
                            disabled={id != user?.uid}
                            className="w-full text-white bg-sky-500/100 hover:bg-sky-500/75 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
