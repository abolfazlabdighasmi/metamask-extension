import { NameType } from '@metamask/name-controller';
import { useSelector } from 'react-redux';
import { Hex } from '@metamask/utils';
import { TokenStandard } from '../../shared/constants/transaction';
import { hexToDecimal } from '../../shared/modules/conversion.utils';
import { getMemoizedMetadataContracts } from '../selectors';
import { getNftContractsByAddressOnCurrentChain } from '../selectors/nft';
import { useNames } from './useName';
import { useFirstPartyContractNames } from './useFirstPartyContractName';
import { useNftCollectionsMetadata } from './useNftCollectionsMetadata';

export type UseDisplayNameRequest = {
  value: string;
  preferContractSymbol?: boolean;
  standard?: TokenStandard;
  tokenId?: Hex;
  type: NameType;
};

export type UseDisplayNameResponse = {
  name: string | null;
  hasPetname: boolean;
  contractDisplayName?: string;
  image?: string;
};

export function useDisplayNames(
  requests: UseDisplayNameRequest[],
): UseDisplayNameResponse[] {
  const nameRequests = requests.map(({ value, standard, tokenId, type }) => ({
    value,
    standard,
    tokenId,
    type,
  }));

  const nameEntries = useNames(nameRequests);
  const firstPartyContractNames = useFirstPartyContractNames(nameRequests);
  const nftCollections = useNftCollectionsMetadata(nameRequests);
  const values = requests.map(({ value }) => value);

  const contractInfo = useSelector((state) =>
    // TODO: Replace `any` with type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (getMemoizedMetadataContracts as any)(state, values, true),
  );

  const watchedNftNames = useSelector(getNftContractsByAddressOnCurrentChain);

  return requests.map(({ value, preferContractSymbol, tokenId }, index) => {
    const nameEntry = nameEntries[index];
    const firstPartyContractName = firstPartyContractNames[index];
    const singleContractInfo = contractInfo[index];
    const watchedNftName = watchedNftNames[value.toLowerCase()]?.name;
    const nftCollectionProperties =
      nftCollections[
        `${value.toLowerCase()}:${hexToDecimal(tokenId as string)}`
      ];

    let nftCollectionName;
    let nftCollectionImage;

    if (!nftCollectionProperties?.isSpam) {
      nftCollectionName = nftCollectionProperties?.name;
      nftCollectionImage = nftCollectionProperties?.image;
    }

    const contractDisplayName =
      preferContractSymbol && singleContractInfo?.symbol
        ? singleContractInfo.symbol
        : singleContractInfo?.name;

    const name =
      nameEntry?.name ||
      firstPartyContractName ||
      nftCollectionName ||
      contractDisplayName ||
      watchedNftName ||
      null;

    const hasPetname = Boolean(nameEntry?.name);

    return {
      name,
      hasPetname,
      contractDisplayName,
      image: nftCollectionImage,
    };
  });
}

/**
 * Attempts to resolve the name for the given parameters.
 *
 * @param value - The address or contract address to resolve.
 * @param type - The type of value, e.g. NameType.ETHEREUM_ADDRESS.
 * @param preferContractSymbol - Applies to recognized contracts when no petname is saved:
 * If true the contract symbol (e.g. WBTC) will be used instead of the contract name.
 * @param standard - The token standard, if applicable.
 * @param tokenId - Token ID, if applicable.
 * @returns An object with two properties:
 * - `name` {string|null} - The display name, if it can be resolved, otherwise null.
 * - `hasPetname` {boolean} - True if there is a petname for the given address.
 */
export function useDisplayName(
  value: string,
  type: NameType,
  preferContractSymbol: boolean = false,
  standard?: TokenStandard,
  tokenId?: Hex,
): UseDisplayNameResponse {
  return useDisplayNames([
    { preferContractSymbol, standard, tokenId, type, value },
  ])[0];
}
