/* eslint-disable consistent-return */
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

export default async function updatePlans(id) {
    try {
        const planPrice = doc(db, "SubscriptionPlans", "admin");
        // await setDoc(planPrice, {
        //     // name: "Frank",
        //     plans: { basic: "45", standard: "75", premium: "120" },
        //     // age: 12,
        // });

        // // To update age and favorite color:
        await updateDoc(planPrice, {
            // age: 13,
            "plans.basic": id?.basic,
            "plans.standard": id.standard,
            "plans.premium": id.premium,
        });
        console.log("updated");
    } catch (error) {
        console.log(error);
    }
}
