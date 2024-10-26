// main.js
import { usdtContractAddress, usdtAbi, web3, userAccount, ownerAddress } from './roo/config.js';

// يمكنك هنا تهيئة web3 واستخدام المتغيرات الأخرى
async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        userAccount = (await web3.eth.getAccounts())[0]; // استرجاع عنوان المحفظة
        console.log("User Account:", userAccount);
    } else {
        alert("Please install MetaMask to connect your wallet.");
    }
}

init(); // استدعاء الدالة لتهيئة الويب3

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

// دالة إرسال USDT إلى محفظة المالك
async function sendUSDT(amount) {
    const usdtContract = new web3.eth.Contract(usdtAbi, usdtContractAddress);
    const amountInWei = web3.utils.toWei(amount.toString(), "mwei"); // تحويل المبلغ إلى 6 خانات عشرية لـ USDT

    try {
        // استدعاء دالة transfer وإرسال المبلغ إلى محفظة المالك
        await usdtContract.methods.transfer(ownerAddress, amountInWei).send({ from: userAccount });
        alert(`${amount} USDT sent successfully to the owner's wallet.`);
    } catch (error) {
        console.error("Transaction failed", error);
    }
}

// إضافة الحدث على زر "BUY" لإرسال المبلغ المحدد
document.querySelectorAll(".buy-button").forEach((button, index) => {
    button.addEventListener("click", () => {
        const rentalPriceText = button.parentElement.querySelector("p span").innerText;
        const rentalPrice = parseFloat(rentalPriceText.split(" ")[0]);
        sendUSDT(rentalPrice);
    });
});
