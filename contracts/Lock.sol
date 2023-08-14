// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Coffee{

    struct Memo {
        string Name;
        string Message;
        uint timestamp;
        address from;
    }
    Memo[] memos;
    address payable owner;
    constructor(){
        owner = payable(msg.sender);
    }

    // hi
    mapping(address => string) public names;
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    function setName(string memory _name) public {
        names[msg.sender] = _name;
    }
    function getName(address _address) public view returns (string memory) {
        return names[_address];
    }


    function buyCoffee (string calldata name , string calldata message) external payable{
        require(msg.value>0 , "Please pay more than 0 Ether");
        owner.transfer(msg.value);
        memos.push(Memo(name,message,block.timestamp,msg.sender));
    }
    function getMemos() public view returns(Memo[] memory){
        return memos;
    }
}