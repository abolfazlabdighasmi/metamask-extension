import React from 'react';
import { fireEvent, renderWithProvider, screen } from '../../../../test/jest';
import configureStore from '../../../store/store';
import testData from '../../../../.storybook/test-data';
import { CHAIN_IDS } from '../../../../shared/constants/network';
import { mockNetworkState } from '../../../../test/stub/networks';
import { DetectedTokensBanner } from '.';

describe('DetectedTokensBanner', () => {
  let setShowDetectedTokensSpy;

  const args = {};

  beforeEach(() => {
    setShowDetectedTokensSpy = jest.fn();
    args.actionButtonOnClick = setShowDetectedTokensSpy;
  });

  it('should render correctly', () => {
    const store = configureStore({
      ...testData,
      metamask: {
        ...testData.metamask,
        selectedNetworkClientId: 'sepolia',
        ...mockNetworkState({ chainId: CHAIN_IDS.SEPOLIA }),
      },
    });
    const { getByTestId, container } = renderWithProvider(
      <DetectedTokensBanner {...args} />,
      store,
    );

    expect(getByTestId('detected-token-banner')).toBeDefined();
    expect(container).toMatchSnapshot();
  });
  it('should render number of tokens detected link', () => {
    const store = configureStore({
      ...testData,
      metamask: {
        ...testData.metamask,
        selectedNetworkClientId: 'sepolia',
        ...mockNetworkState({ chainId: CHAIN_IDS.SEPOLIA }),
      },
    });
    renderWithProvider(<DetectedTokensBanner {...args} />, store);

    expect(
      screen.getByText('3 new tokens found in this account'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Import tokens'));
    expect(setShowDetectedTokensSpy).toHaveBeenCalled();
  });
});
