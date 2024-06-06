import { USER_PLAYLISTS_URL } from '@/constants/urls'
import { useApi } from '@/hooks/auth/useApi'
import { xmlToJson } from '@/lib/xmlParser'
import { useEffect, useState } from 'react'

export const useGetPlaylists = () => {
	const [contents, setContents] = useState<any>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [filteredContents, setFilteredContents] = useState<any>([])

	const api = useApi()

	useEffect(() => {
		let isMounted = true
		setLoading(true)

		const controller = new AbortController()
		const signal = controller.signal

		const fetchContents = async () => {
			try {
				const { data } = await api.get(USER_PLAYLISTS_URL, { signal })
				const xmlDoc = xmlToJson(data)

				if (isMounted) {
					setContents(xmlDoc)
					setFilteredContents(xmlDoc?.PagedDynamicPlaylistList?.Items['d2p1:DynamicPlaylist'])
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

	return { contents, loading, filteredContents, setFilteredContents }
}
