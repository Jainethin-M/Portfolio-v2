import { ClassicPortfolio } from "@/components/stations/ClassicPortfolio";
import { NexusApp } from "@/components/NexusApp";
import { SITE } from "@/config/site";
import { profile } from "@/data/profile";
import { existingAssets } from "@/lib/assets";

const REVEAL_WITHOUT_JS =
  ".nexus-seo{position:static!important;width:auto!important;height:auto!important;margin:0!important;overflow:visible!important;clip:auto!important;white-space:normal!important}";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.seo.description,
    url: SITE.url,
    sameAs: profile.socials.filter((s) => s.url.startsWith("http")).map((s) => s.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // "<" is escaped so profile text can never terminate the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <noscript>
        <style>{REVEAL_WITHOUT_JS}</style>
      </noscript>
      <NexusApp existingAssets={existingAssets()}>
        <ClassicPortfolio />
      </NexusApp>
    </>
  );
}
