import type { PostConfig } from '$lib/types/post'

export const post: PostConfig = {
  comment: {
    use: ['giscus'],
    giscus: {
      repo: 'mohammadbnei/blog-2023',
      repoID: 'R_kgDOJoATxg',
      categoryID: 'DIC_kwDOJoATxs4CW0Bo',
      reactionsEnabled: true,
      // input-position: 'bottom',
      theme: 'preferred_color_scheme',
      lang: 'en',
      loading: 'lazy'
    }
  }
}
