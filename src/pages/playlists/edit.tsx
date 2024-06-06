import { Button } from '@/components/ui/button'
import { USER_PLAYLISTS_URL } from '@/constants/urls'
import { useApi } from '@/hooks/auth/useApi'
import { xmlToJson } from '@/lib/xmlParser'
import { PencilIcon, Trash2, Trash2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function PlaylistEditPage() {
	const { playlistId } = useParams<{ playlistId: string }>()

	const [contents, setContents] = useState<[]>([])
	const [presentations, setPresentations] = useState<[]>([])
	const [loading, setLoading] = useState<boolean>(true)

	const api = useApi()

	useEffect(() => {
		let isMounted = true
		setLoading(true)

		const controller = new AbortController()
		const signal = controller.signal

		const fetchContents = async () => {
			try {
				const { data } = await api.get(`${USER_PLAYLISTS_URL}/${playlistId}`, { signal })
				const xmlDoc = xmlToJson(data)

				if (isMounted) {
					setContents(xmlDoc.DynamicPlaylist.Content.DynamicPlaylistContent)
					setPresentations(xmlDoc.DynamicPlaylist.Presentations.PresentationInfo)
					console.log(xmlDoc.DynamicPlaylist)
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

	return (
		<div>
			<div className="mb-10 bg-gray-800/20 rounded-xl px-10 py-5">
				<h1 className="text-2xl font-bold">{playlistId}</h1>
			</div>
			<div className="grid md:grid-cols-2 grid-cols-1 gap-5">
				<div>
					{contents.map((content: any, index: number) => (
						<div className={'bg-gray-800/30 mb-3 rounded-lg p-3 items-center flex justify-between'} key={index}>
							<p>{content.FileName}</p>
							<div className="text-right">
								<Button variant={'secondary'} className="w-10 p-3">
									<Trash2Icon className="h-6 w-6 text-rose-500" />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
