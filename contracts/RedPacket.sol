// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RedPacket
 * @notice 拼手气红包合约 - 基于 Conflux eSpace
 * @dev 用户随机领取不同金额的红包
 */
contract RedPacket {
    // ============ 状态变量 ============
    
    address public owner;
    uint256 public minAmount;
    uint256 public maxAmount;
    uint256 public totalBalance;
    uint256 public packetCount;
    
    // 记录已领取的用户地址
    mapping(address => bool) public hasClaimed;
    
    // ============ 事件 ============
    
    event Deposit(address indexed sender, uint256 amount);
    event Claim(address indexed user, uint256 amount);
    event ConfigUpdated(uint256 minAmount, uint256 maxAmount);
    event EmergencyWithdraw(uint256 amount);
    
    // ============ 修饰符 ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    // ============ 构造函数 ============
    
    constructor(uint256 _minAmount, uint256 _maxAmount) {
        owner = msg.sender;
        minAmount = _minAmount;
        maxAmount = _maxAmount;
        packetCount = 0;
    }
    
    // ============ 核心函数 ============
    
    /**
     * @notice 充值 CFX 到红包合约
     */
    function deposit() external payable onlyOwner {
        require(msg.value > 0, "Must send CFX");
        totalBalance += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @notice 用户领取红包
     * @dev 每个地址只能领取一次，随机金额
     */
    function claim() external {
        require(!hasClaimed[msg.sender], "Already claimed");
        require(address(this).balance >= minAmount, "No balance");
        
        // 生成随机金额
        uint256 randomAmount = _randomAmount();
        
        // 确保不超过合约余额
        if (randomAmount > address(this).balance) {
            randomAmount = address(this).balance;
        }
        
        // 标记已领取
        hasClaimed[msg.sender] = true;
        packetCount++;
        
        // 转账给用户
        (bool success, ) = msg.sender.call{value: randomAmount}("");
        require(success, "Transfer failed");
        
        emit Claim(msg.sender, randomAmount);
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
    
    /**
     * @notice 获取合约余额
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @notice 检查用户是否已领取
     */
    function checkClaimed(address user) external view returns (bool) {
        return hasClaimed[user];
    }
    
    /**
     * @notice 获取剩余可领取红包数量估算
     */
    function getRemainingPackets() external view returns (uint256) {
        if (maxAmount == 0) return 0;
        return address(this).balance / maxAmount;
    }
    
    // ============ 内部函数 ============
    
    /**
     * @notice 生成随机金额
     * @dev 使用区块哈希和发送者地址生成伪随机数
     */
    function _randomAmount() internal view returns (uint256) {
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(
                    blockhash(block.number - 1),
                    block.timestamp,
                    msg.sender,
                    packetCount
                )
            )
        );
        
        // 在 minAmount 和 maxAmount 之间生成随机数
        uint256 range = maxAmount - minAmount + 1;
        return minAmount + (seed % range);
    }
    
    // 接收 CFX
    receive() external payable {
        totalBalance += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
}
