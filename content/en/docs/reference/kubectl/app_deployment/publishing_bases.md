---
title: "Publishing Bases"
linkTitle: "Publishing Bases"
weight: 3
type: docs
description: >
   Publish a White Box Application as a Base for other users to Kustomize
---


## Motivation

Users may want to run a common White Box Application without writing the Resource Config
for the Application from scratch.  Instead they may want to consume ready-made Resource
Config published specifically for the White Box Application, and add customizations for
their specific needs.

- Run a White Box Application (e.g. Cassandra, MongoDB) instance from ready-made Resource Config
- Publish Resource Config to run an Application

## Publishing a White Box Base

White Box Applications may be published to a URL and consumed as Bases in an `kustomization.yaml`.  It
can then be consumed in the following manner.

**Use Case:** Run a White Box Application published to GitHub.

**Input:** The kustomization.yaml file

```yaml
# kustomization.yaml
bases:
# GitHub URL
- github.com/kubernetes-sigs/kustomize/examples/multibases/dev/?ref=v1.0.6
```

**Applied:** The Resource that is Applied to the cluster

```yaml
# Resource comes from the Remote Base
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: myapp
  name: dev-myapp-pod
spec:
  containers:
  - image: nginx:1.7.9
    name: nginx
```

## Versioning White Box Bases

White Box Bases may be versioned using the well known versioning techniques provided by Git.

- ***Tag***

  Bases may be versioned by applying a tag to the repo and modifying the url to point to the tag:
  `github.com/kubernetes-sigs/kustomize/tree/master/examples/multibases?ref=v1.0.6`

- ***Branch***

  Bases may be versioned by creating a branch and modifying the url to point to the branch:
  `github.com/Liujingfang1/kustomize/tree/master/examples/helloWorld?ref=repoUrl2`

- ***Commit***

  If the White Box Base has not been explicitly versioned by the maintainer, users may pin the
  base to a specific commit:
  `github.com/Liujingfang1/kustomize/tree/master/examples/helloWorld?ref=7050a45134e9848fca214ad7e7007e96e5042c03`

## Forking a White Box Base

Users may fork a White Box Base hosted on GitHub by forking the GitHub repo. This allows
the user complete control over changes to the Base. Users should periodically pull changes
from the upstream repo back into the fork to get bug fixes and optimizations.
