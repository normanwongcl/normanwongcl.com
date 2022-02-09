import useRepos from 'hooks/useRepos'
import Repo from '../github-icons/repo.svg'
import Circle from '../github-icons/circle.svg'
import Stars from '../github-icons/stars.svg'
import Forks from '../github-icons/forks.svg'

const LoadingRepo: React.FC = () => (
  <li className="mb-4 w-full animate-pulse md:w-1/2 md:px-2">
    <div className="flex flex-col rounded-md border border-solid border-gray-200 p-4 dark:border-gray-800">
      <div
        className="mb-2 flex flex-row items-center"
        style={{ paddingTop: '2px', paddingBottom: '2px' }}
      >
        <Repo width={16} height={16} aria-hidden className="mr-2 text-gray-400" />
        <div className="h-2 w-1/4 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mt-1 mb-5 h-2 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="flex flex-row items-center">
        <span className="mr-4 flex flex-row items-center text-gray-400">
          <div
            aria-hidden
            style={{ width: '12px', height: '12px' }}
            className="mr-1 rounded-full bg-gray-200 dark:bg-gray-800"
          />
          <div className="my-1 h-2 w-12 rounded bg-gray-200 dark:bg-gray-800" />
        </span>
        <span className="flex flex-row items-center text-gray-400">
          <Stars width={16} height={16} aria-hidden className="mr-1" />
          <div className="my-1 h-2 w-12 rounded bg-gray-200 dark:bg-gray-800" />
        </span>
        <span className="ml-4 flex flex-row items-center text-gray-400">
          <Forks width={16} height={16} aria-hidden className="mr-1" />
          <div className="my-1 h-2 w-12 rounded bg-gray-200 dark:bg-gray-800" />
        </span>
      </div>
    </div>
  </li>
)

const Repos: React.FC = () => {
  const { data, isLoading } = useRepos()

  return (
    <ol className="flex w-full flex-wrap" style={{ maxWidth: '900px' }}>
      {isLoading &&
        Array(4)
          .fill('loading')
          .map((_, i) => <LoadingRepo key={i} />)}
      {!isLoading &&
        data?.repos?.viewer?.pinnedItems?.nodes?.map((repo) => (
          <li key={repo.id} className="mb-4 w-full md:w-1/2 md:px-2">
            <div className="flex flex-col rounded-md border border-solid border-gray-200 p-4 dark:border-gray-800">
              <div className="mb-2 flex flex-row items-center">
                <Repo width={16} height={16} aria-hidden className="mr-2 text-gray-400" />
                <a
                  className="rounded px-1 text-sm font-medium text-blue-400 hover:underline focus:outline-none focus:ring-2"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={repo.url}
                >
                  {repo.owner.login === 'wbeuil' ? (
                    <span>{repo.name}</span>
                  ) : (
                    <>
                      <span className="font-normal">{repo.owner.login}</span>
                      <span>/{repo.name}</span>
                    </>
                  )}
                </a>
              </div>
              <p className="mb-4 text-xs text-gray-400">{repo.description}</p>
              <div className="flex flex-row items-center">
                <span className="mr-4 flex flex-row items-center text-xs text-gray-400">
                  <Circle
                    width={12}
                    height={12}
                    aria-hidden
                    className="mr-1"
                    style={{ color: repo.primaryLanguage.color }}
                  />
                  {repo.primaryLanguage.name}
                </span>
                {repo.stargazerCount > 0 && (
                  <span className="flex flex-row items-center text-xs text-gray-400">
                    <Stars width={16} height={16} aria-hidden className="mr-1" />
                    {repo.stargazerCount}
                  </span>
                )}
                {repo.forkCount > 0 && (
                  <span className="ml-4 flex flex-row items-center text-xs text-gray-400">
                    <Forks width={16} height={16} aria-hidden className="mr-1" />
                    {repo.forkCount}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
    </ol>
  )
}

export default Repos
