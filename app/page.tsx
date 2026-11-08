"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const styles: HTMLStyleElement[] = [];
    const scripts: HTMLScriptElement[] = [];

    async function loadPortfolio() {
      const response = await fetch("/portfolio.html");
      if (!response.ok) {
        throw new Error(`Portfolio source request failed (${response.status}).`);
      }

      const source = new DOMParser().parseFromString(await response.text(), "text/html");
      if (cancelled || !portfolioRef.current) return;

      document.title = source.title;
      source.head.querySelectorAll("style").forEach((original) => {
        const style = document.createElement("style");
        style.textContent = original.textContent;
        document.head.appendChild(style);
        styles.push(style);
      });

      portfolioRef.current.innerHTML = source.body.innerHTML;
      const inlineScripts = Array.from(portfolioRef.current.querySelectorAll("script"));
      inlineScripts.forEach((script) => script.remove());

      inlineScripts.forEach((original) => {
        const script = document.createElement("script");
        script.textContent = original.textContent;
        document.body.appendChild(script);
        scripts.push(script);
      });
    }

    loadPortfolio().catch((cause: unknown) => {
      if (!cancelled) {
        setError(
          cause instanceof Error ? cause.message : "The portfolio could not be loaded.",
        );
      }
    });

    return () => {
      cancelled = true;
      scripts.forEach((script) => script.remove());
      styles.forEach((style) => style.remove());
      if (portfolioRef.current) portfolioRef.current.innerHTML = "";
    };
  }, []);

  if (error) {
    return (
      <main role="alert" style={{ padding: 24, fontFamily: "sans-serif" }}>
        Unable to load the portfolio: {error}
      </main>
    );
  }

  return <div ref={portfolioRef} />;
}
