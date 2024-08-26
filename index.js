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

    try {
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

        const tx = await contract.flipCoin(guess, { value: ethers.utils.parseEther(betAmount) });
        await tx.wait();

        const receipt = await provider.getTransactionReceipt(tx.hash);
        const event = receipt.logs.map(log => contract.interface.parseLog(log)).find(log => log.name === "CoinFlipped");

        if (event.args.won) {
            document.getElementById("result").textContent = "Congratulations! You won!";
        } 
        else {
            document.getElementById("result").textContent = "Sorry, you lost!";
        }
    } 
    catch (error) {
        console.error("Error flipping the coin:", error);
        document.getElementById("result").textContent = "Transaction failed.";
    }

    document.getElementById("coin").classList.add("flip");
    setTimeout(() => document.getElementById("coin").classList.remove("flip"), 1000);
}

// Automatically request accounts when the page loads
window.addEventListener('load', async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } 
        catch (error) {
            console.error("Error requesting accounts:", error);
        }
    } 
    else {
        console.error("MetaMask is not installed.");
    }
});
