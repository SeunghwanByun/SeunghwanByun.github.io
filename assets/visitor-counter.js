(function () {
  var endpoint = "https://icount.kr/api.php?id=seunghwanbyun.github.io";

  fetch(endpoint)
    .then(function (response) {
      if (!response.ok) throw new Error("Visitor counter request failed");
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
      // The external widget remains the source of truth if the API is unavailable.
    });
})();
