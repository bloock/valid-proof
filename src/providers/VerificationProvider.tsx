import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import FileLoader from "../components/FileLoader";
import DecryptFile from "../components/DecryptFile";
import Stepper from "../components/Stepper";
import Results from "../components/Results";
import {
  AuthenticityDetails,
  AvailabilityDetails,
  EncryptionDetails,
  IntegrityDetails,
} from "../models/VerificationResult";
import BloockService from "../services/BloockService";

export type VerificationState = {
  onInputChange: (input: File | URL) => void;
  onDecryptFile: (key: string) => Promise<boolean>;
  isFileValid: boolean | undefined;
  integrityDetails: IntegrityDetails | undefined;
  authenticityDetails: AuthenticityDetails | undefined;
  encryptionDetails: EncryptionDetails | undefined;
  availabilityDetails: AvailabilityDetails | undefined;
  service: BloockService;
};

const VerificationContext = createContext<VerificationState | undefined>(
  undefined
);

export const useVerification = () => {
  const ctxt = useContext(VerificationContext);
  if (!ctxt) {
    throw new Error(
      "useVerification returned `undefined`, maybe you forgot to wrap the component?"
    );
  }

  return ctxt;
};

export const steps = {
  loader: {
    Contents: FileLoader,
  },
  decrypt: {
    Contents: DecryptFile,
  },
  stepper: {
    Contents: Stepper,
  },
  details: {
    Contents: Results,
  },
};

export const VerificationProvider: React.FC = () => {
  // Inputs
  const [isFileValid, setIsFileValid] = useState<boolean | undefined>();
  const [integrityDetails, setIntegrityDetails] = useState<
    IntegrityDetails | undefined
  >();
  const [authenticityDetails, setAuthenticityDetails] = useState<
    AuthenticityDetails | undefined
  >();
  const [encryptionDetails, setEncryptionDetails] = useState<
    EncryptionDetails | undefined
  >();
  const [availabilityDetails, setAvailabilityDetails] = useState<
    AvailabilityDetails | undefined
  >();

  const [component, setComponent] = useState(steps.loader);

  const bloockService = useMemo(() => {
    return new BloockService();
  }, []);

  useEffect(() => {
    if (!integrityDetails?.enabled && !authenticityDetails?.enabled) return;

    let verification = [];
    if (integrityDetails?.enabled) {
      verification.push(integrityDetails.valid);
    }

    if (authenticityDetails?.enabled) {
      verification.push(authenticityDetails.valid);
    }

    const valid =
      verification.length > 0
        ? verification.every((v) => v === true)
        : undefined;

    if (isFileValid != valid) {
      setIsFileValid(valid);
    }
  }, [integrityDetails, authenticityDetails]);

  const processFile = (availabilityDetails: AvailabilityDetails) => {
    setAvailabilityDetails(availabilityDetails);

    return bloockService
      .checkEncryption(availabilityDetails.buffer)
      .then((_encryptionDetails) => {
        if (_encryptionDetails.enabled) {
          setEncryptionDetails(_encryptionDetails);
          setComponent(steps.decrypt);
        } else {
          return bloockService.checkAuthenticity(availabilityDetails.buffer);
        }
      })
      .then((authenticityDetails) => {
        if (authenticityDetails) {
          setAuthenticityDetails(authenticityDetails);
          return bloockService.checkIntegrity(availabilityDetails.buffer);
        }
      })
      .then((integrityDetails) => {
        if (integrityDetails) {
          setIntegrityDetails(integrityDetails);
          setComponent(steps.details);
        }
      });
  };

  const onDecryptFile = (key: string): Promise<boolean> => {
    if (!availabilityDetails) {
      throw new Error("Unknown error");
    }

    return bloockService
      .decryptFile(availabilityDetails.buffer, key)
      .then((decryptedFile) => {
        onInputChange(decryptedFile);
        return true;
      })
      .catch(() => false);
  };

  const onInputChange = (input: File | URL | Uint8Array) => {
    let readPromise: Promise<AvailabilityDetails>;
    if (input instanceof URL) {
      readPromise = bloockService.readUrl(input);
    } else if (input instanceof File) {
      readPromise = bloockService.readFile(input);
    } else if (input instanceof Uint8Array) {
      readPromise = bloockService.readBuffer(input, availabilityDetails);
    } else {
      return;
    }

    setComponent(steps.stepper);

    readPromise
      .then((availabilityDetails) => {
        return processFile(availabilityDetails);
      })
      .catch(console.error);
  };

  const value: VerificationState = {
    onInputChange,
    onDecryptFile,
    isFileValid,
    integrityDetails,
    authenticityDetails,
    encryptionDetails,
    availabilityDetails,
    service: bloockService,
  };

  return (
    <VerificationContext.Provider value={value}>
      <component.Contents></component.Contents>
    </VerificationContext.Provider>
  );
};
