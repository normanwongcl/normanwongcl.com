export type ReposData = {
  repos: {
    viewer: {
      pinnedItems: {
        nodes: Array<{
          id: string
          url: string
          name: string
          description: string
          stargazerCount: number
          forkCount: number
          primaryLanguage: {
            name: string
            color: string
          }
          owner: {
            login: string
          }
        }>
      }
    }
  }
}

export type GraphData = {
  graph: {
    viewer: {
      contributionsCollection: {
        contributionCalendar: {
          months: Array<{
            name: string
            totalWeeks: number
          }>
          weeks: Array<{
            contributionDays: Array<{
              contributionLevel: string
              contributionCount: number
              date: string
              weekday: number
            }>
          }>
        }
      }
    }
  }
}
