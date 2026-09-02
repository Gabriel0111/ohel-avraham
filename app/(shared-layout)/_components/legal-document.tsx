"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { legalContent } from "@/lib/i18n/legal";

type DocKey = "help" | "terms" | "privacy" | "cookies";

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Renders a translated string, turning `[label](href)` into links. */
function RichText({ text }: { text: string }): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  for (const match of text.matchAll(LINK_RE)) {
    const [full, label, href] = match;
    const start = match.index ?? 0;
    if (start > lastIndex) parts.push(text.slice(lastIndex, start));
    parts.push(
      href.startsWith("/") ? (
        <Link key={key++} href={href} className="text-primary underline">
          {label}
        </Link>
      ) : (
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline"
        >
          {label}
        </a>
      ),
    );
    lastIndex = start + full.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  );
}

export function LegalDocument({ kind }: { kind: DocKey }) {
  const { lang } = useT();
  const content = legalContent[lang];
  const doc = content[kind];

  return (
    <div>
      <div className="py-10 sm:py-16">
        <div className="mx-auto w-full max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {doc.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {content.lastUpdated}: {content.updatedDate}
          </p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
            {doc.intro && (
              <p>
                <RichText text={doc.intro} />
              </p>
            )}

            {doc.sections.map((section, si) => (
              <section key={si} className="space-y-3">
                {section.heading && (
                  <h2 className="text-base font-semibold text-foreground">
                    {section.heading}
                  </h2>
                )}
                {section.blocks.map((block, bi) => {
                  if ("h" in block) {
                    return (
                      <p key={bi} className="font-medium text-foreground">
                        {block.h}
                      </p>
                    );
                  }
                  if ("ul" in block) {
                    return (
                      <ul key={bi} className="list-disc space-y-1 pl-5">
                        {block.ul.map((item, ii) => (
                          <li key={ii}>
                            <RichText text={item} />
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={bi}>
                      <RichText text={block.p} />
                    </p>
                  );
                })}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
