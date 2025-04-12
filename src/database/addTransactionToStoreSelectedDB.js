import { db } from '../firebase';
import { addDoc, collection, setDoc, doc } from 'firebase/firestore';

// Function to add a transaction to a specific store document (with arrayUnion)
export const addTransactionToStoreSelectedDB = async (
  collectionName,
  transaction
) => {
  try {
    await addDoc(collection(db, collectionName), transaction);
  } catch (error) {
    console.error('Error adding transaction: ', error);
  }
};

// Function to add a transaction to a specific store document (with arrayUnion)
export const setStoreOrComapinesToDB = async (
  storeOrComapany,
  registerStoreOrComapany
) => {
  try {
    await setDoc(
      doc(db, 'Lists', storeOrComapany),
      { [registerStoreOrComapany]: registerStoreOrComapany },
      { merge: true }
    );
  } catch (error) {
    console.error('Error adding transaction: ', error);
  }
};
