import { Context } from "@/components/Context";
import { auth } from "@/utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MakerxLogo from "@/public/images/tokenmakerx.png";

export default function Signin() {
    const router = useRouter();
    const { user, setUser } = useContext(Context);

    const [formValues, setFormValues] = useState({
        email: "",
        pass1: "",
    });

    const signin = () => {
        signInWithEmailAndPassword(auth, formValues.email, formValues.pass1)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                setUser(user);
                console.log(user);
                router.replace({ pathname: "/admin", query: { id: user.uid } });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error);
                toast("Something went wrong");
            });
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg min-h-screen scrollStyle">
                <div className="flex justify-center mb-4">
                    <Image src={MakerxLogo} alt="" width={70} height={70} />
                </div>
                <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 bg-[radial-gradient(83.21%_186.29%_at_12.42%_13.72%,rgba(0,12,40,.9)0%,rgba(0,12,40,.2)99.99%)] shadow-2xl">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sigin Account
                        </h1>
                        <div>
                            <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Your email
                            </label>
                            <input
                                type="email"
                                // name="email"
                                // id="email"
                                className="bg-transparent border border-[#10333D] text-[#FFFFFF80] sm:text-sm rounded-lg block w-full p-2.5"
                                placeholder="name@company.com"
                                required=""
                                value={formValues.email}
                                onChange={(e) => setFormValues((pre) => ({ ...pre, email: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label
                                for="password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                // name="password"
                                // id="password"
                                placeholder="••••••••"
                                className="bg-transparent border border-[#10333D] text-[#FFFFFF80] sm:text-sm rounded-lg block w-full p-2.5"
                                required=""
                                value={formValues.pass1}
                                onChange={(e) => setFormValues((pre) => ({ ...pre, pass1: e.target.value }))}
                            />
                        </div>
                        <button
                            onClick={signin}
                            type="submit"
                            className="w-full text-white bg-sky-500/100 hover:bg-sky-500/75 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
