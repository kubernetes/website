---
title: Opening a pull request
slug: new-content
content_template: templates/concept
weight: 10
card:
  name: contribute
  weight: 40
---

{{% capture overview %}}

{{< note >}}
**Kubernetes code developers**: If you are documenting a new feature for an
upcoming Kubernetes release, your process is a bit different. See
[Document a new feature](/docs/contribute/new-content/new-features/) for
{{< /note >}}

To contribute new content pages or improve existing content pages, open a _pull request_ (PR). Make sure you follow all the requirements in the [Before you begin](#before-you-begin) section.

If your change is only a few lines long, or you're not that familiar with git, read "[Small changes](#small-changes)" to learn how to quickly edit a page.

If your changes are larger, or span multiple pages, read "[Large changes](#large-changes)" to learn how to fork the Kubernetes website repository.

{{% /capture %}}

{{% capture body %}}

## Small changes {#small-changes}

If you're less experienced with Git workflows, this is an easier method of
opening a pull request.

1.  On the page where you see the issue, click the pencil icon at the top right.
    Alternatively, scroll to the bottom of the page and click **Edit this page**.

2.  Make your changes in the GitHub markdown editor.

    {{< note >}}
    If you have not forked the Kubernetes website repository before, editing in
    GitHub automatically creates a fork.
    {{< /note >}}

3.  Below the editor, fill in the **Propose file change**
    form. In the first field, give your commit message a title. In
    the second field, provide a description.

    {{< note >}}
    Do reference other GitHub issues or pull
    requests in your commit message. You can add those to the pull request
    description later.
    {{< /note >}}

4.  Click **Propose file change**. The change is saved as a commit in a
    new branch in your fork.

    The next screen compares your new
    branch (the **head fork** and **compare** selection boxes) to the current
    state of the **base fork** and **base** branch (`master` on the
    `kubernetes/website` repository by default).

5.  Look at the difference
    viewer at the bottom of the screen, and if everything looks right, click
    **Create pull request**.

    {{< note >}}
    If you don't want to create the pull request now, you can do it
    later. Browse to the main URL of the Kubernetes website repository or
    your fork's repository. The GitHub website prompts you to create a
    pull request if it detects a new branch pushed to your fork.
    {{< /note >}}

6.  The **Open a pull request** screen appears. Fill in the form:
    - The **Subject** field of the pull request defaults to the commit summary.
    You can change it if needed.
    - The **Body** contains your extended commit message, if you have one,
    and some template text. Add the
    details the template text asks for, then delete the extra template text.
    - If you add `fixes #<000000>` or `closes #<000000>` to the description,
    where `#<000000>` is the number of  an associated issue, GitHub
    automatically closes the issue when the PR merges.
    - Leave the **Allow edits from maintainers** checkbox selected.

6.  Click **Create pull request**.

## Large changes {#large-changes}

If you're more experienced with Git, or if your changes are larger than a few lines,
fork the repository first, clone it locally, then open a pull request.

### Fork the `kubernetes/website` repository

The Kubernetes project only allows pull requests from a fork.

1. Navigate to the [`kubernetes/website`](https://github.com/kubernetes/website/) repository.
2. Click **Fork**.

### Create a local clone and set the upstream

To work from a fork, ensure you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed on your computer. You can also use a Git UI application.

1. In a terminal window, use `git clone` to clone the your fork.

    ```bash
    git clone git@github.com/<github_username>/website
    ```

    The new directory `website` is created in your current directory, with
    the contents of your GitHub repository. Your fork is your `origin`.

2. Navigate to the new `website` directory. Set the `kubernetes/website` repository as the `upstream` remote.

      ```bash
      cd website

      git remote add upstream https://github.com/kubernetes/website.git
      ```

4.  Confirm your `origin` and `upstream` repositories.

    ```bash
    git remote -v
    ```

    Output is similar to:

    ```bash
    origin	git@github.com:<github_username>/website.git (fetch)
    origin	git@github.com:<github_username>/website.git (push)
    upstream	https://github.com/kubernetes/website (fetch)
    upstream	https://github.com/kubernetes/website (push)
    ```

There are three different copies of the repository when you work locally:
`local`, `upstream`, and `origin`. Fetch both the `origin` and `upstream` remotes. This
updates your cache of the remotes without actually changing any of the copies.

  ```bash
  git fetch origin
  git fetch upstream
  ```

This workflow deviates from the one defined in the Community's [GitHub
Workflow](https://github.com/kubernetes/community/blob/master/contributors/guide/github-workflow.md).
In this workflow, you do not need to merge your local copy of `master` with `upstream/master` before
pushing the updates to your fork. That step is not required in
`kubernetes/website` because you are basing your branch on the upstream repository.

You can now build the website locally For more information, see the `kubernetes/website` repository's
[README.md](https://github.com/kubernetes/website/blob/master/README.md).

### View your changes locally

If you aren't ready to create a pull request but you want to see what your
changes look like, you can build and run a docker image to generate all the documentation and
serve it locally.

{{< tabs name="tab_with_hugo" >}}
{{% tab name="Hugo in a container" %}}

1.  Build the image locally:

      ```bash
      make docker-image
      ```

2.  Once the `kubernetes-hugo` image has been built locally, you can build and serve the site:

      ```bash
      make docker-serve
      ```

3.  In your browser's address bar, enter `localhost:1313`. Hugo will watch the
    filesystem for changes and rebuild the site as needed.

4.  To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`
    or just close the terminal window.
{{% /tab %}}
{{% tab name="Hugo locally" %}}

Alternatively, you can install and use the `hugo` command on your development machine:

1.  Install the [Hugo](https://gohugo.io/getting-started/installing/) version specified in [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/master/netlify.toml).

2.  In a terminal, go to the root directory of your clone of the Kubernetes
    docs, and enter this command:

      ```bash
      hugo server
      ```

3.  In your browser’s address bar, enter `localhost:1313`.

4.  To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`
    or just close the terminal window.

{{% /tab %}}

### Open a pull request from your fork to `kubernetes/website`

When you're ready to subit your changes for review, do the following:

1. Navigate to the [`kubernetes/website`](https://github.com/kubernetes/website/) repository.
2. Click **New Pull Request**.
3. Click **compare across forks** and select your fork repository from the **head repository** drop-down menu.
4. Click **Create Pull Request**.
5. Add a description for your pull request.
  - If your PR closes or fixes an issue, add`fixes #<000000>`
  or `closes #<000000>` to the description, where `#<000000>` is the issue number.
  If you mention an issue in your description, GitHub automatically closes it when
  your PR is merged.


Congratulations! Your pull request is available in [Pull requests](https://github.com/kubernetes/website/pulls).

After a few minutes, you can preview the website with your PR's changes
applied. Go to the **Conversation** tab of your PR and click the **Details**
link for the `deploy/netlify` test, near the bottom of the page. It opens in
the same browser window by default.

## Review and revisions

Before merging a pull request, Kubernetes community members review and
approve it. In general, the `k8s-ci-robot` suggests reviewers based on the nearest
owner mentioned in the pages. If you have someone specific in mind,
request them specifically by mentioning their GitHub username.

If a reviewer asks you to make changes, go to the **Files changed**
tab and click the pencil icon on any files that have been changed by the
pull request, or commit a change to your fork.

If you are waiting on a reviewer to review the changes, proactively reach out to
the reviewer once every 7 days. You can also drop into `#sig-docs` Slack channel,
which is a good place to ask for help regarding PR reviews.

After approving a pull request,  your change is merged, and
goes live on the Kubernetes website a few minutes later.

## Contribute to other repos

The [Kubernetes project](https://github.com/kubernetes) contains more than 50
individual repositories. Many of these repositories contain code or content that
can be considered documentation, such as user-facing help text, error messages,
user-facing text in API references, or even code comments.

If you see text and you aren't sure where it comes from, you can use GitHub's
search tool at the level of the Kubernetes organization to search through all
repositories for that text. This can help you figure out where to submit your
issue or PR.

Each repository may have its own processes and procedures. Before you file an
issue or submit a PR, read that repository's `README.md`, `CONTRIBUTING.md`, and
`code-of-conduct.md`, if they exist.

Most repositories use issue and PR templates. Have a look through some open
issues and PRs to get a feel for that team's processes. Make sure to fill out
the templates with as much detail as possible when you file issues or PRs.

{{% /capture %}}

{{% capture whatsnext %}}

- Read [Reviewing](/docs/contribute/reviewing/reviewing) to learn more about the review process.

{{% /capture %}}
