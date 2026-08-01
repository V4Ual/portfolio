import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/learn-nextjs-basics`,
      lastModified: new Date('2024-02-01'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog/typescript-with-react`,
      lastModified: new Date('2024-02-05'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
