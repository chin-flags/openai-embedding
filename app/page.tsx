import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import CurrentData from '@/components/CurrentData'
import { getEmbededCount } from '@/lib/actions'

export const revalidate = 0

export default async function IndexPage() {
  const count = await getEmbededCount()
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <CurrentData />
      {count && count > 0 ? <Chat /> : null}
    </>
  )
}
