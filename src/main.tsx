import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

/* --------------------------------- Helpers -------------------------------- */
import PrivateRoutes from '@/lib/privateRoute'

/* ------------------------------ Ui Components ----------------------------- */
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/toaster'

/* ---------------------------------- Pages --------------------------------- */
import LoginPage from '@/pages/login'
import DashboardPage from '@/pages/dashboard'
import ContentsPage from '@/pages/contents'
import PlaylistsPage from '@/pages/playlists'

/* ------------------------------ Global styles ----------------------------- */
import '@/styles/globals.css'
import PlaylistEditPage from './pages/playlists/edit'

const router = createBrowserRouter([
	{
		path: '/',
		element: <LoginPage />
	},
	{
		element: <PrivateRoutes />,
		children: [
			{
				path: '/dashboard',
				element: <DashboardPage />
			},
			{
				path: '/contents',
				element: <ContentsPage />
			},
			{
				path: '/playlists',
				element: <PlaylistsPage />
			},
			{
				path: '/playlists/:playlistId',
				element: <PlaylistEditPage />
			}
		]
	}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<RouterProvider router={router} />
			<Toaster />
		</ThemeProvider>
	</React.StrictMode>
)
