//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

error Crowdfunding__DateMustBeInTheFuture();

contract Crowdfunding {
    ///////////////
    // Variables //
    ///////////////

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    uint256 public numberOfCampaigns = 0;

    //Events//

    event CampaignCreated(
        uint256 indexed id,
        address indexed owner,
        string indexed title,
        string description,
        uint256 target,
        uint256 deadline
    );

    event DonatedToCampaign(uint256 indexed id, address indexed donator, uint256 amountDonated);

    //////////////
    // Mappings //
    //////////////

    //Campaing ID -> Campaign Object
    mapping(uint256 => Campaign) public campaigns;

    ////////////////////
    // Main Functions //
    ////////////////////

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        //Checking that the deadline must be in the future.
        if (campaign.deadline > block.timestamp) {
            revert Crowdfunding__DateMustBeInTheFuture();
        }

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        emit CampaignCreated(
            numberOfCampaigns - 1,
            _owner,
            _title,
            _description,
            _target,
            _deadline
        );

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    //////////////////////
    // Getter Functions //
    //////////////////////

    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}
