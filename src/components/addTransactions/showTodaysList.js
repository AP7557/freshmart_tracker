import { db } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect } from 'react';
import { FiList, FiType } from 'react-icons/fi';

export default function ShowTodaysList({
  selectedStore,
  todaysTransactions,
  setTodaysTransactions,
}) {
  useEffect(() => {
    const fetchTodaysTransactions = async () => {
      if (!selectedStore) return;

      try {
        const checksRef = collection(db, selectedStore);
        const q = query(
          checksRef,
          where('date', '==', new Date().toLocaleDateString())
        );

        const querySnapshot = await getDocs(q);

        const todaysT = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          todaysT.push(data);
        });

        setTodaysTransactions(todaysT);
      } catch (error) {
        console.error('Error fetching todays list:', error);
      }
    };

    fetchTodaysTransactions();
  }, [selectedStore]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    selectedStore &&
    todaysTransactions.length > 0 && (
      <div className='mt-8 space-y-4'>
        <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
          <FiList className='text-green-600' />
          Today's Transactions
        </h3>
        <ul className='space-y-3'>
          {todaysTransactions.map((data, index) => (
            <li
              key={index}
              className='p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='flex justify-between items-center'>
                <div className='font-medium text-gray-800'>{data.company}</div>
                <div className='text-green-600 font-semibold'>
                  $
                  {data.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </div>
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2 mt-1 text-sm text-gray-600'>
                  <FiType
                    className='text-green-500'
                    size={14}
                  />
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      data.type === 'Invoice'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {data.type}
                  </span>
                </div>
                <div className='font-medium text-gray-800'>
                  {data.invoiceNumber}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  );
}
