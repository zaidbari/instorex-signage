import { Button } from '@/components/ui/button'
import { useGetDevices } from '@/hooks/data/useGetDevices'
import { useEffect, useRef } from 'react'
import { PlaylistLoadingskeleton } from '../playlists/components/loader'

export default function DevicesPage() {
	const { devices, marker, setMarker, filteredDevices, filteredDevicesByRegion, loading } = useGetDevices()
	const divRef = useRef<HTMLDivElement>(null!)

	useEffect(() => {
		if (marker) {
			window.scrollTo({
				top: divRef.current.offsetTop,
				behavior: 'smooth'
			})
		}
		console.log(filteredDevicesByRegion)
	}, [marker, devices, filteredDevicesByRegion])

	return (
		<div>
			<div className="mb-10 grid grid-cols-2 bg-gray-800/20 rounded-xl px-10 py-5">
				<h1 className="text-2xl font-bold">Devices</h1>
			</div>
			{loading ? (
				<PlaylistLoadingskeleton />
			) : (
				<div className="mb-10">
					<div className="">
						{filteredDevicesByRegion.map((content: any, index: number) => (
							<div key={index}>
								<div className="bg-gray-800/20 rounded-xl px-10 py-5">{content.region}</div>
								<div className="grid md:grid-cols-3 gap-5 grid-cols-1">
									{content.devices.map((content: any, index: number) => (
										<div key={index}>
											{content['d2p1:Id']} - {content['d2p1:Name']}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
					{filteredDevices.length === 0 && <h1>No playlists found</h1>}
					{devices.PagedDeviceList.IsTruncated && (
						<Button onClick={() => setMarker(devices.PagedDeviceList.NextMarker)}>Load More</Button>
					)}
				</div>
			)}
			<div ref={divRef} />
		</div>
	)
}
