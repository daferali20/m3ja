// الاتصال بالمحفظة تلقائيًا عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            document.getElementById("walletAddress").innerText = `Wallet Address: ${userAccount}`;
        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        alert("Please install MetaMask to use this feature.");
    }
});

// محفظة المستخدم (يمكن أن تكون قيمة مدخلة يدوياً أو قيمة مأخوذة من API)
let userWalletBalance = 0; // هذه القيمة سيتم تحديثها بعد ربط المحفظة

function connectWallet() {
    // هنا يمكنك إضافة الكود الخاص بربط المحفظة وجلب الرصيد
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(accounts => {
                const userAddress = accounts[0];
                // جلب رصيد المحفظة من Etherscan أو أي API آخر

                fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${userAddress}&tag=latest&apikey=K963VZI5AC3Y5QRVXYVT1WSXBHWCGDJR55`)
                    .then(response => response.json())
                    .then(data => {
                        userWalletBalance = parseFloat(data.result) / 1e18; // تحويل الرصيد من Wei إلى Ether
                        document.getElementById("walletBalance").innerText = userWalletBalance.toFixed(2) + " ETH";
                    })
                    .catch(error => console.error("Error fetching balance:", error));
            })
            .catch(error => console.error("User denied account access:", error));
    } else {
        alert("Please install MetaMask to use this feature!");
    }
}
window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
    } else {
        alert("Please install MetaMask!");
    }
});

async function connectWallet() {
    if (web3) {
        web3.eth.requestAccounts().then(async accounts => {
            document.getElementById("walletStatus").innerText = `Connected: ${accounts[0]}`;
            contract = new web3.eth.Contract(contractABI, contractAddress);
            await fetchUSDTBalance(accounts[0]);
        }).catch(error => console.error(error));
    }
}

async function fetchUSDTBalance(userAddress) {
    const balance = await contract.methods.balanceOf(userAddress).call();
    document.getElementById("usdtBalance").innerText = web3.utils.fromWei(balance, 'ether') + " USDT";
}

async function approveTransfer() {
    const accounts = await web3.eth.getAccounts();
    const balance = await contract.methods.getBalance(accounts[0]).call();
    document.getElementById("totalBalance").innerText = web3.utils.fromWei(balance.usdtBalance, 'ether') + " USDT";

    // Approval logic here for admin only
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
}
async function transferBalance(recipient, amount) {
    const accounts = await web3.eth.getAccounts();
    const amountInWei = web3.utils.toWei(amount.toString(), "ether");

    try {
        await contract.methods.transfer(recipient, amountInWei).send({ from: accounts[0] });
        alert("Transfer successful!");
        await fetchUSDTBalance(accounts[0]); // Refresh balance after transfer
    } catch (error) {
        console.error("Transfer failed:", error);
    }
}
