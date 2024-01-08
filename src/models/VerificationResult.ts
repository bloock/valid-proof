export type VerificationInput = {
  name: string;
  bytes: Uint8Array;
};

export type IntegrityNetwork = {
  name: string;
  status: string;
  timestamp: number;
  txHash: string;
  anchorId: number;
  root?: string;
};

export type IntegrityDetails = {
  enabled: boolean;
  hash?: string;
  valid: boolean;
  timestamp?: number;
  networks?: IntegrityNetwork[];
  error?: string;
};

export type AuthenticitySignature = {
  alg?: string;
  kid?: string;
  signature?: string;
  subject?: Record<string, string>;
};

export type AuthenticityDetails = {
  enabled: boolean;
  valid: boolean;
  signatures: AuthenticitySignature[];
  subject?: Record<string, string>;
  error?: string;
};

export type EncryptionDetails = {
  enabled: boolean;
  type?: "SYMMETRIC" | "ASYMMETRIC";
  mode?: "LOCAL" | "MANAGED";
  alg?: string;
  key?: string;
  subject?: Record<string, string>;
  error?: string;
};

export type AvailabilityDetails = {
  filename?: string;
  link?: string;
  size?: number;
  type?: string;
  buffer: Uint8Array;
  payload?: Uint8Array;
  error?: string;
};
