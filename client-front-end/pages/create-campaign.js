import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ethers } from "ethers"
import Image from "next/image"
import money from "../assets/money.svg"
import CustomButton from "../components/CustomButton"
import FormField from "../components/FormField"
import Loader from "../components/Loader"
import { checkIfImage } from "../utils"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Crowdfunding from "../constants/Crowdfunding.json"
import networkMapping from "../constants/networkMapping.json"
import { useNotification } from "web3uikit"

const CreateCampaign = () => {
    const router = useRouter()
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()
    const { chainId, account } = useMoralis()
    console.log(`Printing ChainId:${parseInt(chainId)}`)
    const chainString = chainId ? parseInt(chainId).toString() : null
    const contractAddress = networkMapping[chainString]
        ? networkMapping[chainString].Crowdfunding[0]
        : null

    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        name: "",
        title: "",
        description: "",
        target: "",
        deadline: "",
        image: "",
    })

    const handlePublishSuccess = async () => {
        dispatch({
            type: "success",
            message: "Campaign Published!",
            title: "",
            position: "topR",
        })
    }

    const publishCampaign = async (form) => {
        const title = form.title
        const description = form.description
        const target = form.target
        const image = form.image
        const deadline = new Date(form.deadline).getTime()

        console.log(
            `title: ${title}\n description: ${description}\n target:${target}\n image:${image}\n deadline:${deadline}`
        )

        const campaignId = await runContractFunction({
            params: {
                abi: Crowdfunding,
                contractAddress: contractAddress,
                functionName: "createCampaign",
                params: {
                    _owner: account, // owner
                    _title: title, // title
                    _description: description, // description
                    _target: target,
                    _deadline: deadline, // deadline,
                    _image: image,
                },
            },
            onError: (error) => console.log(error),
            onSuccess: () => handlePublishSuccess(),
        })

        console.log("Created campaign n: ", campaignId)
    }

    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        checkIfImage(form.image, async (exists) => {
            if (exists) {
                setIsLoading(true)
                await publishCampaign({
                    ...form,
                    target: ethers.utils.parseEther(form.target),
                })
                setIsLoading(false)
                router.push("/")
            } else {
                alert("Provide valid image URL")
                setForm({ ...form, image: "" })
            }
        })
    }

    return (
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
            {isLoading && <Loader />}
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                    Start a Campaign
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
                <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Your Name *"
                        placeholder="John Doe"
                        inputType="text"
                        value={form.name}
                        handleChange={(e) => handleFormFieldChange("name", e)}
                    />
                    <FormField
                        labelName="Campaign Title *"
                        placeholder="Write a title"
                        inputType="text"
                        value={form.title}
                        handleChange={(e) => handleFormFieldChange("title", e)}
                    />
                </div>

                <FormField
                    labelName="Story *"
                    placeholder="Write your story"
                    isTextArea
                    value={form.description}
                    handleChange={(e) => handleFormFieldChange("description", e)}
                />

                <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
                    <Image src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
                    <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
                        You will get 100% of the raised amount
                    </h4>
                </div>

                <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Goal *"
                        placeholder="ETH 0.50"
                        inputType="text"
                        value={form.target}
                        handleChange={(e) => handleFormFieldChange("target", e)}
                    />
                    <FormField
                        labelName="End Date *"
                        placeholder="End Date"
                        inputType="date"
                        value={form.deadline}
                        handleChange={(e) => handleFormFieldChange("deadline", e)}
                    />
                </div>

                <FormField
                    labelName="Campaign image *"
                    placeholder="Place image URL of your campaign"
                    inputType="url"
                    value={form.image}
                    handleChange={(e) => handleFormFieldChange("image", e)}
                />

                <div className="flex justify-center items-center mt-[40px]">
                    <CustomButton
                        btnType="submit"
                        title="Submit new campaign"
                        styles="bg-[#1dc071]"
                    />
                </div>
            </form>
        </div>
    )
}

export default CreateCampaign
