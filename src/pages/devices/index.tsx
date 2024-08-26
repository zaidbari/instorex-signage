import { Button } from '@/components/ui/button'
import { useGetDevices } from '@/hooks/data/useGetDevices'
import { useEffect, useRef, useState } from 'react'
import { PlaylistLoadingskeleton } from '../playlists/components/loader'
import { Checkbox } from '@/components/ui/checkbox'

const splitName = (name: string) => {
	const parts = name.split('_')
	return `${parts[1]} - ${parts[2]} ${parts[3] ?? ''}`
}

export default function DevicesPage() {
	const { devices, marker, setMarker, filteredDevices, filteredDevicesByRegion, loading } = useGetDevices()
	const [selectedDevices, setSelectedDevices] = useState<any>([])

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

	useEffect(() => {
		console.log(selectedDevices)
	}, [selectedDevices])

	return (
		<div>
			<div className="mb-10 grid grid-cols-2 bg-gray-800/20 rounded-xl px-10 py-5">
				<h1 className="text-2xl font-bold">Devices</h1>
			</div>
			{loading ? (
				<PlaylistLoadingskeleton />
			) : (
				<div className="mb-5">
					<div>
						{filteredDevicesByRegion.map((content: any, index: number) => (
							<div key={index}>
								<div className="bg-gray-800/20 my-5 rounded-xl px-10 py-5">
									<div className="flex items-center gap-3">
										<Checkbox
											onCheckedChange={(checked) => {
												return checked
													? setSelectedDevices(content.devices.map((device: any) => device['d2p1:Id']))
													: setSelectedDevices([])
											}}
										/>{' '}
										{content.region}
									</div>
								</div>
								<div className="grid md:grid-cols-3 gap-5 grid-cols-1 px-10">
									{content.devices.map((content: any, index: number) => (
										<div key={index} className="flex items-center gap-3">
											<Checkbox
												id={content['d2p1:Id']}
												checked={selectedDevices.includes(content['d2p1:Id'])}
												onCheckedChange={(checked) => {
													return checked
														? setSelectedDevices([...selectedDevices, content['d2p1:Id']])
														: setSelectedDevices(selectedDevices.filter((id: any) => id !== content['d2p1:Id']))
												}}
											/>
											<label htmlFor={content['d2p1:Id']}>{splitName(content['d2p1:Name'])}</label>
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
