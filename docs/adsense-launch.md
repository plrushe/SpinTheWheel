# AdSense launch requirements

This branch provides privacy information and consent-gated optional game storage. It does **not** install ads, analytics or third-party tracking, and it does not claim Google approval or legal certification.

The site notice controls only the application's saved roster/team preferences. It is not a Google-certified CMP and must never be used as a signal to enable advertising, analytics, ad personalisation, or Consent Mode. There is deliberately no ad script, fake publisher ID, sample ads.txt or assumed consent signal.

Before serving ads to UK visitors:

1. Confirm the operator's legal identity and contact details, the live domain, hosting provider, hosting log retention and any international transfers. Update `public/privacy.html` to accurately describe the deployed service, legal bases and actual providers. The privacy page currently describes the browser application and flags hosting details as provider-dependent; it cannot certify unknown hosting practices.
2. Review current Google AdSense Publisher Policies, programme eligibility, prohibited/restricted content rules and ad placement policies. Seek site approval in the actual publisher account. A working privacy page does not guarantee content quality, eligibility or approval.
3. Configure a Google-certified consent management platform integrated with the applicable IAB TCF for the UK/EEA/Switzerland. Google's Privacy & messaging product is one possible route. Configure vendor disclosures, purposes, equal and freely available refusal, consent records, withdrawal and regional coverage. Test the actual production configuration before enabling tags. The game's optional-storage permission does not authorise ad tracking.
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
