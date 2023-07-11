import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { FileUploader } from '@/components/file-uploader'

export default function IndexPage() {
  const id = nanoid()

  return (
    <>
      {/* <FileUploader/> */}
      <Chat id={id} />
    </>
  )
}
