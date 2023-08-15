
const hre = require("hardhat");

async function getBalances(address){
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.formatEther(balanceBigInt);
}
async function consoleBalances(addresses){
  let counter=0;
  for(const address of addresses){
    console.log(`Address ${counter} balance:`,await getBalances(address))
  }
}
// async function consoleMemos(memos){
//   for(const memo of memos){
//     const timestamp = memo.timestamp;
//     const name=memo.name;
//     const from= memo.from;
//     const message =memo.message;
//     console.log(`At ${timestamp},name ${name}, address ${from}` , `message ${message}`)
//   }
// }
async function main() {
  const [owner,from1,from2,from3]=await hre.ethers.getSigners();
  const coffee = await hre.ethers.getContractFactory("coffeekachakkar");
  const contractinstance = await coffee.deploy();

  await contractinstance.waitForDeployment();
  console.log("Address of the contract is ", contractinstance.target);

  // const addresses = [owner.address,from1.address];
  // await consoleBalances(addresses)
  // const amount = {value:hre.ethers.parseEther("1")}
  // await contractinstance.connect(from1).buyCoffee("from1","Very nice Coffee",amount);
  // await contractinstance.connect(from2).buyCoffee("from2","Very nic  offee",amount);
  // await contractinstance.connect(from3).buyCoffee("from3","y nice Coffee",amount);
  // console.log("after balances");
  // await consoleBalances(addresses);

  // const memos = await contractinstance.getMemos();

}
 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// 0x5FbDB2315678afecb367f032d93F642f64180aa3