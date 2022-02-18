import Link from '@/components/Link'
import BlogPost from '@/components/BlogPost'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { PostFrontMatter } from 'types/PostFrontMatter'
import NewsletterForm from '@/components/NewsletterForm'
import Repos from '@/components/github/Repos'
import Graph from '@/components/github/Graph'

const MAX_DISPLAY = 5

export const getStaticProps: GetStaticProps<{ posts: PostFrontMatter[] }> = async () => {
  const posts = await getAllFilesFrontMatter('blog')

  return { props: { posts } }
}

export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="space-y-2 pt-12 pb-8 md:space-y-5">
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
          <span className="block"> Hi there 👋, </span>
          <span className="block bg-gradient-to-r from-green-700 to-green-500 bg-clip-text pb-3 text-transparent dark:from-green-200 dark:to-green-400 sm:pb-5">
            I'm Norman Wong Chiew Look
          </span>
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          {siteMetadata.description}
        </p>
      </div>
      <div className="space-y-2 pt-8 pb-8 md:space-y-5">
        <h2 className="mt-2 mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          My contribution to the community
        </h2>
        <Repos />
        <Graph />
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-12 pb-8 md:space-y-5">
          <h2 className="mt-2 mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Latest
          </h2>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            My most recent blog posts
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug } = frontMatter
            return (
              <li key={slug} className="py-12">
                <BlogPost key={slug} {...frontMatter} />
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
    </>
  )
}
