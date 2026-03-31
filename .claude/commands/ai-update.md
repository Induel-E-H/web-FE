Update `CLAUDE.md` to reflect the current state of the codebase.

---

## Step 1: Scan the codebase

Run these commands in parallel:

```bash
# All source files (for Project Structure)
find src -type f | sort

# Dependencies (for Tech Stack)
cat package.json

# Vite config (for Build System / Development Server)
cat vite.config.ts
```

## Step 2: Identify what has changed

Compare the scan results against the current `CLAUDE.md` and identify:

1. **Project Structure** — files or directories added/removed under `src/`
2. **Tech Stack** — new or removed packages in `package.json` that are user-facing (ignore dev tooling already listed)
3. **Build System / Development Server** — any changes in `vite.config.ts`

Do NOT change sections that have not actually changed.

## Step 3: Update CLAUDE.md

Apply only the changes identified in Step 2.

### Project Structure rules

- Regenerate the full file tree under `# Project Structure`
- Include only real files (no `.gitkeep`)
- Add a short `# comment` for non-obvious files
- Mark empty or placeholder layers as `(WIP)`
- Keep the FSD layer order: `app → pages → widgets → features → entities → shared`

### Tech Stack rules

- List only libraries the project actually uses at runtime or build time
- Format: `- LibraryName vX.Y.Z — one-line description`
- Do not list ESLint/Prettier plugins individually; keep them as single entries

### Other sections

- Only update if the corresponding config file has materially changed
- Do not rewrite prose that is still accurate

## Step 4: Confirm

After editing, briefly summarize in Korean what was updated and what was left unchanged.
