  //@ts-nocheck
 "use client";
import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiArrowLeft, FiSend, FiImage, FiX, FiUser, FiDollarSign, FiClock, FiBell, FiMessageSquare, FiSettings, FiUsers } from 'react-icons/fi';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { HTTPGetWithToken, HTTPPostWithToken, HTTPPatchWithToken } from '@/Services';
import { useRouter, useSearchParams } from 'next/navigation';
import { BASEURL } from '@/Constant/Link';

interface Member {
  user_id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  payout_status: number;
  current_round?: number;
}

interface Transaction {
  id: number;
  user_id: string;
  amount: number;
  status: number;
  created_at: string;
  comment: string;
  receipt: string;
}

interface Payout {
  id: number;
  first_name: string;
  last_name: string;
  amount: number;
  status: number;
  created_at: string;
  receipt: string;
}

interface Chat {
  user_id: string;
  username: string;
  message: string;
  created_at: string;
}

interface GroupData {
  group_name: string;
  group_desc: string;
  group_status: string;
  group_value: number;
  payment_interval: string;
  amount: number;
  next_payment: string;
  host: string;
  group_round: number;
  id?: string;
}

const GroupDetailsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('id');

  // State management
  const [groupData, setGroupData] = useState<GroupData>({
    group_name: '',
    group_desc: '',
    group_status: '',
    group_value: 0,
    payment_interval: '',
    amount: 0,
    next_payment: '',
    host: '',
    group_round: 0
  });

  const [user_, setUser] = useState<Member[]>([]);
  const [userDummy, setUserDummy] = useState<Member[]>([{
    first_name: "",
    last_name: "",
    user_id: "",
    payout_status: 0
  }]);
  const [groupTrans, setGroupTrans] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [totalPayout, setTotalPayout] = useState(0);
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<Member[]>([]);
  const [memberArray, setMemberArray] = useState<string[]>([]);
  const [memberArrayCount, setMemberArrayCount] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [auth, setAuth] = useState({ user_id: "", token: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [isReceiptSelected, setIsReceiptSelected] = useState("Select Receipt");
  const [startingDate, setStartingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phone, setPhone] = useState("");
  const [decision, setDecision] = useState(1);
  const [id, setId] = useState(0);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Modal states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Chart configuration
  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#4fb26e'],
    xaxis: {
      categories: [],
      title: {
        text: 'Number of Contributions',
        style: {
          fontSize: '12px',
          fontWeight: 400,
        }
      }
    },
    yaxis: {
      title: {
        text: 'Members',
        style: {
          fontSize: '12px',
          fontWeight: 400,
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " contributions";
        }
      }
    }
  });

  const [series, setSeries] = useState([{
    name: 'Contributions',
    data: []
  }]);

  // Fetch data functions
  const fetchGroupData = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    const token = parsedUser.user.token;
    
    try {
      const data = await HTTPGetWithToken(`${BASEURL}/group/fetch/${groupId}`, token);
      if (data.code === 200) {
        setGroupData(data.payload);
        setUser(data.members);
        setUserDummy(data.members);
        setUsers(data.members);
      }
    } catch (error) {
      console.error('Error fetching group data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupPayouts = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    const token = parsedUser.user.token;

    try {
      const data = await HTTPGetWithToken(`${BASEURL}/group/payouts/${groupId}`, token);
      if (data.code === 200) {
        setPayouts(data.payload);
        setTotalPayout(data.total?.[0]?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching payouts:', error);
    }
  };

  const fetchGroupTrans = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    const token = parsedUser.user.token;

    try {
      const data = await HTTPGetWithToken(`${BASEURL}/group/transactions/${groupId}`, token);
      if (data.code === 200) {
        setGroupTrans(data.payload);

        // Update chart data
        const tempArray: string[] = [];
        const tempCount: number[] = [];
        
        user_.forEach(member => {
          tempArray.push(member.first_name);
          const userTransactions = data.payload.filter((t: Transaction) => t.user_id === member.user_id);
          tempCount.push(userTransactions.length);
        });
        
        setMemberArray(tempArray);
        setMemberArrayCount(tempCount);
        
        // Update chart series
        setSeries([{
          name: 'Contributions',
          data: tempCount
        }]);
        
        // Update chart categories
        setChartOptions(prev => ({
          ...prev,
          xaxis: {
            ...prev.xaxis,
            categories: tempArray
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchGroupChats = async () => {
    const user = localStorage.getItem("user");
    if (!user) return;

    const parsedUser = JSON.parse(user);
    const token = parsedUser.user.token;

    try {
      const data = await HTTPGetWithToken(`${BASEURL}/group/chats/${groupId}`, token);
      if (data.code === 200) {
        setChats(data.payload);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // Handlers for various actions
  const handleInvite = async () => {
    if (!phone) {
      alert('Please enter a phone number');
      return;
    }

    setIsLoadingAction(true);
    const user = localStorage.getItem("user");
    if (!user) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    const token = parsedUser.user.token;
    
    const body = {
      userid: parsedUser.user.user_id,
      invited_userid: phone,
      group_id: groupId
    };
    
    try {
      const response = await HTTPPostWithToken(`${BASEURL}/group/invite`, body, token);
      
      if (response.code === 200) {
        alert(response.message);
        setIsInviteOpen(false);
        setPhone("");
        fetchGroupData();
      } else if (response.code === 500) {
        // Send SMS invite
        const smsMessage = `Hi, I am inviting you to join my group on Adashe. Download the app on Google Playstore and Apple store to join now`;
        window.location.href = `sms:${phone}?body=${encodeURIComponent(smsMessage)}`;
        setIsInviteOpen(false);
      } else {
        alert(response.errorMessage || "Failed to send invite");
      }
    } catch (error) {
      console.error('Error inviting user:', error);
      alert("Please retry");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReceiptSelected("Uploading...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://payload-x.com/server/cdn/file/upload.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setIsReceiptSelected("Uploaded");
      setSelectedImage(data.link);
    } catch (error) {
      console.error("Error uploading image", error);
      setIsReceiptSelected("Failed to upload. Try again.");
    }
  };

  const handlePaymentRequest = async () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }

    setIsLoadingAction(true);
    const user = localStorage.getItem("user");
    if (!user) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    const token = parsedUser.user.token;

    const body = {
      userid: parsedUser.user.user_id,
      group_id: groupId,
      amount: amount,
      receipt: selectedImage,
      comment: comment
    };
    
    try {
      const response = await HTTPPostWithToken(`${BASEURL}/payments/submit_request/`, body, token);
      
      if (response.code === 200) {
        alert(response.message);
        setAmount("");
        setComment("");
        setSelectedImage("");
        setIsReceiptSelected("Select Receipt");
        fetchGroupTrans();
      } else {
        alert(response.errorMessage || "Failed to submit payment");
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert("Please retry");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handlePayout = async () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }

    setIsLoadingAction(true);
    const user = localStorage.getItem("user");
    if (!user) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    const token = parsedUser.user.token;

    const receiver = user_.find(
      (ex) => ex.payout_status > groupData.group_round && ex.current_round === 1
    );

    const body = {
      userid: parsedUser.user.user_id,
      group_id: groupId,
      receiver_id: receiver ? receiver.user_id : "",
      amount: amount,
      receipt: selectedImage,
    };
    
    try {
      const response = await HTTPPostWithToken(`${BASEURL}/group/processPayout`, body, token);
      console.log(body)
      
      if (response.code === 200) {
        alert(response.message);
        setAmount("");
        setSelectedImage("");
        setIsReceiptSelected("Select Receipt");
        setIsPayoutOpen(false);
        fetchGroupData();
        fetchGroupPayouts();
      } else {
        alert(response.errorMessage || "Failed to process payout");
      }
    } catch (error) {
      console.error('Error processing payout:', error);
      alert("Please retry");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleAccept = async (payoutId: string) => {
    setIsLoadingAction(true);
    const user = localStorage.getItem("user");
    if (!user) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    const token = parsedUser.user.token;

    const body = {
      userid: parsedUser.user.user_id,
      payout_id: payoutId,
    };
    
    try {
      const response = await HTTPPostWithToken(`${BASEURL}/group/acceptPayout`, body, token);
      
      if (response.code === 200) {
        alert(response.message);
        fetchGroupPayouts();
      } else {
        alert(response.errorMessage || "Failed to accept payout");
      }
    } catch (error) {
      console.error('Error accepting payout:', error);
      alert("Please retry");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleDecision = async (decision: number, id: number) => {
    setDecision(decision);
    setId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoadingAction(true);
    setIsConfirmOpen(false);

    const user = localStorage.getItem("user");
    if (!user) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    const token = parsedUser.user.token;

    const body = {
      userid: parsedUser.user.user_id,
      txnid: id,
      decision: decision
    };
    
    try {
      const response = await HTTPPatchWithToken(`${BASEURL}/payments/decide`, body, token);
      
      if (response.code === 200) {
        alert(response.message);
        fetchGroupTrans();
      } else {
        alert(response.errorMessage || "Failed to process decision");
      }
    } catch (error) {
      console.error('Error processing decision:', error);
      alert("Please retry");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const startGroup = async () => {
    setIsLoadingAction(true);
    const user = localStorage.getItem("user");
    if (!user) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    const token = parsedUser.user.token;

    const formattedDate = startingDate instanceof Date && !isNaN(startingDate.getTime())
      ? new Intl.DateTimeFormat('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        }).format(startingDate)
      : '';
    
    const body = {
      userid: parsedUser.user.user_id,
      start_date: formattedDate,
      group_id: groupId,
    };
    
    try {
      const response = await HTTPPostWithToken(`${BASEURL}/group/startGroup`, body, token);
      
      if (response.code === 200) {
        alert(response.message);
        setIsManageOpen(false);
        fetchGroupData();
      } else {
        alert(response.errorMessage || "Failed to start group");
      }
    } catch (error) {
      console.error('Error starting group:', error);
      alert("Please retry");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Drag and drop functionality
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedUsers = Array.from(users);
    const [removed] = reorderedUsers.splice(result.source.index, 1);
    reorderedUsers.splice(result.destination.index, 0, removed);
    setUsers(reorderedUsers);
  };

  // Render draggable member item
  const renderMemberItem = (user: Member, index: number) => (
    <Draggable key={user.user_id} draggableId={user.user_id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 mb-3 rounded-lg flex items-center ${
            snapshot.isDragging ? 'bg-gray-100 shadow-md' : 'bg-white'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            <FiUser className="text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(user.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </Draggable>
  );

  // Effect hooks
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setAuth({
        user_id: parsedUser.user.user_id,
        token: parsedUser.user.token
      });
    }
    console.log(groupId)
    if (groupId) {
      fetchGroupData();
      fetchGroupTrans();
      fetchGroupPayouts();
    }
  }, [groupId]);

  useEffect(() => {
    if (isChatOpen) {
      fetchGroupChats();
    }
  }, [isChatOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiArrowLeft className="text-gray-700 text-xl" />
          </button> */}
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">{groupData.group_name}</h1>
            <p className="text-sm text-gray-500">{groupData.group_desc}</p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 text-green-600"
            >
              <FiMessageSquare className="text-xl" />
            </button>
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 text-green-600"
            >
              <FiBell className="text-xl" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */} 
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-50 mr-3">
                <FiDollarSign className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Contribution</p>
                <p className="font-bold text-gray-900">₦ {groupData.group_value?.toLocaleString()}</p>
              </div>
            </div>
          </div>
 
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-50 mr-3">
                <FiDollarSign className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Payout</p>
                <p className="font-bold text-gray-900">₦ {totalPayout?.toLocaleString()}</p>
              </div>
            </div>
          </div>
 
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-50 mr-3">
                <FiClock className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Interval</p>
                <p className="font-bold text-gray-900">{groupData.payment_interval}</p>
              </div>
            </div>
          </div>
 
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-50 mr-3">
                <FiDollarSign className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount to Pay</p>
                <p className="font-bold text-gray-900">₦ {groupData.amount?.toLocaleString()}</p>
              </div>
            </div>
          </div>
 
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-50 mr-3">
                <FiClock className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Payment</p>
                <p className="font-bold text-gray-900">
                  {groupData.next_payment ? new Date(groupData.next_payment).toLocaleString() : "N/A"}
                </p>
              </div>
            </div>
          </div>
 
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-50 mr-3">
                <FiUser className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Payout Collector</p>
                <p className="font-bold text-gray-900">
                  {userDummy.filter(ex => parseInt(ex.payout_status.toString()) > 0).length > 0
                    ? `${userDummy.filter(ex => parseInt(ex.payout_status.toString()) === 1)[0].first_name} ${userDummy.filter(ex => parseInt(ex.payout_status.toString()) === 1)[0].last_name}`
                    : `${userDummy[0].first_name} ${userDummy[0].last_name}`
                  }
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      
      {/* Tabs */}
      <div className="container mx-auto px-4">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab(0)}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 0 ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 1 ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
          >
            Payouts
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 2 ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
          >
            Payment Notification
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="container mx-auto px-4 py-4">
        {activeTab === 0 && (
          <>
            {/* Members Tab */}
            <div className="mb-6">
              <ReactApexChart 
                options={chartOptions}
                series={series}
                type="bar"
                height={350}
              />
            </div>
            
            {groupData.host === auth.user_id && (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="membersList">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-3"
                    >
                      {users.map((user, index) => renderMemberItem(user, index))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </>
        )}
        
        {activeTab === 1 && (
          <div className="space-y-4">
            {payouts.map((payout, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  payout.status === 1 ? 'bg-green-50' : 
                  payout.status === 0 ? 'bg-yellow-50' : 'bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {payout.first_name} {payout.last_name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(payout.created_at).toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">₦ {payout.amount?.toLocaleString()}</p>
                </div>
                
                {payout.receipt && (
                  <div className="mt-3">
                    <img
                      src={payout.receipt}
                      alt="Receipt"
                      className="w-full rounded-lg border border-gray-200"
                      onClick={() => window.open(payout.receipt, '_blank')}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Receipt</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500"
                onClick={() => document.getElementById('receipt-upload')?.click()}
              >
                <input
                  id="receipt-upload"
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                <FiImage className="mx-auto text-gray-400 text-2xl" />
                <p className="mt-2 text-sm text-gray-600">{isReceiptSelected}</p>
              </div>
              
              {selectedImage && (
                <div className="mt-4">
                  <img
                    src={selectedImage}
                    alt="Uploaded Receipt"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}
              
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Comment</label>
              <textarea
                placeholder="Enter comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              ></textarea>
              
              <button
                onClick={handlePaymentRequest}
                disabled={isLoadingAction}
                className={`w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ${
                  isLoadingAction ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoadingAction ? 'Processing...' : 'Proceed'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Admin Bottom Navigation */}
      {groupData.host === auth.user_id && (
  <div className="fixed md:static bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-20">
    <div className="container mx-auto px-4 py-3">
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setIsManageOpen(true)}
          className="flex flex-col items-center justify-center p-2 text-green-600"
        >
          <FiSettings className="text-xl mb-1" />
          <span className="text-xs text-black">Manage</span>
        </button>

        <button
          onClick={() => setIsHistoryOpen(true)}
          className="flex flex-col items-center justify-center p-2 text-green-600"
        >
          <FiClock className="text-xl mb-1" />
          <span className="text-xs">History</span>
        </button>

        <button
          onClick={() => setIsPayoutOpen(true)}
          className="flex flex-col items-center justify-center p-2 text-green-600"
        >
          <FiDollarSign className="text-xl mb-1" />
          <span className="text-xs">Payout</span>
        </button>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex flex-col items-center justify-center p-2 text-green-600"
        >
          <FiUsers className="text-xl mb-1" />
          <span className="text-xs">Invite</span>
        </button>
      </div>
    </div>
  </div>
)}

      
      {/* Chat Modal */} 
      {isChatOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "90%",
              borderRadius: "1rem",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "1rem",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={() => setIsChatOpen(false)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "9999px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <FiArrowLeft size={20} color="#374151" />
              </button>
              <h3 style={{ fontWeight: "500", color: "#111827" }}>Group Chat</h3>
              <div style={{ width: "2rem" }} /> {/* Spacer */}
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1rem",
                backgroundColor: "#fafafa",
              }}
            >
              <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b7280", marginBottom: "1rem" }}>
                --- Chat Started ---
              </p>

              {chats.map((chat, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: chat.user_id === auth.user_id ? "flex-end" : "flex-start",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: chat.user_id === auth.user_id ? "#d1fae5" : "#f3f4f6",
                      padding: "0.75rem",
                      borderRadius: "0.75rem",
                      maxWidth: "75%",
                    }}
                  >
                    <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>{chat.username}</p>
                    <p style={{ marginTop: "0.25rem" }}>{chat.message}</p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        textAlign: "right",
                        marginTop: "0.25rem",
                      }}
                    >
                      {new Date(chat.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: "1rem",
                borderTop: "1px solid #e5e7eb",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem 0 0 0.5rem",
                  outline: "none",
                }}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={async () => {
                  if (!message.trim()) return;

                  try {
                    const user = localStorage.getItem("user");
                    if (!user) return;

                    const parsedUser = JSON.parse(user);
                    const body = {
                      userid: parsedUser.user.user_id,
                      group_id: groupId,
                      message: message,
                    };

                    await HTTPPostWithToken(`${BASEURL}/group/sendMessage`, body, parsedUser.user.token);
                    setMessage("");
                    fetchGroupChats();
                  } catch (error) {
                    console.error("Error sending message:", error);
                  }
                }}
                style={{
                  backgroundColor: "#16a34a",
                  color: "#fff",
                  padding: "0.75rem",
                  borderRadius: "0 0.5rem 0.5rem 0",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: "-1px",
                }}
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* Notifications Modal */} 
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 30,
          display: isNotificationsOpen ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '80vh',
            overflow: 'hidden',
            margin: '0 16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3 style={{ fontWeight: '500', color: '#111827' }}>Notifications</h3>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <FiX style={{ color: '#4B5563' }} />
            </button>
          </div>

          <div
            style={{
              overflowY: 'auto',
              flex: 1,
              padding: '16px',
              display: payouts.filter((ex) => ex.status === 0).length === 0 ? 'flex' : 'block',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {payouts.filter((ex) => ex.status === 0).length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: '16px', color: '#6B7280' }}>No notifications yet</p>
            ) : (
              payouts
                .filter((ex) => ex.status === 0)
                .map((payout, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor:
                        payout.status === 1
                          ? '#ECFDF5'
                          : payout.status === 0
                          ? '#FEF9C3'
                          : '#FEE2E2',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontWeight: '500' }}>
                          {payout.first_name} {payout.last_name}
                        </p>
                        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
                          {new Date(payout.created_at).toLocaleString()}
                        </p>
                      </div>
                      <p style={{ fontWeight: 'bold' }}>₦ {payout.amount?.toLocaleString()}</p>
                    </div>

                    {payout.receipt && (
                      <img
                        src={payout.receipt}
                        alt="Receipt"
                        style={{
                          width: '100%',
                          marginTop: '12px',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB',
                          cursor: 'pointer',
                        }}
                        onClick={() => window.open(payout.receipt, '_blank')}
                      />
                    )}

                    {payout.status === 0 && groupData.host === auth.user_id && (
                      <button
                        onClick={() => handleAccept(payout.id.toString())}
                        disabled={isLoadingAction}
                        style={{
                          width: '100%',
                          marginTop: '12px',
                          backgroundColor: '#16A34A',
                          color: 'white',
                          padding: '12px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: isLoadingAction ? 'not-allowed' : 'pointer',
                          opacity: isLoadingAction ? 0.5 : 1,
                          transition: 'background-color 0.3s',
                        }}
                      >
                        {isLoadingAction ? 'Processing...' : 'Accept'}
                      </button>
                    )}
                  </div>
                )))
            }
          </div>
        </div>
      </div>



      
      {/* Manage Group Modal */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 30,
          display: isManageOpen ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '80vh',
            overflow: 'hidden',
            margin: '0 16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3 style={{ fontWeight: '500', color: '#111827' }}>Manage Group</h3>
            <button
              onClick={() => setIsManageOpen(false)}
              style={{
                padding: '4px',
                borderRadius: '9999px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <FiX style={{ color: '#374151' }} />
            </button>
          </div>

          <div
            style={{
              padding: '16px',
              overflowY: 'auto',
              maxHeight: '60vh',
              flexGrow: 1,
            }}
          >
            {groupData.group_status === "running" ? (
              <>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>Drag to arrange members</p>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="manageMembersList">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                      >
                        {users.map((user, index) => renderMemberItem(user, index))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </>
            ) : (
              <>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>Start Group</p>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  Pick a start date
                </label>

                <div
                  onClick={() => setShowDatePicker(true)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    cursor: 'pointer',
                  }}
                >
                  {startingDate instanceof Date && !isNaN(startingDate.getTime())
                    ? startingDate.toLocaleDateString()
                    : 'Select date'}
                </div>

                {showDatePicker && (
                  <div
                    style={{
                      position: 'fixed',
                      inset: 0,
                      backgroundColor: 'white',
                      zIndex: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DatePicker
                      selected={startingDate}
                      onChange={(date) => {
                        setStartingDate(date);
                        setShowDatePicker(false);
                      }}
                      inline
                    />
                  </div>
                )}

                <button
                  onClick={startGroup}
                  disabled={isLoadingAction}
                  style={{
                    width: '100%',
                    backgroundColor: isLoadingAction ? '#059669' : '#10b981',
                    color: 'white',
                    fontWeight: '500',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    opacity: isLoadingAction ? 0.5 : 1,
                    cursor: isLoadingAction ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isLoadingAction ? 'Starting...' : 'Start Group'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      
      {/* History Modal */} 
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 30,
          display: isHistoryOpen ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '80vh',
            overflow: 'hidden',
            margin: '0 16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3 style={{ fontWeight: '500', color: '#111827' }}>Contribution History</h3>
            <button
              onClick={() => setIsHistoryOpen(false)}
              style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <FiX style={{ color: '#4B5563' }} />
            </button>
          </div>

          <div
            style={{
              overflowY: 'auto',
              flex: 1,
              padding: '16px',
              display: groupTrans.length === 0 ? 'flex' : 'block',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {groupTrans.length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: '16px', color: '#6B7280' }}>No transactions yet</p>
            ) : (
              groupTrans.map((transaction, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor:
                      transaction.status === 1
                        ? '#ECFDF5'
                        : transaction.status === 0
                        ? '#FEF9C3'
                        : '#FEE2E2',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <p style={{ fontWeight: '500' }}>
                        {user_.find((u) => u.user_id === transaction.user_id)?.first_name}{' '}
                        {user_.find((u) => u.user_id === transaction.user_id)?.last_name}
                      </p>
                      <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
                        {new Date(transaction.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p style={{ fontWeight: 'bold' }}>₦ {transaction.amount?.toLocaleString()}</p>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#4B5563' }}>Comment</p>
                    <p style={{ fontSize: '14px', marginTop: '4px', color: '#6B7280' }}>{transaction.comment}</p>
                  </div>

                  {transaction.receipt && (
                    <img
                      src={transaction.receipt}
                      alt="Receipt"
                      style={{
                        width: '100%',
                        marginTop: '12px',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        cursor: 'pointer',
                      }}
                      onClick={() => window.open(transaction.receipt, '_blank')}
                    />
                  )}

                  {transaction.status === 0 && groupData.host === auth.user_id && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                      <button
                        onClick={() => handleDecision(1, transaction.id)}
                        style={{
                          backgroundColor: '#16A34A',
                          color: 'white',
                          padding: '12px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s',
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecision(2, transaction.id)}
                        style={{
                          backgroundColor: '#EF4444',
                          color: 'white',
                          padding: '12px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s',
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      
      {/* Payout Modal */} 
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 30,
          display: isPayoutOpen ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '80vh',
            overflow: 'hidden',
            margin: '0 16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3 style={{ fontWeight: '500', color: '#111827' }}>Process Payout</h3>
            <button
              onClick={() => setIsPayoutOpen(false)}
              style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <FiX style={{ color: '#4B5563' }} />
            </button>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '16px' }}>
            <label
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#4B5563',
                marginBottom: '8px',
              }}
            >
              Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '16px',
                marginBottom: '16px',
                focus: { borderColor: '#10B981' },
              }}
            />

            <label
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#4B5563',
                marginBottom: '8px',
              }}
            >
              Receipt
            </label>
            <div
              onClick={() => document.getElementById('payout-receipt-upload')?.click()}
              style={{
                border: '2px dashed #E5E7EB',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: '16px',
              }}
            >
              <input
                id="payout-receipt-upload"
                type="file"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
              <FiImage style={{ color: '#9CA3AF', fontSize: '24px' }} />
              <p style={{ marginTop: '8px', fontSize: '14px', color: '#6B7280' }}>{isReceiptSelected}</p>
            </div>

            {selectedImage && (
              <img
                src={selectedImage}
                alt="Receipt"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  marginBottom: '16px',
                }}
              />
            )}

            <div style={{ marginTop: '16px' }}>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#4B5563',
                }}
              >
                Processing payout to:
              </p>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  marginTop: '4px',
                  color: '#111827',
                }}
              >
                {userDummy.filter((ex) => parseInt(ex.payout_status.toString()) > 0).length > 0
                  ? `${userDummy.filter((ex) => parseInt(ex.payout_status.toString()) === 1)[0].first_name} ${userDummy.filter((ex) => parseInt(ex.payout_status.toString()) === 1)[0].last_name}`
                  : `${userDummy[0].first_name} ${userDummy[0].last_name}`}
              </p>
            </div>

            <button
              onClick={handlePayout}
              disabled={isLoadingAction}
              style={{
                width: '100%',
                marginTop: '24px',
                padding: '12px',
                backgroundColor: '#16A34A',
                color: 'white',
                fontWeight: '500',
                borderRadius: '8px',
                cursor: isLoadingAction ? 'not-allowed' : 'pointer',
                opacity: isLoadingAction ? 0.5 : 1,
                transition: 'background-color 0.3s',
              }}
            >
              {isLoadingAction ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>

      
      {/* Invite Modal */} 
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 30,
          display: isInviteOpen ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '80vh',
            overflow: 'hidden',
            margin: '0 16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3 style={{ fontWeight: '500', color: '#111827' }}>Invite a Member</h3>
            <button
              onClick={() => setIsInviteOpen(false)}
              style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <FiX style={{ color: '#4B5563' }} />
            </button>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '16px' }}>
            <label
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#4B5563',
                marginBottom: '8px',
              }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter user phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '16px',
                marginBottom: '24px',
                focus: { borderColor: '#10B981' },
              }}
            />

            <button
              onClick={handleInvite}
              disabled={isLoadingAction}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#16A34A',
                color: 'white',
                fontWeight: '500',
                borderRadius: '8px',
                cursor: isLoadingAction ? 'not-allowed' : 'pointer',
                opacity: isLoadingAction ? 0.5 : 1,
                transition: 'background-color 0.3s',
              }}
            >
              {isLoadingAction ? 'Sending...' : 'Invite'}
            </button>
          </div>
        </div>
      </div>

      
      {/* Confirm Modal */} 
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 30,
          display: isConfirmOpen ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '350px',
            padding: '24px',
            margin: '0 16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>
            Confirm Decision
          </h3>
          <p
            style={{
              color: '#4B5563',
              fontSize: '16px',
              marginBottom: '24px',
            }}
          >
            Are you sure you want to {decision === 1 ? "approve" : "reject"} this payment?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={handleConfirm}
              disabled={isLoadingAction}
              style={{
                backgroundColor: '#16A34A',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                cursor: isLoadingAction ? 'not-allowed' : 'pointer',
                opacity: isLoadingAction ? 0.5 : 1,
                transition: 'background-color 0.3s',
              }}
            >
              {isLoadingAction ? 'Processing...' : 'Yes'}
            </button>
            <button
              onClick={() => setIsConfirmOpen(false)}
              style={{
                backgroundColor: '#DC2626',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GroupDetailsPage;