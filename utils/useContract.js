import { useState, useEffect } from "react";
import { useContract } from "@thirdweb-dev/react";
const usecontract = (contractAddress, abi) => {
  const [data, setData] = useState(null);

  const { contract } = useContract(contractAddress, abi);

  return contract;
};

export default usecontract;
