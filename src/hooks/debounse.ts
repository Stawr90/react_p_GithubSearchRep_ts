import { useEffect, useState } from 'react';

export function useDebounce(value: string, delay = 300): string {
    const [debounsed, setDebounsed] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => setDebounsed(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])

    return debounsed
}