# AdSense launch requirements

This branch provides privacy information and consent-gated optional game storage. It registers the supplied AdSense publisher code behind an advertising-consent gate. It does not claim Google approval or legal certification.

The site notice controls only the application's saved roster/team preferences. It is not a Google-certified CMP and must never be used as a signal to enable advertising, analytics, ad personalisation, or Consent Mode. The real publisher ID `ca-pub-6050932726280158`, supplied script and matching Google `ads.txt` entry are configured. No consent signal is invented.

Before serving ads to UK visitors:

1. Confirm the operator's legal identity and contact details, the live domain, hosting provider, hosting log retention and any international transfers. Update `public/privacy.html` to accurately describe the deployed service, legal bases and actual providers. The privacy page currently describes the browser application and flags hosting details as provider-dependent; it cannot certify unknown hosting practices.
2. Review current Google AdSense Publisher Policies, programme eligibility, prohibited/restricted content rules and ad placement policies. Seek site approval in the actual publisher account. A working privacy page does not guarantee content quality, eligibility or approval.
3. Install and configure a Google-certified consent management platform integrated with the applicable IAB TCF for the UK/EEA/Switzerland. Google's Privacy & messaging product is one possible route. Configure vendor disclosures, purposes, equal and freely available refusal, consent records, withdrawal and regional coverage. Test the actual production configuration before enabling tags. The game's optional-storage permission does not authorise ad tracking. The CMP must bootstrap independently of the gated AdSense tag; publishing a message in the account alone is not evidence the CMP is installed on the page. This branch does not include a CMP installer because its public integration code has not been supplied.
4. Update disclosures before ads go live: identify the vendors and purposes, explain relevant cookies/identifiers, sharing and retention, link Google's partner-site and privacy information, and provide ongoing access to advertising choices. Obtain valid consent before any advertising storage/personalisation that requires it. Consent Mode is not itself a consent platform.
5. Add the real AdSense publisher ID and authorised ad scripts only through the approved account configuration; never collect credentials in source control. If requested by AdSense, publish the account's actual authorised `ads.txt` content at the live domain root. Do not invent a publisher ID or a seller entry.
6. Serve the live site over HTTPS. Verify privacy/contact links, the notice, refusal, withdrawal, CMP validation, actual network requests before/after consent, mobile usability and ad placement. Ads must not obscure or imitate Spin buttons, player controls or consent choices, or encourage invalid clicks.
7. Re-check policies as they change. Third-party code or a new processing purpose requires an updated notice and, where applicable, a renewed choice before use.

Official references to review:

- https://support.google.com/adsense/answer/13554116 (certified CMP requirements)
- https://www.google.com/about/company/user-consent-policy/
- https://support.google.com/adsense/answer/1348695 (privacy disclosures)
- https://support.google.com/adsense/answer/48182 (programme policies)
- https://support.google.com/adsense/answer/7532444 (ads.txt)
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/

Access to the official Google and ICO pages returned a proxy HTTP 403 during this task (26 October 2026). Their latest wording could not be independently retrieved here; confirm it against the live policies before launch.

## Supplied AdSense code

Both page heads contain a publisher verification meta tag, the exact provided async AdSense script in an inert template, and `/advertising-consent.js`. The gate registers a TCF v2 listener with an independently installed CMP, and does not contact AdSense without a completed CMP event, nonempty TC string, purpose-1 storage consent and Google vendor-755 consent. It deliberately fails closed without a CMP, including outside the UK. Google’s ad tag is responsible for interpreting all other TCF purposes and restrictions; this small gate does not certify the CMP or replace TCF validation.

Repeated events load the tag once. A completed withdrawal after the tag has loaded refreshes the document, since removing a script element cannot stop already executed advertising code. Unsaved in-memory lineups can be lost on that refresh. Make the CMP’s advertising settings/revocation UI continuously accessible.

The public publisher ID is not a secret. `/ads.txt` declares the supplied Google publisher as a direct seller using Google’s seller certification ID; confirm the entry in the publisher account and serve it at the actual domain root. Verification metadata can be read without enabling ads, but site approval and real ad serving are not established by a local test.

Browser checks use intercepted/mock ad requests to verify exact script attributes on both pages, no loading without CMP/vendor permission, independence from game-storage acceptance, a single load after simulated consent, withdrawal reload and the `ads.txt` response. No real ad impressions, CMP certification, publisher verification or production ad serving were tested.
