/* ------------------------------------------------------------------ */
/* Legal pages (/privacy, /terms)                                      */
/* ------------------------------------------------------------------ */

/*
 * Company details used across both documents. Bracketed values are
 * placeholders: fill them in (and have counsel review both documents)
 * before launch. The page highlights anything still in [brackets].
 */
export const company = {
  name: "Median",
  legalName: "[Legal entity name] Private Limited",
  address: "[Registered office address], India",
  city: "[City]",
  privacyEmail: "privacy@[your-domain]",
  legalEmail: "legal@[your-domain]",
  grievanceOfficer: "[Grievance Officer name]",
  updated: "10 November 2026",
};

/** A paragraph, or a list whose items may lead with a bold term. */
export type LegalBlock = string | { list: (string | [term: string, text: string])[] };
export type LegalSection = { id: string; title: string; body: LegalBlock[] };
export type LegalDoc = {
  meta: { title: string; description: string };
  title: string;
  intro: string[];
  sections: LegalSection[];
};

const c = company;

export const privacyPolicy: LegalDoc = {
  meta: {
    title: "Privacy Policy — Median",
    description:
      "How Median collects, uses and protects personal data across our website, early access programme and accounting platform.",
  },
  title: "Privacy Policy",
  intro: [
    `${c.name} (“${c.name}”, “we”, “us”) builds agentic infrastructure for accounting teams in India: software that connects to your payment gateways, banks and marketplaces, reads the statements and bills you upload, and keeps your books, cash and GST current. This policy explains what personal data we collect, why, and the choices you have.`,
    "It is written for the Digital Personal Data Protection Act, 2023 (“DPDP Act”), the Information Technology Act, 2000 and the rules made under them.",
  ],
  sections: [
    {
      id: "scope",
      title: "Who we are and what this covers",
      body: [
        `${c.name} is operated by ${c.legalName}, with its registered office at ${c.address}.`,
        "This policy covers our website, the early access programme and the Median platform (together, the “Service”). It applies to visitors, people who request early access, and the users our customers invite, including their finance teams and chartered accountants.",
        {
          list: [
            [
              "Where we decide why and how data is used",
              "for example your early access request, your account and our website, we act as a Data Fiduciary under the DPDP Act.",
            ],
            [
              "Where we process data inside your books on your behalf",
              "for example customer, vendor or employee names in a bank statement, your business is the Data Fiduciary and we act as its Data Processor. We process that data only to provide the Service to you and on your instructions.",
            ],
          ],
        },
      ],
    },
    {
      id: "collect",
      title: "Information we collect",
      body: [
        "Information you give us:",
        {
          list: [
            [
              "Early access requests",
              "your full name, work email, phone number and country code, company name, designation, annual revenue band, and anything you choose to tell us in the free-text field.",
            ],
            [
              "Account and onboarding",
              "the names, emails and roles of people on your workspace, including any CA or accountant you invite, and the details you share while we set Median up with you.",
            ],
            [
              "Communications",
              "messages, call notes and feedback you send us.",
            ],
          ],
        },
        "Financial data you connect or upload (“Customer Data”):",
        {
          list: [
            "Transactions, settlements and payouts from payment gateways and marketplaces you connect.",
            "Bank statements and bank lines, from connections you authorise or files you upload (PDF, CSV or Excel).",
            "Invoices, bills and receipts, and the data we extract from them.",
            "Business identifiers such as GSTIN, PAN and TAN, and the ledger, GST and TDS data needed to prepare your books and returns.",
            "Data synced from accounting software you connect, such as Tally or Zoho Books.",
          ],
        },
        "Customer Data often contains personal data about other people: names, UPI IDs, account numbers and amounts that appear in narrations, invoices or payroll lines. You are responsible for having the right to share it with us (see “Your responsibilities” in our Terms of Use).",
        "Information collected automatically:",
        {
          list: [
            [
              "Technical data",
              "IP address, browser and device type, and server logs. We use your IP address to protect our forms from abuse, for example by rate-limiting requests.",
            ],
            [
              "Browser storage",
              "a small value in your browser's local storage remembers that you dismissed our announcement banner. We do not use advertising or cross-site tracking cookies.",
            ],
            [
              "Product usage",
              "inside the platform, actions such as approvals, corrections and edits, which form the audit trail of your books.",
            ],
          ],
        },
      ],
    },
    {
      id: "connections",
      title: "How connections work",
      body: [
        "We read your data. We never touch your money.",
        {
          list: [
            "We ask for read-only access wherever a provider offers it, and we never initiate payments, transfers or refunds.",
            "Where a provider supports authorised connections (such as OAuth or API keys), we store the access token, never your login password.",
            "If no connection is available, you can upload statements and files instead. You choose what to share.",
            "You can disconnect a source at any time. We stop syncing new data from it straight away.",
          ],
        },
      ],
    },
    {
      id: "use",
      title: "How we use information",
      body: [
        {
          list: [
            "To respond to your early access request, assess fit and set up a walkthrough.",
            "To provide the Service: categorise transactions, match payments to invoices and payouts to bank lines, prepare GST and TDS workings, and produce reports.",
            "To learn your business's coding from your approvals and corrections, so suggestions improve for your workspace.",
            "To provide onboarding and support, and to send service messages about your account.",
            "To keep the Service secure, prevent fraud and abuse, and debug problems.",
            "To improve the Service using aggregated or de-identified information.",
            "To meet legal, tax and regulatory obligations and enforce our terms.",
            "To send product updates and news about Median. You can opt out of these at any time.",
          ],
        },
      ],
    },
    {
      id: "ai",
      title: "AI and automated processing",
      body: [
        "AI drafts. Code does the maths. Your CA approves.",
        {
          list: [
            "We use machine-learning models, including models from third-party providers, to read documents, suggest categories and propose matches.",
            "Totals, balances and tax calculations are computed by deterministic code, not by a language model.",
            "When the AI is unsure, the item goes to your AI inbox with its reason and source, and nothing posts without a record of who approved it.",
            "We do not use your Customer Data to train models that serve other customers. Our AI providers process it only to return results to us, under contracts that prohibit them from using it to train their own models.",
            "No decision with a legal or similarly significant effect on an individual is made solely by automated means.",
          ],
        },
      ],
    },
    {
      id: "basis",
      title: "Why we're allowed to process it",
      body: [
        "Under the DPDP Act we process personal data on the basis of your consent, which you give when you submit a form, create an account or connect a source, or for a legitimate use the Act permits, such as data you provide voluntarily for a specified purpose or processing needed to comply with the law.",
        "You can withdraw consent at any time by writing to us. Withdrawal does not affect processing that happened before it, and we may then be unable to provide some or all of the Service.",
      ],
    },
    {
      id: "share",
      title: "How we share information",
      body: [
        "We do not sell personal data. We share it only as follows:",
        {
          list: [
            [
              "Service providers",
              "cloud hosting, storage, email, customer support and AI model providers who process data for us under written contracts and only on our instructions.",
            ],
            [
              "People you authorise",
              "teammates and accountants you invite to your workspace, and integrations you connect or export to.",
            ],
            [
              "Legal requirements",
              "where required by law, court order or a lawful request from a government authority, or to protect the rights, safety and property of Median, our customers or others.",
            ],
            [
              "Business transfers",
              "as part of a merger, acquisition or sale of assets, subject to this policy's protections.",
            ],
          ],
        },
      ],
    },
    {
      id: "storage",
      title: "Where data is stored",
      body: [
        "We store data with reputable cloud providers. Some of our service providers may process data outside India. Any transfer follows the DPDP Act, including any restrictions the Government of India notifies, and is protected by contractual safeguards.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      body: [
        {
          list: [
            [
              "Early access requests",
              "for as long as the early access programme runs and up to 24 months after our last contact, unless you ask us to delete them sooner.",
            ],
            [
              "Customer Data",
              "for as long as your account is active. After your account closes, we keep it for 90 days so you can export it, then delete or anonymise it.",
            ],
            [
              "Legal holds",
              "we keep some records longer where the law requires, for example invoices and payment records needed for our own tax and accounting.",
            ],
          ],
        },
        "Your own statutory duty to preserve books of account (for example under the Companies Act, 2013 and GST law) remains yours. Export your records before closing your account.",
      ],
    },
    {
      id: "security",
      title: "Security",
      body: [
        "We protect data with reasonable security practices suited to financial information, including encryption in transit and at rest, least-privilege access for our staff, read-only connections, and an audit trail of changes to your books. No system is perfectly secure. If a personal data breach occurs, we will notify affected customers and the Data Protection Board of India as the law requires.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      body: [
        "Subject to the DPDP Act, you have the right to:",
        {
          list: [
            "Get a summary of the personal data we process about you and how we process it.",
            "Correct, complete or update inaccurate or incomplete data.",
            "Ask us to erase data we no longer need, unless the law requires us to keep it.",
            "Withdraw consent you have given.",
            "Have your grievances addressed by our Grievance Officer.",
            "Nominate someone to exercise your rights if you die or become incapacitated.",
          ],
        },
        `Write to ${c.privacyEmail} to make a request. If your data sits inside a customer's books, we will route your request to that customer, as it controls that data. If you are not satisfied with our response, you may complain to the Data Protection Board of India.`,
      ],
    },
    {
      id: "children",
      title: "Children",
      body: [
        "The Service is built for businesses and is not meant for anyone under 18. We do not knowingly collect personal data from children. If you think a child has given us data, contact us and we will delete it.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: [
        "We will update this policy as Median grows. When we make a material change, we will update the date above and tell active customers by email or in the product before it takes effect.",
      ],
    },
    {
      id: "contact",
      title: "Contact and Grievance Officer",
      body: [
        {
          list: [
            ["Privacy questions", c.privacyEmail],
            ["Grievance Officer", `${c.grievanceOfficer}, ${c.privacyEmail}`],
            ["Postal address", `${c.legalName}, ${c.address}`],
          ],
        },
        "We acknowledge grievances within 48 hours and aim to resolve them within 30 days.",
      ],
    },
  ],
};

export const termsOfUse: LegalDoc = {
  meta: {
    title: "Terms of Use — Median",
    description:
      "The terms that govern your use of Median's website, early access programme and accounting platform.",
  },
  title: "Terms of Use",
  intro: [
    `These Terms of Use (“Terms”) are an agreement between you and ${c.legalName} (“${c.name}”, “we”, “us”). They govern your use of our website, the early access programme and the Median platform (together, the “Service”).`,
    "By using the Service you agree to these Terms. If you use it for a company, you confirm you are authorised to bind that company, and “you” means the company. If you have signed an order form or separate agreement with us, that agreement takes priority where it conflicts with these Terms.",
  ],
  sections: [
    {
      id: "eligibility",
      title: "Who can use Median",
      body: [
        "The Service is for businesses and the professionals who work with them, such as chartered accountants and finance teams. You must be at least 18 and able to enter a binding contract under Indian law. You may not use the Service if you are barred from doing so under any applicable law.",
      ],
    },
    {
      id: "early-access",
      title: "Early access",
      body: [
        "Median is in early access. While it is:",
        {
          list: [
            "Features may change, be added or be removed, and some may be labelled beta or experimental.",
            "We may limit how many companies we onboard and decide who to admit.",
            "Unless agreed in writing, early access comes with no uptime or support commitment.",
            "Pricing for design partners, including any founder pricing, is set out in your order form or the written terms we agree with you.",
          ],
        },
        "Your feedback during early access shapes what we build. Please tell us when something looks wrong.",
      ],
    },
    {
      id: "service",
      title: "The Service",
      body: [
        "Median connects to the payment gateways, banks, marketplaces and accounting software you authorise, reads the statements, bills and files you upload, and uses software and AI to categorise transactions, match payments, prepare GST and TDS workings and produce reports. We may improve or change the Service over time.",
      ],
    },
    {
      id: "accounts",
      title: "Your account",
      body: [
        {
          list: [
            "Give us accurate information and keep it up to date.",
            "Keep your login credentials confidential. You are responsible for activity under your account and for the people you invite, including your accountants.",
            `Tell us promptly at ${c.legalEmail} if you suspect unauthorised access.`,
          ],
        },
      ],
    },
    {
      id: "data",
      title: "Your data",
      body: [
        "You own the data you connect, upload or create in the Service (“Customer Data”). You grant us a limited licence to host, copy, process and display it only to provide, secure and support the Service for you, and as described in our Privacy Policy.",
        "Your responsibilities:",
        {
          list: [
            "You confirm you have the rights, consents and notices needed to share Customer Data with us, including any personal data of your customers, vendors and employees it contains.",
            "For that personal data you are the Data Fiduciary under the DPDP Act, and we process it on your behalf.",
            "Export your records before your account closes. Your statutory duty to keep books of account remains yours.",
          ],
        },
        "We may use aggregated or de-identified data that does not identify you or any individual to operate and improve the Service. We do not use Customer Data to train models that serve other customers.",
      ],
    },
    {
      id: "connections",
      title: "Connections and third-party services",
      body: [
        {
          list: [
            "We use read-only access where providers offer it. Median never initiates payments, transfers or refunds.",
            "Connected services, such as payment gateways, banks, marketplaces, Tally and Zoho Books, are run by third parties under their own terms. We are not responsible for their availability, accuracy or changes to their access.",
            "You can disconnect any source at any time.",
          ],
        },
      ],
    },
    {
      id: "advice",
      title: "AI outputs and professional advice",
      body: [
        "Median automates bookkeeping work, but it is not a chartered accountant, tax adviser or lawyer.",
        {
          list: [
            "AI suggestions, categories, matches and extracted data can be wrong or incomplete. Review them before relying on them. Items Median is unsure about are sent to your AI inbox for approval.",
            "GST returns, TDS workings, reports and other outputs are drafts for you and your accountant to review. You remain responsible for your books, filings, payments and compliance with tax and other laws.",
            "Unless we expressly agree in writing, Median does not file returns or make submissions to any authority for you.",
          ],
        },
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      body: [
        "You agree not to:",
        {
          list: [
            "Use the Service for anything unlawful, including money laundering, tax evasion or fraud, or to process data you have no right to.",
            "Upload malware or content that infringes someone else's rights.",
            "Probe, scan or test the Service's security, or bypass its access controls or rate limits, without our written permission.",
            "Reverse engineer, copy or resell the Service, or use it to build a competing product.",
            "Scrape the Service, or overload it with automated requests.",
          ],
        },
      ],
    },
    {
      id: "fees",
      title: "Fees",
      body: [
        "Fees, billing periods and payment terms are set out in your order form or on our pricing page when published. Fees exclude GST and other applicable taxes, which you will pay. Unless agreed otherwise, fees are non-refundable. We will give you at least 30 days' notice before changing the price of a paid plan.",
      ],
    },
    {
      id: "ip",
      title: "Our intellectual property",
      body: [
        "The Service, including its software, models, design and the Median name and logo, belongs to us or our licensors and is protected by law. We grant you a limited, non-exclusive, non-transferable right to use the Service under these Terms. If you send us feedback, we may use it without any obligation to you.",
      ],
    },
    {
      id: "confidentiality",
      title: "Confidentiality",
      body: [
        "Each party will protect the other's non-public information with reasonable care and use it only for the purposes of this agreement. This does not apply to information that is public, already known to the recipient, independently developed, or that must be disclosed by law.",
      ],
    },
    {
      id: "termination",
      title: "Suspension and termination",
      body: [
        {
          list: [
            "You can stop using the Service and close your account at any time.",
            "We may suspend or end your access if you materially breach these Terms, if required by law, or to protect the Service or other users. Where reasonable, we will give you notice first.",
            "After closure, you will have 90 days to export your Customer Data, after which we may delete it as described in our Privacy Policy.",
            "Sections that by their nature should survive, such as fees owed, intellectual property, disclaimers, liability and governing law, survive termination.",
          ],
        },
      ],
    },
    {
      id: "disclaimers",
      title: "Disclaimers",
      body: [
        "To the extent the law allows, the Service is provided “as is” and “as available”, especially during early access. We disclaim implied warranties, including merchantability, fitness for a particular purpose and non-infringement, and we do not warrant that the Service will be uninterrupted, error-free, or that its outputs will be accurate or complete.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      body: [
        "To the extent the law allows, neither party is liable for indirect, incidental, special or consequential losses, or for lost profits, revenue, data or goodwill, or for penalties or interest arising from filings or payments you make. Our total liability arising from the Service is limited to the greater of the fees you paid us in the 12 months before the claim and ₹10,000.",
        "These limits do not apply to liability that cannot be limited by law, or to fraud.",
      ],
    },
    {
      id: "indemnity",
      title: "Indemnity",
      body: [
        "You will indemnify us against third-party claims arising from Customer Data you had no right to share, or from your breach of these Terms or applicable law.",
      ],
    },
    {
      id: "law",
      title: "Governing law and disputes",
      body: [
        `These Terms are governed by the laws of India. The parties will first try to resolve any dispute in good faith. If it is not resolved within 30 days, the courts at ${c.city} have exclusive jurisdiction.`,
      ],
    },
    {
      id: "changes",
      title: "Changes to these Terms",
      body: [
        "We may update these Terms. When we make a material change, we will update the date above and give active customers reasonable notice by email or in the product. If you keep using the Service after a change takes effect, you accept the updated Terms.",
      ],
    },
    {
      id: "general",
      title: "General",
      body: [
        "You may not assign these Terms without our consent. We may assign them in connection with a merger, acquisition or sale of assets. If any provision is unenforceable, the rest remains in effect. Not enforcing a right is not a waiver of it. Neither party is liable for delays caused by events beyond its reasonable control.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: [
        {
          list: [
            ["Legal questions", c.legalEmail],
            ["Postal address", `${c.legalName}, ${c.address}`],
          ],
        },
      ],
    },
  ],
};
