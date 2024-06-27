import { Input } from '@/components/ui/input'

import { PlaylistCard } from './components/playlistCard'
import { useGetPlaylists } from '../../data/useGetPlaylists'
import { PlaylistLoadingskeleton } from './components/loader'
import { Button } from '@/components/ui/button'
import { useEffect, useRef } from 'react'

export default function PlaylistsPage() {
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

	return (
		<div>
			<div className="mb-10 grid grid-cols-2 bg-gray-800/20 rounded-xl px-10 py-5">
				<h1 className="text-2xl font-bold">Spillelister</h1>
				<div className="text-right flex flex-row gap-2">
					<Input placeholder="Søg efter spillelister" onChange={(e) => handleSearch(e.target.value)} />
				</div>
			</div>
			{loading ? (
				<PlaylistLoadingskeleton />
			) : (
				<div className="mb-10">
					<div className="grid md:grid-cols-3 gap-5 grid-cols-1">
						{filteredContents.map((content: any, index: number) => (
							<PlaylistCard key={index} content={content} />
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
	)
}
