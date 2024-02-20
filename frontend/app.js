window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            window.web3 = new Web3(window.ethereum);

            const response = await fetch('abi.json');
            const contractABI = await response.json();
            const contractAddress = "0xBBcB5b83901971786b9A3A778940E4A1470A35ab";
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const accounts = await web3.eth.getAccounts();

            document.getElementById('addMember').onclick = async () => {
                const address = document.getElementById('addMemberAddress').value;
                const receipt = await contract.methods.addMember(address).send({from: accounts[0]});
                document.getElementById('result').innerText = `Add Member Transaction: ${receipt.transactionHash}`;
            };

            document.getElementById('createProposal').onclick = async () => {
                const description = document.getElementById('proposalDescription').value;
                const receipt = await contract.methods.createProposal(description).send({from: accounts[0]});
                document.getElementById('result').innerText = `Create Proposal Transaction: ${receipt.transactionHash}`;
            };

            document.getElementById('vote').onclick = async () => {
                const proposalId = document.getElementById('voteProposalId').value;
                const tokenAmount = document.getElementById('voteTokenAmount').value;
                const receipt = await contract.methods.vote(proposalId, tokenAmount).send({from: accounts[0]});
                document.getElementById('result').innerText = `Vote Transaction: ${receipt.transactionHash}`;
            };

            document.getElementById('executeProposal').onclick = async () => {
                const proposalId = document.getElementById('executeProposalId').value;
                const receipt = await contract.methods.executeProposal(proposalId).send({from: accounts[0]});
                document.getElementById('result').innerText = `Execute Proposal Transaction: ${receipt.transactionHash}`;
            };
        } catch (error) {
            console.error("Error", error);
            document.getElementById('result').innerText = `Error: ${error.message}`;
        }
    } else {
        console.log('Please install MetaMask.');
        document.getElementById('result').innerText = 'Please install MetaMask.';
    }
});
