const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // عنوان عقد USDT
const usdtAbi = [{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]; // التأكد من احتواء ABI على دالة التحويل فقط

let web3;
let userAccount;
const ownerAddress = "0x0DD5C4c9B169317BF0B77D927d2cB1eC3570Dbb3"; // استبدل بعنوان محفظة المالك

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

// وظيفة إرسال USDT إلى محفظة المالك
async function sendUSDT(amount) {
    const usdtContract = new web3.eth.Contract(usdtAbi, usdtContractAddress);
    const amountInWei = web3.utils.toWei(amount.toString(), "mwei"); // تحويل إلى وحدات USDT

    try {
        await usdtContract.methods.transfer(ownerAddress, amountInWei).send({ from: userAccount });
        alert(`${amount} USDT sent successfully to owner.`);
    } catch (error) {
        console.error("Transaction failed", error);
    }
}

// إضافة حدث على زر "BUY" للتنفيذ عند الضغط
document.querySelectorAll(".buy-button").forEach((button, index) => {
    button.addEventListener("click", () => {
        const rentalPriceText = button.parentElement.querySelector("p span").innerText;
        const rentalPrice = parseFloat(rentalPriceText.split(" ")[0]);
        sendUSDT(rentalPrice);
    });
});
