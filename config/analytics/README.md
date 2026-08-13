# Analytics configuration

`ga4.yml` declares how GA4 must be configured for this site, so the setup lives
in version control instead of in someone's memory or in a panel nobody audits.

## What the site sends

One delegated click listener in `src/layouts/BaseLayout.astro` emits a single
event, `generate_lead`, with a `method` parameter:

| Click target | `method` |
|---|---|
| Google Calendar booking link | `booking` |
| WhatsApp (`wa.me`, `api.whatsapp.com`) | `whatsapp` |
| `tel:` link | `phone` |
| `mailto:` link | `email` |

Every event also carries `cta_location`, derived from an explicit
`data-cta-location` attribute, the enclosing `section[id]`, or `header`/`footer`.
That is what makes it possible to tell which CTA converts and which is decoration.

Generic outbound clicks and file downloads are **not** emitted. GA4 Enhanced
Measurement already collects both by default; sending them again would
double-count every click. `tel:` and `mailto:` are the reverse case — Enhanced
Measurement ignores them, so without this listener they are invisible.

## What GA4 measures, and what it does not

These events record that someone clicked through to WhatsApp, the phone, or the
booking calendar. They do **not** record whether that conversation became a
client. Closing that gap is a human process, not a tracking one.

## Applying the configuration

Blocked on two things:

1. The numeric `property_id` (`TBD` in `ga4.yml`).
2. A Google Cloud service account with Editor permission on the GA4 property,
   with the Analytics Admin API enabled.

The Analytics Admin API covers key events and custom dimensions, which is all
this file declares. It does **not** cover Looker Studio dashboards or explorations —
those stay manual.

Until an apply script exists, the same configuration can be applied by hand:

- **Key event**: Admin → Data display → Events → mark `generate_lead` as key event.
- **Custom dimensions**: Admin → Custom definitions → Create custom dimension,
  once per entry in `custom_dimensions`, scope Event, matching the parameter name exactly.

Whichever route is used, `ga4.yml` must reflect reality afterwards.

**Credentials never go in this repo.** The service account key belongs in
`~/.secrets.agents`, referenced by environment variable.

## Verifying it works

Open GA4 → Admin → DebugView, then browse the site with debug mode on and click a
CTA. The `generate_lead` event should appear within seconds, carrying both
`method` and `cta_location`. The Realtime report also shows the event, but not
its parameters.
