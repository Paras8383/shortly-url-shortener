import { useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Clipboard, Link2, TriangleAlert } from 'lucide-react';
import { shortenUrl } from '@/lib/shorten-url';

type ShortenerState = 'idle' | 'loading' | 'success' | 'error';

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [state, setState] = useState<ShortenerState>('idle');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setUrl('');
    setShortUrl('');
    setError('');
    setCopied(false);
    setState('idle');
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError('Paste a URL to get started.');
      setState('error');
      inputRef.current?.focus();
      return;
    }
    if (!isValidUrl(trimmedUrl)) {
      setError('That does not look like a valid URL. Include https:// or http://.');
      setState('error');
      inputRef.current?.focus();
      return;
    }

    setState('loading');
    setError('');
    setCopied(false);

    try {
      const result = await shortenUrl(trimmedUrl);
      setShortUrl(result);
      setState('success');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong. Please try again.');
      setState('error');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError('Copy is unavailable in this browser. Select the link and copy it manually.');
    }
  };

  return (
    <main className="shortly-page">
      <nav className="shortly-nav" aria-label="Main navigation">
        <a className="wordmark" href="/" data-testid="link-home">
          <span className="wordmark-mark" aria-hidden="true"><Link2 size={16} strokeWidth={2.5} /></span>
          <span>Shortly</span>
        </a>
        <div className="nav-right">
          <a className="nav-link" href="#how-it-works" data-testid="link-how-it-works">How it works</a>
          <a className="nav-cta" href="#shorten" data-testid="link-shorten">Shorten a link <ArrowUpRight size={14} /></a>
        </div>
      </nav>

      <section className="hero" id="shorten" aria-labelledby="hero-title">
        <div className="orbit" aria-hidden="true"><span className="orbit-label">less is more</span></div>
        <div className="scribble" aria-hidden="true" />
        <div className="hero-kicker"><span aria-hidden="true" /> A little less link</div>
        <h1 className="hero-title" id="hero-title">Shorten<br /><em>your links.</em></h1>
        <p className="hero-subtitle">Turn the long, messy URL into something you’ll actually want to share. One clean link, no distractions.</p>

        <div className="shortener-wrap">
          {state === 'success' ? (
            <div className="result-card" data-testid="status-success" role="status">
              <div>
                <span className="result-label">Your short link is ready</span>
                <span className="result-url" data-testid="text-short-url">{shortUrl}</span>
              </div>
              <button className={`copy-button${copied ? ' copied' : ''}`} type="button" onClick={handleCopy} data-testid="button-copy">
                {copied ? <Check size={15} /> : <Clipboard size={15} />}
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
          ) : (
            <form className="shortener-form" onSubmit={handleSubmit} noValidate>
              <label className="sr-only" htmlFor="long-url">Long URL</label>
              <input
                ref={inputRef}
                className="url-input"
                id="long-url"
                type="url"
                value={url}
                onChange={(event) => {
                  setUrl(event.target.value);
                  if (state === 'error') {
                    setState('idle');
                    setError('');
                  }
                }}
                placeholder="Paste your long URL here..."
                autoComplete="url"
                aria-invalid={state === 'error'}
                aria-describedby={state === 'error' ? 'url-error' : undefined}
                data-testid="input-long-url"
              />
              <button className="shorten-button" type="submit" disabled={state === 'loading'} data-testid="button-shorten">
                {state === 'loading' ? <><span className="spinner" aria-hidden="true" /> Shortening</> : <>Shorten it <ArrowUpRight size={15} /></>}
              </button>
            </form>
          )}
          {state === 'error' && (
            <p className="error-message" id="url-error" role="alert" data-testid="status-error">
              <TriangleAlert size={14} aria-hidden="true" /> {error}
            </p>
          )}
          {state === 'success' && (
            <button className="another-button" type="button" onClick={resetForm} data-testid="button-shorten-another">
              Shorten another URL
            </button>
          )}
        </div>
        <p className="hero-note"><strong>No account.</strong> No clutter. Just a shorter link.</p>
      </section>

      <section className="how-section" id="how-it-works" aria-labelledby="how-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The short version</p>
            <h2 className="section-title" id="how-title">A long link in.<br />A better link out.</h2>
          </div>
          <p className="section-copy">Shortly does one thing, and keeps it pleasantly simple. Here’s the whole story.</p>
        </div>
        <div className="steps">
          <article className="step" data-testid="card-step-1">
            <div className="step-number">01 / PASTE</div>
            <h3>Bring the messy bit</h3>
            <p>Drop any long URL into the box. The kind with tracking codes and too many slashes.</p>
          </article>
          <article className="step" data-testid="card-step-2">
            <div className="step-number">02 / CLICK</div>
            <h3>Let it get small</h3>
            <p>One tap is all it takes. Shortly makes a neat, shareable link in a moment.</p>
          </article>
          <article className="step" data-testid="card-step-3">
            <div className="step-number">03 / SHARE</div>
            <h3>Send it on its way</h3>
            <p>Copy your new link and get back to the good stuff. No account, no detour.</p>
          </article>
        </div>
      </section>

      <footer className="shortly-footer">
        <span className="footer-built">Built with AWS <Link2 size={12} aria-hidden="true" /></span>
        <span className="footer-mono">short links, clear mind</span>
      </footer>
    </main>
  );
}