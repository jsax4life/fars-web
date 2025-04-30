"use client";

import React from "react";
import Sidebar from "@/components/utility/Sidebar"; // Adjust path if needed
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', earnings: 2000 },
  { name: 'Feb', earnings: 1500 },
  { name: 'March', earnings: 3000 },
  { name: 'April', earnings: 2500 },
  { name: 'May', earnings: 4000 },
  { name: 'June', earnings: 3500 },
  { name: 'July', earnings: 5000 },
  { name: 'August', earnings: 4500 },
  { name: 'Sept', earnings: 6000 },
  { name: 'Oct', earnings: 5500 },
  { name: 'Nov', earnings: 7000 },
  { name: 'Dec', earnings: 6500 },
];

const ActivityItem = ({ name, email, description, time }: any) => (
  <li className="bg-white rounded-md p-3 shadow-sm">
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
        <svg className="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700">{name}</h4>
        <p className="text-xs text-gray-500">{email}</p>
        <p className="text-xs text-gray-600">{description}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  </li>
);

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Hi, Olayimmika</h1>
            <p className="text-sm text-gray-500">June 18th 2023 - 08:34 am</p>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none">State</button>
            <button className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none">Category</button>
            <button className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none">Company</button>
            <button className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none">Date</button>
            <button className="relative">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-6-6C5.928 5 4 6.979 4 9.5V17h5a2 2 0 002 2h2a2 2 0 002-2zm0 0l-1.405-1.405A2.032 2.032 0 0115 14.158V11a6 6 0 00-6-6C5.928 5 4 6.979 4 9.5V17h5a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">3</span>
            </button>
            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="bg-[#2E2D2D] text-white p-6 h-auto md:h-64 rounded-lg w-full md:w-[100%] relative overflow-hidden flex flex-col justify-between">
        {/* Background Image */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-cover bg-no-repeat bg-right" style={{ backgroundImage: "url('/dashboard/star.png')" }}></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-cover bg-no-repeat bg-right" style={{ backgroundImage: "url('/dashboard/star.svg')" }}></div>
        
        <div className="flex items-center space-x-4 relative z-10">
         
          <svg width="87" height="87" viewBox="0 0 87 87" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="9" y="9" width="69" height="69" rx="34.5" fill="#FFFDFB"/>
<rect x="4.74658" y="4.74658" width="77.5069" height="77.5069" rx="38.7534" stroke="#C2C2C2" stroke-opacity="0.18" stroke-width="8.50685"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M31.3915 23.4701C34.1996 22.0644 38.9451 20.3438 44.1542 20.3438H44.1554C49.2653 20.3438 53.8978 22.0009 56.692 23.3917C57.3637 23.7186 58.0142 24.0872 58.6398 24.4953L55.6195 28.911L53.9128 29.7967C48.0348 32.7616 40.1537 32.7616 34.2769 29.7967L32.7731 29.1982L29.5787 24.4953C29.8739 24.3004 30.2452 24.079 30.6812 23.8415C30.9014 23.7215 31.1378 23.597 31.3915 23.4701ZM33.3797 24.8275C34.4768 25.175 35.594 25.4554 36.7252 25.667C39.2138 26.1271 41.7209 26.194 43.8659 25.5736C46.5921 24.786 49.4533 24.1459 52.1345 23.7688C49.8465 23.0146 47.0799 22.4195 44.1542 22.4195C39.93 22.4195 36.0102 23.6593 33.3797 24.8275ZM54.8469 31.6499L55.1306 31.5069C64.7669 41.8029 72.3631 61.8562 44.1542 61.8562C15.9453 61.8562 23.3605 42.1707 33.0729 31.5138L33.3416 31.6499C39.8066 34.9112 48.3819 34.9112 54.8469 31.6499ZM39.9464 39.9951C40.3981 39.8579 40.8866 40.0352 41.1476 40.4267L45.8284 47.4429H47.7523V41.0189C47.7523 40.4267 48.2307 39.9483 48.8229 39.9483C49.4151 39.9483 49.8936 40.4267 49.8936 41.0189V47.4429H50.9643C51.5565 47.4429 52.0349 47.9214 52.0349 48.5136C52.0349 49.1058 51.5565 49.5843 50.9643 49.5843H49.8936V53.8703C49.8936 54.3421 49.5858 54.757 49.1341 54.8941C48.6824 55.0313 48.1939 54.854 47.9329 54.4625L44.6808 49.5843H41.3282V53.867C41.3282 54.4592 40.8498 54.9376 40.2576 54.9376C39.6654 54.9376 39.1869 54.4592 39.1869 53.867V49.5843H38.1162C37.524 49.5843 37.0456 49.1058 37.0456 48.5136C37.0456 47.9214 37.524 47.4429 38.1162 47.4429H39.1869V41.0189C39.1869 40.5472 39.4947 40.1323 39.9464 39.9951ZM47.7523 49.5843H47.2537L47.7523 50.3304V49.5843ZM41.3282 47.4429H43.2521L41.3282 44.5555V47.4429Z" fill="#F36F2E"/>
</svg>

          
          <div>
            <h2 className="text-3xl font-bold text-white">NGN 843,000</h2>
            <p className="text-gray-400 text-sm">Total Payment Received (16-01-2024)</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center relative z-10">
          <div>
            <p className="text-lg font-semibold">NGN 346,000.00</p>
            <p className="text-gray-400 text-sm">Total Approved Payment</p>
          </div>
          <div>
            <p className="text-lg font-semibold">NGN 346,000.00</p>
            <p className="text-gray-400 text-sm">Total Pending Payment</p>
          </div>
        
        </div>
      </div>

        {/* Transaction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-200 flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm md:text-lg">673</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">673</h3>
              <p className="text-xs md:text-sm text-gray-500">Total Authorized Transactions</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-200 flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm md:text-lg">087</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">087</h3>
              <p className="text-xs md:text-sm text-gray-500">Total Unauthorized Transactions</p>
            </div>
          </div>
        </div>

        {/* Earning Reports */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 md:mb-4">Earning Reports</h2>
          <div className="h-48">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="earnings" stroke="#F36F2E" strokeWidth={2} dot={false} />
            </LineChart>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Jan</span><span>Feb</span><span>March</span><span>April</span><span>May</span><span>June</span><span>July</span><span>August</span><span>Sept</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar (All Activities) */}
      <aside className="w-72 md:w-80 bg-gray-50 p-4 md:p-6 rounded-lg shadow-md overflow-y-auto">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h2 className="text-lg font-semibold text-gray-700">All Activities</h2>
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-3 md:mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
          />
        </div>

        {/* Activities List */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">August</h3>
          <ul className="space-y-2 md:space-y-3">
            <ActivityItem
              name="Olayimika Yinka"
              email="@olayinkasysoftpress.com"
              description="Consectetur Tempus aliquam ut sagittis ut Lorem ipsum dolor sit amet tempus aliquam ut sagittis ut Lorem ipsum dolor sit amet."
              time="Aug 20, 2023 - 04:12 PM"
            />
            <ActivityItem
              name="Olayimika Yinka"
              email="@olayinkasysoftpress.com"
              description="Consectetur Tempus aliquam ut sagittis ut Lorem ipsum dolor sit amet tempus aliquam ut sagittis ut Lorem ipsum dolor sit amet."
              time="Aug 20, 2023 - 04:12 PM"
            />
            <ActivityItem
              name="Olayimika Yinka"
              email="@olayinkasysoftpress.com"
              description="Consectetur Tempus aliquam ut sagittis ut Lorem ipsum dolor sit amet tempus aliquam ut sagittis ut Lorem ipsum dolor sit amet."
              time="Aug 20, 2023 - 04:12 PM"
            />
          </ul>
        </div>

        <div className="mt-4 md:mt-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">July</h3>
          <ul className="space-y-2 md:space-y-3">
            <ActivityItem
              name="Olayimika Yinka"
              email="@olayinkasysoftpress.com"
              description="Consectetur Tempus aliquam ut sagittis ut Lorem ipsum dolor sit amet tempus aliquam ut sagittis ut Lorem ipsum dolor sit amet."
              time="Aug 03, 2023 - 02:32 PM"
            />
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;