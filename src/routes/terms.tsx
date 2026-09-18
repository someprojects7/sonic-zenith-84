import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { LEGAL, SITE_NAME, SITE_URL, canonicalUrl } from "@/config/site";

const TITLE = `Terms of Service | ${SITE_NAME}`;
const DESCRIPTION =
  "Terms of Service for Sponsa: how public event information is sourced and linked, subscriptions and refunds, takedown notices, privacy, liability and dispute resolution.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: canonicalUrl("/terms") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/terms") }],
  }),
  component: TermsPage,
});

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-9 scroll-mt-20">
      <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-[14px] leading-[1.55] text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-4">
      {items.map((item) => (
        <li key={item} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  );
}

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-hairline bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-5">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[14px] font-semibold text-foreground transition-opacity active:opacity-70"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-8">
        <h1 className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground">
          Terms of Service
        </h1>
        <p className="mt-2 text-[13px] text-muted-foreground">
          Last updated {LEGAL.lastUpdated}. Effective for every visit to {SITE_URL} and use of the{" "}
          {SITE_NAME} app.
        </p>

        <div className="mt-6 rounded-xl border border-hairline p-4 text-[13px] leading-[1.55] text-muted-foreground">
          Short version: {SITE_NAME} is a referral and discovery service. We point to event
          information that is already public, in short factual form, and always send you to the
          original source. We do not organise events, sell tickets, host event content as our own,
          or control what venues, organisers and platforms do. Confirm every detail with the
          organiser before you travel or pay.
        </div>

        <Section id="provider" title="1. Who we are">
          <p>
            The service is operated by {LEGAL.operatorName}, {LEGAL.operatorForm} from{" "}
            {LEGAL.country}. Contact for any legal, privacy or content matter: {LEGAL.contactEmail}.
            Postal contact details are provided on request to that address where a law or a
            competent authority requires them. In these terms &quot;we&quot;, &quot;us&quot; and
            &quot;{SITE_NAME}&quot; mean the operator; &quot;you&quot; means the person using the
            service.
          </p>
        </Section>

        <Section id="agreement" title="2. Agreement to these terms">
          <p>
            By opening the site, taking the onboarding quiz, creating an account or paying for a
            plan, you accept these terms and our privacy notice. If you do not accept them, do not
            use the service. If you use the service on behalf of an organisation, you confirm you
            are authorised to bind it.
          </p>
          <p>
            You must be at least 16 years old, or older where local law requires a higher age for
            data processing or ticket purchases. Individual events have their own age limits set by
            the organiser.
          </p>
        </Section>

        <Section id="service" title="3. What the service is, and what it is not">
          <p>
            {SITE_NAME} locates event information that organisers, venues, ticket platforms and
            media have themselves published for the public, describes each event in a short factual
            way, and shows you a small personalised selection with a link to the original page.
          </p>
          <Bullets
            items={[
              "We are not an organiser, promoter, venue, agent or ticket seller, and we take no commission on any ticket.",
              "We are not a party to any contract you make with an organiser, venue or ticket platform.",
              "Prices, times, line-ups, addresses, age limits and availability come from third parties and can be wrong, outdated, changed or removed at any moment.",
              "Recommendations are automated suggestions based on your answers and behaviour. They are opinions, not advice, and no particular outcome is promised.",
              "Availability may be interrupted for maintenance, source outages or reasons outside our control. We do not guarantee uninterrupted or error-free operation.",
            ]}
          />
          <p>
            Always verify the event on the organiser&apos;s own page before travelling, paying or
            relying on any detail you saw here.
          </p>
        </Section>

        <Section id="sources" title="4. How event information is sourced">
          <p>
            Everything we show originates from openly accessible sources: public event pages, public
            social posts and channels, ticketing listings, venue calendars and press coverage. We do
            not use login-only areas, private groups, paid archives or anything behind a paywall or
            access control, and we do not bypass technical restrictions.
          </p>
          <Bullets
            items={[
              "We publish only short factual particulars — what, when, where, price range, category — which are facts and not protected expression, plus a brief neutral note of our own about why an event may suit you.",
              "We do not republish full descriptions, articles, programmes, databases or substantial extracts of any source, and we do not present source content as our own.",
              "Every listing names or links its origin, so the source receives attribution and traffic rather than losing it.",
              "We respect robots directives and reasonable technical limits of the sources we read, and we do not reproduce any source's database structure or a substantial part of its contents.",
              "Automated reading is limited to what is needed for indexing and referral, at a volume that does not burden the source.",
              "Where a source states that its material may not be reused, we still only reference the underlying facts and link out; if the source objects to being referenced at all, we remove it on notice (see section 6).",
            ]}
          />
          <p>
            No partnership, sponsorship, affiliation or endorsement between {SITE_NAME} and any
            source, platform, venue, artist or organiser is implied by a listing, a name, a logo or
            a link. Marks and names are used descriptively, to identify the event or its source.
          </p>
        </Section>

        <Section id="images" title="5. Images and media">
          <p>
            Photographs and artwork are handled conservatively. Where an image is shown next to a
            listing, it is either material we own or have licensed, material the organiser or
            platform makes publicly available for promotion of that event, or a thumbnail-scale
            preview shown solely to identify the event and linked to its source. Decorative imagery
            in the product interface is our own or licensed stock.
          </p>
          <Bullets
            items={[
              "We do not sell, sublicense, redistribute or build a stock library out of third-party images, and we do not remove watermarks or credits.",
              "Previews are kept small and are never presented as a substitute for the source page.",
              "Copyright and personality rights in third-party images stay with their owners; any credit shown is informational.",
              "Anyone depicted in, or holding rights to, an image can ask for its removal and we will take it down (see section 6) without requiring proof of registration.",
            ]}
          />
        </Section>

        <Section id="takedown" title="6. Notices, corrections and takedown">
          <p>
            We operate a no-argument removal policy. If you are a rights holder, an organiser, a
            platform, a venue or a person shown in an image, write to {LEGAL.noticeEmail} or{" "}
            {LEGAL.contactEmail} with the link to the item on our service, the material or right
            concerned and your contact details. You do not need to prove your claim in advance.
          </p>
          <Bullets
            items={[
              "We aim to remove or correct the item promptly after a complete notice reaches us, normally within a few working days.",
              "A source can also ask to be excluded entirely, and we will stop referencing it.",
              "Removal is not an admission of liability, and voluntary compliance does not create any obligation beyond the item in question.",
              "Misuse of this channel to suppress lawful factual information may be refused with reasons.",
            ]}
          />
        </Section>

        <Section id="accounts" title="7. Your account">
          <p>
            Keep your login credentials confidential and tell us at {LEGAL.contactEmail} if you
            suspect unauthorised access. You are responsible for activity under your account. We may
            suspend or close accounts that break these terms, create legal risk for us or others, or
            abuse the service technically.
          </p>
        </Section>

        <Section id="plans" title="8. Plans, payments and renewals">
          <p>
            The service is offered as a paid subscription, which may start with a free trial.
            Current prices, trial length, features and billing periods are shown at checkout and
            form part of this agreement. Prices include applicable VAT where required.
          </p>
          <Bullets
            items={[
              "A trial converts into a paid subscription unless you cancel before it ends.",
              "Subscriptions renew automatically for the same period until you cancel.",
              "You can cancel at any time; cancellation stops the next renewal and access continues until the end of the paid period.",
              "Payments are processed by third-party payment providers; we do not store full card details.",
              "We may change prices or plan contents with reasonable advance notice; changes apply from the next billing period, and you may cancel before they take effect.",
              "Failed payments may lead to suspension of paid features.",
            ]}
          />
          <p>
            Consumers in the EU normally have a 14-day right of withdrawal for digital services. By
            starting to use the paid features immediately you ask us to begin performance and accept
            that the right of withdrawal is lost once the service has been fully performed; for
            partial performance a proportionate amount may be charged. Beyond mandatory law, paid
            periods already used are not refundable. The subscription pays for our selection,
            ranking and interface — never for third-party content, tickets or entry.
          </p>
        </Section>

        <Section id="use" title="9. Acceptable use">
          <Bullets
            items={[
              "Do not scrape, crawl, copy, resell or redistribute the picks, data or database in bulk, and do not use them to train models or build a competing dataset.",
              "Do not reverse engineer, probe, overload or bypass access controls, rate limits or paywalls.",
              "Do not upload unlawful, infringing, misleading or abusive content, or impersonate anyone.",
              "Do not use the service for unlawful purposes or in breach of applicable sanctions or export rules.",
            ]}
          />
        </Section>

        <Section id="ip" title="10. Intellectual property and your licence">
          <p>
            Our interface, editorial selection, ranking logic, code, wording and brand are owned by
            us or our licensors. Third-party event content remains with its owners and is only
            referenced. We grant you a personal, revocable, non-exclusive, non-transferable licence
            to use the service for your own private, non-commercial event discovery. All other
            rights are reserved.
          </p>
          <p>
            If you send feedback, you allow us to use it without obligation or compensation. If you
            submit content, you grant us a worldwide, royalty-free licence to host and display it
            inside the service, and you confirm you have the rights to do so.
          </p>
        </Section>

        <Section id="privacy" title="11. Privacy and data">
          <p>
            We process account data, quiz answers, saved events, votes, city and usage analytics to
            deliver and improve the picks. Legal bases are performance of this contract, our
            legitimate interest in improving the service, and consent where required (for example
            marketing or non-essential cookies).
          </p>
          <Bullets
            items={[
              "You may request access, correction, deletion, portability, restriction or objection at any time by writing to " +
                LEGAL.contactEmail +
                ".",
              "We keep data only as long as needed for the service, legal accounting duties and dispute defence.",
              "Processors include hosting, database, analytics, payment and email providers acting under contract.",
              "We do not sell personal data.",
            ]}
          />
          <p>
            The full privacy notice and cookie details are published separately and prevail on data
            matters where they are more specific than this section.
          </p>
        </Section>

        <Section id="disclaimer" title="12. Disclaimers">
          <p>
            To the fullest extent permitted by law, the service is provided &quot;as is&quot; and
            &quot;as available&quot;, without warranties of any kind, express or implied, including
            accuracy, completeness, fitness for a particular purpose, satisfactory quality or
            non-infringement. We do not warrant that any event will take place, be safe, be
            enjoyable, match its description, or that recommendations suit your taste.
          </p>
          <p>
            You attend events at your own risk and are responsible for your own safety, transport,
            insurance, health and lawful behaviour.
          </p>
        </Section>

        <Section id="liability" title="13. Limitation of liability">
          <p>
            To the extent permitted by law, we are not liable for indirect, incidental, special or
            consequential loss, loss of profit, data, opportunity or goodwill, wasted expenditure,
            travel or ticket costs, or damage arising from cancelled, changed, misdescribed or
            unsafe events, third-party conduct, third-party content, or inaccurate source data.
          </p>
          <p>
            Our total aggregate liability for all claims in any twelve-month period is limited to
            the greater of the amounts you paid us for the service in that period or{" "}
            {LEGAL.liabilityCap}. Nothing here limits liability for death or personal injury caused
            by our negligence, fraud, wilful misconduct, or any liability that cannot be excluded
            under mandatory consumer law.
          </p>
        </Section>

        <Section id="indemnity" title="14. Indemnity">
          <p>
            You agree to indemnify us against claims, damages and reasonable costs arising from your
            breach of these terms, your unlawful use of the service, or content you submit.
          </p>
        </Section>

        <Section id="changes" title="15. Changes and termination">
          <p>
            We may update these terms when the product, the law or our providers change. Material
            changes will be announced in the app or by email before they take effect; continuing to
            use the service afterwards means you accept the updated terms. We may modify, suspend or
            discontinue features, and either party may end the agreement at any time. Sections on
            sources, images, intellectual property, disclaimers, liability, indemnity and disputes
            survive termination.
          </p>
        </Section>

        <Section id="law" title="16. Governing law and disputes">
          <p>
            These terms are governed by the law of {LEGAL.country}, without prejudice to mandatory
            consumer protections in your country of residence. Disputes fall to the competent courts
            of {LEGAL.courtsCity}, {LEGAL.country}; consumers may also bring proceedings in their
            own country where the law allows and may use the EU online dispute resolution platform.
            Before starting a claim, please contact us at {LEGAL.contactEmail} so we can try to
            resolve the matter directly.
          </p>
        </Section>

        <Section id="misc" title="17. Miscellaneous">
          <p>
            If a provision is unenforceable, the rest stays in force. Our failure to enforce a right
            is not a waiver. You may not assign this agreement without our consent; we may assign it
            as part of a reorganisation or sale of the business. These terms, the privacy notice and
            the plan details at checkout form the entire agreement between us. The English version
            prevails over translations.
          </p>
        </Section>

        <p className="mt-10 text-[13px] leading-[1.55] text-muted-foreground">
          Questions, corrections and removal requests: {LEGAL.contactEmail}. This document is a
          thorough starting point and not legal advice; have a qualified lawyer in {LEGAL.country}{" "}
          review it before launch.
        </p>
      </main>
    </div>
  );
}
