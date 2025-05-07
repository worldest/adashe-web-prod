 "use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASEURL } from "@/Constant/Link";
import { HTTPGetWithToken } from "@/Services";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";

interface Group {
  id: number;
  group_name: string;
  next_payment: string;
  start_date: string;
  group_value: number;
  status?: "Active" | "Inactive" | "Pending";
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const GroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4fb26e]">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export default function GroupTable({ data }: { data?: any }) {
  const router = useRouter();
  const [group, setGroup] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const getGroup = async () => {
    const user = localStorage.getItem("user");
    if (user === null) {
      router.push('/signin');
      return;
    }

    const parsedUser = JSON.parse(user);
    const userId = parsedUser.user.user_id;
    const token = parsedUser.user.token;

    try {
      const data = await HTTPGetWithToken(`${BASEURL}/group/member/${userId}`, token);
      if (data.code === 200) {
        const payload = data.payload.map((item: Group) => {
          if (item.start_date) item.start_date = formatDate(item.start_date);
          if (item.next_payment) item.next_payment = formatDate(item.next_payment);
          item.status = "Active"; // Example status
          return item;
        });
        setGroup(payload);
      } else {
        console.error('Error fetching group data:', data.message);
      }
    } catch (error) {
      console.error('Error making HTTP request:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGroup();
  }, []);

  const handleViewGroup = (groupId: number) => {
    router.push(`/group-details?id=${groupId}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Active Groups
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View and manage your savings groups
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
              <th className="px-6 py-3">Group</th>
              <th className="px-6 py-3">Next Payment</th>
              <th className="px-6 py-3">Created On</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : group.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">No groups found</td>
              </tr>
            ) : (
              group.map((groupItem, index) => (
                <tr key={groupItem.id} className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#e6f9ee] text-blue-600 dark:bg-blue-900 dark:text-blue-200 flex items-center justify-center">
                        <GroupIcon />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{groupItem.group_name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Group ID: {groupItem.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{groupItem.next_payment || 'N/A'}</td>
                  <td className="whitespace-nowrap px-6 py-4">{groupItem.start_date}</td>
                  <td className="whitespace-nowrap px-6 py-4">₦{groupItem.group_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Badge size="sm" color={groupItem.status === "Active" ? "success" : groupItem.status === "Pending" ? "warning" : "error"}>
                      {groupItem.status || "Active"}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewGroup(groupItem.id)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
