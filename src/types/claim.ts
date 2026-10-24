export type AppealStrategy =
  | 'MEDICAL_NECESSITY'
  | 'CODING_ERROR'
  | 'OUT_OF_NETWORK_EXCEPTION'
  | 'PROCEDURAL_COMPLIANCE';

export interface ViolatedClause {
  section: string;
  title: string;
  quote: string;
  relevance: string;
}

export interface DisputeAppealResult {
  claim_id: string;
  policy_number: string;
  denial_reason: string;
  violated_clauses: string[];
  appeal_strategy: AppealStrategy;
  appeal_letter_markdown: string;
  required_supporting_docs: string[];
}

export interface ClaimFormPayload {
  patient_name: string;
  claim_id: string;
  denied_amount_inr: number;
  provider_name: string;
  form_fields: Record<string, string | number | boolean>;
}

export interface ProcessingAuditLog {
  id: string;
  step: 'PARSE' | 'AUDIT' | 'STRATEGY' | 'TOOL_EXECUTION';
  title: string;
  detail: string;
  status: 'pending' | 'active' | 'success' | 'warning';
  timestamp: string;
}

export interface ClaimAnalysisResponse {
  appeal: DisputeAppealResult;
  form_payload: ClaimFormPayload;
  audit_logs: ProcessingAuditLog[];
  identified_grounds: {
    check_type: 'Check A (Improper Denial)' | 'Check B (Procedural Error)' | 'Check C (Ambiguity)';
    finding: string;
    supporting_clause: string;
  }[];
  extracted_entities: {
    patient_name: string;
    claim_id: string;
    policy_number: string;
    date_of_service: string;
    denial_code: string;
    denied_amount: number;
    provider_name: string;
  };
}

export interface PresetScenario {
  id: string;
  title: string;
  category: 'medical_emergency' | 'dental' | 'diagnostic_mri';
  badge: string;
  denial_code: string;
  denied_amount: number;
  summary: string;
  denialNoticeText: string;
  policyDocumentText: string;
  groundSummary: string;
  strategy: AppealStrategy;
}

export interface GmailDispatchReceipt {
  messageId: string;
  threadId: string;
  recipient: string;
  subject: string;
  timestamp: string;
  hasAttachment: boolean;
  attachmentName: string;
  appealStrategy: AppealStrategy;
  claimId: string;
}

export interface GmailSendRequest {
  recipientEmail: string;
  subject: string;
  bodyHtml: string;
  pdfBase64?: string;
  pdfFileName?: string;
}

