//import React, { useContext, createContext, Children } from 'react';

//import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { useMoralis, useWeb3Contract, Moralis } from 'react-moralis';
import networkMapping from "../constants/networkMapping.json"
import { ethers } from 'ethers';
import Crowdfunding from "../constants/Crowdfunding.json"



export const contextProvider = () => {

  const { runContractFunction } = useWeb3Contract
    const { chainId, account } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : null
    console.log(chainId)
    const contract = networkMapping[chainString] ? networkMapping[chainString].Crowdfunding[0] : null

    const address = account;
  //const connect = Moralis.Web3.authenticate();

  const publishCampaign = async (form) => {
    const title = form.title
    const description = form.description
    const target = form.target
    const image = form.image
    const deadline = new Date(form.deadline).getTime()

    try {
      const data = await runContractFunction({params: {
        abi: Crowdfunding,
        contractAddress: contract,
        functionName: "createCampaign",
        params: {
					address, // owner
					title, // title
					description, // description
					target,
					deadline, // deadline,
					image,
				},
    }});

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});

    return data;
  }
  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }
  
  return ({publishCampaign,getCampaigns, getUserCampaigns,donate,getDonations})


}


