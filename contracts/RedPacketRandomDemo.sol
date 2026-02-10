// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RedPacketRandomDemo
 * @notice 演示模式随机红包合约 - 无限领取 + 随机金额
 * @dev 用于 AI 春晚演示，用户可以无限次领取随机金额红包
 */
contract RedPacketRandomDemo {
    // ============ 状态变量 ============
    
    address public owner;
    uint256 public minAmount;
    uint256 public maxAmount;
    uint256 public totalClaimed;
    uint256 public totalDistributed;
    
    // 记录每个地址领取次数（仅统计，不限制）
    mapping(address => uint256) public claimCount;
    
    // ============ 事件 ============
    
    event Deposit(address indexed sender, uint256 amount);
    event Claim(address indexed user, uint256 amount, uint256 claimIndex);
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
     * @notice 领取随机金额红包 - 演示模式，无限次领取
     * @dev 每次领取随机金额，不限制领取次数
     */
    function claim() external {
        uint256 contractBalance = address(this).balance;
        require(contractBalance >= minAmount, "Insufficient balance");
        
        // 生成随机金额
        uint256 randomAmount = _randomAmount();
        
        // 确保不超过合约余额
        if (randomAmount > contractBalance) {
            randomAmount = contractBalance;
        }
        
        // 更新统计（仅记录，不限制）
        claimCount[msg.sender]++;
        totalClaimed++;
        totalDistributed += randomAmount;
        
        // 转账给用户
        (bool success, ) = msg.sender.call{value: randomAmount}("");
        require(success, "Transfer failed");
        
        emit Claim(msg.sender, randomAmount, claimCount[msg.sender]);
    }
    
    /**
     * @notice 批量领取随机红包 - 一次性领取多次
     * @param times 领取次数 (1-50)
     */
    function claimBatch(uint256 times) external {
        require(times > 0 && times <= 50, "Times must be 1-50");
        
        uint256 contractBalance = address(this).balance;
        require(contractBalance >= minAmount * times, "Insufficient balance for batch");
        
        uint256 totalAmount = 0;
        
        for (uint256 i = 0; i < times; i++) {
            uint256 randomAmount = _randomAmount();
            if (randomAmount > contractBalance - totalAmount) {
                randomAmount = contractBalance - totalAmount;
            }
            totalAmount += randomAmount;
        }
        
        // 更新统计
        claimCount[msg.sender] += times;
        totalClaimed += times;
        totalDistributed += totalAmount;
        
        // 转账给用户
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
     * @notice 获取用户领取次数
     */
    function getClaimCount(address user) external view returns (uint256) {
        return claimCount[user];
    }
    
    /**
     * @notice 获取合约统计信息
     */
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
        if (maxAmount > 0) {
            remainingPackets = balance / maxAmount;
        } else {
            remainingPackets = 0;
        }
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
                    totalClaimed,
                    claimCount[msg.sender]
                )
            )
        );
        
        // 在 minAmount 和 maxAmount 之间生成随机数
        uint256 range = maxAmount - minAmount + 1;
        return minAmount + (seed % range);
    }
    
    // 接收 CFX
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}
