import { DEVICES_URL } from '@/constants/urls'
import { useApi } from '@/hooks/auth/useApi'
import { xmlToJson } from '@/lib/xmlParser'
import { useEffect, useState } from 'react'

function organizeDevicesByRegion(devices: any) {
	const regionMap: any = {}

	devices.forEach((device: any) => {
		// Extract the device name
		// const deviceName = device['d2p1:Name']

		// // Split the name to get the region
		// const parts = deviceName.split('_')
		// const region = parts[2]
		const region = device['d2p1:Description']

		// Check if the region already exists in the map
		if (!regionMap[region]) {
			regionMap[region] = []
		}

		// Add the device to the corresponding region array
		regionMap[region].push(device)
	})

	// Convert the map into an array of arrays
	const organizedDevices = Object.keys(regionMap).map((region) => ({
		region: region,
		devices: regionMap[region]
	}))

	return organizedDevices
}

export const useGetDevices = () => {
	const [devices, setDevices] = useState<any>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [marker, setMarker] = useState<string>('')
	const [filteredDevices, setFilteredDevices] = useState<any>([])
	const [filteredDevicesByRegion, setFilteredDevicesByRegion] = useState<any>([])

	const api = useApi()

	useEffect(() => {
		let isMounted = true
		setLoading(true)

		const controller = new AbortController()
		const signal = controller.signal
		const query = marker ? `&marker=${marker}` : ''
		const filter = "&filter=[Device].[Description] CONTAINS ANY ('Jylland', 'Sjaelland', 'Fyn')"

		const fetchContents = async () => {
			try {
				const { data } = await api.get(DEVICES_URL + '?sort=[Device].[Id] ASC' + filter + query, {
					signal
				})
				const xmlDoc = xmlToJson(data)
				if (isMounted) {
					setDevices(xmlDoc)
					setLoading(false)
					setFilteredDevices((prev: any) => prev.concat(xmlDoc?.PagedDeviceList?.Items['d2p1:Device']))
				}
			} catch (error) {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		fetchContents()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [marker])

	useEffect(() => {
		setFilteredDevicesByRegion(organizeDevicesByRegion(filteredDevices))
	}, [filteredDevices])

	return { devices, loading, marker, setMarker, filteredDevices, filteredDevicesByRegion }
}
