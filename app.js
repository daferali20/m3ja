// عنوان عقد USDT
const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const usdtAbi = [
    {
        "constant": false,
        "inputs": [
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]; 

let web3;
let userAccount;
const ownerAddress = "0x0DD5C4c9B169317BF0B77D927d2cB1eC3570Dbb3"; // عنوان محفظة المالك

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0]; // حفظ عنوان المستخدم
            document.getElementById("walletAddress").innerText = `Wallet Address: ${userAccount}`;
        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        alert("Please install MetaMask to connect your wallet.");
    }
}

async function buyPlan() {
    const planPrice = parseFloat(document.getElementById("planPrice").innerText); // سعر الخطة
    const contract = new web3.eth.Contract(usdtAbi, usdtContractAddress);

    try {
        const amountInWei = web3.utils.toWei(planPrice.toString(), 'mwei'); // USDT يستخدم 6 أرقام عشرية، لذا استخدم 'mwei'
        const result = await contract.methods.transfer(ownerAddress, amountInWei).send({ from: userAccount });

        console.log("Payment successful!", result);

        // تخزين معلومات الطلب
        sessionStorage.setItem("planName", document.getElementById("planName").innerText);
        sessionStorage.setItem("planPrice", planPrice);
        sessionStorage.setItem("startDate", new Date().toLocaleDateString("ar-EG")); // تاريخ اليوم
        sessionStorage.setItem("durationDays", 30); // عدد أيام الإيجار

        // الانتقال إلى صفحة تفاصيل الطلب
        window.location.href = "ordd.html"; 
    } catch (error) {
        console.error("Payment failed", error);
    }
}

// إضافة الحدث للزر "Connect Wallet"
const connectButton = document.getElementById("connectWallet");
if (connectButton) {
    connectButton.addEventListener("click", connectWallet);
}
