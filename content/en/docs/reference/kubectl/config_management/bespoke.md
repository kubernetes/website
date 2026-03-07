---
title: "Bespoke Application"
linkTitle: "Bespoke Application"
type: docs
weight: 8
description: >
    Workflow for bespoke applications
---

In this workflow, all configuration (resource YAML) files are owned by the user.
No content is incorporated from version control repositories owned by others.

![bespoke config workflow image][workflowBespoke]

Following are the steps involved:

1. ***Create a directory in version control***

    Speculate some overall cluster application called _ldap_;
    we want to keep its configuration in its own repo.

    > ```bash
    > git init ~/ldap
    > ```

1. ***Create a [base]***

    > ```bash
    > mkdir -p ~/ldap/base
    > ```

    In this directory, create and commit a [kustomization]
    file and a set of [resources].

1. ***Create [overlays]***

    > ```bash
    > mkdir -p ~/ldap/overlays/staging
    > mkdir -p ~/ldap/overlays/production
    > ```

    Each of these directories needs a [kustomization]
    file and one or more [patches].

    The _staging_ directory might get a patch
    that turns on an experiment flag in a configmap.

    The _production_ directory might get a patch
    that increases the replica count in a deployment
    specified in the base.

1. ***Bring up [variants]***

    Run kustomize, and pipe the output to [apply].

    > ```bash
    > kustomize build ~/ldap/overlays/staging | kubectl apply -f -
    > kustomize build ~/ldap/overlays/production | kubectl apply -f -
    > ```

    You can also use [kubectl-v1.14.0] to apply your [variants].
    >
    > ```bash
    > kubectl apply -k ~/ldap/overlays/staging
    > kubectl apply -k ~/ldap/overlays/production
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
[workflowBespoke]: /images/new_bespoke.jpg
[workflowOts]: /images/workflowOts.jpg
[kubectl-v1.14.0]:https://kubernetes.io/blog/2019/03/25/kubernetes-1-14-release-announcement/
