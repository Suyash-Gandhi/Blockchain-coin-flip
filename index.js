const contractAddress = "0x86dBCE8eF54B9125c182dc5eDBc6A853696f9012";
const abi = [
    "function flipCoin(bool guess) external payable",
    "function owner() public view returns (address)",
    "event CoinFlipped(address indexed player, uint256 betAmount, bool won)"
];

async function flipCoin(guess) {
    if (typeof ethers === 'undefined') {
        console.error("ethers.js library is not loaded.");
        return;
    }

    // Check if MetaMask is installed
    if (!window.ethereum) {
        window.alert("MetaMask is not installed.");
        return;
    }

    // Request accounts if not already connected
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
        window.alert("No accounts found. Please connect your MetaMask wallet.");
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const betAmount = document.getElementById("betAmount").value;

    try {
        const tx = await contract.flipCoin(guess, { value: ethers.utils.parseEther(betAmount) });
        await tx.wait();

        const receipt = await provider.getTransactionReceipt(tx.hash);
        const event = receipt.logs
            .map(log => {
                try {
                    return contract.interface.parseLog(log);
                } catch (e) {
                    return null; // Ignore logs that don't match
                }
            })
            .find(parsedLog => parsedLog && parsedLog.name === "CoinFlipped");

        if (event && event.args.won) {
            document.getElementById("result").textContent = "Congratulations! You won!";
        } else {
            document.getElementById("result").textContent = "Sorry, you lost!";
        }
    } catch (error) {
        console.error("An error occurred during the transaction:", error);
    }
}
