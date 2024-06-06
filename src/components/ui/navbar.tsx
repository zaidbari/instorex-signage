import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useStorage } from '@/hooks/auth/useStorage'
import { MenuIcon, UserRound } from 'lucide-react'

export const Navbar = () => {
	const { logout } = useStorage()

	return (
		<nav className="px-10 grid w-full grid-cols-2 gap-10 my-5">
			<a className="text-2xl font-bold" href="/dashboard">
				InstoreX
			</a>
			<div className="space-x-4 text-right">
				<DropdownMenu>
					<DropdownMenuTrigger className="ring-0 outline-none focus:outline-none focus:right-0">
						<div className="flex gap-3">
							<UserRound />
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<button onClick={logout}>Logout</button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<DropdownMenu>
					<DropdownMenuTrigger className="ring-0 outline-none focus:outline-none focus:right-0">
						<div className="flex gap-3">
							<MenuIcon />
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<a href="/dashboard">Dashboard</a>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<a href="/contents">Handter Content</a>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<a href="/playlists">Live Content</a>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</nav>
	)
}
