const NodeCache = require('node-cache');
const axios = require('axios');

// Cache results for 1 hour
const cache = new NodeCache({ stdTTL: 3600 });
const NLM_BASE_URL = 'https://clinicaltables.nlm.nih.gov/api';

const CONTEXT_NOTES = {
  billing: {
    label: 'Billing & Reimbursement',
    note: 'Used for insurance claims, CMS reimbursement, and payer adjudication.',
    tip: 'Ensure specificity - payers often reject unspecified codes (e.g. prefer Z87.891 over Z87.8).'
  },
  clinical: {
    label: 'Clinical / Patient Care',
    note: 'Used for documenting patient diagnoses, care coordination, and EHR records.',
    tip: 'Combine with SNOMED-CT for interoperability in clinical decision support systems.'
  },
  research: {
    label: 'Scientific Research',
    note: 'Used for epidemiological studies, cohort definitions, and outcomes research.',
    tip: 'Consider using ICD-11 for new studies - WHO transitioned officially in 2022.'
  },
  public_health: {
    label: 'Public Health & Surveillance',
    note: 'Used in mortality statistics, disease registries, and outbreak monitoring.',
    tip: 'CDC uses ICD codes for cause-of-death coding and MMWR reporting.'
  }
};

/**
 * GET /api/icd/search?q=diabetes&version=10&context=billing&limit=20
 */
exports.search = async (req, res) => {
  try {
    const { q, version = '10', context = 'clinical', limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters.' });
    }

    const cacheKey = 'search_' + q + '_v' + version + '_' + limit;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, context: CONTEXT_NOTES[context] || CONTEXT_NOTES.clinical, fromCache: true });
    }

    const response = await axios.get(NLM_BASE_URL + '/icd10cm/v3/search', {
      params: { sf: 'code,name', terms: q, maxList: limit },
      timeout: 8000
    });

    const [total, codes, , descriptions] = response.data;
    const results = (codes || []).map((code, i) => ({
      code,
      description: descriptions ? descriptions[i] : '',
      version: 'ICD-10-CM'
    }));

    const payload = { query: q, version: 'ICD-' + version, total: total || results.length, results };
    cache.set(cacheKey, payload);
    return res.json({ ...payload, context: CONTEXT_NOTES[context] || CONTEXT_NOTES.clinical, fromCache: false });

  } catch (error) {
    console.error('Search error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch ICD codes.' });
  }
};

/**
 * GET /api/icd/:code?version=10&context=clinical
 */
exports.getCode = async (req, res) => {
  try {
    const { code } = req.params;
    const { version = '10', context = 'clinical' } = req.query;

    if (!code) return res.status(400).json({ error: 'ICD code is required.' });

    const cacheKey = 'code_' + code + '_v' + version;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, context: CONTEXT_NOTES[context] || CONTEXT_NOTES.clinical, fromCache: true });
    }

    const response = await axios.get(NLM_BASE_URL + '/icd10cm/v3/search', {
      params: { sf: 'code,name', terms: code, maxList: 5 },
      timeout: 8000
    });

    const [, codes, , descriptions] = response.data;
    const idx = (codes || []).findIndex(c => c.toUpperCase() === code.toUpperCase());

    if (idx === -1) return res.status(404).json({ error: 'Code "' + code + '" not found.' });

    const payload = {
      code: codes[idx],
      description: descriptions ? descriptions[idx] : '',
      version: 'ICD-' + version + '-CM',
      details: {
        category: codes[idx].substring(0, 3),
        isSpecific: codes[idx].length >= 5,
        isValid: true
      }
    };

    cache.set(cacheKey, payload);
    return res.json({ ...payload, context: CONTEXT_NOTES[context] || CONTEXT_NOTES.clinical, fromCache: false });

  } catch (error) {
    console.error('Get code error:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve code details.' });
  }
};
