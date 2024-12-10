import { useMoralis, useWeb3Contract } from "react-moralis"
import DisplayCampaigns from "../components/DisplayCampaigns"
import networkMapping from "../constants/networkMapping.json"
import React, { useEffect, useState } from "react"
import Crowdfunding from "../constants/Crowdfunding.json"
import { ethers } from "ethers"
import Loader from "../components/Loader.jsx"

export default function Home() {
    const [isLoading, setIsLoading] = useState(false)
    const [campaigns, setCampaigns] = useState([])
    const { isWeb3Enabled, chainId, account, enableWeb3 } = useMoralis()
    enableWeb3()
    console.log("Is Web3 enabled?", isWeb3Enabled)
    console.log(`Printing ChainId:${parseInt(chainId)}`)
    console.log(account)
    const chainString = chainId ? parseInt(chainId).toString() : null
    const contractAddress = networkMapping[chainString]
        ? networkMapping[chainString].Crowdfunding[0]
        : null

    console.log("Contract Address: ", contractAddress)
    //const { runContractFunction } = useWeb3Contract()

    const { runContractFunction: getCampaigns } = useWeb3Contract({
        abi: Crowdfunding,
        contractAddress: contractAddress,
        functionName: "getCampaigns",
        params: {},
    })

    const { runContractFunction: getDonations } = useWeb3Contract({
        abi: Crowdfunding,
        contractAddress: contractAddress,
        functionName: "getDonation",
        params: { _id: 0 },
    })

    /* const parseCampaigns = async (campaigns) => {
        /* const campaigns = await runContractFunction({
            params: {
                abi: Crowdfunding,
                contractAddress: contractAddress,
                functionName: "getCampaigns",
                params: {},
            },
            onError: (error) => console.log(error),
            onSuccess: () => console.log("getCampaigns function called successfully"),
        })

        console.log(campaigns)

        const parsedCampaings = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: i,
        }))

        return parsedCampaings
    } */

    const fetchCampaigns = async () => {
        console.log("Calling fetchCampaigns...")
        setIsLoading(true)
        const data = await getCampaigns()
        console.log(data)
        setCampaigns(data)
        const testData = await getDonations()
        console.log(testData)
        setIsLoading(false)
    }

    useEffect(() => {
        if (contractAddress) {
            fetchCampaigns()
        }
    }, [contractAddress, account, isWeb3Enabled])

    return (
        <div className="flex flex-wrap">
            {isWeb3Enabled && chainId ? (
                contractAddress ? (
                    isLoading && <Loader /> ? (
                        <DisplayCampaigns
                            title="All Campaigns"
                            isLoading={isLoading}
                            campaigns={campaigns}
                        />
                    ) : (
                        <div> Loading... </div>
                    )
                ) : (
                    <div> Network error, please switch to a supported network. </div>
                )
            ) : (
                <div>Web3 Currently Not Enabled - Pages index</div>
            )}
        </div>
    )
}
