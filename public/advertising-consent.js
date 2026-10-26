/* This gate must be paired with a Google-certified CMP. Game-storage consent is unrelated. */
(() => {
  const template = document.getElementById('adsense-code');
  if (!template) return;
  let loaded = false;
  function update(tcData, success) {
    if (!success || !tcData || !['tcloaded', 'useractioncomplete'].includes(tcData.eventStatus)) return;
    const allowed = tcData.cmpStatus === 'loaded'
      && typeof tcData.tcString === 'string' && tcData.tcString.length > 0
      && tcData.purpose?.consents?.[1] === true
      && tcData.vendor?.consents?.[755] === true;
    if (!allowed) {
      if (loaded && tcData.eventStatus === 'useractioncomplete') window.location.reload();
      return;
    }
    if (loaded) return;
    const configured = template.content.querySelector('script');
    if (!configured) return;
    loaded = true;
    const script = document.createElement('script');
    for (const attribute of configured.attributes) script.setAttribute(attribute.name, attribute.value);
    script.dataset.adsenseLoaded = 'true';
    document.head.appendChild(script);
  }
  let attempts = 0;
  function connect() {
    if (typeof window.__tcfapi !== 'function') return false;
    try { window.__tcfapi('addEventListener', 2, update); return true; }
    catch { return false; }
  }
  if (connect()) return;
  const timer = window.setInterval(() => {
    if (connect() || ++attempts >= 120) window.clearInterval(timer);
  }, 500);
})();
