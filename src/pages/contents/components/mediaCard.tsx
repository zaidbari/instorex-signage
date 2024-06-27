import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { BASE_URL } from '@/constants/urls'
import { useApi } from '@/hooks/auth/useApi'
import { cn } from '@/lib/utils'
import { Calendar, Eye, PlusIcon, Trash } from 'lucide-react'
import { useState } from 'react'

export const MediaCard = ({ content }: any) => {
	const api = useApi()
	const [display, setDisplay] = useState<boolean>(true)
	const { toast } = useToast()
	const handleDelete = async () => {
		const id = content['d2p1:Id']
		try {
			await api.delete(`${BASE_URL}/Content/${id}/`)
			toast({
				description: 'Content deleted successfully'
			})
			setDisplay(false)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className={cn('bg-gray-800/30 rounded-lg relative', display ? 'block' : 'hidden')}>
			<img
				loading="lazy"
				src={content['d2p1:ThumbPath']}
				alt="placeholder"
				className="rounded-t-lg aspect-video w-full"
			/>
			<div className="absolute top-0 right-0">
				<DropdownMenu>
					<DropdownMenuTrigger className="ring-0 outline-none focus:ring-0 focus:outline-none">
						<PlusIcon className="bg-orange-500 rounded-tr-lg p-1 h-8 w-8" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem className="cursor-pointer">
							<Calendar className="mr-3 h-4 w-4" /> Planlæg
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer">
							<Calendar className="mr-3 h-4 w-4" /> Ryd plan
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer">
							<a
								href={content['d2p1:PhysicalPath']}
								target="_blank"
								className="flex items-center"
								rel="noopener noreferrer"
							>
								<Eye className="mr-3 h-4 w-4" /> Preview
							</a>
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
							<Trash className="mr-3 h-4 w-4" /> Slet
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="p-3">
				<Badge variant="secondary" className="font-bold">
					{content['d2p1:MediaType']}
				</Badge>
				<h2 className="text-md font-bold mt-4">Filename</h2>
				<p className="text-sm break-words">{content['d2p1:FileName']}</p>
			</div>
		</div>
	)
}
