import React from 'react';
//import { useNavigate } from 'react-router-dom';
import {useRouter} from 'next/navigation'
//import Link from 'next/link'
import { v4 as uuidv4 } from "uuid";
import FundCard from './FundCard';
import loader from '../assets/loader.svg';
import Image from 'next/image';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  //const navigate = useNavigate();
  const router = useRouter()

  console.log("Campaigns value at Display Campaign component: ", campaigns)

  const handleNavigate = (campaign) => {
    router.push(`/campaign-details/${campaign.title}`)
  }
  
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({campaigns.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <Image src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campigns yet
          </p>
        )}

        {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => <FundCard 
          key={uuidv4()}
          {...campaign}
          handleClick={() => handleNavigate(campaign)}
        />)}
      </div>
    </div>
  )
}

export default DisplayCampaigns