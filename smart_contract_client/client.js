const util = require('util');
const exec = util.promisify(require('child_process').exec);

const addToWhiteList = async (address, network) => {
	try {
	  const networkFlag = (network === 'rinkeby' ? '--network rinkeby' : '')
	  const script = `./node_modules/truffle/build/cli.bundled.js exec smart_contract_client/add_to_whitelist.js ${networkFlag} ${address}`
	  console.log(script)
	  // const { stdout } = await exec(script);
	  // console.log(stdout)
	  await exec(script);
	  return true;
	} catch(err) {
		console.log("addToWhiteList Err:", err)
		return false
	}
};


module.exports = { 
  addToWhiteList: addToWhiteList
};