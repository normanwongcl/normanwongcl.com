import { GraphData } from 'types/Github'

import useSWR from 'swr'
import fetcher from 'lib/utils/fetcher'

type UseGraph = {
  data?: GraphData
  isLoading: boolean
  isError: Error
}

const useGraph = (): UseGraph => {
  const { data, error } = useSWR<GraphData>('/api/github/graph', fetcher)

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}

export default useGraph
