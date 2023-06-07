import abi from "./contract.json";
import { Contract } from "@ethersproject/contracts";
import { InfuraProvider } from "@ethersproject/providers";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_SEPOLIA_ADDRESS;
const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY;
const INFURA_ID = "sepolia";

const provider = new InfuraProvider(INFURA_ID, INFURA_API_KEY);

export const getCandidate = async (index = 0) => {
  const contract = await new Contract(CONTRACT_ADDRESS, abi, provider);
  try {
    const response = await contract.candidates(index);
    return response;
  } catch (error) {
    return error.message;
  }
};

export const getTotalVotersOf = async (candidate_address) => {
  const contract = await new Contract(CONTRACT_ADDRESS, abi, provider);
  try {
    const response = await contract.getTotalVotersOf(candidate_address);
    return response;
  } catch (error) {
    return error.message;
  }
};

export const postVoteCandidate = async (candidate_address, signer) => {
  const contract = await new Contract(CONTRACT_ADDRESS, abi, signer);
  try {
    const response = await contract.doVoteFor(candidate_address, {
      // gasLimit: parseEther("0.000000000035"),
      gasLimit: 2100 + 68 *  4000,
    });
    return response;
  } catch (error) {
    return error.message;
  }
};
