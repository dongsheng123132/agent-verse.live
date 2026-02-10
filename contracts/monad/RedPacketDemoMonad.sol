// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RedPacketDemoMonad
 * @notice 演示模式红包合约 (Monad 版) - 不限制领取次数，每次随机金额
 * @dev 用于 AI 春晚等活动演示，用户可无限次领取，每次随机 min～max
 */
contract RedPacketDemoMonad {
    // ============ 状态变量 ============
    
    address public owner;
    uint256 public minAmount;        // 单次最小金额
    uint256 public maxAmount;        // 单次最大金额
    uint256 public totalClaimed;     // 总领取次数
    uint256 public totalDistributed; // 总发放金额
    
    mapping(address => uint256) public claimCount;
    
    // ============ 事件 ============
    
    event Deposit(address indexed sender, uint256 amount);
    event Claim(address indexed user, uint256 amount, uint256 claimIndex);
    event ConfigUpdated(uint256 minAmount, uint256 maxAmount);
    event EmergencyWithdraw(uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    constructor(uint256 _minAmount, uint256 _maxAmount) {
        require(_minAmount > 0 && _maxAmount >= _minAmount, "Invalid min/max");
        owner = msg.sender;
        minAmount = _minAmount;
        maxAmount = _maxAmount;
        totalClaimed = 0;
        totalDistributed = 0;
    }
    
    function deposit() external payable onlyOwner {
        require(msg.value > 0, "Must send MON");
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @notice 领取红包 - 演示模式，无限次领取，每次随机金额 [minAmount, maxAmount]
     */
    function claim() external {
        uint256 contractBalance = address(this).balance;
        require(contractBalance >= minAmount, "Insufficient balance");
        
        uint256 amount = _randomAmount();
        if (amount > contractBalance) amount = contractBalance;
        
        claimCount[msg.sender]++;
        totalClaimed++;
        totalDistributed += amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Claim(msg.sender, amount, claimCount[msg.sender]);
    }
    
    /**
     * @notice 批量领取 - 多次随机金额一次转出（方便演示）
     */
    function claimBatch(uint256 times) external {
        require(times > 0 && times <= 50, "Times must be 1-50");
        uint256 contractBalance = address(this).balance;
        require(contractBalance >= minAmount * times, "Insufficient balance for batch");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < times; i++) {
            uint256 amount = _randomAmountWithOffset(i);
            if (amount > contractBalance - totalAmount) amount = contractBalance - totalAmount;
            if (amount < minAmount) break;
            totalAmount += amount;
        }
        require(totalAmount > 0, "No amount to claim");
        
        claimCount[msg.sender] += times;
        totalClaimed += times;
        totalDistributed += totalAmount;
        
        (bool success, ) = msg.sender.call{value: totalAmount}("");
        require(success, "Transfer failed");
        
        emit Claim(msg.sender, totalAmount, claimCount[msg.sender]);
    }
    
    function setAmountRange(uint256 _min, uint256 _max) external onlyOwner {
        require(_min > 0 && _max >= _min, "Invalid range");
        minAmount = _min;
        maxAmount = _max;
        emit ConfigUpdated(_min, _max);
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");
        emit EmergencyWithdraw(balance);
    }
    
    // ============ 内部函数 ============
    
    function _randomAmount() internal view returns (uint256) {
        return _randomAmountWithOffset(0);
    }
    
    function _randomAmountWithOffset(uint256 offset) internal view returns (uint256) {
        uint256 seed = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            totalClaimed,
            offset
        )));
        
        return minAmount + (seed % (maxAmount - minAmount + 1));
    }
    
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}
