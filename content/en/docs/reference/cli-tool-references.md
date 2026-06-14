---
title: CLI tool references
content_type: reference
weight: 115
---

<!-- overview -->

This page lists reference material for command-line tools that you can use to
manage Kubernetes resources and configuration.

<!-- body -->

## kubectl

[`kubectl`](/docs/reference/kubectl/) is the primary command-line tool for
communicating with a Kubernetes cluster.

* [kubectl Quick Reference](/docs/reference/kubectl/quick-reference/) lists
  commonly used `kubectl` commands and flags.
* [kubectl command reference](/docs/reference/kubectl/generated/) lists
  `kubectl` commands, subcommands, and options. Use the quick reference for
  task-oriented examples.
* [kubectl usage conventions](/docs/reference/kubectl/conventions/) describes
  conventions for using `kubectl` in reusable scripts.
* [JSONPath support](/docs/reference/kubectl/jsonpath/) describes how to use
  JSONPath expressions with `kubectl` output.

## Kustomize

Kustomize lets you customize Kubernetes object configuration through a
`kustomization.yaml` file. You can use Kustomize through `kubectl`.

* [Declarative Management of Kubernetes Objects Using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/)
  explains how to compose and customize resources with a kustomization file.
* [kubectl kustomize](/docs/reference/kubectl/generated/kubectl_kustomize/)
  describes the command that builds a kustomization target from a directory or URL.

## Helm

[Helm](https://helm.sh/) is a package manager for Kubernetes. Helm is maintained
outside the Kubernetes project, and the Helm project publishes its own reference
documentation.

* [Helm Cheat Sheet](https://helm.sh/docs/intro/cheatsheet/) lists common Helm
  commands.
* [Using Helm](https://helm.sh/docs/intro/using_helm/) explains Helm concepts and
  common workflows.
* [Helm command reference](https://helm.sh/docs/helm/) lists Helm commands,
  subcommands, and options.
