# Claude Prompt for Fishing God

Use this prompt when asking Claude to review the current state of the project and propose the best next work.

---

## Prompt

You are reviewing an existing mobile + backend aquaculture product called **Fishing God**.

Before answering, carefully read the file:

- [PROJECT_STATUS.md](/Users/pranjalupadhyay/Desktop/projects/fishery_app/PROJECT_STATUS.md)

That file is the source of truth for:

- what features already exist
- which ones are fully working
- which ones are only partially wired
- which parts are stale, fragile, or missing
- what the current architecture looks like

Do **not** assume the app is greenfield.  
Do **not** suggest generic startup features without checking whether related foundations already exist.  
Base your recommendations on the actual current state described in `PROJECT_STATUS.md`.

## What I want from you

Please give me a detailed, practical response with these sections:

### 1. Executive Summary

- Summarize the app’s current maturity honestly.
- Tell me what is strongest already.
- Tell me what is holding the product back most.

### 2. Best Order to Complete Partially Working Features

Rank the incomplete or partially wired features in the **best implementation order**.

For each item, explain:

- why it should come now
- what user value it unlocks
- what technical dependencies it has
- whether it is a quick win, medium effort, or major feature

### 3. Top 3 Completion Plans

Choose the **top 3 most important incomplete areas** and give a detailed implementation plan for each.

For each of the top 3, include:

- goal
- current gap
- frontend changes needed
- backend changes needed
- database/schema changes if needed
- risks or edge cases
- recommended sequence of tasks
- how to know when it is truly complete

### 4. New Features That Fit This Product

Suggest **new features worth adding** that fit the current architecture and product direction.

Prioritize features that are:

- useful for Indian aquaculture users
- realistic to build on top of the current codebase
- aligned with the existing knowledge-backed and beginner-friendly direction

For each feature, explain:

- why it matters
- which existing modules it builds on
- whether it is low, medium, or high effort

### 5. Codebase Risks / Refactors

Identify any risks, inconsistencies, or refactors that should happen before the app scales further.

Examples:

- partial feature wiring
- duplicate data paths
- weak auth enforcement
- local-only profile logic
- pond data not connected across modules
- confusing data model boundaries

For each risk, explain:

- the real problem
- what it could break later
- whether it should be fixed now or later

### 6. Recommended Next PRs

Propose the **next 5 PRs or implementation chunks** that should be done.

For each PR, include:

- PR title
- scope
- why it is useful
- rough difficulty

## Product constraints you must respect

Please keep these in mind while recommending work:

- This app is for aquaculture and fisheries users in India.
- The app should remain beginner-friendly.
- The app already has a knowledge-backed subsidy/policy layer.
- The app already has economics simulation as a core strength.
- The app should not be turned into a totally different product.
- Avoid suggesting a full rewrite unless absolutely necessary.
- Prefer extending the current mobile app + Express backend + PostgreSQL architecture.
- Keep pond management, water quality, learning, subsidy, and ROI tightly connected.

## Areas I especially care about

Please pay extra attention to these areas when you analyze the product:

- pond lifecycle management
- pond-linked water quality
- real notifications
- better beginner education
- project template selection in economics
- stronger profile/auth integration
- richer knowledge-base usage

## Style of response I want

Please be concrete and opinionated.

I do **not** want:

- vague feature brainstorming
- generic startup advice
- generic “improve UX” statements without specifics

I **do** want:

- prioritization
- implementation reasoning
- realistic sequencing
- architectural awareness
- product thinking tied to actual user value

## Optional extra

If useful, end with:

- a **30-day roadmap**
- and a **“best single next move”** recommendation

---

## Short version

If you want a shorter version of the same prompt, use this:

> Read `PROJECT_STATUS.md` carefully and act like a product-minded senior engineer reviewing the current Fishing God app. Tell me:
> 1. the best order to complete the partially working features,
> 2. the top 3 incomplete areas and exactly how to implement them,
> 3. the best new features that fit the existing architecture,
> 4. any codebase risks/refactors I should handle before scaling,
> 5. the next 5 PRs I should make.
> Be specific, architecture-aware, and grounded in the actual current app state.

