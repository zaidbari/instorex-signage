import { USER_CONTENTS_URL } from '@/constants/urls'
import { useApi } from '@/hooks/auth/useApi'
import { useStorage } from '@/hooks/auth/useStorage'
import { xmlToJson } from '@/lib/xmlParser'
import { useEffect, useState } from 'react'

export const useGetContents = () => {
	const [contents, setContents] = useState<any>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const { getUsername } = useStorage()
	const api = useApi()

	useEffect(() => {
		let isMounted = true
		setLoading(true)

		const controller = new AbortController()
		const signal = controller.signal

		const fetchContents = async () => {
			const username = getUsername()
			try {
				const { data } = await api.get(USER_CONTENTS_URL + `${username}/`, { signal })
				const xmlDoc = xmlToJson(data)
				if (isMounted) {
					setContents(xmlDoc)
					setLoading(false)
				}
			} catch (error) {
				if (isMounted) {
					console.log(error)
					setLoading(false)
				}
			}
		}

		fetchContents()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [])

	return { contents, loading }
}
