import type { NextApiRequest, NextApiResponse } from 'next'
import type { ReposData } from 'types/Github'

const query = `{
  viewer {
    pinnedItems(first: 6) {
      nodes {
        ... on Repository {
          id
          url
          name
          description
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          owner {
            login
          }
        }
      }
    }
  }
}`

/* eslint-disable import/no-anonymous-default-export */
export default async (_: NextApiRequest, res: NextApiResponse<ReposData>): Promise<void> => {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  }).then((r) => r.json())

  return res.status(200).json({ repos: response.data })
}
