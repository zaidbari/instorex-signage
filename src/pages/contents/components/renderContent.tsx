import { FolderCard } from './folderCard'
import { MediaCard } from './mediaCard'

export const RenderContent = ({ contents }: any) => {
	return (
		<div className="grid md:grid-cols-3 lg:grid-cols-5 grid-cols-1 gap-10">
			{contents &&
				contents.PagedLibraryItemList.Items['d2p1:LibraryItem']
					.sort((a: any, b: any) => ('d2p1:HasSubFolders' in b ? 1 : 0) - ('d2p1:HasSubFolders' in a ? 1 : 0))
					.map((content: any) =>
						'd2p1:HasSubFolders' in content ? (
							<FolderCard key={content['d2p1:Id']} content={content} />
						) : (
							<MediaCard key={content['d2p1:Id']} content={content} />
						)
					)}
		</div>
	)
}
