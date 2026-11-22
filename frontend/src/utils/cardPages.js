// How much vertical room a home card takes, in "short card" units.
// Mirrors the show/hide conditions in BagProgressCard.
export function cardWeight(bean) {
    const isOpen = (bean.pool_state ?? (bean.opened_on ? "open" : "sealed")) === "open";
    const hasLots = (bean.lots?.length ?? 0) > 0;

    let weight = 1;
    if (bean.opened_on) weight += 0.5;        // grind row
    if (hasLots || isOpen) weight += 0.5;     // progress bar row
    return weight;
}

// Fill pages in order until the next card would go over the budget.
export function buildPages(beans, budget) {
    const pages = [];
    let current = [];
    let used = 0;

    for (const bean of beans) {
        const weight = cardWeight(bean);
        if (current.length > 0 && used + weight > budget) {
            pages.push(current);
            current = [];
            used = 0;
        }
        current.push(bean);
        used += weight;
    }
    if (current.length > 0) pages.push(current);
    return pages;
}