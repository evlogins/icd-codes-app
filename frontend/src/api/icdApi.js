/**
 * icdApi.js - Direct browser calls to NLM Clinical Tables API
 * No backend needed - works as a pure static site on Cloudflare Pages
 */

const NLM_BASE = 'https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search';
const cache = new Map();

const CONTEXT_NOTES = {
  billing: {
    label: 'Billing & Reimbursement',
    note: 'Used for insurance claims, CMS reimbursement, and payer adjudication.',
    tip: 'Ensure specificity - payers often reject unspecified codes. Prefer codes with 5+ characters.'
  },
  clinical: {
    label: 'Clinical / Patient Care',
    note: 'Used for documenting patient diagnoses, care coordination, and EHR records.',
    tip: 'Combine with SNOMED-CT for interoperability in clinical decision support systems.'
  },
  research: {
    label: 'Scientific Research',
    note: 'Used for epidemiological studies, cohort definitions, and outcomes research.',
    tip: 'Consider ICD-11 for new studies - WHO transitioned officially in 2022.'
  },
  public_health: {
    label: 'Public Health & Surveillance',
    note: 'Used in mortality statistics, disease registries, and outbreak monitoring.',
    tip: 'CDC uses ICD codes for cause-of-death coding and MMWR disease reporting.'
  }
};

export async function searchCodes(query, { context = 'clinical', limit = 25 } = {}) {
  const key = 'search:' + query + ':' + limit;
  if (cache.has(key)) {
    return { ...cache.get(key), context: CONTEXT_NOTES[context] || CONTEXT_NOTES.clinical, fromCache: true };
  }
  const url = new URL(NLM_BASE);
  url.searchParams.set('sf', 'code,name');
  url.searchParams.set('terms', query);
  url.searchParams.set('maxList', limit);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('API error: ' + res.status);
  const [total, codes, , descriptions] = await res.json();
  const results = (codes || []).map((code, i) => ({
    code, description: descriptions ? descriptions[i] : '', version: 'ICD-10-CM'
  }));
  const payload = { query, total: total || results.length, results, version: 'ICD-10-CM' };
  cache.set(key, payload);
  return { ...payload, context: CONTEXT_NOTES[context] || CONTEXT_NOTES.clinical, fromCache: false };
}

export async function getCodeDetail(code, context = 'clinical') {
  const key = 'detail:' + code;
  if (cache.has(key)) {
    return { ...cache.get(key), context: CONTEXT_NOTES[context] || CONTEXT_NOTES.clinical, fromCache: true };
  }
  const url = new URL(NLM_BASE);
  url.searchParams.set('sf', 'code,name');
  url.searchParams.set('terms', code);
  url.searchParams.set('maxList', 10);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('API error: ' + res.status);
  const [, codes, , descriptions] = await res.json();
  const idx = (codes || []).findIndex(c => c.toUpperCase() === code.toUpperCase());
  if (idx === -1) throw new Error('Code not found: ' + code);
  const payload = {
    code: codes[idx],
    description: descriptions ? descriptions[idx] : '',
    version: 'ICD-10-CM',
    details: { category: codes[idx].substring(0, 3), isSpecific: codes[idx].length >= 5, isValid: true }
  };
  cache.set(key, payload);
  return { ...payload, context: CONTEXT_NOTES[context] || CONTEXT_NOTES.clinical, fromCache: false };
}
