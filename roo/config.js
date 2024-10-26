// config.js
export const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // عنوان عقد USDT
export const usdtAbi = [
    {
        "constant": false,
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export let web3; // يمكن تهيئة web3 لاحقًا
export let userAccount;
export const ownerAddress = "0x0DD5C4c9B169317BF0B77D927d2cB1eC3570Dbb3"; // عنوان محفظة المالك
