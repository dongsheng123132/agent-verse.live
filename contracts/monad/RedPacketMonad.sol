// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RedPacketMonad
 * @notice 拼手气红包合约 - 基于 Monad
 * @dev 用户随机领取不同金额的红包
 */
contract RedPacketMonad {
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
     * @notice 充值 MON 到红包合约
     */
    function deposit() external payable onlyOwner {
        require(msg.value > 0, "Must send MON");
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
    
    // ============ 内部函数 ============
    
    /**
     * @notice 生成随机金额 (伪随机，演示用)
     * @dev 生产环境建议使用 Chainlink VRF 或 Monad 随机数预言机
     */
    function _randomAmount() internal view returns (uint256) {
        uint256 seed = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            packetCount
        )));
        
        return minAmount + (seed % (maxAmount - minAmount + 1));
    }
    
    // 接收 MON
    receive() external payable {
        totalBalance += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
}
