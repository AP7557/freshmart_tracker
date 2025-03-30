// lib/firebaseQueries.js
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const getListOfStoresAndCompanies = async () => {
  try {
    const listsCollection = collection(db, "Lists");
    const querySnapshot = await getDocs(listsCollection);
    const lists = querySnapshot.docs.map((doc) => doc.data());
    return lists;
  } catch (error) {
    console.error("Error fetching lists: ", error);
    return [];
  }
};

const getDocsFromDB = async (collectionNames) => {
  try {
    const getCollectionDocs = collectionNames.map(async (collectionName) => {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const transactions = querySnapshot.docs.map((doc) => doc.data());
      return { store: collectionName, transactions };
    });

    return await Promise.all(getCollectionDocs);
  } catch (error) {
    console.error("Error fetching lists: ", error);
    return [];
  }
};

export { getDocsFromDB, getListOfStoresAndCompanies };
