/* Tab navigation: show one panel at a time, persist via hash + localStorage */
(function () {
  const TABS = ["about", "experience", "publications", "skills", "recognition", "contact"];
  const STORE = "tm_portfolio_tab";

  const tabButtons = Array.from(document.querySelectorAll(".tab"));
  const panels = Array.from(document.querySelectorAll(".panel"));

  // Right-fade hint when tabs overflow
  function checkOverflow() {
    const wrap = document.querySelector(".tabs-wrap");
    const tabs = document.querySelector(".tabs");
    if (!wrap || !tabs) return;
    wrap.classList.toggle("has-overflow", tabs.scrollWidth > tabs.clientWidth + 2);
  }
  window.addEventListener("resize", checkOverflow);
  setTimeout(checkOverflow, 200);

  function activate(name, push) {
    if (!TABS.includes(name)) name = "about";

    panels.forEach((p) => p.classList.toggle("is-active", p.id === name));
    tabButtons.forEach((b) => {
      const on = b.dataset.tab === name;
      b.setAttribute("aria-selected", on ? "true" : "false");
    });

    try { localStorage.setItem(STORE, name); } catch (e) {}
    if (push && location.hash.slice(1) !== name) {
      history.replaceState(null, "", "#" + name);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  // wire tab clicks
  tabButtons.forEach((b) => {
    b.addEventListener("click", () => activate(b.dataset.tab, true));
  });

  // brand -> about
  const brand = document.querySelector(".brand");
  if (brand) {
    const go = () => activate("about", true);
    brand.addEventListener("click", go);
    brand.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  }

  // respond to hash navigation
  window.addEventListener("hashchange", () => {
    activate(location.hash.slice(1), false);
  });

  // initial: hash wins, else stored, else about
  let initial = location.hash.slice(1);
  if (!TABS.includes(initial)) {
    try { initial = localStorage.getItem(STORE) || "about"; } catch (e) { initial = "about"; }
  }
  activate(initial, true);
})();
