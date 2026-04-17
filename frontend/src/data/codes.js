import codes from './icd10cm-codes.json';
import { CONTEXT_NOTES } from '../api/icdApi';

const byCode = new Map(codes.map((c) => [c.code.toUpperCase(), c]));

export function getCodeFromDataset(code, context = 'clinical') {
  if (!code) return null;
  const record = byCode.get(code.toUpperCase());
  if (!record) return null;
  return {
    code: record.code,
    description: record.description,
    version: 'ICD-10-CM',
    details: {
      category: record.code.substring(0, 3),
      isSpecific: record.code.length >= 5,
      isValid: true,
    },
    context: CONTEXT_NOTES[context] || CONTEXT_NOTES.clinical,
  };
}

export function allCodes() {
  return codes;
}
