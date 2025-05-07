 //@ts-nocheck
 "use client";
import React, { useState } from 'react'; 
import { HTTPPostWithToken } from '@/Services';
import { BASEURL } from '@/Constant/Link';
import { useRouter } from 'next/navigation';

const CreateGroup: React.FC = () => {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [groupname, setGroupname] = useState('');
  const [des, setDes] = useState('');
  const [paymentInterval, setPaymentInterval] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createGroup = async () => {
    const user = localStorage.getItem("user"); 
    if (user === null) {
      router.push('/signin');
      return;
    }

    const parsedUser = JSON.parse(user); 
    const userId = parsedUser.user.user_id; 
    const token = parsedUser.user.token;

    if (!groupname || !des || !paymentInterval || !amount) {
      setModalVisible(true);
      setModalType('warning');
      setModalMessage('Please fill the required fields');
      return;
    }

    setIsLoading(true);
    
    const body = {
      userid: userId,
      group_name: groupname,
      group_description: des,
      payment_interval: paymentInterval,
      amount: amount,
    };

    try {
      const response = await HTTPPostWithToken(`${BASEURL}/group/create`, body, token);
      if (response.code === 200) {
        setModalType('success');
        setModalMessage(response.message);
        setTimeout(() => {
          setModalVisible(false);
          router.push('/'); 
        }, 2000);
      } else {
        setModalType('warning');
        setModalMessage(response.errorMessage);
      }
    } catch (error) {
      setModalType('warning');
      setModalMessage('An error occurred, please try again.');
    } finally {
      setIsLoading(false);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-white p-8"> 
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Group Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setGroupname(e.target.value)}
          placeholder="Enter group name"
        />
      </div>

      {/* Payment Interval */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Interval</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={paymentInterval}
          onChange={(e) => setPaymentInterval(e.target.value)}
        >
          <option value="">Select Interval</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
        <input
          type="number"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>

      {/* Group Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Group Description</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={4}
          onChange={(e) => setDes(e.target.value)}
          placeholder="Enter group description"
        />
      </div>
    </div>

    {/* Create Group Button */}
    <div className="mt-6">
      <button
        onClick={createGroup}
        className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {isLoading ? (
          <span className="flex justify-center items-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path d="M4 12a8 8 0 1 1 16 0 8 8 0 1 1-16 0z" fill="none"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Create Group'
        )}
      </button>
    </div>

    {/* Modal */}
    {modalVisible && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className={`text-lg font-semibold ${modalType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {modalType === 'success' ? 'Success' : 'Warning'}
          </h2>
          <p className="mt-2">{modalMessage}</p>
          <button
            onClick={closeModal}
            className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    )}
  </div>
  );
};

export default CreateGroup;
