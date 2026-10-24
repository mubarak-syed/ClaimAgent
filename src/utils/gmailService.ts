import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { DisputeAppealResult, ClaimAnalysisResponse, GmailDispatchReceipt } from '../types/claim';
import { getAppealPdfBase64 } from './pdfGenerator';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google Auth Provider with Gmail send scope
export const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

// In-memory token cache (NEVER persist in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

/**
 * Initialize auth state listener.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthSuccess) onAuthSuccess(user, null);
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Google Sign In popup to acquire Gmail send access token.
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token with Gmail permissions.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Encode UTF-8 string to base64
 */
function utf8ToBase64(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}

/**
 * Convert standard base64 to URL-safe base64
 */
function base64ToBase64Url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Constructs an RFC 2822 multipart/mixed message with PDF attachment.
 */
export function buildMimeMessage(options: {
  to: string;
  subject: string;
  fromName?: string;
  fromEmail?: string;
  htmlBody: string;
  attachment?: {
    filename: string;
    mimeType: string;
    base64Data: string;
  };
}): string {
  const boundary = `====_ClaimLens_${Date.now()}_====`;
  const subjectEncoded = `=?UTF-8?B?${utf8ToBase64(options.subject)}?=`;

  const headers = [
    `MIME-Version: 1.0`,
    `To: ${options.to}`,
    options.fromEmail ? `From: "${options.fromName || 'ClaimLens Advocate'}" <${options.fromEmail}>` : `From: me`,
    `Subject: ${subjectEncoded}`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
  ];

  const bodyPart = [
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: base64`,
    '',
    utf8ToBase64(options.htmlBody),
    '',
  ];

  const attachmentPart = options.attachment
    ? [
        `--${boundary}`,
        `Content-Type: ${options.attachment.mimeType}; name="${options.attachment.filename}"`,
        `Content-Description: ${options.attachment.filename}`,
        `Content-Disposition: attachment; filename="${options.attachment.filename}"`,
        `Content-Transfer-Encoding: base64`,
        '',
        options.attachment.base64Data,
        '',
      ]
    : [];

  const closing = [`--${boundary}--`, ''];

  const rawMime = [...headers, ...bodyPart, ...attachmentPart, ...closing].join('\r\n');
  return base64ToBase64Url(utf8ToBase64(rawMime));
}

/**
 * Generates an executive dispute email body (HTML) to accompany the attached PDF.
 */
export function generateAppealEmailHtml(
  analysis: ClaimAnalysisResponse,
  appeal: DisputeAppealResult,
  customNotes?: string
): string {
  const groundsList = analysis.identified_grounds
    .map(
      (g) => `
      <li style="margin-bottom: 6px;">
        <strong style="color: #1e3a8a;">${g.check_type}:</strong> ${g.finding}
        <br/><span style="font-size: 11px; color: #475569;">Citing: <em>${g.supporting_clause}</em></span>
      </li>`
    )
    .join('');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1e293b; line-height: 1.5; font-size: 14px;">
      <div style="background: #1e3a8a; padding: 20px 24px; border-radius: 8px 8px 0 0; color: #ffffff;">
        <h2 style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: -0.02em;">FORMAL FIRST-LEVEL CLAIM APPEAL & GRIEVANCE NOTICE</h2>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #bfdbfe;">Dispute under Applicable State Insurance Code & Statutory Prompt-Pay Provisions</p>
      </div>

      <div style="padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <p>Dear Appeals & Grievance Department,</p>
        
        <p>Please find attached the formal legal dispute appeal and supporting evidence checklist regarding the improper denial of Claim Reference <strong>#${appeal.claim_id}</strong> on behalf of policyholder <strong>${analysis.extracted_entities.patient_name}</strong>.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 13px;">
          <tr style="background: #f8fafc;">
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 600; width: 35%;">Claim Reference</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-family: monospace;">${appeal.claim_id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 600;">Policy / Subscriber ID</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-family: monospace;">${appeal.policy_number}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 600;">Disputed Amount</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #047857;">$${analysis.extracted_entities.denied_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 600;">Primary Appeal Strategy</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0;"><span style="background: #eff6ff; color: #1d4ed8; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 11px;">${appeal.appeal_strategy}</span></td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 600;">Stated Denial Reason</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${appeal.denial_reason}</td>
          </tr>
        </table>

        <h3 style="font-size: 14px; color: #0f172a; margin-top: 20px; margin-bottom: 8px;">Key Contractual & Statutory Grounds for Reversal:</h3>
        <ul style="padding-left: 20px; margin: 0 0 16px 0;">
          ${groundsList}
        </ul>

        ${
          customNotes
            ? `<div style="padding: 12px 16px; background: #fffbeb; border-left: 4px solid #f59e0b; margin: 16px 0; font-size: 13px;">
                <strong>Special Policyholder Note:</strong><br/>${customNotes}
              </div>`
            : ''
        }

        <p style="margin-top: 16px; padding: 12px 14px; background: #f1f5f9; border-radius: 6px; font-size: 12px; color: #334155;">
          📎 <strong>Attached:</strong> Complete formal appeal notice PDF formatted with full citations, line-item dispute breakdown, and supporting exhibits manifest.
        </p>

        <p style="margin-top: 20px;">
          Under applicable insurance regulations and statutory prompt-pay guidelines, an expedited written determination is requested within thirty (30) days of receipt.
        </p>

        <p style="margin-top: 24px; color: #64748b; font-size: 12px;">
          Sincerely,<br/>
          <strong>${analysis.extracted_entities.patient_name}</strong><br/>
          c/o ClaimLens Dispute Resolution Advocacy
        </p>
      </div>
    </div>
  `;
}

/**
 * Sends the appeal email via the user's Gmail account using the Gmail REST API.
 */
export async function sendDisputeViaGmail(options: {
  recipientEmail: string;
  subject: string;
  htmlBody: string;
  appeal: DisputeAppealResult;
}): Promise<GmailDispatchReceipt> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('No active Gmail session found. Please sign in with Google to grant email sending permissions.');
  }

  // Generate the PDF base64 attachment
  const pdfBase64 = getAppealPdfBase64(options.appeal);
  const attachmentFileName = `Appeal_Letter_Claim_${options.appeal.claim_id}.pdf`;

  // Build the RFC 2822 MIME message
  const rawBase64Url = buildMimeMessage({
    to: options.recipientEmail,
    subject: options.subject,
    htmlBody: options.htmlBody,
    attachment: {
      filename: attachmentFileName,
      mimeType: 'application/pdf',
      base64Data: pdfBase64,
    },
  });

  // Call the official Gmail API
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: rawBase64Url }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      cachedAccessToken = null;
      throw new Error('Gmail authorization session expired. Please sign in again.');
    }
    const errText = await response.text();
    throw new Error(`Gmail API failed with status ${response.status}: ${errText}`);
  }

  const result = await response.json();

  return {
    messageId: result.id,
    threadId: result.threadId,
    recipient: options.recipientEmail,
    subject: options.subject,
    timestamp: new Date().toISOString(),
    hasAttachment: true,
    attachmentName: attachmentFileName,
    appealStrategy: options.appeal.appeal_strategy,
    claimId: options.appeal.claim_id,
  };
}
