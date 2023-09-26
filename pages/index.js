import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Plans from "@/components/Plans";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            {/* <div className="flex justify-center w-full"> */}
            {/* <div className="bg-[#000c28]"> */}
            <Header />
            <div className="px-4 bg scrollStyle">
                <Plans />
            </div>
            {/* </div> */}
        </>
    );
}
