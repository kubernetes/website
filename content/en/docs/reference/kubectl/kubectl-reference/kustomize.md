---
title: kustomize
content_template: templates/tool-reference
---

### Overview
Print a set of API resources generated from instructions in a kustomization.yaml file.

 The argument must be the path to the directory containing the file, or a git repository URL with a path suffix specifying same with respect to the repository root.

 kubectl kustomize somedir

### Usage

`kustomize <dir>`


### Example

 Use the current working directory

```shell
kubectl kustomize .
```

 Use some shared configuration directory

```shell
kubectl kustomize /home/configuration/production
```

 Use a URL

```shell
kubectl kustomize github.com/kubernetes-sigs/kustomize.git/examples/helloWorld?ref=v1.0.6
```







<hr>


### Version
<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs version 1.15 &#xa9;Copyright 2019 The Kubernetes Authors</a>
</div>

