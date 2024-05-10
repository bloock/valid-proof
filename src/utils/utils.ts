import { AnchorNetwork, Network } from "@bloock/sdk";
import { IntegrityNetwork } from "../models/VerificationResult";

export async function waitRandomTime(min: number, max: number) {
  const delay = Math.floor(Math.random() * (max - min + 1) + min);

  await new Promise((resolve) => setTimeout(resolve, delay));
}

export function getNetworkTranslation(network: IntegrityNetwork): string {
  const base = `results.integrity.networks`;
  switch (network.name) {
    case "ethereum_mainnet":
      // t('results.integrity.networks.ethereum_mainnet')
      return `${base}.ethereum_mainnet`;
    case "gnosis_chain":
      // t('results.integrity.networks.gnosis_chain')
      return `${base}.gnosis_chain`;
    case "polygon_chain":
      // t('results.integrity.networks.polygon_chain')
      return `${base}.polygon_chain`;

    case "ethereum_sepolia":
      // t('results.integrity.networks.ethereum_goerli')
      return `${base}.ethereum_sepolia`;
    default:
      // t('results.integrity.networks.unknown')
      return `${base}.unknown`;
  }
}

export function convertAnchorNetworkToNetwork(network: AnchorNetwork): Network {
  switch (network.name) {
    case "ethereum_mainnet":
      return Network.ETHEREUM_MAINNET;
    case "ethereum_sepolia":
      return Network.ETHEREUM_SEPOLIA;
    case "gnosis_chain":
      return Network.GNOSIS_CHAIN;
    case "polygon_chain":
      return Network.POLYGON_CHAIN;
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

export function parseCertificateSubject(
  subject: string
): Record<string, string> {
  const items = subject.split(",");

  const result: {
    [key: string]: string;
  } = {};

  items.forEach((item) => {
    const [key, value] = item.split("=");
    result[key.trim()] = value.trim();
  });

  return result;
}

export function getTxHashURL(
  network: string,
  txHash: string
): string | undefined {
  switch (network) {
    case "ethereum_mainnet":
      return `https://etherscan.io/tx/${txHash}`;
    case "ethereum_goerli":
      return `https://goerli.etherscan.io/tx/${txHash}`;
    case "polygon_chain":
      return `https://polygonscan.com/tx/${txHash}`;
    case "gnosis_chain":
      return `https://gnosisscan.io/tx/${txHash}`;
    case "bloock_chain":
      return undefined;
  }
}

export function getAlgType(
  alg?: string
): "SYMMETRIC" | "ASYMMETRIC" | undefined {
  switch (alg) {
    case "ES256K":
    case "ES256K_M":
    case "ENS":
    case "ENS_M":
    case "BJJ":
    case "BJJ_M":
    case "RSA":
    case "RSA_M":
      return `ASYMMETRIC`;
    case "A256GCM":
    case "A256GCM_M":
      return `SYMMETRIC`;
    default:
      return undefined;
  }
}

export function getEncryptionMode(
  alg?: string
): "LOCAL" | "MANAGED" | undefined {
  switch (alg) {
    case "A256GCM":
    case "RSA":
      return `LOCAL`;
    case "A256GCM_M":
    case "RSA_M":
      return `MANAGED`;
    default:
      return undefined;
  }
}

export function readBlob(file: Blob): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        const uint8Array = new Uint8Array(reader.result);
        resolve(uint8Array);
      } else {
        reject(new Error("Failed to read file."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file."));
    };

    reader.readAsArrayBuffer(file);
  });
}

export const decodeString = (encodedStr?: string) => {
  if (encodedStr) {
    return decodeURIComponent(escape(encodedStr));
  }
};
