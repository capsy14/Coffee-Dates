const hre = require("hardhat");
// const { ethers } = require("ethers");

async function main() {
  // Compile the contracts before deployment (added)
  await hre.run('compile');
  
  // Access the artifacts of the "Coffee" contract (added)
  const Coffee = await hre.ethers.getContractFactory("Coffee");
  
  // Deploy the "Coffee" contract (improved)
  const coffeeInstance = await Coffee.deploy();
    
  // Wait for deployment transaction to be mined (improved)
  await coffeeInstance.waitForDeployment();
  
  console.log("Deployed contract address:", coffeeInstance.target);
}

// Call the main function and handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
