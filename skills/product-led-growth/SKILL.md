---
name: product-led-growth
description: When the user wants to build a product-led growth (PLG) motion, design a freemium model, create viral loops, optimize free-to-paid conversion, reduce time-to-value, or make the product itself the primary acquisition and retention driver. Use when the user mentions "PLG," "product-led growth," "freemium," "free tier," "viral loop," "product virality," "self-serve," "free-to-paid conversion," "time-to-value," "aha moment," "activation," "product qualified leads," "PQL," or "make the product sell itself." For post-signup onboarding flows, see onboarding. For churn and retention, see churn-prevention. For pricing strategy, see pricing.
metadata:
  version: 1.0.0
---

# Product-Led Growth (PLG)

You are an expert in product-led growth strategy. Your goal is to help design a product experience that acquires, activates, and retains users through the product itself — reducing reliance on sales and marketing spend.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered.

Understand the situation:

1. **What is the product?** — What it does and for whom
2. **Current go-to-market model** — Sales-led, marketing-led, or early PLG?
3. **Pricing model** — Freemium, free trial, or paid-only?
4. **Current activation rate** — % of signups who reach the "aha moment"
5. **Free-to-paid conversion rate** — If freemium or trial exists
6. **Key bottleneck** — Acquisition, activation, conversion, or retention?

---

## PLG Fundamentals

### When PLG Works Best

PLG is a strong fit when:
- The product has a short time-to-value (minutes to hours, not weeks)
- Individual users can adopt without IT/procurement approval
- The product creates network effects or viral moments naturally
- The core value is demonstrable without onboarding calls
- The target user is self-sufficient (developer, designer, operator)

PLG is harder when:
- Value requires significant setup or data migration
- Buying decisions require multiple stakeholders or security review
- The product is deeply customized per customer
- ACV is extremely high ($100K+) — sales involvement is usually needed

### The PLG Spectrum

PLG is not binary. Most successful companies sit on a spectrum:

```
Pure PLG ←————————————————————→ Pure Sales-Led
(Slack early) (Notion) (HubSpot) (Salesforce)
```

The goal is to move as far left as your product allows, then use sales to handle expansion and enterprise.

---

## Designing the Freemium Model

### Freemium vs. Free Trial

| Model | Best When | Risk |
|-------|-----------|------|
| **Freemium** (free forever) | Product has natural viral loops; users invite others | Free tier cannibalizes paid; high support cost |
| **Free Trial** (time-limited) | Full product value is evident quickly; individual decision | Time pressure feels artificial; churn at trial end |
| **Reverse Trial** | Freemium users exist but convert poorly | Complexity; requires both free + full-product trial logic |
| **Usage-Based** | Value scales clearly per unit (seats, calls, records) | Unpredictable revenue; requires usage tracking |

### Designing the Free Tier Limit

The free tier must be:
- **Valuable enough** to attract real users who get genuine value
- **Limited enough** to create a real upgrade incentive when users grow

Common freemium limits:
- **Seat limits**: Free for 1 user, paid for teams (Notion, Figma, Linear)
- **Usage caps**: Free up to X projects/records/API calls (Airtable, Calendly)
- **Feature gates**: Free core, premium power features (Zoom, Canva)
- **Storage limits**: Free up to X GB (Dropbox, Google Drive)
- **Branding removal**: Free with watermark, paid without (Loom, many tools)
- **Export/integrations**: Create free, export or connect to other apps paid

**Key question**: What is the natural limit users hit when they're getting real value and growing?

---

## Finding and Designing the Aha Moment

The "aha moment" is the specific action that correlates most strongly with long-term retention. Users who reach it stay; users who don't, churn.

### How to Find Your Aha Moment

1. **Segment retained vs. churned users** in your product analytics
2. **Compare actions in first 7 days** between the two groups
3. **Find the action retained users took that churned users didn't**
4. **Validate**: Does driving users to that action improve D30 retention?

Classic examples:
- Facebook: Add 7 friends in 10 days
- Slack: Team sends 2,000 messages
- Twitter: Follow 30 accounts in first session
- Dropbox: Store 1 file across 2 devices
- HubSpot: Connect email and send first campaign
- Figma: Share a file with a collaborator

### Designing for Aha Faster

Once you know the aha moment, remove every obstacle between signup and that moment:

1. **Reduce steps**: Cut required form fields, skip unnecessary configuration
2. **Pre-populate with sample data**: Show the product "working" before real data exists
3. **Progressive disclosure**: Show only what's needed right now — hide the rest
4. **One guided first win**: A clear, short activation path, not a full feature tour
5. **Kill the blank slate**: Empty states are conversion killers — prefill with examples

---

## Viral Loops and Product Virality

### Types of Viral Loops

**1. Collaboration Virality**
Users invite others to use the product together.
- Examples: Notion, Figma, Google Docs, Slack, Linear
- Design: Make sharing the path of least resistance; surface collaboration value early in onboarding

**2. "Made With" / Sharing Virality**
Users share output that carries the product brand.
- Examples: Canva designs, Loom videos, Framer pages, Typeform forms
- Design: Make sharing the natural endpoint of a successful task; put the brand where it's seen

**3. Referral Virality**
Incentivized word-of-mouth with rewards for both parties.
- Examples: Dropbox (extra storage), Robinhood (free stock), Cash App ($5)
- Design: Reward must match what users value; double-sided incentives convert best

**4. Content / SEO Virality**
User-created content is public and indexed, creating organic discovery.
- Examples: Notion templates gallery, Framer templates, HubSpot tools
- Design: Make user outputs public and SEO-friendly by default; create a sharing incentive

**5. Integration Virality**
Product appears in other tools the audience already uses daily.
- Examples: Linear in GitHub, Loom in Slack, Calendly in email signatures
- Design: Appear where users already work; reduce friction to first exposure

### Calculating Viral Coefficient

```
K = i × r
```
- **i** = invitations sent per user on average
- **r** = conversion rate of those invitations

- K > 1: True viral growth (each user brings more than 1 new user)
- K = 0.3-0.5: Strong for B2B
- K < 0.1: Virality is not a growth driver

Most B2B SaaS products have K between 0.1-0.5. Even K = 0.3 meaningfully reduces effective CAC.

---

## Free-to-Paid Conversion

### The Conversion Funnel

```
Signup → Activation → Regular Use → Hitting Limits → Upgrade Prompt → Converts
```

Identify where the biggest drop-off occurs — that's your highest-leverage fix.

### Upgrade Triggers: When to Show the Paywall

**Best moments to prompt upgrade:**
- User hits a usage limit while doing something they clearly value
- User tries to access a feature that would help their current task
- User achieves a first success and is naturally ready for more
- User invites a collaborator (show team/pro plan)
- 14-30 days after signup for consistently engaged users

**Worst moments to prompt upgrade:**
- Immediately on signup (too early — they haven't seen value)
- During the core onboarding flow (interrupts activation)
- When the user is stuck or confused (they'll just leave)
- As a random pop-up with no connection to what they're doing

### Upgrade Messaging That Converts

- Frame around what they gain, not what they're losing access to
- Show the ROI: "Teams on Pro close 40% more deals"
- Use social proof: "Join 12,000 teams on Pro"
- Reduce perceived risk: "Cancel anytime" and money-back guarantee
- Offer a trial of paid features before requiring a credit card

### Product Qualified Leads (PQLs)

PQLs are free users who show behavioral signals of readiness to buy:
- Hit a usage limit 2+ times in the same week
- Invited 3+ collaborators
- Used the product daily for 2+ consecutive weeks
- Viewed the pricing page 2+ times
- Actively used features adjacent to premium ones

Route PQLs to sales (for enterprise/high ACV) or to targeted in-app upgrade nudges (for self-serve).

---

## PLG Metrics Dashboard

| Metric | Definition | Benchmark |
|--------|-----------|-----------|
| **TTV** | Time-to-value: time from signup to aha moment | As low as possible |
| **Activation Rate** | % of signups who reach the aha moment | >40% (varies by product) |
| **D7 Retention** | % of activated users still active at day 7 | >30% |
| **D30 Retention** | % of activated users still active at day 30 | >15% |
| **Free → Paid Conversion** | % of free users who upgrade (freemium) | 2-5% typical |
| **Viral Coefficient (K)** | New users per existing user via invites | >0.3 is strong for B2B |
| **PQL Rate** | % of free users who become PQLs | Define and track; improve quarterly |
| **CAC Payback** | Months to recover acquisition cost | <12 months for SaaS |

Track these weekly, segment by cohort (signup month), and review trends quarterly.

---

## PLG + Sales (Product-Led Sales)

PLG doesn't mean no sales team. It means sales focuses on expansion, not cold acquisition.

**The model:**
- Self-serve handles SMB and mid-market (< $10-20K ACV)
- Sales handles enterprise deals (> $20K ACV), using PLG data as context
- Sales reaches out to PQLs with product-usage context: "I see your team of 4 has been hitting the API limit"

**Why this works:**
- Lower CAC: product does the early qualification
- Higher win rate: prospect already has product experience
- Shorter sales cycles: no discovery needed on basics
- Natural "land and expand": individual users bring in their team

---

## Common PLG Mistakes

- **Free tier too generous**: Users get full value free and never need to pay
- **Free tier too restrictive**: Users can't see enough value before hitting a wall
- **Onboarding too long**: Users churn before reaching the aha moment
- **No clear upgrade path**: Users don't know what paid offers or why they'd want it
- **Feature-gating wrong things**: Blocking features users need to see value, not features that extend value
- **Ignoring PQLs**: High-intent free users fall through with no follow-up
- **Adding sales too early**: Sales-led motion before product can deliver self-serve value
- **Skipping analytics**: Building PLG without data on what drives activation and retention

---

## PLG Audit Checklist

- [ ] Can a new user get real value within 5 minutes without any help?
- [ ] Is there a clearly identified aha moment based on retention data?
- [ ] Does the onboarding path lead directly to the aha moment?
- [ ] Is there at least one natural viral loop designed into the product?
- [ ] Is the freemium/trial limit designed around when users are ready to pay?
- [ ] Are upgrade prompts shown at natural friction points, not randomly?
- [ ] Are PQLs identified with a clear definition and routing process?
- [ ] Is D7 and D30 retention tracked and benchmarked?
- [ ] Is the viral coefficient measured and improving over time?

---

## Related Skills

- **onboarding**: For designing the activation flow that leads to the aha moment
- **pricing**: For designing freemium tiers, upgrade packaging, and usage-based models
- **churn-prevention**: For retaining activated users who are at risk of leaving
- **referrals**: For designing formal referral programs on top of organic viral loops
- **analytics**: For tracking PLG metrics and finding the aha moment in behavioral data
- **paywalls**: For designing in-product upgrade prompts and paywall UX
- **cro**: For optimizing the free-to-paid upgrade conversion rate
- **ab-testing**: For running experiments to improve activation and conversion
