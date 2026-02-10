// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RedPacketWithPassphrase
 * @notice 带口令的随机红包合约 - 输入正确口令才能领取
 * @dev 基于 RedPacketRandomDemo，增加口令校验；演示模式可无限次领取
 */
contract RedPacketWithPassphrase {
    // ============ 状态变量 ============

    address public owner;
    uint256 public minAmount;
    uint256 public maxAmount;
    /// @notice 口令的 keccak256 哈希，部署时或由 owner 设置
    bytes32 public passphraseHash;
    uint256 public totalClaimed;
    uint256 public totalDistributed;

    mapping(address => uint256) public claimCount;

    // ============ 事件 ============

    event Deposit(address indexed sender, uint256 amount);
    event Claim(address indexed user, uint256 amount, uint256 claimIndex);
    event ConfigUpdated(uint256 minAmount, uint256 maxAmount);
    event PassphraseUpdated();
    event EmergencyWithdraw(uint256 amount);

    // ============ 修饰符 ============

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    // ============ 构造函数 ============

    /// @param _minAmount 单次领取最小金额 (drip)
    /// @param _maxAmount 单次领取最大金额 (drip)
    /// @param _passphraseHash 口令的 keccak256 hash，例如 keccak256(abi.encodePacked("我的口令"))
    constructor(uint256 _minAmount, uint256 _maxAmount, bytes32 _passphraseHash) {
        owner = msg.sender;
        minAmount = _minAmount;
        maxAmount = _maxAmount;
        passphraseHash = _passphraseHash;
        totalClaimed = 0;
        totalDistributed = 0;
    }

    // ============ 核心函数 ============

    /**
     * @notice 充值 CFX 到红包合约
     */
    function deposit() external payable onlyOwner {
        require(msg.value > 0, "Must send CFX");
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @notice 校验口令
     */
    function _requirePassphrase(string calldata passphrase) internal view {
        require(passphraseHash != bytes32(0), "Passphrase not set");
        require(
            keccak256(abi.encodePacked(passphrase)) == passphraseHash,
            "Wrong passphrase"
        );
    }

    /**
     * @notice 领取随机金额红包 - 需输入正确口令
     * @param passphrase 红包口令
     */
    function claim(string calldata passphrase) external {
        _requirePassphrase(passphrase);

        uint256 contractBalance = address(this).balance;
        require(contractBalance >= minAmount, "Insufficient balance");

        uint256 randomAmount = _randomAmount();
        if (randomAmount > contractBalance) {
            randomAmount = contractBalance;
        }

        claimCount[msg.sender]++;
        totalClaimed++;
        totalDistributed += randomAmount;

        (bool success, ) = msg.sender.call{value: randomAmount}("");
        require(success, "Transfer failed");

        emit Claim(msg.sender, randomAmount, claimCount[msg.sender]);
    }

    /**
     * @notice 批量领取 - 需输入正确口令
     * @param passphrase 红包口令
     * @param times 领取次数 (1-50)
     */
    function claimBatch(string calldata passphrase, uint256 times) external {
        _requirePassphrase(passphrase);
        require(times > 0 && times <= 50, "Times must be 1-50");

        uint256 contractBalance = address(this).balance;
        require(
            contractBalance >= minAmount * times,
            "Insufficient balance for batch"
        );

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < times; i++) {
            uint256 randomAmount = _randomAmount();
            if (randomAmount > contractBalance - totalAmount) {
                randomAmount = contractBalance - totalAmount;
            }
            totalAmount += randomAmount;
        }

        claimCount[msg.sender] += times;
        totalClaimed += times;
        totalDistributed += totalAmount;

        (bool success, ) = msg.sender.call{value: totalAmount}("");
        require(success, "Transfer failed");

        emit Claim(msg.sender, totalAmount, claimCount[msg.sender]);
    }

    /**
     * @notice 设置红包金额范围
     */
    function setAmountRange(uint256 _min, uint256 _max) external onlyOwner {
        require(_min > 0 && _max > _min, "Invalid range");
        minAmount = _min;
        maxAmount = _max;
        emit ConfigUpdated(_min, _max);
    }

    /**
     * @notice 设置新口令（仅 hash，不存明文）
     * @param _passphraseHash 新口令的 keccak256(abi.encodePacked(newPassphrase))
     */
    function setPassphrase(bytes32 _passphraseHash) external onlyOwner {
        passphraseHash = _passphraseHash;
        emit PassphraseUpdated();
    }

    /**
     * @notice 紧急提取所有余额
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");

        emit EmergencyWithdraw(balance);
    }

    /**
     * @notice 转移所有权
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }

    // ============ 视图函数 ============

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getClaimCount(address user) external view returns (uint256) {
        return claimCount[user];
    }

    /**
     * @notice 检查口令是否正确（只读，不改变状态）
     * @param passphrase 用户输入的口令
     */
    function checkPassphrase(string calldata passphrase) external view returns (bool) {
        return passphraseHash != bytes32(0) &&
            keccak256(abi.encodePacked(passphrase)) == passphraseHash;
    }

    function getStats() external view returns (
        uint256 balance,
        uint256 minAmount_,
        uint256 maxAmount_,
        uint256 totalClaimed_,
        uint256 totalDistributed_,
        uint256 remainingPackets
    ) {
        balance = address(this).balance;
        minAmount_ = minAmount;
        maxAmount_ = maxAmount;
        totalClaimed_ = totalClaimed;
        totalDistributed_ = totalDistributed;
        remainingPackets = maxAmount > 0 ? balance / maxAmount : 0;
    }

    // ============ 内部函数 ============

    function _randomAmount() internal view returns (uint256) {
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(
                    blockhash(block.number - 1),
                    block.timestamp,
                    msg.sender,
                    totalClaimed,
                    claimCount[msg.sender]
                )
            )
        );
        uint256 range = maxAmount - minAmount + 1;
        return minAmount + (seed % range);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}
