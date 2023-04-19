const hardhat = require("hardhat");
const fs = require("fs");

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    const abi = [];
    const abiName = [];

    // zkLink
    const zkLinkArtifact = await hardhat.artifacts.readArtifact('ZkLink');
    const peripheryArtifact = await hardhat.artifacts.readArtifact('ZkLinkPeriphery');
    abi.push(...zkLinkArtifact.abi);
    for (let element of zkLinkArtifact.abi) {
        abiName.push(element.name);
    }
    for (let element of peripheryArtifact.abi) {
        if (!abiName.includes(element.name)) {
            abi.push(element);
        } else {
            console.log("duplicate name: ", element.name);
        }
    }

    const outputFilePath = process.env.ZKLINK_JSON_PATH;
    if (outputFilePath === undefined) {
        console.log("combine output file path not set");
    } else {
        const output = {
            description: "This file is generated by run script 'combine_zklink_abi.js' in zklink-contracts",
            abi: abi
        };
        fs.writeFileSync(outputFilePath, JSON.stringify(output, null, 2));
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });