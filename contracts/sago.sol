// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "@ganache/console.log/console.sol";

contract SagoToken is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 TokenPrice = 1 ether;
   uint TotalSoldAmount =0;
    event BuyTokenEvent(
        uint256 amount,
        address Buyer,
        uint256 NoofToken,  
        uint256 totalBalance,
        uint256 returnAmount
    );
    event TransferBalanceEvnet(
        uint256 OwnerBalance,
        uint256 Transferedamount,
        address Receiptend
    );
    event GetDetails(
        uint256 TotalSupply,
        uint256 SGNPrice,
        uint256 CurrentSupply,
        uint256 TotalUserTOken,
        uint256 TotalPrice
    );
    address  Owner;
    constructor() ERC20("SagoToken", "SGN") {
        Owner = msg.sender;
        _mint(msg.sender, 10000* 10 ** decimals());
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

  function BuyToken() public payable {
      require(msg.value < address(msg.sender).balance,"You dont have sufficient fund");
      require(msg.value >= TokenPrice,"Need to tranfer money heigher than token amount");
      console.log("******************* Buy Token ********************");
      console.log("owner:",  Owner);
      uint Token = msg.value / TokenPrice;
      uint RemainingAmount = msg.value % TokenPrice;
      console.log("TransferedToken",Token);
      console.log("decimalValue: 1",10 ** decimals());
      console.log("ToeknPrice",TokenPrice);
      _transfer(Owner, msg.sender,Token  * 10 ** decimals());
      TotalSoldAmount += Token;
      emit BuyTokenEvent(msg.value,msg.sender,Token,address(msg.sender).balance,RemainingAmount);
      if(RemainingAmount > 0)
      {
         SendBalanceTouser(payable(msg.sender),RemainingAmount);
      }
      EmitDetails(); 

  }

  function getWalletBalance()public view returns(uint256)
  {
      return address(this).balance;
  }
   function getOwner()public view returns(address)
  {
      return Owner;
  }
  function SendBalanceTouser(address payable _to,uint256 RemainingAmount) public
  {
        require(RemainingAmount < address(this).balance,"Balance not sufficient");
        _to.transfer(RemainingAmount);
  }

  function SellToken(uint Token) public{
      require((Token * 10 ** decimals()) <= balanceOf(msg.sender),"Token not available try less");
      TotalSoldAmount -= Token;
      _transfer(msg.sender,Owner,Token* 10 ** decimals());
      uint ReturnAmount = Token * TokenPrice;
      if(ReturnAmount > 0)
      SendBalanceTouser(payable(msg.sender),ReturnAmount);
      EmitDetails() ;
  }
  function TranferToken(address _to,uint Token) public{
      require(Token* 10 ** decimals()  <= balanceOf(msg.sender),"You dont have much token");
      _transfer(msg.sender,_to,Token* 10 ** decimals());
        EmitDetails(); 
  }

   function EmitDetails() public{
        console.log("User Account:",  msg.sender);
        console.log("User Balance:",  balanceOf(msg.sender)/(10 ** decimals()));
       emit GetDetails(
        totalSupply()/TokenPrice,
        TokenPrice,
        ((totalSupply()/TokenPrice) - TotalSoldAmount),
        balanceOf(msg.sender)/TokenPrice,
        balanceOf(msg.sender)/TokenPrice
       );
   }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
      
}
