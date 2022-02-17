import Link from 'next/link'
import useSWR from 'swr'

import fetcher from '@/lib/utils/fetcher'
import formatDate from '@/lib/utils/formatDate'
import Tag from '@/components/Tag'
import { PostFrontMatter } from 'types/PostFrontMatter'
import { Views } from 'types/Views'

const BlogPost = (post: PostFrontMatter) => {
  const { slug, date, title, summary, tags } = post
  const { data } = useSWR<Views>(`/api/views/${slug}`, fetcher)
  const views = data?.total

  return (
    <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
      <dl>
        <dt className="sr-only">Published on</dt>
        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
          <time dateTime={date}>{formatDate(date)}</time>
        </dd>
      </dl>
      <div className="space-y-3 xl:col-span-3">
        <div>
          <div className="flex flex-col justify-between md:flex-row">
            <h3 className="text-2xl font-bold leading-8 tracking-tight">
              <Link href={`/blog/${slug}`} passHref>
                <h1 className="text-gray-900 dark:text-gray-100"> {title}</h1>
              </Link>
            </h3>
            <p className="mb-4 w-32 text-left text-gray-500 md:mb-0 md:text-right">
              {`${views ? new Number(views).toLocaleString() : '–––'} views`}
            </p>
          </div>

          <div className="flex flex-wrap">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        </div>
        <div className="prose max-w-none text-gray-500 dark:text-gray-400">{summary}</div>
      </div>
    </article>
  )
}

export default BlogPost
