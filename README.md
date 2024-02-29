# GitHub Deployments [![View Action][view-action-badge]][action-url] [![pipeline][pipeline-badge]][pipeline-yaml]

`KineticCafe/deployments` is a fork of [bobheadxi/deployments][] upgraded to
support Node 20.

`deployments` is a [GitHub Action][github-actions] for working painlessly with
[GitHub deployment statuses][deployment-statuses]. Instead of exposing
convoluted Action configuration that mirrors that of the [GitHub
API][deployments-api] like some of the other available Actions do, this Action
simply exposes a number of configurable, easy-to-use "steps" common to most
deployment life cycles.

- [Configuration](#configuration)
  - [`step: start`](#step-start)
  - [`step: finish`](#step-finish)
  - [`step: deactivate-env`](#step-deactivate-env)
  - [`step: delete-env`](#step-delete-env)
- [Debugging](#debugging)

A simple example:

```yml
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: start deployment
        uses: KineticCafe/deployments@v1
        id: deployment
        with:
          step: start
          token: ${{ secrets.GITHUB_TOKEN }}
          env: release

      - name: do my deploy
        # ...

      - name: update deployment status
        uses: KineticCafe/deployments@v1
        if: always()
        with:
          step: finish
          token: ${{ secrets.GITHUB_TOKEN }}
          status: ${{ job.status }}
          env: ${{ steps.deployment.outputs.env }}
          deployment_id: ${{ steps.deployment.outputs.deployment_id }}
```

## Configuration

The following [`inputs`][actions-input] configuration options are for _all steps_:

| Variable     | Default                      | Purpose                                                                                                                                |
| ------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `step`       |                              | One of [`start`](#step-start), [`finish`](#step-finish), [`deactivate-env`](#step-deactivate-env), or [`delete-env`](#step-delete-env) |
| `token`      | `${{ github.token }}`        | provide your `${{ github.token }}` or `${{ secrets.GITHUB_TOKEN }}` for API access                                                     |
| `env`        |                              | identifier for environment to deploy to (e.g. `staging`, `prod`, `main`)                                                               |
| `repository` | Current repository           | target a specific repository for updates, e.g. `owner/repo`                                                                            |
| `logs`       | URL to GitHub commit checks  | URL of your deployment logs                                                                                                            |
| `desc`       | GitHub-generated description | description for this deployment                                                                                                        |
| `ref`        | `github.ref`                 | Specify a particular git ref to use, (e.g. `${{ github.head_ref }}`)                                                                   |

### `step: start`

This is best used on the `push: { branches: [ ... ] }` event, but you can also
have `release: { types: [ published ] }` trigger this event. `start` should be
followed by whatever deployment tasks you want to do, and it creates and marks
a deployment as "started":

![deploy started](.static/start.png)

In addition to the [core configuration](#configuration), the following
[`inputs`][actions-input] are available:

| Variable            | Default    | Purpose                                                                                                                    |
| ------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `deployment_id`     |            | Use an existing deployment instead of creating a new one (e.g. `${{ github.event.deployment.id }}`)                        |
| `override`          | `false`    | whether to mark existing deployments of this environment as inactive                                                       |
| `auto_merge`        | `false`    | Attempts to automatically merge the default branch into the requested ref, if it's behind the default branch.              |
| `required_contexts` | `''`       | The names of any status contexts to verify against, separated by newlines. To bypass checking entirely, pass a string `''` |
| `payload`           |            | JSON-formatted dictionary with extra information about the deployment                                                      |
| `task`              | `'deploy'` | change the task associated with this deployment, can be any string                                                         |

The following [`outputs`][actions-output] are available:

| Variable        | Purpose                                |
| --------------- | -------------------------------------- |
| `deployment_id` | ID of created GitHub deployment        |
| `status_id`     | ID of created GitHub deployment status |
| `env`           | name of configured environment         |

<details><summary>Simple Push Example</summary>

```yml
on:
  push:
    branches:
      - main

jobs:
  deploy:
    steps:
      - name: start deployment
        uses: KineticCafe/deployments@v1
        id: deployment
        with:
          step: start
          env: release

      - name: do my deploy
        # ...
```

</details>

<br />

<details><summary>Simple Pull Request Example</summary>

```yml
on:
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: start deployment
        uses: KineticCafe/deployments@v1
        id: deployment
        with:
          step: start
          env: integration

      - name: do my deploy
        # ...
```

</details>

### `step: finish`

This is best used after `step: start` and should follow whatever deployment
tasks you want to do in the same workflow.
`finish` marks an in-progress deployment as complete:

![deploy finished](.static/finish.png)

In addition to the [core configuration](#configuration), the following
[`inputs`][actions-input] are available:

| Variable        | Default | Purpose                                                                                                                                                                                                             |
| --------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`        |         | provide the current deployment job status `${{ job.status }}`                                                                                                                                                       |
| `deployment_id` |         | identifier for deployment to update (see outputs of [`step: start`](#step-start))                                                                                                                                   |
| `env_url`       |         | URL to view deployed environment                                                                                                                                                                                    |
| `override`      | `true`  | whether to manually mark existing deployments of this environment as inactive                                                                                                                                       |
| `auto_inactive` | `false` | whether to let GitHub handle marking existing deployments of this environment as inactive ([if and only if a new deployment succeeds](https://docs.github.com/en/rest/reference/deployments#inactive-deployments)). |

<details><summary>Simple Example</summary>

```yml
# ...

jobs:
  deploy:
    steps:
      - name: start deployment
        # ... see previous example

      - name: do my deploy
        # ...

      - name: update deployment status
        uses: KineticCafe/deployments@v1
        if: always()
        with:
          step: finish
          token: ${{ secrets.GITHUB_TOKEN }}
          status: ${{ job.status }}
          env: ${{ steps.deployment.outputs.env }}
          deployment_id: ${{ steps.deployment.outputs.deployment_id }}
```

</details>

### `step: deactivate-env`

This is best used on the `pull_request: { types: [ closed ] }` event, since
GitHub does not seem to provide a event to detect when branches are deleted.
This step can be used to automatically shut down deployments you create on pull
requests and mark environments as destroyed:

![env destroyed](.static/destroyed.png)

Refer to the [core configuration](#configuration) for available
[`inputs`][actions-input].

<details><summary>Simple Example</summary>

```yml
on:
  pull_request:
    types: [closed]

jobs:
  prune:
    steps:
      # see https://dev.to/bobheadxi/branch-previews-with-google-app-engine-and-github-actions-3pco
      - name: extract branch name
        id: get_branch
        shell: bash
        env:
          PR_HEAD: ${{ github.head_ref }}
        run: echo "##[set-output name=branch;]$(echo ${PR_HEAD#refs/heads/} | tr / -)"

      - name: do my deployment shutdown
        # ...

      - name: mark environment as deactivated
        uses: KineticCafe/deployments@v1
        with:
          step: deactivate-env
          token: ${{ secrets.GITHUB_TOKEN }}
          env: ${{ steps.get_branch.outputs.branch }}
          desc: Environment was pruned
```

</details>

### `step: delete-env`

This is the same as `deactivate-env`, except deletes the environment entirely.
See [`step: deactivate-env`](#step-deactivate-env) for more details.

Note that the default `GITHUB_TOKEN` does not allow environment deletion - you
have to set a personal access token with repo scope from an account with repo
admin permissions and provide it in the `token` input.

Refer to the [core configuration](#configuration) for available
[`inputs`][actions-input].

## Debugging

The argument `debug: true` can be provided to print arguments used by
`deployments` and log debug information.

If you run into an problems or have any questions, feel free to open an
[issue][]!

[bobheadxi/deployments]: https://github.com/bobheadxi/deployments
[view-action-badge]: https://img.shields.io/badge/view-github%20action-yellow.svg

<!-- TODO: Replace this -->

[action-url]: https://bobheadxi.dev/r/deployments/
[pipeline-badge]: https://github.com/KineticCafe/deployments/actions/workflows/pipeline.yaml/badge.svg
[pipeline-yaml]: https://github.com/KineticCafe/deployments/actions/workflows/pipeline.yaml
[github-actions]: https://github.com/features/actions
[deployment-statuses]: https://docs.github.com/en/rest/reference/deployments
[deployments-api]: https://developer.github.com/v3/repos/deployments/
[actions-input]: https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstepswith
[actions-output]: https://help.github.com/en/actions/automating-your-workflow-with-github-actions/contexts-and-expression-syntax-for-github-actions#steps-context
[issue]: (https://github.com/KineticCafe/deployments/issues)
