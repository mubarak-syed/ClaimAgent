import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMimeMessage } from './gmailService';

test('buildMimeMessage creates valid RFC 2822 base64url formatted output', () => {
  const mime = buildMimeMessage({
    to: 'appeals@apexhealth.com',
    subject: 'FORMAL APPEAL: Claim #CLM-2026-99412',
    htmlBody: '<p>Test email content</p>',
    attachment: {
      filename: 'Appeal_Letter_CLM-2026-99412.pdf',
      mimeType: 'application/pdf',
      base64Data: 'JVBERi0xLjQKJeLjz9MKMSAwIG9ia...',
    },
  });

  assert.ok(typeof mime === 'string');
  assert.ok(mime.length > 50);
  // Ensure base64url characters only (no +, /, or trailing =)
  assert.ok(!mime.includes('+'));
  assert.ok(!mime.includes('/'));
  assert.ok(!mime.endsWith('='));
});
