import { getEmbededCount } from '@/lib/actions'
import CleanData from './CleanData'
import DataEmbedder from './data-embeder'

const CurrentData = async () => {
  const count = await getEmbededCount()

  return (
    <div className="max-w-2xl px-4 mx-auto mt-4">
      <div className="p-8 border rounded-lg bg-background">
        <div className="flex flex-col items-center mt-4">
          <p className="mr-2 text-sm font-bold text-gray-600 ">
            There are {count} rows in your database
          </p>
          <DataEmbedder />
          {count && count > 0 ? <CleanData /> : null}
        </div>
      </div>
    </div>
  )
}

export default CurrentData
