---
title: Contribution intermédiaire
slug: intermediate
content_template: templates/concept
weight: 20
card:
  name: contribute
  weight: 50
---

{{% capture overview %}}

Cette page suppose que vous avez lu et maîtrisé les tâches de la rubrique [start contributing](/fr/docs/contribute/start/) et que vous êtes prêt à apprendre d'autres façons de contribuer.

{{< note >}}
Certaines tâches nécessitent l'utilisation du client en ligne de commande Git et d'autres outils.
{{< /note >}}

{{% /capture %}}

{{% capture body %}}

Maintenant que vous vous êtes lancé et que vous avez aidé avec les documents de Kubernetes de la manière décrite dans le sujet[Commencez à contribuer](/fr/docs/contribute/start/), vous pouvez vous sentir prêt à faire plus.
Ces tâches supposent que vous avez, ou que vous êtes disposé à acquérir, une connaissance plus approfondie des domaines suivants :

- Les concepts Kubernetes
- Flux de travail de documentation Kubernetes
- Où et comment trouver des informations sur les prochaines fonctionnalités de Kubernetes
- Solides compétences en recherche en général

Ces tâches ne sont pas aussi séquentielles que les tâches du débutant.
On ne s'attend pas à ce qu'une seule personne les fasse tous tout le temps.

## Examiner les Pull Request

In any given week, a specific docs approver volunteers to do initial triage and review of [pull requests and issues](#triage-and-categorize-issues).
This person is the "PR Wrangler" for the week.
The schedule is maintained using the [PR Wrangler scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers).
To be added to this list, attend the weekly SIG Docs meeting and volunteer.
Even if you are not on the schedule for the current week, you can still review pull requests (PRs) that are not already under active review.

In addition to the rotation, an automated system comments on each new PR and suggests reviewers and approvers for the PR, based on the list of approvers and reviewers in the affected files.
The PR author is expected to follow the guidance of the bot, and this also helps PRs to get reviewed quickly.

We want to get pull requests (PRs) merged and published as quickly as possible.
To ensure the docs are accurate and up to date, each PR needs to be reviewed by people who understand the content, as well as people with experience writing great documentation.

Reviewers and approvers need to provide actionable and constructive feedback to keep contributors engaged and help them to improve.
Sometimes helping a new contributor get their PR ready to merge takes more time than just rewriting it yourself, but the project is better in the long term when we have a diversity of active participants.

Before you start reviewing PRs, make sure you are familiar with the [Documentation Style Guide](/docs/contribute/style/style-guide/) and the [code of conduct](/community/code-of-conduct/)

### Find a PR to review

To see all open PRs, go to the **Pull Requests** tab in the Github repository.
A PR is eligible for review when it meets all of the following criteria:

- Has the `cncf-cla:yes` tag
- Does not have WIP in the description
- Does not a have tag including the phrase `do-not-merge`
- Has no merge conflicts
- Is based against the correct branch (usually `master` unless the PR relates to a feature that has not yet been released)
- Is not being actively reviewed by another docs person (other technical reviewers are fine), unless that person has explicitly asked for your help.
  In particular, leaving lots of new comments after other review cycles have already been completed on a PR can be discouraging and counter-productive.

If a PR is not eligible to merge, leave a comment to let the author know about the problem and offer to help them fix it.
If they've been informed and have not fixed the problem in several weeks or months, eventually their PR will be closed without merging.

If you're new to reviewing, or you don't have a lot of bandwidth, look for PRs with the `size/XS` or `size/S` tag set.
The size is automatically determined by the number of lines the PR changes.

#### Reviewers and approvers

The Kubernetes website repo operates differently than some of the Kubernetes code repositories when it comes to the roles of reviewers and approvers.
For more information about the responsibilities of reviewers and approvers, see [Participating](/docs/contribute/participating/).
Here's an overview.

- A reviewer reviews pull request content for technical accuracy.
  A reviewer indicates that a PR is technically accurate by leaving a `/lgtm` comment on the PR.

    {{< note >}}Don't add an `/lgtm` unless you are confident in the technical
    accuracy of the documentation modified or introduced in the PR.{{< /note >}}

- An approver reviews pull request content for docs quality and adherence to SIG Docs guidelines, such as the [style guide](/docs/contribute/style/style-guide).
  Only people listed as approvers in the [`OWNERS`](https://github.com/kubernetes/website/blob/master/OWNERS) file can approve a PR.
  To approve a PR, leave an `/approved` comment on the PR.

A PR is merged when it has both a `/lgtm` comment from anyone in the Kubernetes organization and an `/approved` comment from an approver in the `sig-docs-maintainers` group, as long as it is not on hold and the PR author has signed the CLA.

### Review a PR

1. Read the PR description and read any attached issues or links, if applicable.
   "Drive-by reviewing" is sometimes more harmful than helpful, so make sure you have the right knowledge to provide a meaningful review.

2. If someone else is the best person to review this particular PR, let them know by adding a comment with `/assign @<github-username>`.
   If you have asked a non-docs person for technical review but still want to review the PR from a docs point of view, keep going.

3. Go to the **Files changed** tab. Look over all the changed lines.
   Removed content has a red background, and those lines also start with a `-` symbol.
   Added content has a green background, and those lines also start with a `+` symbol.
   Within a line, the actual modified content has a slightly darker green background than the rest of the line.

      - Especially if the PR uses tricky formatting or changes CSS, Javascript, or other site-wide elements, you can preview the website with the PR applied.
        Go to the **Conversation** tab and click the **Details** link for the `deploy/netlify` test, near the bottom of the page.
        It opens in the same browser window by default, so open it in a new window so you don't lose your partial review.
        Switch back to the **Files changed** tab to resume your review.
      - Make sure the PR complies with the [Documentation Style Guide](/docs/contribute/style/style-guide/) and link the author to the relevant part of the style guide if not.
      - If you have a question, comment, or other feedback about a given change, hover over a line and click the blue-and-white `+` symbol that appears.
        Type your comment and click **Start a review**.
      - If you have more comments, leave them in the same way.
      - By convention, if you see a small problem that does not have to do with the main purpose of the PR, such as a typo or whitespace error, you can call it out, prefixing your comment with `nit:` so that the author knows you consider it trivial.
        They should still address it.
      - When you've reviewed everything, or if you didn't have any comments, go back to the top of the page and click **Review changes**.
        Choose either **Comment** or **Request Changes**.
        Add a summary of your review, and add appropriate [Prow commands](https://prow.k8s.io/command-help) to separate lines in the Review Summary field.
        SIG Docs follows the [Kubernetes code review process](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process).
        All of your comments will be sent to the PR author in a single notification.

          - If you think the PR is ready to be merged, add the text `/approve` to your summary.
          - If the PR does not need additional technical review, add the text `/lgtm` as well.
          - If the PR *does* need additional technical review, add the text `/assign` with the Github username of the person who needs to provide technical review.
            Look at the `reviewers` field in the front-matter at the top of a given Markdown file to see who can provide technical review.
          - To prevent the PR from being merged, add `/hold`. This sets the label `do-not-merge/hold`.
          - If a PR has no conflicts and has the `lgtm` and `approved` label but no `hold` label, it is merged automatically.
          - If a PR has the `lgtm` and/or `approved` labels and new changes are detected, these labels are removed automatically.

            See [the list of all available slash commands](https://prow.k8s.io/command-help) that can be used in PRs.

      - If you previously selected **Request changes** and the PR author has addressed your concerns, you can change your review status either in the **Files changed** tab or at the bottom of the **Conversation** tab.
        Be sure to add the `/approve` tag and assign technical reviewers if necessary, so that the PR can be merged.

### Commit into another person's PR

Leaving PR comments is helpful, but there may be times when you need to commit into another person's PR, rather than just leaving a review.

Resist the urge to "take over" for another person unless they explicitly ask you to, or you want to resurrect a long-abandoned PR.
While it may be faster in the short term, it deprives the person of the chance to contribute.

The process you use depends on whether you need to edit a file that is already in the scope of the PR or a file that the PR has not yet touched.

You can't commit into someone else's PR if either of the following things is true:

- If the PR author pushed their branch directly to the [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/) repository, only a reviewer with push access can commit into their PR.
  Authors should be encouraged to push their branch to their fork before opening the PR.
- If the PR author explicitly disallowed edits from approvers, you can't commit into their PR unless they change this setting.

#### If the file is already changed by the PR

This method uses the Github UI. If you prefer, you can use the command line even if the file you want to change is part of the PR, if you are more comfortable working that way.

1. Click the **Files changed** tab.
2. Scroll down to the file you want to edit, and click the pencil icon for that file.
3. Make your changes, add a commit message in the field below the editor, and click **Commit changes**.

Your commit is now pushed to the branch the PR represents (probably on the author's fork) and now shows up in the PR and your changes are reflected in the **Files changed** tab.
Leave a comment letting the PR author know you changed the PR.

If the author is using the command line rather than the Github UI to work on this PR, they need to fetch their fork's changes and rebase their local branch on the branch in their fork, before doing additional work on the PR.

#### If the file has not yet been changed by the PR

If changes need to be made to a file that is not yet included in the PR, you need to use the command line.
You can always use this method, if you prefer it to the Github UI.

1. Get the URL for the author's fork.
   You can find it near the bottom of the **Conversation** tab.
   Look for the text **Add more commits by pushing to**.
   The first link after this phrase is to the branch, and the second link is to the fork.
   Copy the second link.
   Note the name of the branch for later.

2. Add the fork as a remote.
   In your terminal, go to your clone of the repository.
   Decide on a name to give the remote (such as the author's Github username), and add the remote using the following syntax:

      ```bash
      git remote add <name> <url-of-fork>
      ```

3. Fetch the remote.
   This doesn't change any local files, but updates your clone's notion of the remote's objects (such as branches and tags) and their current state.

      ```bash
      git remote fetch <name>
      ```

4. Check out the remote branch.
   This command will fail if you already have a local branch with the same name.

      ```bash
      git checkout <branch-from-PR>
      ```

5. Make your changes, use `git add` to add them, and commit them.

6. Push your changes to the author's remote.

      ```bash
      git push <remote-name> <branch-name>
      ```

7. Go back to the Github IU and refresh the PR.
   Your changes appear.
   Leave the PR author a comment letting them know you changed the PR.

If the author is using the command line rather than the Github UI to work on this PR, they need to fetch their fork's changes and rebase their local branch on the branch in their fork, before doing additional work on the PR.

## Work from a local clone

For changes that require multiple files or changes that involve creating new files or moving files around, working from a local Git clone makes more sense than relying on the Github UI.
These instructions use the `git` command and assume that you have it installed locally.
You can adapt them to use a local graphical Git client instead.

### Clone the repository

You only need to clone the repository once per physical system where you work
on the Kubernetes documentation.

1. In a terminal window, use `git clone` to clone the repository.
   You do not need any credentials to clone the repository.

      ```bash
      git clone https://github.com/kubernetes/website
      ```

      The new directory `website` is created in your current directory, with the contents of the Github repository.

2. Change to the new `website` directory.
   Rename the default `origin` remote to `upstream`.

      ```bash
      cd website

      git remote rename origin upstream
      ```

3. If you have not done so, create a fork of the repository on Github.
   In your web browser, go to [https://github.com/kubernetes/website](https://github.com/kubernetes/website) and click the **Fork** button. After a few seconds, you are redirected to the URL for your fork, which is typically something like `https://github.com/<username>/website` unless you already had a repository called `website`.
   Copy this URL.

4. Add your fork as a second remote, called `origin`:

      ```bash
      git remote add origin <FORK-URL>
      ```

### Work on the local repository

Before you start a new unit of work on your local repository, you need to figure out which branch to base your work on.
The answer depends on what you are doing, but the following guidelines apply:

- For general improvements to existing content, start from `master`.
- For new content that is about features that already exist in a released version of Kubernetes, start from `master`.
- For long-running efforts that multiple SIG Docs contributors will collaborate on, such as content reorganization, use a specific feature branch created for that effort.
- For new content that relates to upcoming but unreleased Kubernetes versions, use the pre-release feature branch created for that Kubernetes version.

For more guidance, see
[Choose which branch to use](/docs/contribute/start/#choose-which-git-branch-to-use).

After you decide which branch to start your work (or _base it on_, in Git terminology), use the following workflow to be sure your work is based on the most up-to-date version of that branch.

1. Fetch both the `upstream` and `origin` branches. This updates your local notion of what those branches contain, but does not change your local branches at all.

      ```bash
      git fetch upstream
      git fetch origin
      ```

2. Create a new tracking branch based on the branch you decided is the most appropriate.
   This example assumes you are using `master`.

      ```bash
      git checkout -b <my_new_branch> upstream/master
      ```

      This new branch is based on `upstream/master`, not your local `master`.
      It tracks `upstream/master`.

3. With your new branch checked out, make your changes using a text editor.
   At any time, use the `git status` command to see what you've changed.

4. When you are ready to submit a pull request, commit your changes.
   First use `git status` to see what changes need to be added to the changeset.
   There are two important sections: `Changes staged for commit` and `Changes not staged for commit`.
   Any files that show up in the latter section under `modified` or `untracked` need to be added if you want them to be part of this commit.
   For each file that needs to be added, use `git add`.

      ```bash
      git add example-file.md
      ```

      When all your intended changes are included, create a commit, using the
      `git commit` command:

      ```bash
      git commit -m "Your commit message"
      ```

      {{< note >}}
      Do not reference a Github issue or pull request by ID or URL in the commit message.
      If you do, it will cause that issue or pull request to get a notification every time the commit shows up in a new Git branch.
      You can link issues and pull requests together later, in the Github UI.
      {{< /note >}}

5. Optionally, you can test your change by staging the site locally using the `hugo` command.
   See [View your changes locally](#view-your-changes-locally).
   You'll be able to view your changes after you submit the pull request, as well.

6. Before you can create a pull request which includes your local commit, you need to push the branch to your fork, which is the endpoint for the `origin` remote.

      ```bash
      git push origin <my_new_branch>
      ```

      Technically, you can omit the branch name from the `push` command, but the behavior in that case depends upon the version of Git you are using.
      The results are more repeatable if you include the branch name.

7. At this point, if you go to <https://github.com/kubernetes/website> in your web browser, Github detects that you pushed a new branch to your fork and offers to create a pull request.
   Fill in the pull request template.

      - The title should be no more than 50 characters and summarize the intent of the change.
      - The long-form description should contain more information about the fix, including a line like `Fixes #12345` if the pull request fixes a Github issue.
        This will cause the issue to be closed automatically when the pull request is merged.
      - You can add labels or other metadata and assign reviewers.
        See [Triage and categorize issues](#triage-and-categorize-issues) for the syntax.

      Click **Create pull request**.

8. Several automated tests will run against the state of the website with your changes applied.
   If any of the tests fail, click the **Details** link for more information.
   If the Netlify test completes successfully, its **Details** link goes to a staged version of the Kubernetes website with your changes applied.
   This is how reviewers will check your changes.

9. If you notice that more changes need to be made, or if reviewers give you feedback, address the feedback locally, then repeat step 4 - 6 again, creating a new commit.
   The new commit is added to your pull request and the tests run again, including re-staging the Netlify staged site.

10. If a reviewer adds changes to your pull request, you need to fetch those changes from your fork before you can add more changes.
    Use the following commands to do this, assuming that your branch is currently checked out.

      ```bash
      git fetch origin
      git rebase origin/<your-branch-name>
      ```

      After rebasing, you need to add the `-f` flag to force-push new changes to the branch to your fork.

      ```bash
      git push -f origin <your-branch-name>
      ```

11. If someone else's change is merged into the branch your work is based on, and you have made changes to the same parts of the same files, a conflict might occur.
    If the pull request shows that there are conflicts to resolve, you can resolve them using the Github UI or you can resolve them locally.

      First, do step 10 to be sure that your fork and your local branch are in the same state.

      Next, fetch `upstream` and rebase your branch on the branch it was originally based on, like `upstream/master`.

      ```bash
      git fetch upstream
      git rebase upstream/master
      ```

      If there are conflicts Git can't automatically resolve, you can see the conflicted files using the `git status` command.
      For each conflicted file, edit it and look for the conflict markers `>>>`, `<<<`, and `===`.
      Resolve the conflict and remove the conflict markers.
      Then add the changes to the changeset using `git add <filename>` and continue the rebase using `git rebase --continue`.
      When all commits have been applied and there are no more conflicts, `git status` will show that you are not in a rebase and there are no changes that need to be committed.
      At that point, force-push the branch to your fork, and the pull request should no longer show any conflicts.

If you're having trouble resolving conflicts or you get stuck with anything else related to your pull request, ask for help on the `#sig-docs` Slack channel or the [kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

### View your changes locally

If you aren't ready to create a pull request but you want to see what your changes look like, you can build and run a docker image to generate all the documentation and serve it locally.

1. Build the image locally:

      ```bash
      make docker-image
      ```

2. Once the `kubernetes-hugo` image has been built locally, you can build and serve the site:

      ```bash
      make docker-serve
      ```

3. In your browser's address bar, enter `localhost:1313`. Hugo will watch the filesystem for changes and rebuild the site as needed.

4. To stop the local Hugo instance, go back to the terminal and type `Ctrl+C` or just close the terminal window.

Alternatively, you can install and use the `hugo` command on your development machine:

1. [Install Hugo](https://gohugo.io/getting-started/installing/) version {{< hugoVersion >}} or later.

2. In a terminal, go to the root directory of your clone of the Kubernetes docs, and enter this command:

      ```bash
      hugo server
      ```

3. In your browser’s address bar, enter `localhost:1313`.

4. To stop the local Hugo instance, go back to the terminal and type `Ctrl+C` or just close the terminal window.

## Triage and categorize issues

In any given week, a specific docs approver volunteers to do initial [triage and review of pull requests](#review-pull-requests) and issues.
To get on this list, attend the weekly SIG Docs meeting and volunteer. Even if you are not on the schedule for the current week, you can still review PRs.

People in SIG Docs are responsible only for triaging and categorizing documentation issues.
General website issues are also filed in the `kubernetes/website` repository.

When you triage an issue, you:

- Assess whether the issue has merit. Some issues can be closed quickly by answering a question or pointing the reporter to a resource.
- Ask the reporter for more information if the issue doesn't have enough detail to be actionable or the template is not filled out adequately.
- Add labels (sometimes called tags), projects, or milestones to the issue.
  Projects and milestones are not heavily used by the SIG Docs team.
- At your discretion, taking ownership of an issue and submitting a PR for it (especially if it is quick or relates to work you were already doing).

If you have questions about triaging an issue, ask in `#sig-docs` on Slack or the [kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

### More about labels

These guidelines are not set in stone and are subject to change.

- An issue can have multiple labels.
- Some labels use slash notation for grouping, which can be thought of like "sub-labels".
  For instance, many `sig/` labels exist, such as `sig/cli` and `sig/api-machinery`.
- Some labels are automatically added based on metadata in the files involved in the issue, slash commands used in the comments of the issue, or information in the issue text.
- Some labels are manually added by the person triaging the issue (or the person reporting the issue, if they are a SIG Docs approvers).
  - `Actionable`: There seems to be enough information for the issue to be fixed or acted upon.
  - `good first issue`: Someone with limited Kubernetes or SIG Docs experience might be able to tackle this issue.
  - `kind/bug`, `kind/feature`, and `kind/documentation`: If the person who filed the issue did not fill out the template correctly, these labels may not be assigned automatically. A bug is a problem with existing content or functionality, and a feature is a request for new content or functionality.
    The `kind/documentation` label is not currently in use.
  - Priority labels: define the relative severity of the issue.
    These do not conform to those outlined in the [Kubernetes contributor guide](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority), and can be one of `P1`, `P2`, or `P3`, if set.
- To add a label, you can use Github's **Labels** widget if you are a Sig Docs approver.
  Anyone who is a member of the Kubernetes organization can add a label by leaving a comment like `/label <label-to-add>`.
  The label must already exist.
  If you try to add a label that does not exist, the command is silently ignored.

### Priorities

An issue's priority influences how quickly it is addressed.
For documentation, here are the guidelines for setting a priority on an issue:

#### P1

- Major content errors affecting more than 1 page
- Broken code sample on a heavily trafficked page
- Errors on a “getting started” page
- Well known or highly publicized customer pain points
- Automation issues

#### P2

This is the default for new issues and pull requests.

- Broken code for sample that is not heavily used
- Minor content issues in a heavily trafficked page
- Major content issues on a lower-trafficked page

#### P3

- Typos and broken anchor links
- Documentation feature requests
- "Nice to have" items

### Handling special issue types

We've encountered the following types of issues often enough to document how to handle them.

#### Duplicate issues

If a single problem has one or more issues open for it, the problem should be consolidated into a single issue.
You should decide which issue to keep open (or open a new issue), port over all relevant information, link related issues, and close all the other issues that describe the same problem.
Only having a single issue to work on will help reduce confusion and avoid duplicating work on the same problem.

#### Dead link issues

Depending on where the dead link is reported, different actions are required to resolve the issue.
Dead links in the API and Kubectl docs are automation issues and should be assigned a P1 until the problem can be fully understood.
All other dead links are issues that need to be manually fixed and can be assigned a P3.

#### Blog issues

[Kubernetes Blog](https://kubernetes.io/blog/) entries are expected to become outdated over time, so we maintain only blog entries that are less than one year old.
If an issue is related to a blog entry that is more than one year old, it should be closed without fixing.

#### Support requests or code bug reports

Some issues opened for docs are instead issues with the underlying code, or requests for assistance when something (like a tutorial) didn’t work.
For issues unrelated to docs, close the issue with a comment directing the requester to support venues (Slack, Stack Overflow) and, if relevant, where to file an issue for bugs with features (kubernetes/kubernetes is a great place to start).

Sample response to a request for support:

```none
This issue sounds more like a request for support and less
like an issue specifically for docs. I encourage you to bring
your question to the `#kubernetes-users` channel in
[Kubernetes slack](http://slack.k8s.io/). You can also search
resources like
[Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
for answers to similar questions.

You can also open issues for Kubernetes functionality in
 https://github.com/kubernetes/kubernetes.

If this is a documentation issue, please re-open this issue.
```

Exemple de code de réponse au rapport de bogue :

```none
This sounds more like an issue with the code than an issue with the documentation.
Please open an issue at https://github.com/kubernetes/kubernetes/issues.

If this is a documentation issue, please re-open this issue.
```

## Documenter les nouvelles fonctionnalités

Chaque version majeure de Kubernetes inclut de nouvelles fonctionnalités, et beaucoup d'entre elles nécessitent au moins une petite quantité de documentation pour montrer aux gens comment les utiliser.

Souvent, le SIG responsable d'une fonctionnalité soumet une ébauche de documentation pour cette fonctionnalité en tant que pull request sur la branche de publication appropriée du dépôt `kubernetes/website`, et quelqu'un de l'équipe SIG Docs fournit une revue éditoriale ou édite directement l'ébauche.

### Renseignez-vous sur les fonctionnalités à venir

Pour en savoir plus sur les fonctionnalités à venir, assistez à la réunion hebdomadaire sig-release (voir la page [communauté](https://kubernetes.io/community/) pour les réunions à venir) et surveillez la documentation spécifique à la version dans le dépôt[kubernetes/sig-release](https://github.com/kubernetes/sig-release/).
Chaque version a un sous-répertoire dans le répertoire [/sig-release/tree/master/releases/](https://github.com/kubernetes/sig-release/tree/master/releases).
Chaque sous-répertoire contient un calendrier de publication, une ébauche des notes de publication et un document énumérant chaque personne de l'équipe de publication.

- Le calendrier de diffusion contient des liens vers tous les autres documents, réunions, procès-verbaux et jalons relatifs à la diffusion.
  Il contient également des informations sur les objectifs et l'échéancier de la libération, ainsi que sur les processus spéciaux en place pour cette libération.
  Vers le bas du document, plusieurs termes liés à la publication sont définis.

    This document also contains a link to the **Feature tracking sheet**, which is the official way to find out about all new features scheduled to go into the release.
- Le document de l'équipe de lancement indique qui est responsable de chaque rôle de lancement.
  Si vous ne savez pas à qui parler d'une fonctionnalité ou d'une question spécifique, assistez à la réunion de lancement pour poser votre question ou contactez le responsable du lancement pour qu'il vous redirige.
- L'ébauche des notes de mise à jour est un bon endroit pour en savoir un peu plus sur les fonctionnalités spécifiques, les changements, les suppressions, et plus sur la version.
  Le contenu n'est pas finalisé avant la fin du cycle de publication, alors soyez prudent.

#### La fiche de suivi des caractéristiques

La feuille de suivi des fonctionnalités [pour une version donnée de Kubernetes](https://github.com/kubernetes/sig-release/tree/master/releases) énumère chaque fonctionnalité qui est prévue pour une version.
Chaque rubrique comprend le nom de la fonctionnalité, un lien vers le principal problème Github de la fonctionnalité, son niveau de stabilité (Alpha, Beta ou Stable), le SIG et la personne responsable de sa mise en œuvre, si elle a besoin de documentation, une ébauche de note de publication pour la fonctionnalité, et si elle a été intégrée.
Gardez à l'esprit que :

- Les fonctionnalités Beta et Stable ont généralement une priorité de documentation plus élevée que les fonctionnalités Alpha.
- Il est difficile de tester (et donc de documenter) une fonctionnalité qui n'a pas été intégrée, ou du moins qui est considérée comme complète dans ses PR.
- Déterminer si une fonctionnalité a besoin de documentation est un processus manuel et ce n'est pas parce qu'une fonctionnalité n'est pas marquée comme nécessitant de la documentation qu'elle n'en a pas besoin.

### Documenter une fonctionnalité

Comme indiqué plus haut, le projet de contenu des nouvelles fonctionnalités est généralement soumis par le SIG responsable de la mise en œuvre de la nouvelle fonctionnalité.
Cela signifie que votre rôle peut être plus un rôle de guide pour une fonctionnalité donnée que de développer la documentation à partir de zéro.

Une fois que vous avez choisi une fonctionnalité à documenter, renseignez-vous dans le canal `#sig-docs` Slack, lors d'une réunion hebdomadaire sig-docs, ou directement sur le PR archivé par la fonctionnalité SIG.
Si on vous donne le feu vert, vous pouvez modifier la PR à l'aide de l'une des techniques décrites dans [Contribuer dans la PR d'une autre personne] (#commit-into-another-persons-pr).

Si vous avez besoin d'écrire un nouveau sujet, les liens suivants sont utiles :

- [Rédiger un nouveau sujet](/docs/contribute/style/write-new-topic/)
- [Utiliser des templates de page](/docs/contribute/style/page-templates/)
- [Documentation Style Guide](/docs/contribute/style/style-guide/)

### SIG members documenting new features

Si vous êtes membre d'un SIG développant une nouvelle fonctionnalité pour Kubernetes, vous devez travailler avec SIG Docs pour vous assurer que votre fonctionnalité est documentée à temps pour la sortie.
Consultez la [feuille de suivi des fonctionnalités](https://github.com/kubernetes/sig-release/tree/master/releases) ou vérifiez dans le canal Slack #sig-release pour vérifier les détails et les délais.
Certaines dates limites relatives à la documentation sont :

- **Docs deadline - Open placeholder PRs**: Ouvrez une pull request contre la branche `release-X.Y` dans le dépôt `kubernetes/website', avec un petit commit que vous modifierez plus tard.
  Utilisez la commande Prow `/milestone X.Y` pour affecter la PR au jalon correspondant.
  Ceci avertit la personne responsable de la gestion de cette version que la documentation de la fonctionnalité arrive.
  Si votre fonctionnalité ne nécessite aucun changement de documentation, assurez-vous que l'équipe de sig-release le sache, en le mentionnant dans le canal Slack #sig-release.
  Si la fonctionnalité a besoin de documentation mais que la PR n'est pas créé, la fonctionnalité peut être supprimée du jalon.
- **Docs deadline - PRs ready for review**: Your PR now needs to contain a first draft of the documentation for your feature.
  Don't worry about formatting or polishing.
  Il suffit de décrire ce que la fonctionnalité fait et comment l'utiliser.
  La personne chargée de la gestion de la publication travaillera avec vous pour mettre le contenu en forme afin qu'il soit publié.
  Si votre fonctionnalité a besoin de documentation et que le premier projet de contenu n'est pas reçu, la fonctionnalité peut être supprimée du jalon.
- **Docs complete - All PRs reviewed and ready to merge**: If your PR has not yet been merged into the `release-X.Y` branch by this deadline, work with the docs person managing the release to get it in.
  If your feature needs documentation and the docs are not ready, the feature may be removed from the milestone.

If your feature is an Alpha feature and is behind a feature gate, make sure you add it to [Feature gates](/docs/reference/command-line-tools-reference/feature-gates/) as part of your pull request.
If your feature is moving out of Alpha, make sure to remove it from that file.

## Contribute to other repos

The [Kubernetes project](https://github.com/kubernetes) contains more than 50 individual repositories.
Many of these repositories contain code or content that can be considered documentation, such as user-facing help text, error messages, user-facing text in API references, or even code comments.

If you see text and you aren't sure where it comes from, you can use Github's search tool at the level of the Kubernetes organization to search through all repositories for that text.
This can help you figure out where to submit your issue or PR.

Each repository may have its own processes and procedures.
Before you file an issue or submit a PR, read that repository's `README.md`, `CONTRIBUTING.md`, and `code-of-conduct.md`, if they exist.

Most repositories use issue and PR templates.
Have a look through some open issues and PRs to get a feel for that team's processes.
Make sure to fill out the templates with as much detail as possible when you file issues or PRs.

## Localize content

The Kubernetes documentation is written in English first, but we want people to be able to read it in their language of choice.
If you are comfortable writing in another language, especially in the software domain, you can help localize the Kubernetes documentation or provide feedback on existing localized content.
See [Localization](/docs/contribute/localization/) and ask on the [kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs) or in `#sig-docs` on Slack if you are interested in helping out.

### Working with localized content

Follow these guidelines for working with localized content:

- Limit PRs to a single language.

   Each language has its own reviewers and approvers.

- Reviewers, verify that PRs contain changes to only one language.

   If a PR contains changes to source in more than one language, ask the PR contributor to open separate PRs for each language.

{{% /capture %}}

{{% capture whatsnext %}}

When you are comfortable with all of the tasks discussed in this topic and you want to engage with the Kubernetes docs team in even deeper ways, read the [advanced docs contributor](/docs/contribute/advanced/) topic.

{{% /capture %}}
