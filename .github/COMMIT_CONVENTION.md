## Git Commit Message Convention

> This is adapted from [Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular).

#### TL;DR:

Messages must be matched by the following regex:

```js
/^(revert: )?(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|types|wip)(\(.+\))?: .{1,72}/;
```

#### Examples

Feature for Issue #76:

```
feat(#76): add method
```

Feature for Guilds:

```
feat(guilds): add method
```

Bug Fixes for issue #28:

```
fix(#34): handle processing correctly
```

Appears under "Performance Improvements" header, and under "Breaking Changes" with the breaking change explanation:

```
perf(core): improve patching by removing 'bar' option

BREAKING CHANGE: The 'bar' option has been removed.
```

The following commit and commit `f1fb028` do not appear in the changelog if they are under the same release. If not, the revert commit appears under the "Reverts" header.

```
revert: feat(#23): add

This reverts commit f1fb028a978f4319baf196641d34a637.
```

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body, it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

If the prefix is `feat`, `fix` or `perf`, it will appear in the changelog. However, if there is any [BREAKING CHANGE](#footer), the commit will always appear in the changelog.

Other prefixes are up to your discretion. Suggested prefixes are `docs`, `chore`, `style`, `refactor`, and `test` for non-changelog related tasks.

### Scope

The scope can be either the issue number or any other text that helps to identify the commit to a feature area.

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.
