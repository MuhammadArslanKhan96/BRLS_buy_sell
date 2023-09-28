import { addDoc, collection } from "firebase/firestore";
import { db } from "../../utils/firebase";

export default async function addPlans(PlansPrice) {
    try {
        console.log("Document written with ID:", PlansPrice);
        await addDoc(collection(db, "SubscriptionPlans"), PlansPrice);
        // return 'done';
    } catch (e) {
        console.error("Error adding document:", e);
    }
}
