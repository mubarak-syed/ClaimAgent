# ClaimLens — AI Claims Specialist & Policy Dispute Engine

ClaimLens automates the parsing of claim denial notices and policy documents, audits rejections against policy terms to identify legal and procedural grounds, and generates authoritative appeal packages with interactive portal auto-fill capabilities.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during initial consultation and will guide the implementation:

- **Confirmed Decision 1 (Preset Scenarios)**: The application will include three pre-loaded, realistic test scenarios: **Emergency Room Out-of-Network Denial** (No Surprises Act / prudent layperson standard), **Dental Pre-Authorization & Medical Necessity Denial**, and **Diagnostic MRI Coding Mismatch Denial** (`ERR-402`), allowing instant one-click demonstration without requiring real personal documents.
- **Confirmed Decision 2 (Export & Submission)**: The dispute center will provide a **print-ready, formatted appeal letter with instant PDF export** alongside an **interactive dispute portal simulator** that demonstrates automated form auto-filling using the structured payload.
- **Confirmed Decision 3 (AI Model & Tool Architecture)**: Server-side Gemini processing using native multimodal tool declarations (`generate_dispute_appeal` and `export_claim_form_payload`) with strict anti-hallucination guardrails citing exact policy sections.

---

### 1. Overview & Core Concept

- **What It Does**: ClaimLens acts as a legal-grade insurance rights advocate. Users upload or select a Claim Denial notice alongside their Insurance Policy text or PDF. The agent parses both documents, runs a three-point audit (Improper Denial, Procedural Compliance, Policy Ambiguity), selects the strongest appeal strategy (`MEDICAL_NECESSITY`, `CODING_ERROR`, `OUT_OF_NETWORK_EXCEPTION`, `PROCEDURAL_COMPLIANCE`), and generates a formal, policy-cited appeal letter and automated web form payload.
- **Target Audience / Persona**: Patients, policyholders, and healthcare advocates navigating confusing medical, dental, or insurance claim rejections who need an authoritative, legally grounded appeal without costly legal counsel.
- **Key Value**: Replaces hours of stressful fine-print reading with a transparent, clause-by-clause audit and an airtight, ready-to-mail appeal letter backed by statutory and contractual citations.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Intake & Preset Selection**:
   - The user arrives at a dual-zone document intake station: **Claim Denial Document** on the left, **Insurance Policy Document** on the right.
   - Quick-load chips allow instant population of 3 preset cases (Emergency ER Denial, Dental Bone Graft, MRI Scan Pre-Auth).
   - Alternatively, users drop custom files (PDF, image, or text) with live preview cards.
2. **Agent Reasoning & Audit Stream**:
   - Clicking **"Analyze & Build Appeal"** triggers the ClaimLens agent.
   - A live audit activity stream reveals the 4-step execution in sequence:
     - *Step 1*: Vision OCR & structured entity extraction (Claim ID, codes, amounts, policy limits).
     - *Step 2*: Discrepancy analysis (Cross-checking Denial Reason against exclusions, deductibles, and pre-auth rules).
     - *Step 3*: Appeal strategy determination with confidence and legal basis.
     - *Step 4*: Tool execution generating the appeal package and portal payload.
3. **Dispute Output Center**:
   - **Appeal Letter Studio**: Full formatted Markdown letter citing exact policy sections, editable directly in place, with one-click PDF download / print formatting.
   - **Supporting Evidence Checklist**: Actionable next-step items (e.g. Attending Physician Statement, operative report, itemized Superbill).
   - **Dispute Portal Auto-Fill**: Interactive simulated portal interface showing real-time form field injection from `export_claim_form_payload`, alongside one-click JSON copy for API dispatch.

#### Visual Identity & Theme
- **Aesthetic Direction**: High-trust legal-medical editorial dashboard. Clean, authoritative, and calm to reduce user anxiety. Crisp hairline dividers, balanced margins, zero decorative clutter.
- **Color Palette**:
  - Dominant Neutral: Crisp clean canvas (`bg-slate-50` / `bg-white` light mode, `bg-slate-950` deep slate dark accents).
  - Structural Surfaces: Pure white card containers with 1px hairline borders (`border-slate-200 / border-slate-800`).
  - High-Intent Accents: Deep Navy / Cobalt (`#1E3A8A` / `#2563EB`) for legal authority; Emerald (`#059669`) for positive policy grounds and verified clauses; Crimson (`#DC2626`) reserved strictly for denial markers.
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` for modern structural clarity.
  - Body & Legal Text: `DM Sans` / `Source Serif` for legible reading of long policy clauses and formal letters.
  - Numbers & Identifiers: Monospace tabular numerals (`font-mono tabular-nums`) for Claim IDs, ICD codes, and dollar figures.
- **Anti-Slop Restraint**: No floating badges, no decorative pulsing dots, no fake system latencies or hallucinated scorecards. Clean unboxed metadata separated by typographic middots (`·`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server-Side Tool Calling Architecture**:
  - *Approach*: Implement Gemini server endpoints declaring the exact schemas for `generate_dispute_appeal` and `export_claim_form_payload`.
  - *Why*: Ensures strict type safety, exact matching of parameters (claim ID, policy number, violated clauses, strategy enum, required supporting docs, and form fields), and protects API credentials.
  - *Alternatives Considered*: Client-side regex parsing (fragile, cannot handle scanned PDFs or varied insurer formats).
- **Decision 2: Realistic Multi-Domain Healthcare Presets**:
  - *Approach*: Ship three fully developed denial + policy pairs representing real-world insurance disputes:
    1. *Emergency Room Out-of-Network Surprise Bill* (cites federal No Surprises Act & prudent layperson standard).
    2. *Dental Bone Graft / Periodontal Denial* (cites medical necessity and pre-authorization non-requirement clause).
    3. *Diagnostic Spinal MRI Pre-Authorization Denial* (`ERR-402` coding mismatch where prior auth was retroactively valid).
  - *Why*: Allows instantaneous end-to-end testing with zero friction, while still accepting arbitrary user uploads.
- **Decision 3: Dual-Mode Dispute Portal Simulator & PDF Generator**:
  - *Approach*: Provide an interactive insurer grievance portal view where users can click "Auto-Fill Portal" to see the extracted key-value fields animate into standard electronic dispute form inputs, alongside a clean browser print/PDF export stylesheet.
  - *Why*: Directly solves the user's primary post-denial friction point—submitting the appeal correctly to the payer.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLAIMLENS DASHBOARD                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────┐    ┌──────────────────────────────┐  │
│  │   Claim Denial Document      │    │   Policy Terms Document      │  │
│  │   [File Upload / Drag & Drop]│    │   [File Upload / Drag & Drop]│  │
│  └──────────────┬───────────────┘    └──────────────┬───────────────┘  │
│                 │                                   │                  │
│                 └─────────────────┬─────────────────┘                  │
│                                   ▼                                    │
│                 ┌───────────────────────────────────┐                  │
│                 │      Preset Scenario Selector     │                  │
│                 │  [Emergency ER] [Dental] [MRI]    │                  │
│                 └─────────────────┬─────────────────┘                  │
│                                   │                                    │
│                                   ▼                                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                Server-Side Agent Engine (/api/audit)             │  │
│  │                                                                  │  │
│  │  1. Multimodal OCR & Entity Extraction                           │  │
│  │  2. Policy Clause Audit (Check A: Coverage, B: Proc, C: Ambiguity│  │
│  │  3. Strategy Picker: MEDICAL_NECESSITY | CODING_ERROR | etc.     │  │
│  │  4. Gemini Function Invocation:                                  │  │
│  │     - generate_dispute_appeal                                    │  │
│  │     - export_claim_form_payload                                  │  │
│  └────────────────────────────────┬─────────────────────────────────┘  │
│                                   │                                    │
│         ┌─────────────────────────┴────────────────────────┐           │
│         ▼                                                  ▼           │
│  ┌─────────────────────────────┐           ┌────────────────────────┐  │
│  │    Appeal Letter Studio     │           │  Dispute Portal Auto-  │  │
│  │ - Cited Clause Badges       │           │  Fill Simulator        │  │
│  │ - Markdown Live Editor      │           │ - Key-Value Payload    │  │
│  │ - Evidence Checklist        │           │ - Form Auto-Population │  │
│  │ - Print-Ready PDF Export    │           │ - Raw JSON & Copy API  │  │
│  └─────────────────────────────┘           └────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core Data Entities
- **ClaimDenialNotice**: `claimId`, `patientName`, `dateOfService`, `providerName`, `deniedAmount`, `denialCode`, `denialReasonRaw`.
- **PolicyClause**: `sectionId`, `title`, `textSnippet`, `supportsAppeal`, `category` (Coverage, Exclusion Exception, Procedural).
- **AppealPackage**:
  - `claim_id`: string
  - `policy_number`: string
  - `denial_reason`: string
  - `violated_clauses`: string[]
  - `appeal_strategy`: `"MEDICAL_NECESSITY" | "CODING_ERROR" | "OUT_OF_NETWORK_EXCEPTION" | "PROCEDURAL_COMPLIANCE"`
  - `appeal_letter_markdown`: string
  - `required_supporting_docs`: string[]
- **DisputeFormPayload**:
  - `patient_name`: string
  - `claim_id`: string
  - `denied_amount_inr`: number (or currency equivalent)
  - `provider_name`: string
  - `form_fields`: Record<string, string | number>

#### Interactive State Transitions
- **IDLE**: User selects preset or uploads files. Real-time file validation and size checks.
- **PROCESSING**: Step-by-step progress visualizer tracking document parsing, clause cross-referencing, and appeal formulation.
- **COMPLETED**: Interactive tabs toggle between **Appeal Letter**, **Evidence Checklist**, and **Dispute Portal Auto-Fill**.
- **EXPORT**: Print-ready modal for paper/PDF generation and real-time form filler animation.
