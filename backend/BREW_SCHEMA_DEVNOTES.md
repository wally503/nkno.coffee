# nkno.coffee — Brew App Schema Reference
 
The core model for the `brew` Django app. Captures the three-tier design, the rename
plan against the current schema, and the deliberately deferred pieces.
 
---
 
## The three tiers
 
```
RecipeTemplate ─< Recipe ─< BrewSession
   (holes)         (filled,     (records reuse:
                    named,        recipe_id, bean_id,
                    reusable)     date, notes, rating)
 
      Recipe ─< RecipeSetting   (the filled holes — recipe owns its values)
```
 
### 1. `RecipeTemplate` — the shape
 
- Holes + steps + token markup. **No values, no bean.**
- Token markup: prose with `[[grinder.grind_size]]`-style holes naming which settings
  this template cares about, plus step structure/order.
- Bean-agnostic and run-agnostic. Stands completely alone.
- This is the renamed current `BrewRecipe`.
- The template is the **axis** that makes recipes under it comparable — same holes,
  same units, so temp means temp across every recipe that fills it.
### 2. `Recipe` — the filled, named baseline
 
- Points at a `RecipeTemplate`. Owns its hole-fills (the values).
- Named, reusable, stands alone. Independent of any run or bean.
- A "nudge" that changes a value = a **new `Recipe`**, not a session-level diff.
- The knot that binds: template (which holes) + fills (what's in them) + an identity
  a session can point at. Thin on its own — its job is to be the join.
- **Genuinely new table** — did not exist before.
### 3. `RecipeSetting` — the hole-fills
 
- Belongs to `Recipe`. "Template hole X is filled with value Y, for this recipe."
- This is your existing bridge pattern (`BrewRecipeGrinderSetting` etc.), re-parented
  to `Recipe` and renamed.
- Static fill. Answers "what is this recipe."
### `BrewSession` — the run
 
- Points at a `Recipe` (`recipe_id`) — **this FK is where reuse is recorded.**
  Many sessions → one recipe. The recipe doesn't know who ran it; each session declares it.
- Also carries: `bean_id`, date/time, rating, free notes/remarks.
- **No fills of its own. No adjustment children.** It got simpler.
---
 
## What changed (rename + re-scope pass, not a rebuild)
 
| Current | Becomes | Note |
|---|---|---|
| `BrewRecipe` | `RecipeTemplate` | holes/steps/markup only, no values |
| — | `Recipe` | **new tier**: template FK + fills + name, reusable |
| `BrewRecipeGrinderSetting` / `BrewRecipeVesselSetting` | `RecipeGrinderSetting` / … | re-parent to `Recipe` |
| `SessionAdjustment` | **deleted** | role absorbed by `Recipe`'s owned fills |
| `BrewSession` | (slimmed) | keeps `recipe_id` + `bean_id` + metadata; drops adjustment children |
 
**The one real structural change:** hole-fills moved *up* from session to recipe.
Everything else is labels. A value bound to a hole now belongs to a `Recipe`, and a
nudge that changes a value makes a new `Recipe`.
 
**Untouched:** `BrewMethodDispatch`, equipment leaves (`Grinder`, `Water`, `Cup`,
`BrewVessel`, settings sub-tables), `BrewCampaign`.
 
---
 
## Why the fills live on the recipe (not the session)
 
The recipe has to be **self-describing** — you can't ask "what's filled?" if the fills
live somewhere else. The recipe holds its own values, full stop.
 
Comparison is therefore **recipe-to-recipe** along the shared template axis. Two recipes
2° apart off the same pourover template, each run clean many times — "did the 2° matter"
is a plain join over their settings + the sessions' outcomes. This is the disciplined
A/B mode: bake the difference into named recipes, run each cleanly, compare.
 
`SessionAdjustment` is gone because it was doing two jobs under a session-scoped name:
it was standing in as both the recipe's fills *and* per-run drift. Splitting fixed it —
fills belong to the recipe; drift resolves to *a new recipe*.
 
---
 
## The brew-start flow (four value-set sources)
 
When starting a run, pick where the starting values come from:
 
1. **Use last recipe (overall)** — most recent session's recipe, any bean. New-bean fallback.
2. **Use last recipe used on this bean** — most recent session where `bean_id = X`. Daily driver.
3. **Pick from ones already used on this bean** — a list of prior recipes for this bean.
4. **Stem from an existing recipe never used** — a `Recipe` with no session history.
Building a *new* template/recipe is a separate authoring screen you route to — not a
fifth source in the picker. Keep "start a brew" and "define a recipe" separate.
 
Paths 1–3 inherit from prior sessions' recipes (query, not stored pointer). Only path 4
touches a recipe with no run history.
 
---
 
## `BrewCampaign` — optional overlay
 
- Nullable tag grouping sessions into a **declared** deliberate dial-in effort.
- Owns neither bean nor recipe — sessions keep their own FKs. Campaign just points at
  a bag of sessions with start / end / status / note.
- Exists only to preserve the seam you **can't infer**: "day 3-5" vs "day 10-15" against
  the same bean is two efforts, and a time-gap heuristic can't read intent.
- **Most brews have no campaign.** Default path is a plain session. A campaign is a thing
  you reach for on purpose when you know you're starting a multi-session dial-in.
- If most campaigns end up single-session, it's ceremony — keep it optional and lazy so
  the common path pays zero tax.
---
 
## Deferred (logged, not open)
 
**Discrimination on slight adjusts** — telling near-identical recipes apart (six recipes
differing by 2°). Presentation/labeling problem, not schema. Data supports the distinction;
surfacing "these differ only in temp" is a picker-UI question. Solve when building the picker.
 
**Duplication risk** — "50 recipes basically the same." Real, later-sort. Eventual fix shape:
a cheap identity per recipe (hash of template + sorted settings, or a uniqueness check at save)
so you can spot "I already have this exact value set." Not now.
 
**`BeanProfile` / `TweakHeuristic`** — horizon only. Findings like "high-elevation natural →
grind one finer" become a table *after* the data shows the rule, never before. Building the
heuristic table before you have findings is speculative structure. Scaffolded in your head, not
in migrations.
 
**Fork copy-vs-reference** — when a process/object tweak forks a new recipe, does the fork
*copy* the parent's tokens/values or *reference* the parent and store only the delta? Copy =
self-contained, legible by eye. Reference = DRYer but walks a parent chain to render. Decide
when wiring the "start fresh / borrow-and-tweak" path. Doesn't block anything upstream.
 
---
 
## Build order (the keystone)
 
Do **not** start with a viewset. Start with:
 
1. **Recipe authoring + token resolver** — a `Recipe` can't be a baseline until you can
   build one and resolve its bindings. Every brew path and every analytics query stands on this.
2. **Sessions** reading a recipe back as a value set.
3. **The four-source picker** (brew-start screen).
4. Campaigns, analytics — hang off the above.
The resolver reads: take the recipe's filled values → render the template's holes filled.
Clean recipe of the day = recipe's values, nothing overridden.