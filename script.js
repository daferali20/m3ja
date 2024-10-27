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
