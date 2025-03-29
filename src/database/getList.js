// lib/firebaseQueries.js
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const fetchLists = async () => {
  try {
    const listsCollection = collection(db, "Lists"); // Make sure the collection is named 'companies'
    const querySnapshot = await getDocs(listsCollection);
    const lists = querySnapshot.docs.map((doc) => doc.data());
    return lists;
  } catch (error) {
    console.error("Error fetching lists: ", error);
    return [];
  }
};

export { fetchLists };
