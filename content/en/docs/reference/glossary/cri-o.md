---
title: CRI-O
id: cri-o
date: 2019-05-14
full_link: https://cri-o.io/docs/
short_description: >
  A lightweight container runtime specifically for Kubernetes

aka:
tags:
- tool
---
A tool that lets you use OCI container runtimes witk Kubernetes CRI.

<!--more-->

CRI-O is an implementation of the {{< glossary_tooltip term_id="cri" >}}
to enable using {{< glossary_tooltip text="container" term_id="container" >}}
runtimes that are compatible with the Open Container Initiative (OCI)
[runtime spec](http://www.github.com/opencontainers/runtime-spec).

Deploying CRI-O allows Kubernetes to use any OCI-compliant runtime as the container
runtime for running {{< glossary_tooltip text="Pods" term_id="pod" >}}, and to fetch
OCI container images from remote registries.
