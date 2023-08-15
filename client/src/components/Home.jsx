import React from 'react'
import react, { useEffect, useState } from "react"
import abi from "../contracts/coffeekachakkar.json"
import { ethers } from "ethers";
// import './App.css';
import Buy from "./Buy";
import Memos from "./Memos";
const Home = () => {
    const [state,setState]=useState({
        provider:null,
        signer:null,
        contract:null
      })
      useEffect(()=>{
        const connectWallet=async()=>{
          const contractAddress = "0x97b5e9162C94d9E0448fAc1DE2084084675fc5A4";
          const contractAbi = abi.abi;
          try{
            const {ethereum} = window;
            if(ethereum){
              const account = await ethereum.request({method:"eth_requestAccounts",})
            }
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress,contractAbi,signer);
            setState({provider,signer,contract})
          }catch(e){
            console.log(e);
          }
        };
        connectWallet();
      },[]);
      console.log(state);
  return (
    
      <div className="App">
      <h1 className="lovmatch">Koffee ka Chakkar❤️</h1>
      <Buy state={state}/>
      <Memos state={state}/>
    </div>
    
  )
}

export default Home
