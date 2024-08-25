import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Calendar, Eye, PlusIcon, Trash } from 'lucide-react'
import { memo } from 'react'

const MenuItem = ({ setOpen, content, _handleDelete }: any) => {
	return (
		<div className="absolute top-0 right-0">
			<DropdownMenu>
				<DropdownMenuTrigger className="ring-0 outline-none focus:ring-0 focus:outline-none">
					<PlusIcon className="bg-orange-500 rounded-tr-lg p-1 h-8 w-8" />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem className="cursor-pointer">
						<Calendar className="mr-3 h-4 w-4" /> Planlæg
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
						<Calendar className="mr-3 h-4 w-4" /> Tags
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
					<DropdownMenuItem className="cursor-pointer" onClick={_handleDelete}>
						<Trash className="mr-3 h-4 w-4" /> Slet
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
export const Menu = memo(MenuItem)
