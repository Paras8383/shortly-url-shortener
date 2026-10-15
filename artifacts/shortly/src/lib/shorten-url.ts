export interface ShortenUrlResponse {
  shortUrl: string;
}

function createMockShortUrl(url: string): string {
  let hash = 0;
  for (let index = 0; index < url.length; index += 1) {
    hash = (hash << 5) - hash + url.charCodeAt(index);
    hash |= 0;
  }

  const token = Math.abs(hash).toString(36).slice(0, 6).padStart(5, '0');
  return `https://sho.rt/${token}`;
}

export async function shortenUrl(url: string): Promise<string> {
  const apiUrl = import.meta.env.VITE_API_URL?.trim();

  if (!apiUrl) {
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    return createMockShortUrl(url);
  }

  const response = await fetch(`${apiUrl.replace(/\/$/, '')}/shorten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error('The shortening service is unavailable right now.');
  }

  const data = (await response.json()) as Partial<ShortenUrlResponse>;
  if (!data.shortUrl) {
    throw new Error('The shortening service returned an unexpected response.');
  }

  return data.shortUrl;
}
