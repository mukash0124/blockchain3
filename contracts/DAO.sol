// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DAO {
    struct Proposal {
        string description;
        uint voteCount;
        bool executed;
    }

    struct Member {
        address memberAddress;
        uint startTime;
        uint tokenBalance;
    }

    Proposal[] public proposals;
    mapping(address => Member) public members;
    mapping(address => uint) public balances;
    mapping(address => mapping(uint => bool)) public votes; // Track if a member voted on a proposal
    uint public totalSupply;

    event ProposalCreated(uint indexed proposalId, string description);
    event Voted(
        uint indexed proposalId,
        address indexed voter,
        uint tokenAmount
    );
    event ProposalAccepted(string message);
    event ProposalRejected(string message);

    function addMember(address _member) public {
        require(
            members[_member].memberAddress == address(0),
            "Member already exists"
        );
        members[_member] = Member(_member, block.timestamp, 100);
        balances[_member] = 100;
        totalSupply += 100;
    }

    function removeMember(address _member) public {
        require(
            members[_member].memberAddress != address(0),
            "Member does not exist"
        );
        totalSupply -= members[_member].tokenBalance;
        delete members[_member];
        delete balances[_member];
    }

    function createProposal(string memory _description) public {
        proposals.push(Proposal(_description, 0, false));
        emit ProposalCreated(proposals.length - 1, _description);
    }

    function vote(uint _proposalId, uint _tokenAmount) public {
        require(
            members[msg.sender].memberAddress != address(0),
            "Not a member"
        );
        require(
            balances[msg.sender] >= _tokenAmount,
            "Not enough tokens to vote"
        );
        require(!votes[msg.sender][_proposalId], "Already voted");
        votes[msg.sender][_proposalId] = true;
        members[msg.sender].tokenBalance -= _tokenAmount;
        balances[msg.sender] -= _tokenAmount;
        proposals[_proposalId].voteCount += _tokenAmount;
        emit Voted(_proposalId, msg.sender, _tokenAmount);
    }

    function executeProposal(uint _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Proposal already executed");

        uint votePercentage = (proposal.voteCount * 100) / totalSupply;
        if (votePercentage > 50) {
            proposals[_proposalId].executed = true;
            emit ProposalAccepted("Success");
        } else {
            emit ProposalRejected("Fail");
        }
    }
}
