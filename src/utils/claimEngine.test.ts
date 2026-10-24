import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractEntitiesFromText,
  auditPolicyAgainstDenial,
  buildAppealLetterMarkdown,
  buildFormPayload,
  getRequiredSupportingDocs,
} from './claimEngine';
import { PRESET_SCENARIOS } from '../data/presetScenarios';

test('extractEntitiesFromText accurately extracts claim metadata', () => {
  const erNotice = PRESET_SCENARIOS[0].denialNoticeText;
  const entities = extractEntitiesFromText(erNotice);

  assert.equal(entities.patient_name, 'Eleanor Vance');
  assert.equal(entities.claim_id, 'CLM-2026-99412');
  assert.equal(entities.policy_number, 'AHM-8849201-02');
  assert.equal(entities.denial_code, 'ERR-402');
  assert.equal(entities.denied_amount, 4280.00);
});

test('auditPolicyAgainstDenial selects OUT_OF_NETWORK_EXCEPTION for ER emergency scenario', () => {
  const scenario = PRESET_SCENARIOS[0];
  const entities = extractEntitiesFromText(scenario.denialNoticeText);
  const audit = auditPolicyAgainstDenial(scenario.denialNoticeText, scenario.policyDocumentText, entities);

  assert.equal(audit.strategy, 'OUT_OF_NETWORK_EXCEPTION');
  assert.ok(audit.grounds.length > 0);
  assert.ok(audit.violatedClauses.some((c) => c.includes('Section 8.3.2')));
});

test('auditPolicyAgainstDenial selects MEDICAL_NECESSITY for dental bone graft scenario', () => {
  const scenario = PRESET_SCENARIOS[1];
  const entities = extractEntitiesFromText(scenario.denialNoticeText);
  const audit = auditPolicyAgainstDenial(scenario.denialNoticeText, scenario.policyDocumentText, entities);

  assert.equal(audit.strategy, 'MEDICAL_NECESSITY');
  assert.ok(audit.violatedClauses.some((c) => c.includes('Section 4.1.2')));
});

test('auditPolicyAgainstDenial selects CODING_ERROR for MRI CPT variance scenario', () => {
  const scenario = PRESET_SCENARIOS[2];
  const entities = extractEntitiesFromText(scenario.denialNoticeText);
  const audit = auditPolicyAgainstDenial(scenario.denialNoticeText, scenario.policyDocumentText, entities);

  assert.equal(audit.strategy, 'CODING_ERROR');
  assert.ok(audit.violatedClauses.some((c) => c.includes('Section 12.4')));
});

test('buildFormPayload creates valid structured auto-fill payload with required fields', () => {
  const scenario = PRESET_SCENARIOS[0];
  const entities = extractEntitiesFromText(scenario.denialNoticeText);
  const payload = buildFormPayload(entities, 'OUT_OF_NETWORK_EXCEPTION');

  assert.equal(payload.patient_name, 'Eleanor Vance');
  assert.equal(payload.claim_id, 'CLM-2026-99412');
  assert.equal(payload.denied_amount_inr, 4280.00);
  assert.ok(payload.form_fields.subscriber_policy_id);
  assert.ok(payload.form_fields.dispute_category);
});

test('buildAppealLetterMarkdown contains formal legal citations and non-empty text', () => {
  const scenario = PRESET_SCENARIOS[0];
  const entities = extractEntitiesFromText(scenario.denialNoticeText);
  const letter = buildAppealLetterMarkdown(
    entities,
    'OUT_OF_NETWORK_EXCEPTION',
    ['Section 8.3.2 Emergency Exception'],
    'Out of network provider not authorized'
  );

  assert.ok(letter.includes('FORMAL FIRST-LEVEL CLAIM APPEAL'));
  assert.ok(letter.includes('Eleanor Vance'));
  assert.ok(letter.includes('CLM-2026-99412'));
  assert.ok(letter.includes('Section 8.3.2'));
});

test('getRequiredSupportingDocs returns non-empty list for any strategy', () => {
  const docs = getRequiredSupportingDocs('OUT_OF_NETWORK_EXCEPTION');
  assert.ok(docs.length >= 3);
});
