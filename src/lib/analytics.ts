const measurementId = "G-6P1T5VQLN9";
const preferenceCookie = "alex_analytics";
const productionSite = location.hostname === "alextione.it";
let loaded = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    "ga-disable-G-6P1T5VQLN9"?: boolean;
  }
}

export function analyticsPreference() {
  return document.cookie.match(/(?:^|;\s*)alex_analytics=(allow|decline)(?:;|$)/)?.[1];
}

function loadAnalytics() {
  if (!productionSite || loaded || analyticsPreference() !== "allow") return;
  window["ga-disable-G-6P1T5VQLN9"] = false;
  loaded = true;
  window.dataLayer ??= [];
  window.gtag = function () { window.dataLayer!.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: "granted", ad_storage: "denied",
    ad_user_data: "denied", ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    allow_google_signals: false, allow_ad_personalization_signals: false,
    cookie_domain: "none", cookie_expires: 180 * 86400,
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
  document.head.append(script);
}

export function setAnalyticsPreference(allow: boolean) {
  document.cookie = preferenceCookie + "=" + (allow ? "allow" : "decline") +
    "; Path=/; Max-Age=15552000; SameSite=Lax; Secure";
  if (allow) {
    loadAnalytics();
  } else {
    window["ga-disable-G-6P1T5VQLN9"] = true;
    for (const name of ["_ga", "_ga_" + measurementId.slice(2)]) {
      document.cookie = name + "=; Path=/; Max-Age=0; SameSite=Lax; Secure";
    }
    if (loaded) location.reload();
  }
}

export function trackLead(source: "tour" | "book" | "general") {
  if (productionSite && analyticsPreference() === "allow") {
    window.gtag?.("event", "generate_lead", { send_to: measurementId, lead_source: source });
  }
}

export function initAnalytics() {
  if (!productionSite) return;
  const panel = document.querySelector<HTMLElement>("#analytics-choice")!;
  const settings = document.querySelector<HTMLButtonElement>("[data-analytics-settings]");
  panel.hidden = Boolean(analyticsPreference());
  loadAnalytics();
  if (settings) {
    settings.hidden = false;
    settings.addEventListener("click", () => {
      panel.hidden = false;
      panel.querySelector<HTMLButtonElement>("button")?.focus();
    });
  }
  panel.addEventListener("click", event => {
    const button = event.target instanceof Element && event.target.closest<HTMLButtonElement>("button[data-choice]");
    if (!button) return;
    setAnalyticsPreference(button.dataset.choice === "allow");
    panel.hidden = true;
    settings?.focus();
  });
}
