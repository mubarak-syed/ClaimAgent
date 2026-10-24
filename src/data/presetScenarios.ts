import { PresetScenario } from '../types/claim';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'emergency-er-402',
    title: 'Emergency Trauma ER Out-of-Network',
    category: 'medical_emergency',
    badge: 'Medical Emergency',
    denial_code: 'ERR-402',
    denied_amount: 4280.00,
    summary: 'Trauma emergency appendectomy denied due to out-of-network hospital facility clause.',
    groundSummary: 'Exclusion Clause 8.3 does not apply to emergency admissions under Section 8.3.2 and statutory Emergency Care Protections.',
    strategy: 'OUT_OF_NETWORK_EXCEPTION',
    denialNoticeText: `EXPLANATION OF BENEFITS / CLAIM DENIAL NOTICE
Insurer: Apex Health Mutual Group
Patient Name: Eleanor Vance
Member ID / Policy #: AHM-8849201-02
Claim ID: CLM-2026-99412
Date of Service: October 14, 2026
Servicing Facility: St. Jude Trauma & Acute Care Center (Provider NPI: 1982739401)
Service Rendered: Emergency Room Level 5 (CPT 99285) & Emergency Appendectomy (CPT 44960)
Total Billed Amount: $5,120.00
Eligible Amount: $0.00
Denied Amount: $4,280.00 (Copay Applied: $840.00)

DENIAL REASON / CODE:
Denial Code: ERR-402
Reason Description: "Service rendered by out-of-network provider/facility without mandatory prior authorization. Under Plan Section 8.3, non-participating facilities are not covered under the Standard Select HMO tier."

Notice of Appeal Rights:
You have 180 calendar days from the date of this denial notice (October 18, 2026) to file a formal First-Level Member Grievance.
Send appeals to: Apex Health Appeals Committee, P.O. Box 9042, Minneapolis, MN.`,
    policyDocumentText: `APEX HEALTH MUTUAL MASTER POLICY CONTRACT (POLICY ID: AHM-8849201-02)

SECTION 8: NETWORK PARTICIPATION & PROVIDER DIRECTORY
8.1 Participating Network: Covered individuals are directed to seek scheduled non-emergency care within the Apex Preferred Network.
8.2 Tier 2 Co-Insurance: For eligible out-of-network care, standard 40% co-insurance applies after out-of-network deductible.
8.3 Exclusion of Non-Participating Facilities: Except as otherwise provided, elective or non-authorized care rendered by non-participating facilities is excluded from coverage under Code ERR-402.

8.3.2 Mandatory Emergency & Trauma Care Exception:
"Notwithstanding Section 8.3, all emergency medical evaluations and stabilizing surgical/trauma services—including acute care hospital admissions resulting directly from emergent symptoms—shall be reimbursed at the standard in-network rate, without requirement for prior authorization or network referral. No participating plan deductible higher than the in-network deductible shall be assessed. The Prudent Layperson standard applies to all sudden-onset conditions."

SECTION 11: GRIEVANCE AND RETROACTIVE OVERRIDE
11.4 Emergency Adjudication: Where hospital records confirm admission via emergency ambulance or acute triage, claims erroneously coded under ERR-402 must be re-adjudicated to in-network benefit status within 30 days of receiving member dispute notice.`
  },
  {
    id: 'dental-bone-graft-88',
    title: 'Dental Acute Bone Graft & Periodontal Restoration',
    category: 'dental',
    badge: 'Dental / Surgical',
    denial_code: 'DEN-88',
    denied_amount: 1950.00,
    summary: 'Severe acute periodontal abscess bone graft denied under general cosmetic procedure exclusion.',
    groundSummary: 'Restoration necessitated by acute bone resorption is explicitly protected under Section 4.1.2 as an Essential Restorative Procedure.',
    strategy: 'MEDICAL_NECESSITY',
    denialNoticeText: `DENTAL BENEFIT ADJUDICATION NOTICE
Insurer: DeltaCare Premier Dental
Patient Name: Marcus Thorne
Policy Number: DNT-449102-X
Claim ID: DL-883019
Date of Service: September 29, 2026
Treating Clinician: Dr. Sarah Chen, DDS, Periodontal Surgery Associates (NPI: 1477209110)
Procedure Codes: CDT D7953 (Bone Replacement Graft for Ridge Preservation) & CDT D4263 (Bone Replacement Graft - First Site)
Total Claimed: $1,950.00
Covered Amount: $0.00
Denied Amount: $1,950.00

DENIAL REASON / CODE:
Denial Code: DEN-88
Reason: "Cosmetic or elective bone grafting procedures are excluded from primary periodontal benefit plan under Contract Section 4.1. Prior approval was not recorded in carrier system."

Appeals Timeline:
Appeals must be submitted in writing within 90 days of notification with accompanying clinical documentation and radiographic imaging.`,
    policyDocumentText: `DELTACARE PREMIER COMPREHENSIVE DENTAL BENEFIT CONTRACT (POLICY: DNT-449102-X)

SECTION 4: EXCLUSIONS AND PROCEDURAL LIMITATIONS
4.1 General Cosmetic Exclusion: Purely cosmetic ridge enhancements, aesthetic gingivectomies, and elective implants are non-covered.

4.1.2 Acute Pathology & Structural Preservation Exception:
"Grafting, guided tissue regeneration (CDT D7953, D4263), and osseous surgical intervention are expressly COVERED under Class III Periodontal Benefits whenever necessitated by acute dental infection, traumatic tooth avulsion, or progressive bone loss threatening adjacent sound dentition. In such cases of clinical necessity, the cosmetic exclusion under 4.1 shall not apply."

SECTION 6: PRIOR AUTHORIZATION POLICY
6.3 Urgent & Active Pathology Exemption: Procedures performed under acute localized infection or active suppuration do not require pre-determination of benefits if accompanied by postoperative radiographic evidence and an Attending Periodontist's Narrative of Medical Necessity.`
  },
  {
    id: 'mri-coding-error-104',
    title: 'Diagnostic Lumbar MRI Pre-Auth Mismatch',
    category: 'diagnostic_mri',
    badge: 'Diagnostic Imaging',
    denial_code: 'AUTH-104',
    denied_amount: 2750.00,
    summary: 'MRI scan denied due to clerical CPT code transposition (72148 without contrast vs 72149 with contrast).',
    groundSummary: 'Procedural variance governed by Section 12.4 allows retroactive clerical correction without re-filing or denial.',
    strategy: 'CODING_ERROR',
    denialNoticeText: `HEALTH SERVICES REMITTANCE ADVICE
Insurer: Horizon Shield Integrated Health
Policyholder: Robert DeSilva
Subscriber Policy #: HZ-99104-B
Claim ID: RAD-771205
Date of Service: October 02, 2026
Facility: Metro Advanced Diagnostic Imaging (NPI: 1205883902)
Procedure Billed: CPT 72148 - Magnetic Resonance Imaging, Lumbar Spine, without contrast
Prior Authorization on File: PA-2026-668102 (Approved for CPT 72149 - Lumbar Spine with contrast)
Billed Charges: $2,750.00
Allowed Amount: $0.00
Claim Status: DENIED

DENIAL CODE:
AUTH-104: "Prior Authorization Mismatch. Service billed (CPT 72148) does not correspond to the exact procedure code authorized by Medical Management (CPT 72149). Claim cannot be processed as submitted."

Action Required:
Provider or Member may submit a corrected claim or formal procedural dispute within 60 days.`,
    policyDocumentText: `HORIZON SHIELD SUBSCRIBER EVIDENCE OF COVERAGE (POLICY: HZ-99104-B)

SECTION 12: UTILIZATION REVIEW & PRIOR AUTHORIZATION
12.1 Mandatory Authorization: Advanced outpatient diagnostic imaging (MRI, CT, PET) requires prior medical director review.
12.2 Approved Modalities: Authorization numbers remain valid for 90 days from issuance for the identified anatomical scan.

12.4 Clerical Code Transposition & Procedural Variance:
"When an approved prior authorization exists for an advanced imaging modality (e.g. Lumbar Spine MRI) and the performing facility administers a clinically safer or lesser-invasive variant of the authorized procedure (such as without contrast CPT 72148 in place of with-contrast CPT 72149 due to patient kidney profile or radiologist discretion), the claim shall not be denied under AUTH-104. The payer shall retroactively update the authorized code upon receipt of billing correction notice or appeal statement without penalty to the member."`
  }
];
