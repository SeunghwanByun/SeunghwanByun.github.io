(function () {
  var endpoint = "assets/visitor-stats.json";

  fetch(endpoint, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("Visitor stats request failed");
      return response.json();
    })
    .then(function (stats) {
      var values = {
        today: stats.today && stats.today.pv,
        yesterday: stats.yesterday && stats.yesterday.pv,
        total: stats.total && stats.total.pv
      };

      Object.keys(values).forEach(function (key) {
        var target = document.querySelector('[data-counter="' + key + '"]');
        if (target && typeof values[key] === "number") {
          target.textContent = values[key].toLocaleString("en-US");
        }
      });
    })
    .catch(function () {
      // assets/visitor-stats.json is generated periodically by a GitHub Action.
    });
})();
