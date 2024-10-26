document.addEventListener("DOMContentLoaded", function() {
    // جلب البيانات من الجلسة أو قاعدة البيانات
    const planName = sessionStorage.getItem("planName") || "خطة غير محددة";
    const startDate = sessionStorage.getItem("startDate") || new Date().toLocaleDateString("ar-EG");

    // حساب المدة الزمنية المتبقية
    const durationDays = parseInt(sessionStorage.getItem("durationDays")) || 30; // افتراضي 30 يوم
    const startDateObj = new Date(startDate);
    const remainingDays = Math.max(0, durationDays - Math.floor((new Date() - startDateObj) / (1000 * 60 * 60 * 24)));

    // تعيين البيانات في الجدول
    document.getElementById("planName").innerText = planName;
    document.getElementById("startDate").innerText = startDate;
    document.getElementById("remainingTime").innerText = `${remainingDays} يوم`;

    // وظيفة زر العودة
    window.goBack = function() {
        window.location.href = "index.html";
    };
});
//!----------------------------->
const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // عنوان عقد USDT
const usdtAbi = [{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]; 

let web3;
let userAccount;
const ownerAddress = "0x0DD5C4c9B169317BF0B77D927d2cB1eC3570Dbb3"; // عنوان محفظة المالك

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
