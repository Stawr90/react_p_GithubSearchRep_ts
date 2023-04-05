import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IRepo, IUser, ServerResponse } from '../../models/models';

export const githubApi = createApi({
    reducerPath: 'github/api', // путь, где будет лежать api
    baseQuery: fetchBaseQuery({ //базовый url, откуда берем данные
        baseUrl: 'https://api.github.com/'
    }),
    refetchOnFocus: true, //при фокусе сработает новый запрос на сервер
    endpoints: build => ({ //данные, которые хотим получить для работы
        searchUsers: build.query<IUser[], string>({ //получаем пользователей
            query: (search: string) => ({
                url: 'search/users',
                params: { //параметры запроса (дописываются в url запроса)
                    q: search,
                    per_page: 10
                }
            }),
            transformResponse: (response: ServerResponse) => response.items //трансформация ответа от сервера
        }),
        getUserRepos: build.query<IRepo[], string>({ //получаем репозитории
            query: (username: string) => ({
                url: `users/${username}/repos`
            })
        }),
        createUser: build.mutation<any, void>({ //изменить добавить пользователя
            query: () => ''
        })
    })
})

export const { useSearchUsersQuery, useLazyGetUserReposQuery } = githubApi