(function () {
  var container = document.querySelector(".related-posts");
  if (!container) return;

  var currentId = container.getAttribute("data-post-id");

  fetch("../assets/posts.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("Failed to load posts manifest");
      return response.json();
    })
    .then(function (posts) {
      var current = posts.filter(function (post) {
        return post.id === currentId;
      })[0];
      if (!current) {
        container.hidden = true;
        return;
      }

      var scored = posts
        .filter(function (post) {
          return post.id !== currentId;
        })
        .map(function (post) {
          return { post: post, score: jaccard(current.categories, post.categories) };
        })
        .sort(function (a, b) {
          return b.score - a.score;
        });

      var top = scored.filter(function (entry) {
        return entry.score > 0;
      });
      if (top.length === 0) {
        top = scored;
      }
      top = top.slice(0, 3);

      if (top.length === 0) {
        container.hidden = true;
        return;
      }

      var list = container.querySelector("ul");
      top.forEach(function (entry) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = entry.post.url;
        a.textContent = entry.post.title;
        li.appendChild(a);
        list.appendChild(li);
      });
    })
    .catch(function () {
      container.hidden = true;
    });

  function jaccard(a, b) {
    var setA = {};
    var setB = {};
    (a || []).forEach(function (item) {
      setA[item] = true;
    });
    (b || []).forEach(function (item) {
      setB[item] = true;
    });

    var intersection = 0;
    var unionKeys = {};
    Object.keys(setA).forEach(function (key) {
      unionKeys[key] = true;
      if (setB[key]) intersection += 1;
    });
    Object.keys(setB).forEach(function (key) {
      unionKeys[key] = true;
    });

    var unionSize = Object.keys(unionKeys).length;
    return unionSize === 0 ? 0 : intersection / unionSize;
  }
})();
