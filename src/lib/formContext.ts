// Read browser settings only when the visitor submits a form.
export function formContext() {
  return {
    pagePath: location.pathname,
    pageTitle: document.title,
    browserLanguage: navigator.language,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}
