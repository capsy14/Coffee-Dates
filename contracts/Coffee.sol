// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract coffeekachakkar {
    struct Memo {
        string name;
        string message;
        uint timestamp;
        address from;
    }
    Memo[] memos;
    address payable owner;


    struct Access {
        address user;
        bool access;
    }
    mapping(address => string[]) value; //storing the url
    mapping(address => mapping(address => bool)) ownership;
    mapping(address => Access[]) public accessList; //to give ownership
    mapping(address => mapping(address => bool)) previousData;





    constructor() {
        owner = payable(msg.sender);
    }


    function buyCoffee(
        string memory coffeeName,
        string memory coffeeMessage
    ) public payable {
        require(msg.value > 0, "Please pay the desired amount");
        owner.transfer(msg.value);
        memos.push(
            Memo(coffeeName, coffeeMessage, block.timestamp, msg.sender)
        );
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function add(address _user, string calldata url) external {
        value[_user].push(url);
    }

    function allow(address user) external {
        ownership[msg.sender][user] = true;
        if(previousData[msg.sender][user]==true){
            for(uint i=0;i<accessList[msg.sender].length;i++){
                if(accessList[msg.sender][i].user==user){
                    accessList[msg.sender][i].access=true;
                } 
            }
        }
        else{
            accessList[msg.sender].push(Access(user,true));
            previousData[msg.sender][user]=true;
        }
        accessList[msg.sender].push(Access(user,true)); 
    }

    function disallow(address user) external {
        ownership[msg.sender][user]=false;
        for(uint i=0;i<accessList[msg.sender].length;i++){
            if(accessList[msg.sender][i].user==user){
                accessList[msg.sender][i].access=false;
            }
        }
        accessList[msg.sender].push(Access(user,false));
    }
    function display(address _user) external view returns (string[] memory){
        require(_user==msg.sender || ownership[_user][msg.sender],"You dont have access");
        return value[_user];
    }
    function shareAccess() public view  returns(Access[] memory){
        return accessList[msg.sender];
    }


}

