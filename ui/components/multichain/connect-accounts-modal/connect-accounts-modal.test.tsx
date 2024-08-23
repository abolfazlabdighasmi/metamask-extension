import React from 'react';
import configureStore from '../../../store/store';
import mockState from '../../../../test/data/mock-state.json';
import { renderWithProvider } from '../../../../test/jest/rendering';
import { ConnectAccountsModalList } from './connect-accounts-modal-list';

const render = () => {
  const props = {
    onClose: () => ({}),
    onAccountsUpdate: () => ({}),
    handleAccountClick: () => ({}),
    deselectAll: () => ({}),
    selectAll: () => ({}),
    allAreSelected: () => false,
    checked: false,
    isIndeterminate: false,
    activeTabOrigin: 'metamask.github.io',
    accounts: [
      {
        address: '0x5Ab19e7091dD208F352F8E727B6DCC6F8aBB6275',
        id: 'cf8dace4-9439-4bd4-b3a8-88c821c8fcb3',
        metadata: {
          name: 'Custody Account A',
          keyring: {
            type: 'Custody',
          },
          importTime: Date.now(),
        },
        type: 'eip155:eoa' as const,
        options: {},
        methods: [],
        name: 'Custody Account A',
        balance: 'mockBalance',
        keyring: { type: 'Custody' },
      },
    ],
    selectedAccounts: [],
  };
  const store = configureStore({
    metamask: {
      ...mockState.metamask,
      completedOnboarding: true,
    },
    activeTab: {
      id: 113,
      title: 'E2E Test Dapp',
      origin: 'https://metamask.github.io',
      protocol: 'https:',
      url: 'https://metamask.github.io/test-dapp/',
    },
  });

  return renderWithProvider(<ConnectAccountsModalList {...props} />, store);
};

describe('Connect More Accounts Modal', () => {
  it('should render correctly', () => {
    const { getByTestId } = render();
    expect(getByTestId('connect-more-accounts')).toBeDefined();
  });

  it('should render header correctly', () => {
    const { getByTestId } = render();
    expect(getByTestId('connect-more-accounts-title')).toBeDefined();
  });

  it('should have confirm button', () => {
    const { getByTestId } = render();
    expect(getByTestId('connect-more-accounts-button')).toBeDefined();
  });
});
