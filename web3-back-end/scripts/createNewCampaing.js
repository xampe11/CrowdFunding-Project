const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

async function createNewCampaign() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    const crowdFunding = await ethers.getContract("Crowdfunding")
    console.log("Creating an new Campaign...")
    const title = "My Campaign Title"
    const description = "My Campaign Description"
    const target = ethers.parseEther("2")
    const deadline = 1716595200000
    const image =
        "https://st2.depositphotos.com/1135494/8891/i/450/depositphotos_88916434-stock-photo-successful-woman-sunrise-new-york.jpg"
    const Tx = await crowdFunding.createCampaign(
        deployer,
        title,
        description,
        target,
        deadline,
        image,
    )
    const TxReceipt = await Tx.wait(1)
    console.log(`Created Campaign ${TxReceipt} successfully!`)

    if (network.config.chainId == 31337) {
        await moveBlocks(2, (sleepAmount = 1000))
    }

    const showTx = await crowdFunding.getCampaigns()

    console.log(showTx)
}

createNewCampaign()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
