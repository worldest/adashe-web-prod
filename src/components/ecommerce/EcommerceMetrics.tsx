 
 "use client";
 import React, { useEffect, useState } from "react"; 
 import { BoxIconLine, GroupIcon } from "@/icons";
 import { HTTPGetWithToken } from "@/Services";
 import { BASEURL } from "@/Constant/Link";
 
 export const EcommerceMetrics = () => {
   
   const [totalCont, setTotalCont] = useState("0.00"); 
   const getTrans = async () => {
     const user = localStorage.getItem("user"); 
    
  
     const parsedUser = JSON.parse(user); // Now it's parsed properly
      
     const userId = parsedUser.user.user_id; 
     const token = parsedUser.user.token;
 
     console.log("User ID:", userId);
     console.log("Token:", token);
 
     try { 
       const data = await HTTPGetWithToken(`${BASEURL}/user/transactions/${userId}`, token);
       console.log("Transaction Data:", data);
  
       if (data.code === 200) { 
         
         let tot = 0; 
  
         data.payload.forEach(o => { 
           if (o.status === 1) tot += parseFloat(o.amount);
         });
 
         setTotalCont(tot); 
 
       } else {
         console.error('Error fetching transactions:', data.message);
       }
 
     } catch (error) {
       console.error('Error making HTTP request:', error);
     }
 };
   const [totalPayout, setTotalPayout] = useState(0)
   const fetchGroupPayouts = async () => { 
       const user = localStorage.getItem("user"); 
 
 
     if (user) {
       const parsedUser = JSON.parse(user); // Now it's parsed properly
    
   const userId = parsedUser.user.user_id; 
   const token = parsedUser.user.token;
 
 
       HTTPGetWithToken(`${BASEURL}/group/payouts/user/${userId}`,token)
         .then(data => {
           console.log("TXN", data)
           if (data.code === 200) {
 
             setTotalPayout(data.total[0].total)
 
           } else {
             console.error('Error fetching group data:', data.message);
           }
         })
         .catch(error => {
           console.error('Error making HTTP request:', error);
         })
         .finally(() => {
 
         });
     }
   };
   useEffect(() => {  
     getTrans(); 
     fetchGroupPayouts();
   }, []);  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
              Total Contribution
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              ₦ {totalCont}
            </h4>
          </div> 
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
        <div>
            <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
              Total Payout
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              ₦ {totalPayout !== null ? totalPayout : 0}
            </h4>
          </div> 
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
