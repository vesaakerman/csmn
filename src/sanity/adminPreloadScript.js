export const adminPreloadScript = `
(() => {
  if (!window.location.pathname.startsWith("/admin")) return;

  const LOADING_ID = "csmn-studio-loading";
  const READY_CLASS = "csmn-sanity-ready";
  const AUTH_CLASS = "csmn-sanity-auth";

  const style = document.createElement("style");
  style.textContent = \`
    html,
    body {
      background: #fff !important;
    }

    #\${LOADING_ID} {
      position: fixed;
      z-index: 2147483647;
      top: 16px;
      left: 16px;
      right: 16px;
      max-width: 420px;
      margin: 0 auto;
      padding: 12px 14px;
      border: 1px solid #d8dee7;
      border-radius: 6px;
      background: #ffffff;
      color: #1f2937;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
      font: 14px/1.45 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    body.\${READY_CLASS} #\${LOADING_ID} {
      display: none;
    }

    body.\${AUTH_CLASS} [data-ui="AstroStudioLayout"] {
      overflow-y: auto !important;
    }

    body.\${AUTH_CLASS} [data-ui="AstroStudioLayout"] [data-ui="Flex"] {
      align-items: flex-start !important;
      justify-content: flex-start !important;
    }

    body.\${AUTH_CLASS} [data-ui="AstroStudioLayout"] [data-ui="Container"] {
      padding-top: 24px !important;
      padding-bottom: 24px !important;
    }

  \`;
  document.head.appendChild(style);

  const ensureLoadingNotice = () => {
    if (!document.body || document.getElementById(LOADING_ID)) return;

    const notice = document.createElement("div");
    notice.id = LOADING_ID;
    notice.textContent = "Loading Sanity Studio...";
    document.body.appendChild(notice);
  };

  const syncStudioState = () => {
    if (!document.body) return;

    const authLink = document.querySelector('a[href*="/v1/auth/login/"]');
    const studioRoot = document.querySelector('[data-ui="AstroStudioLayout"]');
    const hasStudioContent = Boolean(studioRoot && studioRoot.textContent.trim().length > 20);

    document.body.classList.toggle(AUTH_CLASS, Boolean(authLink));

    if (authLink || hasStudioContent) {
      document.body.classList.add(READY_CLASS);
    }
  };

  const start = () => {
    ensureLoadingNotice();
    syncStudioState();

    const observer = new MutationObserver(() => {
      ensureLoadingNotice();
      syncStudioState();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.setTimeout(() => {
      syncStudioState();
      if (!document.body?.classList.contains(READY_CLASS)) {
        const notice = document.getElementById(LOADING_ID);
        if (notice) notice.textContent = "Sanity Studio is still loading...";
      }
    }, 8000);
  };

  if (document.body) {
    start();
  } else {
    window.addEventListener("DOMContentLoaded", start, { once: true });
  }
})();
`;
