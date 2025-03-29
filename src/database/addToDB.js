import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

// Function to add a transaction to a specific store document (with arrayUnion)
export const addTransactionToStoreDoc = async (transaction) => {
  try {
    await addDoc(collection(db, "pending_transactions"), transaction);
  } catch (error) {
    console.error("Error adding transaction: ", error);
  }
};
