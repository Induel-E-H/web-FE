Create a Pull Request from the current branch to `Induel-E-H/web-FE:develop`.

> Upstream repository: https://github.com/Induel-E-H/web-FE

---

## Step 1: Gather Information

Run these commands:

```bash
git branch --show-current
git log upstream/develop..HEAD --oneline
git diff upstream/develop..HEAD --stat
gh issue list -R Induel-E-H/web-FE --state open --json number,title,labels --limit 50
```

## Step 2: Determine PR Metadata

**Title Prefix** — pick the best fit from `.cz-config.cjs`:

- `✨ feat` — new feature
- `👹 fix` — bug fix
- `🔨 refactor` — structural/architectural change
- `⚡️ perf` — performance improvement
- `📝 docs` — documentation only
- `✅ test` — test code
- `⚙️ chore` — config / environment setup
- `🧹 clean` — minor code cleanup

**Label** — pick one:

- `✨ Feature` — feature implementation
- `👹 BugFix` — bug fix
- `📝 Docs` — documentation
- `🔧 Chore` — settings / config
- `🔨 Refactor` — code restructuring
- `🧹 Cleanup` — code cleanup

**Related Issues** — match the changes to open issues in `Induel-E-H/web-FE`.

- If the issue is **fully resolved** by this PR → `close #N`
- If the issue is **only partially addressed** → `#N` (mention only)

## Step 3: Write PR Body

Read `.github/PULL_REQUEST_TEMPLATE.md` and use it as the template structure.

## Step 4: Create the PR

```bash
BRANCH=$(git branch --show-current)
GH_USER=$(gh api user --jq '.login')
gh pr create \
  --repo Induel-E-H/web-FE \
  --base develop \
  --head $GH_USER:$BRANCH \
  --title "[PREFIX] [concise title]" \
  --label "[selected label]" \
  --body "$(cat <<'EOF'
[PR body here]
EOF
)"
```

## Step 5: Update Project End Date (only when `close #N` is used)

For each closed issue, update its End Date in the GitHub Project (project number: **1**) to today's date.

**5-1. Fetch project node ID, End Date field ID, and issue item ID in one query** (replace `ISSUE_NUMBER`):

```bash
gh api graphql -f query='
{
  organization(login: "Induel-E-H") {
    projectV2(number: 1) {
      id
      fields(first: 30) {
        nodes {
          __typename
          ... on ProjectV2Field {
            id
            name
          }
        }
      }
    }
  }
  repository(owner: "Induel-E-H", name: "web-FE") {
    issue(number: ISSUE_NUMBER) {
      projectItems(first: 10) {
        nodes {
          id
          project { number }
        }
      }
    }
  }
}'
```

From the response, extract:

- `organization.projectV2.id` → `PROJECT_ID`
- The field node whose `name` matches "End Date" (or similar) → `END_DATE_FIELD_ID`
- The `projectItems` node where `project.number == 1` → `ITEM_ID`

If there are multiple closed issues, repeat Steps 5-1 for each one.
