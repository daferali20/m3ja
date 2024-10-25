let web3;
let userAccount;
const ownerAddress = "OWNER_WALLET_ADDRESS"; // استبدل هذا بعنوان محفظة المالك

document.addEventListener("DOMContentLoaded", () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
    } else {
        alert("Please install MetaMask to use this feature.");
    }
});

async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
    } catch (error) {
        console.error("User denied account access", error);
    }
}

async function sendPayment(amount) {
    if (!userAccount) {
        alert("Please connect your wallet first.");
        return;
    }

    try {
        const amountInWei = web3.utils.toWei(amount.toString(), "ether"); // تحويل المبلغ إلى Wei
        await web3.eth.sendTransaction({
            from: userAccount,
            to: ownerAddress,
            value: amountInWei
        });
        alert(`${amount} USDT sent successfully to owner.`);
    } catch (error) {
        console.error("Transaction failed", error);
    }
}

document.querySelectorAll(".buy-button").forEach((button, index) => {
    button.addEventListener("click", () => {
        const rentalPriceText = button.parentElement.querySelector("p span").innerText;
        const rentalPrice = parseFloat(rentalPriceText.split(" ")[0]);
        sendPayment(rentalPrice);
    });
});

document.getElementById("connectWallet").addEventListener("click", connectWallet);
