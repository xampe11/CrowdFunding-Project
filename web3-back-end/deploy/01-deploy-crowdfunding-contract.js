const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    let arguments = []

    log("---------------------------------")

    console.log("Deploying Crowdfunding contract...")

    const crowdFunding = await deploy("Crowdfunding", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    console.log("Deployed!")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(crowdFunding.address, arguments)
    }

    log("---------------------------------")
}

module.exports.tags = ["all", "crowdFunding"]
