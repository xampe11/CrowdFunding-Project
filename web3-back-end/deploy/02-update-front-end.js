const { frontEndContractsFile, frontEndAbiLocation } = require("../helper-hardhat-config.js")
require("dotenv").config()
const fs = require("fs")
const { network, ethers } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const crowdFunding = await ethers.getContract("Crowdfunding")
    console.log("Updating Abi file...")

    const crowdFundingAbi = crowdFunding.interface.fragments
    const fileExists = fs.existsSync(frontEndAbiLocation)

    if (!fileExists) {
        console.log("File does not exist, proceeding to create one...")
        fs.writeFileSync(frontEndAbiLocation, JSON.stringify(crowdFundingAbi))
        console.log("File Created")
    } else {
        console.log("File already exists, updating...")
        fs.writeFileSync(frontEndAbiLocation, JSON.stringify(crowdFundingAbi))
        console.log("File Updated")
    }
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    const crowdFunding = await ethers.getContract("Crowdfunding")
    const fileExists = fs.existsSync(frontEndContractsFile)
    console.log(crowdFunding.target)
    if (!fileExists) {
        console.log("File does not exist, proceeding to create one...")
        //const contractAddresses = fs.openSync(frontEndContractsFile, "w")
        const contractAddresses = new Object()
        contractAddresses[chainId] = { Crowdfunding: [crowdFunding.target] }
        fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
        console.log("File Updated")
    } else {
        console.log("File already exists, updating...")
        const contractAddresses = await JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))

        if (chainId in contractAddresses) {
            if (!contractAddresses[chainId]["Crowdfunding"].includes(crowdFunding.target)) {
                contractAddresses[chainId]["Crowdfunding"].push(crowdFunding.target)
            }
        } else {
            contractAddresses[chainId] = { Crowdfunding: [crowdFunding.target] }
        }
        fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
        console.log("File Updated")
    }
}
module.exports.tags = ["all", "frontend"]
