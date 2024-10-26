const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // عنوان عقد USDT
const usdtAbi = [{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]; 

let web3;
let userAccount;
const ownerAddress = "0x0DD5C4c9B169317BF0B77D927d2cB1eC3570Dbb3"; // عنوان محفظة المالك

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0]; // تخزين عنوان المحفظة
            document.getElementById("walletAddress").innerText = `Wallet Address: ${userAccount}`;
        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        alert("Please install MetaMask to connect your wallet.");
    }
}

// تأكد من وجود الزر وإضافة الحدث
const connectButton = document.getElementById("connectWallet");
if (connectButton) {
    connectButton.addEventListener("click", connectWallet);
}

async function buyPlan() {
    // تأكد من أن المستخدم متصل بالمحفظة
    if (!userAccount) {
        alert("Please connect your wallet first.");
        return;
    }

    // الحصول على تفاصيل الخطة
    const planPrice = parseFloat(document.getElementById("planPrice").innerText);
    const planName = document.getElementById("planName").innerText;

    // تأكيد الدفع باستخدام عقد USDT
    const usdtContract = new web3.eth.Contract(usdtAbi, usdtContractAddress);
    
    try {
        // طلب تحويل المبلغ من محفظة المستخدم إلى عنوان المالك
        const transaction = await usdtContract.methods.transfer(ownerAddress, web3.utils.toWei(planPrice.toString(), 'mwei')).send({ from: userAccount });

        // تحقق من أن المعاملة تمت بنجاح
        if (transaction.status) {
            // تخزين معلومات الطلب في sessionStorage
            sessionStorage.setItem("planName", planName);
            sessionStorage.setItem("planPrice", planPrice);
            sessionStorage.setItem("startDate", new Date().toLocaleDateString("ar-EG")); // تاريخ اليوم
            sessionStorage.setItem("durationDays", 30); // عدد أيام الإيجار
        
            // الانتقال إلى صفحة تفاصيل الطلب فقط بعد التأكد من نجاح الدفع
            window.location.href = "ordd.html";
        } else {
            alert("Payment failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during payment:", error);
        alert("Payment failed. Please check your wallet or try again.");
    }
}
