/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://kineshlohar.vercel.app/',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  additionalPaths: async (config) => {
    return [
      {
        loc: '/projects',
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/educations-certifications',
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      },
    ]
  },
};