import { Button } from '@/components/ui/button'
import { useGetDevices } from '@/hooks/data/useGetDevices'
import { useEffect, useRef, useState } from 'react'
import { PlaylistLoadingskeleton } from '../playlists/components/loader'
import { Checkbox } from '@/components/ui/checkbox'
import { TagDrawer } from './components/tagDrawer'
import { Trash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { BASE_URL } from '@/constants/urls'
import { useApi } from '@/hooks/auth/useApi'
import { toast } from '@/components/ui/use-toast'

function splitName(name: string) {
	const parts = name.split('_')
	return `${parts[1]} - ${parts[2]} ${parts[3] ?? ''}`
}

function extractContent(input: string): string | null {
	const match = input.match(/<([^>]+)>/)
	return match ? match[1] : null
}

function fixTags(tags: any) {
	if (!Array.isArray(tags)) {
		return [tags]
	} else {
		return tags.map((tag) => (typeof tag === 'object' && tag !== null ? tag : {}))
	}
}

export default function DevicesPage() {
	const { devices, marker, setMarker, filteredDevices, filteredDevicesByRegion, loading } = useGetDevices()
	const api = useApi()

	const [selectedDevices, setSelectedDevices] = useState<any>([])
	const [open, setOpen] = useState<boolean>(false)

	const divRef = useRef<HTMLDivElement>(null!)

	useEffect(() => {
		if (marker) {
			window.scrollTo({
				top: divRef.current.offsetTop,
				behavior: 'smooth'
			})
		}
	}, [marker, devices, filteredDevicesByRegion])

	useEffect(() => {
		console.log(selectedDevices)
	}, [selectedDevices])

	const handleTagDelete = async (tag: 'string', id: string) => {
		try {
			const formData = [tag]
			await api.delete(`${BASE_URL}/Devices/${id}/Tags/`, { data: formData })
			toast({ description: 'Tag deleted successfully' })
		} catch (error) {
			toast({
				description: 'Error Deleting tag, please try to refresh the page and try again.',
				variant: 'destructive'
			})
			console.log(error)
		}
	}
	return (
		<div className="relative">
			{open && <TagDrawer ids={selectedDevices} open={open} setOpen={setOpen} />}
			{selectedDevices.length > 0 && (
				<div className="fixed bottom-0 px-10 bg-slate-900 rounded-t-lg py-2 w-[calc(100%-5rem)]">
					<Button className="w-full" onClick={() => setOpen(true)}>
						Add tags
					</Button>
				</div>
			)}
			<div className="mb-10 grid grid-cols-2 bg-gray-800/20 rounded-xl px-10 py-5">
				<h1 className="text-2xl font-bold">Devices</h1>
			</div>
			{loading ? (
				<PlaylistLoadingskeleton />
			) : (
				<div className="mb-20">
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
									{content.devices.map((device: any, index: number) => (
										<div key={index}>
											<div className="flex items-center gap-3">
												<Checkbox
													id={device['d2p1:Id']}
													checked={selectedDevices.includes(device['d2p1:Id'])}
													onCheckedChange={(checked) => {
														return checked
															? setSelectedDevices([...selectedDevices, device['d2p1:Id']])
															: setSelectedDevices(selectedDevices.filter((id: any) => id !== device['d2p1:Id']))
													}}
												/>
												<label htmlFor={device['d2p1:Id']}>{splitName(device['d2p1:Name'])}</label>
											</div>
											<Collapsible>
												<CollapsibleTrigger className="text-sm text-gray-700 ml-8">Show tags?</CollapsibleTrigger>
												<CollapsibleContent className="ml-5">
													{fixTags(device['d2p1:Tags']['d4p1:KeyValueOfstringstring']).map((tag: any) => (
														<div key={tag['d4p1:Key']}>
															<div className="flex items-center">
																<Button
																	variant="ghost"
																	size={'sm'}
																	onClick={() => handleTagDelete(tag['d4p1:Key'], device['d2p1:Id'])}
																>
																	<Trash className="w-5 text-rose-500" />
																</Button>
																<Badge variant="secondary" className="text-normal">
																	<p>
																		{extractContent(tag['d4p1:Key'])}: {tag['d4p1:Value']}
																	</p>
																</Badge>
															</div>
														</div>
													))}
												</CollapsibleContent>
											</Collapsible>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
					{filteredDevices.length === 0 && <h1>No playlists found</h1>}

					{devices.PagedDeviceList.IsTruncated && (
						<div className="my-5 px-10">
							<Button onClick={() => setMarker(devices.PagedDeviceList.NextMarker)}>Load More</Button>
						</div>
					)}
				</div>
			)}
			<div ref={divRef} />
		</div>
	)
}
