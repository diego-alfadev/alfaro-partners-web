# GA4 setup runbook (manual / browser-use)

Applies the configuration declared in `ga4.yml` through the GA4 web UI, until an
Analytics Admin API script exists. Written to be executed by an agent driving the
user's already-authenticated Chrome.

## Target

| | |
|---|---|
| Account | `396986347` |
| Property | `540440298` — **ALFARO&PARTNERS.ES** |
| Signed in as | `hola@alfaropartners.es` (Google Workspace) |
| Measurement ID | `G-08PP9575QV` |

Entry URL:

```
https://analytics.google.com/analytics/web/#/a396986347p540440298/admin
```

> **`authuser` ambiguity — resolve before touching anything.** The URL the user
> supplied contained `authuser=4` in one place and `authuser=5` in another. The
> wrong `authuser` lands in a different Google account. Do not rely on it.
> Instead, once loaded, confirm on screen that the property reads
> **ALFARO&PARTNERS.ES** and the ID is **540440298**. If it does not, stop and
> ask the user which Chrome profile is correct. Never apply changes to an
> unverified property.

## Hard rules

1. **Never enter credentials.** If Google asks to re-authenticate, stop and hand
   back to the user.
2. **Show each change before confirming it.** These are settings on an account
   that belongs to the client, not to us.
3. **Change nothing outside the steps below.** Do not create or delete
   properties or streams, do not touch users/permissions, do not modify
   attribution or filters.
4. If the UI does not match the paths described here, **stop and report what you
   actually see**. GA4's admin navigation gets reorganised regularly, and the
   labels below may be stale. Navigate by meaning, not by blind clicking, and
   never guess your way through a settings screen.

## Steps

### 1. Verify the property

Confirm property name and ID as above. Screenshot. Do not proceed otherwise.

### 2. Mark `generate_lead` as a key event

Admin → *Data display* → **Key events** (older layouts: *Events*, with a
"Mark as key event" toggle per row).

`generate_lead` has **never fired in production yet**, so it will almost
certainly NOT appear in the list. This is expected, not an error. Use
**"New key event"** and type the name manually, exactly:

```
generate_lead
```

Do **not** mark `contact_click` as a key event — it is intentionally excluded.
It tracks `mailto:` clicks, which on this site only exist on legal pages
(aviso legal, privacidad, cookies) and are data-protection enquiries rather
than prospects.

### 3. Create two custom dimensions

Admin → *Data display* → **Custom definitions** → **Create custom dimension**.
Once per row. The **event parameter name must match exactly** — it is
case-sensitive, and a typo silently produces a dimension that never populates.

| Dimension name | Scope | Event parameter | Description |
|---|---|---|---|
| Lead method | Event | `method` | How the lead was initiated - booking, whatsapp, phone or email |
| CTA location | Event | `cta_location` | Page region the CTA was clicked from - hero, footer, section id |

### 4. Verify Enhanced Measurement stays ON

Admin → *Data collection and modification* → **Data streams** → open the web
stream → **Enhanced measurement**.

Confirm **Outbound clicks** and **File downloads** are enabled. Do not disable
them. The site's own listener deliberately no longer emits those events, so we
now depend on Enhanced Measurement for them. Report their actual state.

### 5. Raise event data retention to 14 months — ask first

Admin → *Data collection and modification* → **Data retention**.

GA4 defaults **event data retention to 2 months**. For a project whose entire
purpose is watching SEO progress over time, that default erases the history
before anyone looks at it. 14 months is the maximum on the free tier and enables
year-over-year comparison.

This is a beneficial and reversible change, but it is still a settings change:
**ask the user before applying it.**

## What cannot be verified yet

The events are **not in production**. All changes live in an uncommitted working
tree and nothing has been deployed. So:

- DebugView will show no `generate_lead` — correct, not a failure.
- Custom dimensions will show "No data" — correct.

Configuring first is deliberate: **custom dimensions do not backfill.** Registering
them before traffic arrives is the only way to capture the first clicks.

Full verification happens after deploy: GA4 → Admin → **DebugView**, browse the
live site with debug mode on, click a WhatsApp or booking CTA, and confirm the
`generate_lead` event arrives carrying both `method` and `cta_location`.

## Phase B — reconnaissance (READ ONLY)

While you are in the property, gather the following. This is **strictly
read-only**: change nothing in this phase, and do not build explorations or
audiences — use the standard reports with the date range set to the **last 12
months**.

The point is not a data dump. Each item below exists because it changes a
decision we have to make. If something is unavailable, say so plainly rather
than approximating.

| # | What to find | Where | Why it matters |
|---|---|---|---|
| 1 | Property creation date, and the earliest date with actual data | Admin → Property settings; then any report at max range | Decides whether we have a usable baseline at all. If collection started last month, the strategy document must say "we are starting from zero" instead of implying history. |
| 2 | Total sessions, last 12 months, and the trend | Reports → Acquisition → Traffic acquisition | Volume decides everything downstream. 200 sessions/month and 5.000 call for completely different strategies — and different reporting formats. |
| 3 | Breakdown by default channel group (Organic Search / Direct / Referral / Social / Paid) | Same report | Tells us whether SEO is currently contributing anything, and how much of the traffic is people who already knew the brand. |
| 4 | **Is Search Console linked?** If yes, which property/URL | Admin → Product links → Search Console links | Answers an open blocker: whether GSC exists for this site at all and who owns it. If it is not linked, report that — linking it is cheap and high value. |
| 5 | Is Google Ads linked? Any paid activity in the period? | Admin → Product links → Google Ads links | Tells us whether any traffic is bought, which would otherwise be misread as organic progress. |
| 6 | Top 10 landing pages by sessions, and the same filtered to Organic Search | Reports → Engagement → Landing page | Directly tests the strategy thesis. If `/herencias-inmobiliarias/` or the `/zonas/` pages get organic traffic, the niche bet is already validated. If they get nothing, that is the conversation. |
| 7 | Device split: mobile vs desktop | Reports → Tech → Tech details | Mobile share justifies the image/LCP work and makes `tel:` clicks meaningful. Desktop-heavy traffic changes the CTA priorities. |
| 8 | Geography: top countries and cities | Reports → User → Demographic details | This is a Madrid business. Traffic from outside Spain is noise, and a high share of it would mean the current numbers overstate reality. |
| 9 | Any key events / conversions **already** configured, and any existing custom dimensions | Admin → Key events; Admin → Custom definitions | Collision check before we add ours, and it reveals whether anyone configured this property before us. |
| 10 | Who has access to the property, and at what role — including any external accounts | Admin → Property access management | The ownership question. Given the history with an outside agency on another site, we want to know if any third party holds access here. Report the list; change nothing. |
| 11 | Current event data retention setting | Admin → Data retention | Needed for step 5 above, and tells us how much history we can still recover. |

### How to report Phase B

A short written summary, not screenshots of everything. For each numbered item:
the answer, and "not available" where it genuinely is not. Flag anything that
looks anomalous — a traffic spike, a channel that makes no sense for this
business, an unfamiliar account with access.

Do not interpret the data into strategy recommendations. Report what is there;
the strategy conversation happens with the client, not in this runbook.

## After finishing

Report back:

- Which steps were applied, with screenshots.
- The actual state of Enhanced Measurement.
- Whether data retention was changed, and to what.
- Anything in the UI that did not match this runbook.
- The Phase B summary.

If any of it diverges from `ga4.yml`, update that file — it is the source of
truth, and a config file that has drifted from reality is worse than none.
