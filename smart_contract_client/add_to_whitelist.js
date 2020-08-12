const fs = require('fs');
const getAbi = () => {
  const abi = fs.readFileSync('./smart_contract_client/build/contracts/SOVToken.json', 'utf8');
  console.log("abi", abi)
  return JSON.parse(abi).abi
}

const getNetwork = (args) => {
  const network = (args[4] === '--network') && (args[5] === 'rinkeby') ? 'rinkeby' : 'development'
  return network
}

module.exports = async function(callback) {
  let myAddress, contractAddress, privateKey
  
  if(getNetwork(process.argv) === 'development') {
    console.log('dev mode')
    myAddress = process.env.DEV_ADDRESS
    contractAddress = process.env.DEV_CONTRACT_ADDRESS
    privateKey = process.env.DEV_PRIVATE_KEY
  } else {
    console.log('prod rinkeby mode')
    myAddress = process.env.PROD_ADDRESS
    contractAddress = process.env.PROD_CONTRACT_ADDRESS
    privateKey = process.env.PROD_PRIVATE_KEY
  }

  try {
    var MyContract = new web3.eth.Contract(getAbi(), contractAddress, {from: myAddress});
  } catch (e) {
    console.log('error: unable to get contract')
    console.log(e)
  }

  const address = process.argv.pop()
  try {
    const res = await MyContract.methods.addToWhiteList(address).send({from: myAddress})
    console.log(res)
  } catch (e) {
    console.log('error: unable to add to whitelist')
    console.log(e)
  }
  callback()
}