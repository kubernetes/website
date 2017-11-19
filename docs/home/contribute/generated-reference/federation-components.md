---
title: Generating Reference Pages for Kubernetes Federation Components
---

{% capture overview %}

This page shows how to automatically generate reference pages for the 
Kubernetes Federation components.

{% endcapture %}


{% capture prerequisites %}

* You need to have
[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
installed.

* You need to have
[Golang](https://golang.org/doc/install) version 1.8 or later installed,
and your `$GOPATH` environment variable must be set.

{% endcapture %}


{% capture steps %}

## Runnig the code generator

If you don't already have the Kubernetes source code, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

Determine the base directory of your clone of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
For example, if you followed the preceding step to get the Kubernetes source
code, you base directory is `$GOPATH/src/github.com/kubernetes/kubernetes.`
The remaining steps refer to your base directory as `<k8s-base>`.

If you don't already have ...

```shell
TODO
```

TODO

{% endcapture %}

{% capture whatsnext %}

[Generating Reference Docs for Kubernetes Components and Tools]()
[Generating the Kubernetes API Reference Docs]()
[Generating Kubernetes Federation Reference Pages]()
[Generating the Kubernetes Federation API Reference Docs]() 

{% endcapture %}


{% include templates/task.md %}
