---
title: "Off The Shelf Application"
linkTitle: "Off The Shelf Application"
type: docs
weight: 9
description: >
    Workflow for off the shelf applications
---

In this workflow, all files are owned by the user and maintained in a repository under their control, but
they are based on an [off-the-shelf] configuration that is periodically consulted for updates.

![off-the-shelf config workflow image][workflowOts]

Following are the steps involved:

1. ***Find and [fork] an [OTS] config***

1. ***Clone it as your [base]***

    The [base] directory is maintained in a repo whose upstream is an [OTS] configuration, in this case
    some user's `ldap` repo:

    > ```bash
    > mkdir ~/ldap
    > git clone https://github.com/$USER/ldap ~/ldap/base
    > cd ~/ldap/base
    > git remote add upstream git@github.com:$USER/ldap
    > ```

1. ***Create [overlays]***

    As in the bespoke case above, create and populate an _overlays_ directory.

    The [overlays] are siblings to each other and to the [base] they depend on.

    > ```bash
    > mkdir -p ~/ldap/overlays/staging
    > mkdir -p ~/ldap/overlays/production
    > ```

    The user can maintain the `overlays` directory in a
    distinct repository.

1. ***Bring up [variants]***

    > ```bash
    > kustomize build ~/ldap/overlays/staging | kubectl apply -f -
    > kustomize build ~/ldap/overlays/production | kubectl apply -f -
    > ```

    You can also use [kubectl-v1.14.0] to apply your [variants].

    > ```bash
    > kubectl apply -k ~/ldap/overlays/staging
    > kubectl apply -k ~/ldap/overlays/production
    > ```

1. ***(Optionally) Capture changes from upstream***

    The user can periodically [rebase] their [base] to
    capture changes made in the upstream repository.

    > ```bash
    > cd ~/ldap/base
    > git fetch upstream
    > git rebase upstream/master
    > ```

[OTS]: /references/kustomize/glossary#off-the-shelf-configuration
[apply]: /references/kustomize/glossary#apply
[applying]: /references/kustomize/glossary#apply
[base]: /references/kustomize/glossary#base
[fork]: https://guides.github.com/activities/forking/
[variants]: /references/kustomize/glossary#variant
[kustomization]: /references/kustomize/glossary#kustomization
[off-the-shelf]: /references/kustomize/glossary#off-the-shelf-configuration
[overlays]: /references/kustomize/glossary#overlay
[patch]: /references/kustomize/glossary#patch
[patches]: /references/kustomize/glossary#patch
[rebase]: https://git-scm.com/docs/git-rebase
[resources]: /references/kustomize/glossary#resource
[workflowBespoke]: /images/workflowBespoke.jpg
[workflowOts]: /images/new_ots.jpg
[kubectl-v1.14.0]:https://kubernetes.io/blog/2019/03/25/kubernetes-1-14-release-announcement/
