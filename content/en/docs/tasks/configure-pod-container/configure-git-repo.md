---
title: Configure a Pod with a Git Repo
content_template: templates/task
---

{{% capture overview %}}

This page shows how to configure a Pod with a Git repo using an
[Init Container](/docs/concepts/workloads/pods/init-containers/) to provision a
volume before the Pod's primary container runs. While these examples are specific
to Git, the overall strategy can be extended to other version control systems.

{{% /capture %}}

{{% capture prerequisites %}}

* You need to have a Kubernetes cluster, and the kubectl command-line tool must
be configured to communicate with your cluster. If you do not already have a
single-node cluster, you can create one by using
[Minikube](/docs/getting-started-guides/minikube).

* Familiarize yourself with the material in
[Init Containers](/docs/concepts/workloads/pods/init-containers/).

{{% /capture %}}

{{% capture steps %}}

## Cloning a Git repo

The [emptyDir](/docs/concepts/storage/volumes/#emptydir) volume type can be used
to share data between multiple containers in a Pod.

First, define a script for cloning a repo to run in the Init Container:

{{< code file="git-repo/configmap.yaml" >}}

Mount this script into the Pod's Init Container and clone to an emptyDir mounted
into both the Init Container and the Pod's primary container:

{{< code file="git-repo/deployment.yaml" >}}

## Cloning private repos

When cloning private repos, use [Secrets](/docs/concepts/configuration/secret/)
to pass credentials to the Init Container.

For example, to use a [GitHub personal access token](
https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
to clone a private repo, create a secret containing the access token:

    kubectl create secret generic github-access-token --from-file=token=secrets/github-access-token

Modify the Init Container's script to use the access token:

{{< code file="git-repo/private-configmap.yaml" >}}

Finally, expose the access token as an environment variable to the Init Container:

{{< code file="git-repo/private-deployment.yaml" >}}

{{% /capture %}}
