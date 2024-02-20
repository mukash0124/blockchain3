const DAO = artifacts.require("DAO");

contract("DAO", function (accounts) {
    let dao;
    const [deployer, member1, member2] = accounts;

    beforeEach(async () => {
        dao = await DAO.new();
    });

    it("should allow adding a member", async () => {
        await dao.addMember(member1, { from: deployer });
        const member = await dao.members(member1);
        assert.equal(member.memberAddress, member1, "Member address should match");
        assert.equal(member.tokenBalance.toNumber(), 100, "Token balance should be initialized to 100");
    });

    it("should allow creating a proposal", async () => {
        const description = "Test Proposal";
        await dao.createProposal(description, { from: member1 });
        const proposal = await dao.proposals(0);
        assert.equal(proposal.description, description, "Proposal description should match");
    });

    it("should allow voting on a proposal", async () => {
        const description = "Test Proposal";
        await dao.addMember(member1, { from: deployer });
        await dao.createProposal(description, { from: member1 });
        await dao.vote(0, 10, { from: member1 });
        const proposal = await dao.proposals(0);
        assert.equal(proposal.voteCount.toNumber(), 10, "Vote count should be updated");
    });

    it("should execute a proposal correctly", async () => {
        await dao.addMember(member1, { from: deployer });
        await dao.addMember(member2, { from: deployer });
        const description = "Test Proposal";
        await dao.createProposal(description, { from: member1 });
        await dao.vote(0, 100, { from: member1 });
        await dao.vote(0, 60, { from: member2 });
        await dao.executeProposal(0, { from: deployer });
        const proposal = await dao.proposals(0);
        assert(proposal.executed, "Proposal should be marked as executed");
    });
});
