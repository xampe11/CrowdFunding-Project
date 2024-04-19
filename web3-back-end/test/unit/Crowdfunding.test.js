const { expect, assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { time } = require("@nomicfoundation/hardhat-network-helpers")
const { Transaction } = require("ethers")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("CrowdFunding Contract Unit Tests", function () {
          let crowdFunding, crowdFundingContract
          const FUND_TARGET = ethers.parseEther("1")
          const TITLE = "This is the title of my Campaign"
          const DESCRIPTION = "This is the Description of my Campaing no so long."
          let deadLine = new Date()
          deadLine.setDate(deadLine.getDate() + 10)
          const deadLine_UnixTimeStamp = Math.floor(deadLine.getTime() / 1000)
          const invalidDeadLine = new Date()
          invalidDeadLine.setDate(invalidDeadLine.getDate() - 2)
          const invalidDeadLine_UnixTimeStamp = Math.floor(invalidDeadLine.getTime() / 1000)
          let ammountCollected = 0
          const image = ""

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]
              await deployments.fixture(["all"])
              crowdFundingContract = await ethers.getContract("Crowdfunding")
              crowdFunding = crowdFundingContract.connect(deployer)
          })

          describe("createCampaign", function () {
              it("creates a campaign, saves it in the campaigns array and reverts its id", async function () {
                  const blockTimestamp = await time.latest()
                  console.log(blockTimestamp)
                  console.log(deadLine_UnixTimeStamp)
                  expect(
                      await crowdFunding.createCampaign(
                          deployer,
                          TITLE,
                          DESCRIPTION,
                          FUND_TARGET,
                          deadLine_UnixTimeStamp,
                          image,
                      ),
                  ).to.be.revertedWith("0")

                  const campaignList = await crowdFunding.getCampaigns()
                  assert(campaignList[0])
              })
              it("Returns error if the deadline date is in the past when trying to create a campaign", async function () {
                  expect(
                      await crowdFunding.createCampaign(
                          deployer,
                          TITLE,
                          DESCRIPTION,
                          FUND_TARGET,
                          invalidDeadLine_UnixTimeStamp,
                          image,
                      ),
                  ).to.be.revertedWith("Crowdfunding__DateMustBeInTheFuture")
              })
              it("Emits an event after the campaign is created", async function () {
                  expect(
                      await crowdFunding.createCampaign(
                          deployer,
                          TITLE,
                          DESCRIPTION,
                          FUND_TARGET,
                          deadLine_UnixTimeStamp,
                          image,
                      ),
                  ).to.emit("CampaignCreated")
              })
          })
          describe("donateToCampaign", function () {
              it("Updates the donations and donators list with the proper information", async function () {
                  const firstCampaing = await crowdFunding.createCampaign(
                      deployer,
                      TITLE,
                      DESCRIPTION,
                      FUND_TARGET,
                      deadLine_UnixTimeStamp,
                      image,
                  )
                  firstCampaing.wait(1)
                  const campaigns = await crowdFunding.getCampaigns()
                  //const donationTx = await crowdFunding.donateToCampaign(BigInt(firstCampaing))

                  console.log(firstCampaing.status)
              })
          })
      })
