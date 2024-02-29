# deployments

## 1.5.0 / 2024-03-11

Adopted bobheadxi/deployments as KineticCafe/deployments, mostly to use Node
20 as required by GitHub.

```diff
- uses: bobheadxi/deployments@v1
+ uses: KineticCafe/deployments@v1
```

We recommend using a more specific version tag:

```diff
- uses: bobheadxi/deployments@v1
+ uses: KineticCafe/deployments@v1.5.0
```

- Switch from `npm` to `pnpm`

- Switch from `prettier` to `biome`.

- Upgrade to Typescript 5, @actions/github 6 and other dependencies.

- **Upgraded to use Node 20.**

- Apply bobheadxi/deployments#152 to allow required status contexts and
  auto merge.

  Changes were made to make the values cleaner and fix some incorrect
  assumptions.

- Apply bobheadxi/deploys#159 to add a warning when `delete-env` fails.

- Remove makefile

- Add a changelog file.

## 1.4.0 / 2023-01-19

- Bump actions/core by @johncarter-phntm in bobheadxi/deployments#124

- fix: delete env from settings by @devthejo in bobheadxi/deployments#134

- @johncarter-phntm made their first contribution in bobheadxi/deployments#124

- @devthejo made their first contribution in bobheadxi/deployments#134

## 1.3.0 / 2022-06-21

- [CI-fix] Run tests on PRs too by @paullarsen-unlikely in
  bobheadxi/deployments#109

- [BUGFIX] Don't deactivate already inactive deployments by
  @paullarsen-unlikely in bobheadxi/deployments#104

- @paullarsen-unlikely made their first contribution in
  bobheadxi/deployments#109

## 1.2.0 / 2022-05-10

- Make `delete-env` work as documented by @awesomeunleashed in
  bobheadxi/deployments#101

- default to the `${{ github.token }}` by @mxcl in bobheadxi/deployments#102

- @awesomeunleashed made their first contribution in bobheadxi/deployments#101

- @mxcl made their first contribution in bobheadxi/deployments#102

## 1.1.0 / 2022-02-28

This release adds the ability to provide the `payload` parameter for
deployment creation on `step: start` (bobheadxi/deployments#87)

## 1.0.1 / 2022-02-21

This release adds back the `auto_inactive` option that was originally removed.

## 1.0.0 / 2022-02-21

`bobheadxi/deployments@v1` brings a streamlined API, refactored codebase (now
complete with [integration testing][]), and more reliable behaviour. Thank you
to everyone who has used this action and contributed features, documentation,
and more!

⚠️ \*\*This release makes a number of following breaking changes from v0.6.x

- please migrate with care!\*\* If you run into any issues, please feel free to
  request help in [GitHub discussions][]:

- **CHANGED: `no_override` is now `override`**, and the default behaviour is
  `override: true` in `step: finish` (`step: start` behaviour remains
  unchanged, but you can now set `override: true` on it now as well).
- **CHANGED: `log_args` is now `debug`**, but does the same thing as before.

- **CHANGED: `env` is now always required**. You can use
  `env: ${{ steps.deployment.outputs.env }}` to avoid repeating your `env`
  configuration.

- ~**REMOVED: `auto_inactive`** - use `override` instead.~ This was added back
  in https://github.com/bobheadxi/deployments/releases/tag/v1.0.1.

- **REMOVED: `transient`** - all deployments created by this action are
  `transient` by default, with removals handled by `override` or
  `step: deactivate-env`.

- **ADDED: `step: delete-env`** deletes an environment entirely.

Then you can change your workflow to target the `v1` tag, and automatically
receive updates going forward:

```diff
- uses: bobheadxi/deployments@v0.6.2
+ uses: bobheadxi/deployments@v1
```

To preserve old behaviour, please ensure that you have your usage of
`bobheadxi/deployments` pinned to the desired version.

## 0.6.2 / 2021-12-28

- feat: allow any deployment status supported by github api by
  @nmccrina-contessa in bobheadxi/deployments#69

- upgrade dependencies

- @nmccrina-contessa made their first contribution in bobheadxi/deployments#69

## 0.6.1 / 2021-10-30

- upgrade to @actions/github v5 by @bobheadxi in bobheadxi/deployments#33

- package action with @vercel/ncc by @bobheadxi in bobheadxi/deployments#35

- Give a description when creating a deployment by @AlekseyLeshko in
  bobheadxi/deployments#58

- @AlekseyLeshko made their first contribution in bobheadxi/deployments#58

## 0.6.0 / 2021-06-11

- repository to update deployment status for can now be configured by the new
  `repository` parameter (bobheadxi/deployments#29)

- improved documentation for `log_args` (bobheadxi/deployments#31)

## 0.5.2 / 2021-03-11

- release: v0.5.2 bobheadxi/deployments#28

## 0.5.1 / 2021-02-23

- Fix invalid variable reference (bobheadxi/deployments#27)

## 0.5.0 / 2021-02-23

- document action parameters in `action.yml` (bobheadxi/deployments#23,
  bobheadxi/deployments#24)

- add `log_args` argument for debugging

## 0.4.3 / 2020-11-20

- document some action parameters (bobheadxi/deployments#23)

- update dependencies

## 0.4.2 / 2020-06-09

- add `auto_inactive` option to configure GitHub's default environment
  deactivation (bobheadxi/deployments#15)

- prune and update dependencies

## 0.4.1 / 2020-04-29

- `env_url` is now optional, as implied by documentation

- update typescript, @actions/\*

## 0.4.0 / 2020-04-09

- Allow ref to be set as part of the start step - this should allow users to
  hook onto `pull_request` events properly by providing
  `ref: ${{ github.head_ref }}` (bobheadxi/deployments#9 by @codyleblanc)

- The default behaviour of `no_override` has been fixed to not mark previous
  deployments as inactive (bobheadxi/deployments#10 by @shallwefootball)

## 0.3.0 / 2020-04-03

Adds new `deployment_id` option to avoid creating new deployments
(bobheadxi/deployments#7 by @AllexVeldman)

## 0.2.0 / 2020-01-02

New release with a [variety of fixes I've made since v0.1.0][since v0.1.0],
since this action seems to be getting a bit of attention.

## 0.1.0 / 2019-10-30

working MVP

## 0.0.4 / 2019-10-30

set initial state to `pending`

## 0.0.3 / 2019-10-30

Add node_modules to get actions working

## 0.0.2 / 2019-10-30

use `env_url` instead of `env-url`

## 0.0.1 / 2019-10-30

Prototype action

[integration testing]: https://github.com/bobheadxi/deployments/actions/runs/1879031987/workflow
[github discussions]: https://github.com/bobheadxi/deployments/discussions
[since v0.1.0]: https://github.com/bobheadxi/deployments/compare/v0.1.0...v0.2.0
