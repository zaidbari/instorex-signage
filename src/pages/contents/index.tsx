import { ContentLoadingskeleton } from './components/loader'
import { RenderContent } from './components/renderContent'
import { UploadModal } from './components/uploadModal'
import { useGetContents } from './data/useGetContents'

export default function ContentsPage() {
	const { loading, contents } = useGetContents()

	return (
		<main>
			<UploadModal />
			{loading ? <ContentLoadingskeleton /> : <RenderContent contents={contents} />}
		</main>
	)
}
