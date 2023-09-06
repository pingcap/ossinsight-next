import * as React from 'react';
import { RemoteRepoInfo } from '../../GHRepoSelector';
import { RemoteUserInfo } from '../../GHUserSelector';
import { RemoteOrgInfo } from '../../GHOrgSelector';
import SearchIcon from 'bootstrap-icons/icons/search.svg';
import { twMerge } from 'tailwind-merge';
import { useRemoteList } from '../../RemoteSelector/useRemoteList';
import {
  getUserText,
  isUserEquals,
  searchUser,
} from '../../GHUserSelector/utils';
import {
  getRepoText,
  isRepoEquals,
  searchRepo,
} from '../../GHRepoSelector/utils';
import { getOrgText, isOrgEquals, searchOrg } from '../../GHOrgSelector/utils';
import * as HUI from '@headlessui/react';

import { GHAvatar } from '../../GHAvatar';

import './style.scss';

const types = [
  { name: 'User', id: 'user', placeholder: 'Enter a GitHub ID' },
  {
    name: 'Organization',
    id: 'org',
    placeholder: 'Enter a GitHub Organization Name',
  },
  { name: 'Repository', id: 'repo', placeholder: 'Enter a GitHub Repo Name' },
] as const;

const { Transition, Dialog } = HUI;

export interface HeaderAnalyzeSelectorProps {
  navigateTo?: (url: string) => void;
}

export function HeaderAnalyzeSelector(props: HeaderAnalyzeSelectorProps) {
  const { navigateTo } = props;

  const [selectedType, setSelectedType] = React.useState<
    'user' | 'org' | 'repo'
  >('user');
  const [isOpen, setIsOpen] = React.useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleTypeChange = React.useCallback(
    (type: 'user' | 'repo' | 'org') => {
      setSelectedType(type);
    },
    []
  );

  const handleSelectItem = React.useCallback(
    (item: RemoteRepoInfo | RemoteUserInfo | RemoteOrgInfo) => {
      closeModal();
      // navigateTo?.(
      //   `/analyze/${
      //     (item as RemoteRepoInfo)!.fullName ||
      //     (item as RemoteUserInfo | RemoteOrgInfo)!.login
      //   }`
      // );
      switch (selectedType) {
        case 'user':
        case 'repo':
          navigateTo?.(
            `https://ossinsight.io/analyze/${
              (item as RemoteRepoInfo)!.fullName ||
              (item as RemoteUserInfo | RemoteOrgInfo)!.login
            }`
          );
          break;
        case 'org':
          navigateTo?.(`/analyze/${(item as RemoteOrgInfo)!.login}`);
          break;
      }
    },
    [selectedType, navigateTo]
  );

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '/') {
        openModal();
        event.preventDefault();
      } else if (event.key === 'Escape') {
        closeModal();
        event.preventDefault();
      }
    };
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  return (
    <>
      <button
        type='button'
        onClick={openModal}
        className='inline-flex items-center gap-2 w-full max-w-[12rem] rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-[var(--border-color-default)]'
      >
        <SearchIcon />
        Type <span className='kbd kbd-sm'>/</span> to search
      </button>

      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full justify-center p-4 text-center'>
              <Transition.Child
                as={React.Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-3xl transform overflow-hidden rounded-2xl bg-[var(--background-color-popover)] p-6 text-left align-middle shadow-xl transition-all'>
                  <div className=''>
                    <div className='block'>
                      <nav className='flex space-x-4' aria-label='Tabs'>
                        {types.map((tab) => (
                          <div
                            key={tab.id}
                            className={twMerge(
                              tab.id === selectedType
                                ? 'bg-[var(--list-item-active)] text-[var(--text-color-active)]'
                                : 'hover:text-[var(--text-color-active)]',
                              'rounded-md px-3 py-2 text-sm font-medium cursor-pointer'
                            )}
                            tabIndex={0}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                handleTypeChange(tab.id as any);
                              }
                            }}
                            onClick={() => handleTypeChange(tab.id as any)}
                          >
                            {tab.name}
                          </div>
                        ))}
                      </nav>
                    </div>
                  </div>
                  <div className='mt-4'>
                    {selectedType === 'user' && (
                      <UserSearch handleSelectItem={handleSelectItem} />
                    )}
                    {selectedType === 'repo' && (
                      <RepoSearch handleSelectItem={handleSelectItem} />
                    )}
                    {selectedType === 'org' && (
                      <OrgSearch handleSelectItem={handleSelectItem} />
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

function CommonSearch<T extends { id: string | number }>(props: {
  placeholder: string;
  handleInputValueChange: (value: string) => void;
  loading: boolean;
  error: any;
  items: T[];
  getAvatarName: (item: T) => string;
  renderLabel: (item: T) => string | React.ReactNode;
  handleSelectItem?: (item: T) => void;
}) {
  const {
    placeholder,
    handleInputValueChange,
    loading,
    error,
    items,
    getAvatarName,
    renderLabel,
    handleSelectItem,
  } = props;

  return (
    <>
      <input
        type='text'
        name='header-search'
        id='header-search'
        className='block w-full rounded-md border-0 p-1.5 text-[var(--text-color-active)] shadow-sm ring-1 ring-inset ring-gray-300 bg-[var(--background-color-control)] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        placeholder={placeholder}
        autoFocus
        onChange={(event) => {
          handleInputValueChange(event.target.value || '');
        }}
      />
      <ul role='list' className='mt-4 space-y-1'>
        {loading && (
          <li className='py-4 px-2 text-disabled text-xs'>Loading...</li>
        )}
        {!loading && error && (
          <li className='py-4 px-2 text-disabled text-xs'>Failed to load</li>
        )}
        {!loading && !error && !items.length && (
          <li className='py-4 px-2 text-disabled text-xs'>Empty result</li>
        )}
        {items.map((item) => (
          <li
            tabIndex={0}
            key={item.id}
            className='group overflow-hidden rounded-md px-4 py-2 text-sm focus:bg-[var(--list-item-active)] focus:text-[var(--text-color-active)] hover:bg-[var(--list-item-active)] hover:text-[var(--text-color-active)] cursor-pointer'
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSelectItem?.(item);
              }
            }}
            onClick={() => {
              handleSelectItem?.(item);
            }}
          >
            <div className='inline-flex gap-2 items-center w-full'>
              <GHAvatar name={getAvatarName(item)} size={6} />
              {renderLabel(item)}
              <span className='hidden ml-auto group-focus:block'>
                Press <span className='kbd kbd-sm'>Enter</span> to choose
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function UserSearch(props: {
  handleSelectItem?: (item: RemoteUserInfo) => void;
}) {
  const { handleSelectItem } = props;

  const { items, reload, error, loading } = useRemoteList<RemoteUserInfo>({
    getRemoteOptions: searchUser,
  });

  const handleInputValueChange = React.useCallback(
    (value: string) => {
      reload(value);
    },
    [reload]
  );

  const renderLabel = React.useCallback(
    (item: RemoteUserInfo) => item.login,
    []
  );

  return (
    <CommonSearch
      placeholder='Enter a GitHub ID'
      handleInputValueChange={handleInputValueChange}
      loading={loading}
      error={error}
      items={items}
      getAvatarName={renderLabel}
      renderLabel={renderLabel}
      handleSelectItem={handleSelectItem}
    />
  );
}

function RepoSearch(props: {
  handleSelectItem?: (item: RemoteRepoInfo) => void;
}) {
  const { handleSelectItem } = props;

  const { items, reload, error, loading } = useRemoteList<RemoteRepoInfo>({
    getRemoteOptions: searchRepo,
  });

  const handleInputValueChange = React.useCallback(
    (value: string) => {
      reload(value);
    },
    [reload]
  );

  const renderLabel = React.useCallback(
    (item: RemoteRepoInfo) => item.fullName,
    []
  );

  return (
    <CommonSearch
      placeholder='Enter a GitHub Repo Name'
      handleInputValueChange={handleInputValueChange}
      loading={loading}
      error={error}
      items={items}
      getAvatarName={renderLabel}
      renderLabel={renderLabel}
      handleSelectItem={handleSelectItem}
    />
  );
}

function OrgSearch(
  props: { handleSelectItem?: (item: RemoteOrgInfo) => void } = {}
) {
  const { handleSelectItem } = props;

  const { items, reload, error, loading } = useRemoteList<RemoteOrgInfo>({
    getRemoteOptions: searchOrg,
  });

  const handleInputValueChange = React.useCallback(
    (value: string) => {
      reload(value);
    },
    [reload]
  );

  const renderLabel = React.useCallback(
    (item: RemoteOrgInfo) => item.login,
    []
  );

  return (
    <CommonSearch
      placeholder='Enter a GitHub Organization Name'
      handleInputValueChange={handleInputValueChange}
      loading={loading}
      error={error}
      items={items}
      getAvatarName={renderLabel}
      renderLabel={renderLabel}
      handleSelectItem={handleSelectItem}
    />
  );
}
