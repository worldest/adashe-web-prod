 
 "use client";
import React, { useEffect, useState } from 'react';  
import { HTTPGetWithToken } from '@/Services';
import { BASEURL } from '@/Constant/Link';
import { useRouter } from 'next/navigation';
type Payment = {
  id: string;
  group_name: string;
  created_at: string;
  status: number;
  amount: number;
};
const PaymentHistoryPage: React.FC = () => { 
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const router = useRouter();

  const getTrans = useCallback(async () => {
    const user = localStorage.getItem("user");

    if (user === null) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(user);
    const userId = parsedUser.user.user_id;
    const token = parsedUser.user.token;

    HTTPGetWithToken(`${BASEURL}/user/transactions/${userId}`, token)
      .then(data => {
        if (data.code === 200) {
          setPayments(data.payload);
        } else {
          setSnackbarMessage(data.message);
          setSnackbarOpen(true);
        }
      })
      .catch(error => {
        console.error("Transaction fetch error:", error);
        setSnackbarMessage("An error occurred while fetching transactions.");
        setSnackbarOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
    }, [router]);

  useEffect(() => {
    getTrans();
  }, [getTrans]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Payment History
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View and manage your payment records
          </p>
        </div>
  
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-[#4fb26e] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#45a85e] dark:bg-[#4fb26e] dark:hover:bg-[#45a85e]">
            See all
          </button>
        </div>
      </div>
  
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3">Group Name</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Amount</th> 
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-600"></div>
                  </div>
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">No payments found</td>
              </tr>
            ) : (
              payments.map((payment, index) => (
                <tr key={payment.id} className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#e6f9ee] text-[#4fb26e] dark:bg-green-900 dark:text-green-200 flex items-center justify-center">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{payment.group_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-400">
                    {payment.created_at.substring(0, 19)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      payment.status === 0
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : payment.status === 1
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {payment.status === 0 ? 'Pending' : payment.status === 1 ? 'Completed' : 'Queried'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    ₦{payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td> 
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  
      <div className="h-52"></div>
  
      <div className={`fixed bottom-0 left-0 right-0 bg-black text-white text-center py-3 ${snackbarOpen ? 'block' : 'hidden'}`}>
        {snackbarMessage}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
