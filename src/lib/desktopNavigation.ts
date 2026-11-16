// Move one frame between the native disclosures so links retain their normal tab order.
export function setupDesktopNavigation(nav: HTMLElement) {
  const desktop = matchMedia("(min-width: 850px)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  nav.dataset.animated = "";
  const frame = document.createElement("div");
  frame.className = "mast-popup";
  const groups = Array.from(nav.querySelectorAll("details"), menu => ({
    menu,
    trigger: menu.querySelector("summary")!,
    links: menu.querySelector<HTMLElement>(".mast-drop")!,
  }));
  type Group = typeof groups[number];
  let active: Group | undefined;
  let pinned = false;
  let timer: number;
  let flight: Animation | undefined;
  let reveal: Animation | undefined;
  const ease = "cubic-bezier(.22,.8,.25,1)";

  function close() {
    clearTimeout(timer);
    if (active) active.menu.open = false;
    active = undefined;
    pinned = false;
  }

  function show(group: Group) {
    clearTimeout(timer);
    if (group === active || !desktop.matches) return;
    const previous = active;
    const from = previous && frame.getBoundingClientRect();
    flight?.cancel();
    reveal?.cancel();
    const oldLinks = frame.firstElementChild;
    if (oldLinks) frame.parentElement!.append(oldLinks);
    if (previous) previous.menu.open = false;
    active = group;
    pinned = false;
    group.menu.open = true;
    group.menu.append(frame);
    frame.replaceChildren(group.links);
    if (reduced.matches) return;
    const to = frame.getBoundingClientRect();
    const origin = from ? {
      translate: (from.left - to.left) + "px " + (from.top - to.top) + "px",
      width: from.width + "px", height: from.height + "px",
    } : { opacity: 0, scale: .9 };
    flight = frame.animate([origin, {
      translate: "0px 0px", width: to.width + "px", height: to.height + "px", scale: 1, opacity: 1,
    }], { duration: from ? 320 : 220, easing: ease });
    if (previous) {
      const offset = groups.indexOf(previous) < groups.indexOf(group) ? 24 : -24;
      reveal = group.links.animate([{ opacity: 0, translate: offset + "px 0" }, { opacity: 1, translate: "0 0" }],
        { duration: 260, easing: ease });
    }
  }

  for (const group of groups) {
    group.trigger.addEventListener("pointerenter", event => {
      if (event.pointerType !== "mouse" || !desktop.matches) return;
      clearTimeout(timer);
      if (group !== active) timer = window.setTimeout(() => show(group), active ? 35 : 100);
    });
    group.trigger.addEventListener("click", event => {
      if (!desktop.matches) return;
      event.preventDefault();
      if (group === active && (pinned || event.detail === 0)) close();
      else { show(group); pinned = true; }
    });
    group.trigger.addEventListener("keydown", event => {
      if (event.key !== "ArrowDown") return;
      event.preventDefault();
      show(group);
      group.links.querySelector("a")?.focus();
    });
  }
  nav.addEventListener("pointerleave", () => {
    clearTimeout(timer);
    if (!pinned && !frame.contains(document.activeElement)) timer = window.setTimeout(close, 180);
  });
  frame.addEventListener("pointerenter", () => clearTimeout(timer));
  nav.addEventListener("pointerover", event => {
    if ((event.target as Element).closest(".mast-links > a, .mast-contact")) close();
  });
  nav.addEventListener("focusout", event => {
    if (active && event.relatedTarget && !active.menu.contains(event.relatedTarget as Node)) close();
  });
  document.addEventListener("click", event => {
    const target = event.target as Element;
    if (!nav.contains(target) || target.closest("a, [data-contact-open]")) close();
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !active) return;
    const trigger = active.trigger;
    const restore = nav.contains(document.activeElement);
    close();
    if (restore) trigger.focus();
  });
  return close;
}
