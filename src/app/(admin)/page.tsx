  
import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react"; 
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart"; 
import RecentOrders from "@/components/ecommerce/RecentOrders"; 
import Image from "next/image"; 

import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Dashboard", 
};

export default function Ecommerce() { 
    
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">   
    <div className="col-span-12">
      <div className="relative w-full p-8 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-[#4fb26e] to-[#d96b60] mt-8">
        {/* Little illustration */}
        <div className="absolute right-6 top-6 ">
          <Image
            src="/images/new.png"
            alt="Contribution"
            width={150}
            height={150}
          />
        </div>

        <div className="relative z-10">
          <h1 className="text-white text-4xl font-extrabold mb-4">
            Welcome to Adashe!
          </h1>
          <p className="text-white text-lg leading-relaxed max-w-3xl mb-6">
            Easily save, contribute, and grow your money together with trusted groups.
            Our platform makes contributions simple, transparent, and rewarding.
          </p>

          {/* Buttons Row */}
          <div className="flex gap-4">
            {/* Create Group Button */} 

              <Link
                href="/create"
                className="flex items-center gap-2 px-5 py-3 bg-white text-[#4fb26e] font-semibold rounded-xl shadow hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create Group
              </Link>

              <Link
                href="/groups"
                className="flex items-center gap-2 px-5 py-3 bg-white text-[#4fb26e] font-semibold rounded-xl shadow hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M6 20h3M2 18a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Groups
              </Link>

          </div>
        </div>
      </div>
    </div>

        <div className="col-span-12">
        <EcommerceMetrics />
        </div>


      <div className="col-span-12"> 
        {/* <EcommerceMetrics /> */}

        <MonthlySalesChart />
      </div>
{/* 
      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div> */}

      {/* <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div> */}

      <div className="col-span-12 ">
        <RecentOrders />
      </div>
    </div>
  );
}
