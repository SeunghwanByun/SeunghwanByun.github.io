(function () {
  var container = document.querySelector(".comments .giscus");
  if (!container) return;

  var script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";

  var attrs = {
    "data-repo": "SeunghwanByun/SeunghwanByun.github.io",
    "data-repo-id": "R_kgDOQH1YrQ",
    "data-category": "Announcements",
    "data-category-id": "DIC_kwDOQH1Yrc4DLtAP",
    "data-mapping": "pathname",
    "data-strict": "1",
    "data-reactions-enabled": "1",
    "data-emit-metadata": "0",
    "data-input-position": "top",
    "data-theme": "light",
    "data-lang": "ko",
    "data-loading": "lazy"
  };
  Object.keys(attrs).forEach(function (key) {
    script.setAttribute(key, attrs[key]);
  });

  container.appendChild(script);
})();
