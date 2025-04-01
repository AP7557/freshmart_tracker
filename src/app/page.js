"use client";

import { getListOfStoresAndCompanies } from "@/database/getDocsFromDB";
import StoreSelection from "@/utils/StoreSelection";
import { useEffect, useState } from "react";

export default function Overview() {
  const [storeSelected, setStoreSelected] = useState("");
  const [storesList, setStoresList] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [_, storeList] = await getListOfStoresAndCompanies("Lists");
      const storeListValues = Object.values(storeList);
      console.log("TRESFD", storeListValues);
      setStoresList(storeListValues);

      // const allTransactionsForEachStore = await getDocsFromDB(storeListValues);
      // const today = new Date().toLocaleDateString("en-US");
      // const todaysTransactions = allTransactionsForEachStore
      //   .map(({ store, transactions }) =>
      //     transactions
      //       .filter(
      //         (transaction) =>
      //           transaction.date === today && transaction.date !== ""
      //       )
      //       .map((transaction) => ({
      //         ...transaction,
      //         store,
      //       }))
      //   )
      //   .flat();

      // setTransactionData(todaysTransactions);
    };

    loadData();
  }, []);

  return (
    <div>
      Overview Page
      <StoreSelection
        setStoreSelected={setStoreSelected}
        storeSelected={storeSelected}
        storesList={storesList}
      />
    </div>
  );
}
