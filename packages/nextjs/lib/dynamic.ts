import { EvmNetwork, Wallet } from "@dynamic-labs/sdk-react-core";
import { NetworkConfigurationMap } from "@dynamic-labs/types";
import { getOrMapViemChain } from "@dynamic-labs/viem-utils";
import { encodeCallData } from "permissionless/accounts/kernel/utils/encodeCallData";
import { Account, Chain, Hex, Transport, WalletClient, encodeFunctionData, parseEther , createPublicClient} from "viem";
import { notification } from "~~/utils/scaffold-eth";
import  deployedContracts  from "~~/contracts/deployedContracts";

export const signMessage = async (message: string, wallet: any): Promise<string> => {
  const connector = wallet?.connector;

  return await connector.signMessage(message);
};


export const getCurrentNetwork = async (wallet: Wallet,  networkConfigurations: NetworkConfigurationMap): Promise<EvmNetwork> => {
  const chainID = await wallet.connector.getNetwork();
  const currentNetwork = networkConfigurations.evm?.find(network => network.chainId === chainID);

  if (!currentNetwork) {
    throw new Error("Network not found");
  }

  return currentNetwork as EvmNetwork;
}
export const sendTransaction = async (
  wallet: Wallet,
  networkConfigurations: NetworkConfigurationMap,
): Promise<string | undefined> => {
  try {
    const walletClient = wallet.connector.getWalletClient<WalletClient<Transport, Chain, Account>>();
    const currentNetwork = await getCurrentNetwork(wallet, networkConfigurations);
    const chain = getOrMapViemChain(currentNetwork as EvmNetwork);
    const abi = deployedContracts[84532].MintNFT_URA.abi;
    const address = deployedContracts[84532].MintNFT_URA.address;
    const transaction = {
      account: wallet.address as Hex,
      to: address as Hex,
      data: encodeFunctionData<typeof abi, "mintERC20">({abi, functionName: "mintERC20", args: []}),
      chain,
      value: parseEther('0.001')
    };

    const transactionHash = await walletClient.sendTransaction(transaction);
    return transactionHash;
  } catch (e) {
    if (e instanceof Error) {
      notification.error(`Error sending transaction: ${e.message}`);
    } else {
      notification.error("Error sending transaction");
    }
  }
};

export const waitForMint = async (wallet: Wallet, transactionHash: string): Promise<void> => {
  const currentNetwork = await getCurrentNetwork(wallet, networkConfigurations);
  const client = createPublicClient({ chain: getOrMapViemChain(currentNetwork as EvmNetwork), transport: "http" });

  const receipt = await client.waitForTransactionReceipt({transactionHash});
  // in receipt you have receipt.logs
  // logs you parse using abi and extract ERC721 Transfer event
  // from the event you taken tokenId argument
  // you may displaz this event in UI or even ask metamask through rpc call to add it to list of tracked nfts
}