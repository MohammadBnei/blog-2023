import type { SiteConfig } from '$lib/types/site'

export const site: SiteConfig = {
  protocol: import.meta.env.URARA_SITE_PROTOCOL ?? import.meta.env.DEV ? 'http://' : 'https://',
  domain: import.meta.env.URARA_SITE_DOMAIN ?? 'bnei.dev',
  title: 'Blog',
  subtitle: 'Passionate developper - Teacher',
  lang: 'en-US',
  description: `Welcome to my tech blog where I discuss technical aspects related to software development. I am a passionate developer with a deep interest in nodejs, golang, svelte, microservices, and kubernetes technologies. 

  Through my blog, I share my experiences and provide insights on topics related to these technologies, such as best practices, tips, tutorials, and other developer-focused resources. My goal is to share technical knowledge and help other developers learn and grow their skills.
  
  In this blog, I explore the latest developments in these technologies, including updates on emerging trends, new features, and tools. Whether you are a beginner or an experienced developer, I cover topics that will help you improve your code quality, performance, and efficiency.
  
  Join me in my tech exploration journey to discover the exciting world of nodejs, golang, svelte, microservices, and kubernetes. Subscribe to my blog and stay up-to-date with the latest trends in the industry and learn how to become a better developer.`,
  author: {
    avatar: '/assets/maskable@512.png',
    name: 'Mohammad-Amine BANAEI',
    status: '🧑🏽‍💻',
    bio: 'From Paris with love'
  },
  themeColor: '#3D4451'
}
