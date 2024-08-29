import { useGetPlaylists } from '@/hooks/data/useGetPlaylists'
import { useGetSingleContent } from '@/hooks/data/useGetSingleContent'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PlaylistLoadingskeleton } from '../playlists/components/loader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { xmlToJson } from '@/lib/xmlParser'
import { useApi } from '@/hooks/auth/useApi'
import { USER_PLAYLISTS_URL } from '@/constants/urls'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export const PlaylistCard = ({ content, setPlaylists, playlists }: any) => {
	const api = useApi()
	const [loading, setLoading] = useState(false)

	const handleCheckbox = async (checked: boolean) => {
		setLoading(true)
		if (checked) {
			try {
				const { data } = await api.get(`${USER_PLAYLISTS_URL}/${content['d2p1:Id']}`)
				const xmlDoc = xmlToJson(data)
				setPlaylists((prev: any) => [...prev, xmlDoc.DynamicPlaylist])
			} catch (error) {
				console.log(error)
			}
		} else {
			setPlaylists(playlists.filter((item: any) => item.Id !== content['d2p1:Id']))
		}
		setLoading(false)
	}
	return (
		<div className={'bg-gray-800/30 rounded-lg p-3 items-center grid grid-cols-2 relative'}>
			<p>{content['d2p1:Name']}</p>
			<div className="text-right">
				{loading ? (
					<Loader2 className="animate-spin text-right inline-block" />
				) : (
					<Checkbox
						checked={playlists.some((item: any) => item.Id === content['d2p1:Id'])}
						onCheckedChange={handleCheckbox}
					/>
				)}
			</div>
		</div>
	)
}

export default function ContentPlanningPage() {
	// get id from router params
	const { contentId } = useParams()
	const [playlists, setPlaylists] = useState<any[]>([])
	const api = useApi()
	const { toast } = useToast()

	const { content, loading: contentLoading } = useGetSingleContent(contentId as string)
	const { contents, loading, filteredContents, setFilteredContents, setMarker, marker } = useGetPlaylists()

	const handleSearch = (searchQuery: string) => {
		const data = contents?.PagedDynamicPlaylistList?.Items['d2p1:DynamicPlaylist']
		const filteredContents = data.filter((content: any) =>
			content['d2p1:Name'].toLowerCase().includes(searchQuery.toLowerCase())
		)
		setFilteredContents(filteredContents)
	}

	const divRef = useRef<HTMLDivElement>(null!)
	useEffect(() => {
		if (marker) {
			window.scrollTo({
				top: divRef.current.offsetTop,
				behavior: 'smooth'
			})
		}
	}, [marker, contents])

	// useEffect(() => {
	// 	console.log(playlists)
	// }, [playlists])

	const handleSave = async () => {
		let currentContent: any = []
		currentContent.push({
			ContentId: content.Id,
			FileName: content.FileName,
			DisplayDuration: 'PT0S',
			ValidityEndDate: '',
			ValidityStartDate: ''
		})

		playlists.forEach(async (playlist) => {
			if (playlist.Content && playlist.Content.DynamicPlaylistContent) {
				const c = playlist.Content.DynamicPlaylistContent
				if (Array.isArray(c)) {
					c.forEach((con: any) => {
						currentContent.push(con)
					})
				} else {
					currentContent.push(c)
				}
			}

			const formData = {
				Content: currentContent
			}

			console.log(formData)
			try {
				const { status, data } = await api.put(`${USER_PLAYLISTS_URL}${playlist.Id}`, formData)
				console.log(status, data)
			} catch (error) {
				console.log(error)
			}
		})
		toast({
			description: 'Playlist updated successfully'
		})
	}

	return loading || contentLoading ? (
		'loading '
	) : (
		<div>
			<div>
				<div className="mb-10 grid grid-cols-2 bg-gray-800/20 rounded-xl px-10 py-5">
					<h1 className="text-2xl font-bold">Planning</h1>
					<div className="text-right flex flex-row gap-2">
						<Input placeholder="Søg efter spillelister" onChange={(e) => handleSearch(e.target.value)} />
					</div>
				</div>
				<div className="grid grid-cols-3 gap-5">
					<div>
						<img loading="lazy" src={content.ThumbPath} alt="placeholder" className="rounded-lg aspect-video w-full" />
						<div className="p-3">
							<Badge variant="secondary" className="font-bold">
								{content.MediaType}
							</Badge>
							<h2 className="text-md font-bold mt-4">Filename</h2>
							<p className="text-sm break-words">{content.FileName}</p>
							<Button onClick={handleSave}>Save</Button>
						</div>
					</div>
					<div className="col-span-2">
						{loading ? (
							<PlaylistLoadingskeleton />
						) : (
							<div className="mb-10">
								<div className="grid md:grid-cols-3 gap-5 grid-cols-1">
									{filteredContents.map((content: any, index: number) => (
										<PlaylistCard key={index} content={content} setPlaylists={setPlaylists} playlists={playlists} />
									))}
								</div>
								{filteredContents.length === 0 && <h1>No playlists found</h1>}
								{contents.PagedDynamicPlaylistList.IsTruncated && (
									<Button onClick={() => setMarker(contents.PagedDynamicPlaylistList.NextMarker)}>Load More</Button>
								)}
							</div>
						)}
						<div ref={divRef} />
					</div>
				</div>
			</div>
		</div>
	)
}
