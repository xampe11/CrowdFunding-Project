const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

async function createDonation() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    const crowdFunding = await ethers.getContract("Crowdfunding")
    console.log("Creating an new Donation...")

    const Tx = await crowdFunding.donateToCampaign(0, { value: ethers.parseEther("0.5") })
    const TxReceipt = await Tx.wait(1)
    console.log(`Donated successfully!`)

    if (network.config.chainId == 31337) {
        await moveBlocks(2, (sleepAmount = 1000))
    }

    const showTx = await crowdFunding.getDonators(0)

    console.log(showTx)
}

createDonation()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
