import { Head } from 'vite-react-ssg';

const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://icd-codes-git.pages.dev').replace(/\/$/, '');
const SITE_NAME = 'ICD Code Explorer';
const DEFAULT_DESCRIPTION = 'Search ICD-10-CM diagnosis codes. Descriptions, billability, and category detail for every code in the FY 2026 code set.';

/**
 * <SEO> emits title, meta, Open Graph, Twitter Card, canonical, and
 * (for code pages) schema.org MedicalCode JSON-LD. Place once per
 * page. Later <SEO> children override earlier ones.
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  noindex = false,
  code = null,
  codeDescription = null,
}) {
  const canonical = SITE_URL + path;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  const jsonLd = code
    ? {
        '@context': 'https://schema.org',
        '@type': 'MedicalCode',
        codeValue: code,
        codingSystem: 'ICD-10-CM',
        name: codeDescription || code,
        description: codeDescription || undefined,
        url: canonical,
      }
    : null;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,follow" />}

      <meta property="og:type" content={code ? 'article' : 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Head>
  );
}
