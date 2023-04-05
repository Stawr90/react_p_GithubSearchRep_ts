import React, {useState, useEffect} from 'react';
import { useSearchUsersQuery, useLazyGetUserReposQuery } from '../store/github/github.api';
import { useDebounce } from '../hooks/debounse';
import { RepoCard } from '../components/RepoCard';

export function HomePage () {
    const [search, setSearch] = useState('');
    const [dropdown, setDropdown] = useState(false)
    const debounced = useDebounce(search)
    const {isLoading, isError, data} = useSearchUsersQuery(debounced, {
        skip: debounced.length < 3, //не делать запрос, пока выполняется условие
        refetchOnFocus: true //отправит новый запрос, если снова открыли эту страницу
    });

    const [fetchRepos, {isLoading: areReposLoading, data: repos}] = useLazyGetUserReposQuery()

    useEffect(() => {
        setDropdown(debounced.length > 2 && data?.length! > 0)
    }, [debounced, data])

    const clickHandler = (username: string) => {
        fetchRepos(username)
        setDropdown(false)
    }

    return (
        <div className='flex justify-center pt-10 mx-auto h-screen w-screen'>
            {isError && <p className="text-center text-red-600">Something went wrong...</p>}

            <div className='relative w-[560px]'>
                <input 
                    type="text"
                    className="border py-2 px-4 w-full h-[42px] mb-2"
                    placeholder='Search username...'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                {dropdown &&<ul className='absolute top-[42px] left-0 right-0 max-h-[200px] overflow-y-scroll shadow-md bg-white'>
                    {isLoading && <p className="text-center">Loading...</p>}
                    {data?.map(user => (
                        <li
                        key={user.id}
                        onClick={() => clickHandler(user.login)}
                        className="flex justify-between items-center py-2 px-4 bg-gray-200 hover:bg-gray-500 hover:text-white transiton-colors cursor-pointer">
                            Github login: {user.login}
                            <img src={user.avatar_url} className="max-w-[100px] max-h-[100px]"></img>
                        </li>
                    ))}
                </ul>}

                <div className="container">
                    {areReposLoading && <p className="text-center">Repos are Loading...</p>}
                    { repos?.map(repo => <RepoCard repo={repo} key={repo.id}/>)}
                </div>
            </div>

        </div>
    )
}