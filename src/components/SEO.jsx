import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'AM Interior'
const SITE_URL = 'https://aex1a.github.io/AM-Interior'
const DEFAULT_IMAGE = `${SITE_URL}/assets/images/featured1.png`

/**
 * Drop this at the top of any page to control that page's <title>,
 * meta description, canonical URL, and Open Graph / Twitter tags.
 *
 * <SEO
 *   title="Modern Minimalist Residence | AM Interior"
 *   description="..."
 *   path="/gallery"
 * />
 */
export default function SEO({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  jsonLd,
  noindex = false,
}) {
  const url = `${SITE_URL}${path === '/' ? '' : path}`
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}

export { SITE_NAME, SITE_URL, DEFAULT_IMAGE }
