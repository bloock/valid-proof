import { AnchorNetwork, Network } from "@bloock/sdk";

export async function waitRandomTime(min: number, max: number) {
  const delay = Math.floor(Math.random() * (max - min + 1) + min);

  await new Promise((resolve) => setTimeout(resolve, delay));
}

export function convertAnchorNetworkToNetwork(network: AnchorNetwork): Network {
  switch (network.name) {
    case "ethereum_mainnet":
      return Network.ETHEREUM_MAINNET;
    case "gnosis_chain":
      return Network.GNOSIS_CHAIN;
    case "polygon_chain":
      return Network.POLYGON_CHAIN;
    case "bloock_chain":
      return Network.BLOOCK_CHAIN;
    default:
      return Network.ETHEREUM_MAINNET;
  }
}

export function formatBytes(bytes?: number, decimals = 2) {
  if (!bytes) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
}
