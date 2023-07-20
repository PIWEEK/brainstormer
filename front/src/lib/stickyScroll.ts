
export function activateStickyScroll(mainElement: HTMLElement) {
  let currentScrollStart: number | undefined;
  let inView = new Set<HTMLElement>();

  function startObservers() {
    const intersectOpts = {
      root: mainElement,
    };
    const intersectObs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          inView.add(entry.target as HTMLElement);
        } else {
          inView.delete(entry.target as HTMLElement);
        }
      }
    }, intersectOpts);

    const lists = document.querySelectorAll(".topics");

    for (const el of lists) {
      intersectObs.observe(el);
    }
    const mutationObs = new MutationObserver((entries) => {
      for (const entry of entries) {
        for (const added of entry.addedNodes) {
          if (added instanceof HTMLElement &&
            added?.classList?.contains("topics")) {
            intersectObs.observe(added);
          }
        }
      }
    });
    const mutationOptions = {
      childList: true,
    };
    mutationObs.observe(mainElement, mutationOptions);
  }

  function handleScroll(event: Event) {
    if (currentScrollStart === undefined) {
      currentScrollStart = (event.target as HTMLElement).scrollLeft
    }
  }

  function handleScrollEnd(event: Event) {
    const positions: Array<[HTMLElement, number]>
      = [...inView].map((e: HTMLElement) => [e, e.offsetLeft])

    let targetOffset: number;

    if (currentScrollStart === undefined) {
      return;
    }

    if (((event.target as HTMLElement).scrollLeft - currentScrollStart) > 0) {
      targetOffset = Math.max(...positions.map(e => e[1]));
    } else {
      targetOffset = Math.min(...positions.map(e => e[1]));
    }
    const entry = positions.find(([el, offset]) => offset === targetOffset);
    if (entry) {
      const el = entry[0];
      el?.scrollIntoView({ behavior: "smooth", inline: "center" });
    }

    currentScrollStart = undefined;
  }


  mainElement.addEventListener("scroll", handleScroll);
  mainElement.addEventListener("scrollend", handleScrollEnd);
  startObservers();
}

