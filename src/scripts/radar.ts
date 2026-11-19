// Progressive enhancement for the radar: tooltips on blips, linked highlighting
// between the chart and the blip list, and the ring filter. Everything works
// without it; the list and the blip links are plain HTML.

const ACTIVE = 'is-active';

function setActive(id: string, active: boolean) {
  const selector = `.radar__blip[data-blip="${CSS.escape(id)}"], [data-blip-item="${CSS.escape(id)}"]`;
  for (const el of document.querySelectorAll(selector)) {
    el.classList.toggle(ACTIVE, active);
  }
}

for (const radar of document.querySelectorAll<HTMLElement>('[data-radar]')) {
  const tooltip = radar.querySelector<HTMLElement>('[data-radar-tooltip]')!;

  for (const blip of radar.querySelectorAll<SVGAElement>('.radar__blip')) {
    const id = blip.dataset.blip!;
    blip.addEventListener('pointerenter', () => {
      setActive(id, true);
      const box = blip.getBoundingClientRect();
      const frame = radar.getBoundingClientRect();
      tooltip.textContent = blip.dataset.title ?? '';
      tooltip.style.left = `${box.left + box.width / 2 - frame.left}px`;
      tooltip.style.top = `${box.top - frame.top}px`;
      tooltip.hidden = false;
    });
    blip.addEventListener('pointerleave', () => {
      setActive(id, false);
      tooltip.hidden = true;
    });
  }
}

for (const item of document.querySelectorAll<HTMLElement>('[data-blip-item]')) {
  const id = item.dataset.blipItem!;
  item.addEventListener('pointerenter', () => setActive(id, true));
  item.addEventListener('pointerleave', () => setActive(id, false));
  item.addEventListener('focusin', () => setActive(id, true));
  item.addEventListener('focusout', () => setActive(id, false));
}

const filter = document.querySelector<HTMLFormElement>('[data-ring-filter]');
if (filter) {
  const applyFilter = (ring: string) => {
    const all = ring === 'all';
    for (const blip of document.querySelectorAll<SVGAElement>('.radar__blip')) {
      blip.classList.toggle('is-dimmed', !all && blip.dataset.ring !== ring);
    }
    for (const group of document.querySelectorAll<HTMLElement>('[data-ring-group]')) {
      group.hidden = !all && group.dataset.ringGroup !== ring;
    }
    for (const quadrant of document.querySelectorAll<HTMLElement>('[data-quadrant-list]')) {
      const empty = quadrant.querySelector<HTMLElement>('[data-empty-note]')!;
      empty.hidden = [...quadrant.querySelectorAll<HTMLElement>('[data-ring-group]')].some((g) => !g.hidden);
    }
    const url = new URL(window.location.href);
    if (all) url.searchParams.delete('ring');
    else url.searchParams.set('ring', ring);
    history.replaceState(null, '', url);
  };

  const requested = new URLSearchParams(window.location.search).get('ring');
  const initial = filter.querySelector<HTMLInputElement>(`input[value="${CSS.escape(requested ?? 'all')}"]`);
  if (initial) {
    initial.checked = true;
    applyFilter(initial.value);
  }
  filter.addEventListener('change', (event) => {
    applyFilter((event.target as HTMLInputElement).value);
  });
}
