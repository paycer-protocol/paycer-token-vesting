// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.3;
pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./libraries/AddressPagination.sol";

/// @title Paycer Vesting Contract
/// @notice You can use this contract for token vesting
/// @dev All function calls are currently implemented without side effects
contract Vesting is Initializable, OwnableUpgradeable {
    using AddressPagination for address[];
    using SafeERC20Upgradeable for IERC20Upgradeable;

    struct VestingParams {
        // Name of this tokenomics
        string vestingName;
        // Total amount to be vested
        uint256 amountToBeVested;
        // Period before release vesting starts, also it unlocks initialUnlock vesting tokens. (in time unit of block.timestamp)
        uint256 lockPeriod;
        // Percent of tokens initially unlocked
        uint256 initialUnlock;
        // Period to release all vesting token, after lockPeriod + vestingPeriod it releases 100% of vesting tokens. (in time unit of block.timestamp)
        uint256 vestingPeriod;
        // Amount of time in seconds between withdrawal periods.
        uint256 releaseInterval;
        // Release percent in each withdrawing interval
        uint256 releaseRate;
    }

    struct VestingInfo {
        // Total amount of tokens to be vested.
        uint256 totalAmount;
        // The amount that has been withdrawn.
        uint256 amountWithdrawn;
    }

    /// @notice General decimal values ACCURACY unless specified differently (e.g. fees, exchange rates)
    uint256 public constant ACCURACY = 1e10;

    /*************************** Vesting Params *************************/

    /// @notice Total balance of this vesting contract
    uint256 public amountToBeVested;

    /// @notice Name of this vesting
    string public vestingName;

    /// @notice Start time of vesting
    uint256 public startTime;

    /// @notice Intervals that the release happens. Every interval, releaseRate of tokens are released.
    uint256 public releaseInterval;

    /// @notice Release percent in each withdrawing interval
    uint256 public releaseRate;

    /// @notice Percent of tokens initially unlocked
    uint256 public initialUnlock;

    /// @notice Period before release vesting starts, also it unlocks initialUnlock vesting tokens. (in time unit of block.timestamp)
    uint256 public lockPeriod;

    /// @notice Period to release all vesting token, after lockPeriod + vestingPeriod it releases 100% of vesting tokens. (in time unit of block.timestamp)
    uint256 public vestingPeriod;

    /// @notice Vesting token of the project.
    address public vestingToken;

    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private enteredStatus;

    /*************************** Status Info *************************/

    /// @notice Sum of all user's vesting amount
    uint256 public totalVestingAmount;

    /// @notice Vesting schedule info for each user(presale)
    mapping(address => VestingInfo) public recipients;

    // Participants list
    address[] internal participants;
    mapping(address => uint256) internal indexOf;
    mapping(address => bool) internal inserted;

    /// @notice An event emitted when the vesting schedule is updated.
    event VestingInfoUpdated(address indexed registeredAddress, uint256 totalAmount);

    /// @notice An event emitted when withdraw happens
    event Withdraw(address indexed registeredAddress, uint256 amountWithdrawn);

    /// @notice An event emitted when startTime is set
    event StartTimeSet(uint256 startTime);

    /// @notice An event emitted when owner is updated
    event OwnerUpdated(address indexed newOwner);

    function initialize(address _vestingToken, VestingParams memory _params) external initializer {
        require(_vestingToken != address(0), "initialize: vestingToken cannot be zero");
        require(_params.releaseRate > 0, "initialize: release rate cannot be zero");
        require(_params.releaseInterval > 0, "initialize: release interval cannot be zero");

        __Ownable_init();

        vestingToken = _vestingToken;

        vestingName = _params.vestingName;
        amountToBeVested = _params.amountToBeVested;
        initialUnlock = _params.initialUnlock;
        releaseInterval = _params.releaseInterval;
        releaseRate = _params.releaseRate;
        lockPeriod = _params.lockPeriod;
        vestingPeriod = _params.vestingPeriod;
        enteredStatus = NOT_ENTERED;
    }

    /**
     * @notice Return the number of participants
     */
    function participantCount() external view returns (uint256) {
        return participants.length;
    }

    /**
     * @notice Return the list of participants
     */
    function getParticipants(uint256 page, uint256 limit)
        external
        view
        returns (address[] memory)
    {
        return participants.paginate(page, limit);
    }

    /**
     * @notice Update user vesting information
     * @dev This is called by presale contract
     * @param recp Address of Recipient
     * @param amount Amount of vesting token
     */
    function updateRecipient(address recp, uint256 amount) external onlyOwner {
        require(
            startTime == 0 || startTime >= block.timestamp,
            "updateRecipient: Cannot update the receipient after started"
        );
        require(amount > 0, "updateRecipient: Cannot vest 0");

        // remove previous amount and add new amount
        totalVestingAmount = totalVestingAmount + amount - recipients[recp].totalAmount;

        uint256 depositedAmount = IERC20Upgradeable(vestingToken).balanceOf(address(this));
        require(
            depositedAmount >= totalVestingAmount,
            "updateRecipient: Vesting amount exceeds current balance"
        );

        if (inserted[recp] == false) {
            inserted[recp] = true;
            indexOf[recp] = participants.length;
            participants.push(recp);
        }

        recipients[recp].totalAmount = amount;

        emit VestingInfoUpdated(recp, amount);
    }

    /**
     * @notice Set vesting start time
     * @dev This should be called before vesting starts
     * @param newStartTime New start time
     */
    function setStartTime(uint256 newStartTime) external onlyOwner {
        // Only allow to change start time before the counting starts
        require(startTime == 0 || startTime >= block.timestamp, "setStartTime: Already started");
        require(newStartTime > block.timestamp, "setStartTime: Should be time in future");

        startTime = newStartTime;

        emit StartTimeSet(newStartTime);
    }

    /**
     * @notice Withdraw tokens when vesting is ended
     * @dev Anyone can claim their tokens
     */
    function withdraw() external nonReentrant {
        VestingInfo storage vestingInfo = recipients[msg.sender];
        if (vestingInfo.totalAmount == 0) return;

        uint256 _vested = vested(msg.sender);
        uint256 _withdrawable = withdrawable(msg.sender);
        vestingInfo.amountWithdrawn = _vested;

        require(_withdrawable > 0, "Nothing to withdraw");
        IERC20Upgradeable(vestingToken).safeTransfer(msg.sender, _withdrawable);
        emit Withdraw(msg.sender, _withdrawable);
    }

    /**
     * @notice Returns the amount of vested vesting tokens
     * @dev Calculates available amount depending on vesting params
     * @param beneficiary address of the beneficiary
     * @return amount : Amount of vested tokens
     */
    function vested(address beneficiary) public view virtual returns (uint256 amount) {
        uint256 lockEndTime = startTime + lockPeriod;
        uint256 vestingEndTime = lockEndTime + vestingPeriod;
        VestingInfo memory vestingInfo = recipients[beneficiary];

        if (startTime == 0 || vestingInfo.totalAmount == 0 || block.timestamp <= lockEndTime) {
            return 0;
        }

        if (block.timestamp > vestingEndTime) {
            return vestingInfo.totalAmount;
        }

        uint256 initialUnlockAmount = (vestingInfo.totalAmount * initialUnlock) / ACCURACY;
        uint256 unlockAmountPerInterval = (vestingInfo.totalAmount * releaseRate) / ACCURACY;
        uint256 vestedAmount = (block.timestamp - lockEndTime) / releaseInterval * unlockAmountPerInterval +
            initialUnlockAmount;

        uint256 withdrawnAmount = recipients[beneficiary].amountWithdrawn;
        vestedAmount = withdrawnAmount > vestedAmount ? withdrawnAmount : vestedAmount;

        return vestedAmount > vestingInfo.totalAmount ? vestingInfo.totalAmount : vestedAmount;
    }

    /**
     * @notice Return locked amount
     * @return Locked vesting token amount
     */
    function locked(address beneficiary) public view returns (uint256) {
        uint256 totalAmount = recipients[beneficiary].totalAmount;
        uint256 vestedAmount = vested(beneficiary);
        return totalAmount - vestedAmount;
    }

    /**
     * @notice Return remaining withdrawable amount
     * @return Remaining vested amount of vesting token
     */
    function withdrawable(address beneficiary) public view returns (uint256) {
        uint256 vestedAmount = vested(beneficiary);
        uint256 withdrawnAmount = recipients[beneficiary].amountWithdrawn;
        return vestedAmount - withdrawnAmount;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        // On the first call to nonReentrant, _notEntered will be true
        require(enteredStatus != ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        enteredStatus = ENTERED;

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        enteredStatus = NOT_ENTERED;
    }
}
