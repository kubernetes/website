---
layout: blog
title: 'APIServer dry-run and kubectl diff'
date: 2019-01-14
author: >
  Antoine Pelisse (Google Cloud) 
---

Declarative configuration management, also known as configuration-as-code, is
one of the key strengths of Kubernetes. It allows users to commit the desired state of
the cluster, and to keep track of the different versions, improve auditing and
automation through CI/CD pipelines. The [Apply working-group](https://groups.google.com/forum/#!forum/kubernetes-wg-apply) 
is working on fixing some of the gaps, and is happy to announce that Kubernetes
1.13 promoted server-side dry-run and `kubectl diff` to beta. These
two features are big improvements for the Kubernetes declarative model.

## Challenges

A few pieces are still missing in order to have a seamless declarative
experience with Kubernetes, and we tried to address some of these:

- While compilers and linters do a good job to detect errors in pull-requests
  for code, a good validation is missing for Kubernetes configuration files.
  The existing solution is to run `kubectl apply --dry-run`, but this runs a
  *local* dry-run that doesn't talk to the server: it doesn't have server
  validation and doesn't go through validating admission controllers. As an
  example, Custom resource names are only validated on the server so a local
  dry-run won't help.
- It can be difficult to know how your object is going to be applied by the
  server for multiple reasons:
  - Defaulting will set some fields to potentially unexpected values,
  - Mutating webhooks might set fields or clobber/change some values.
  - Patch and merges can have surprising effects and result in unexpected
    objects. For example, it can be hard to know how lists are going to be
    ordered once merged.

The working group has tried to address these problems.

## APIServer dry-run

[APIServer dry-run](/docs/reference/using-api/api-concepts/#dry-run) was implemented to address these two problems:

- it allows individual requests to the apiserver to be marked as "dry-run",
- the apiserver guarantees that dry-run requests won't be persisted to storage,
- the request is still processed as typical request: the fields are
  defaulted, the object is validated, it goes through the validation admission
  chain, and through the mutating admission chain, and then the final object is
  returned to the user as it normally would, without being persisted.

While dynamic admission controllers are not supposed to have side-effects on
each request, dry-run requests are only processed if all admission controllers
explicitly announce that they don't have any dry-run side-effects.

### How to enable it

Server-side dry-run is enabled through a feature-gate. Now that the feature is
Beta in 1.13, it should be enabled by default, but still can be enabled/disabled
using `kube-apiserver --feature-gates DryRun=true`.

If you have dynamic admission controllers, you might have to fix them to:

- Remove any side-effects when the dry-run parameter is specified on the webhook request,
- Specify in the [`sideEffects`](https://v1-13.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#webhook-v1beta1-admissionregistration) field of the `admissionregistration.k8s.io/v1beta1.Webhook` object to indicate that the object doesn't have side-effects on dry-run (or at all).

### How to use it

You can trigger the feature from kubectl by using `kubectl apply
--server-dry-run`, which will decorate the request with the dryRun flag
and return the object as it would have been applied, or an error if it would
have failed.

## Kubectl diff

APIServer dry-run is convenient because it lets you see how the object would be
processed, but it can be hard to identify exactly what changed if the object is
big. `kubectl diff` does exactly what you want by showing the differences between
the current "live" object and the new "dry-run" object. It makes it very
convenient to focus on only the changes that are made to the object, how the
server has merged these and how the mutating webhooks affects the output.

### How to use it

`kubectl diff` is meant to be as similar as possible to `kubectl apply`:
`kubectl diff -f some-resources.yaml` will show a diff for the resources in the yaml file. One can even use the diff program of their choice by using the KUBECTL_EXTERNAL_DIFF environment variable, for example:
```
KUBECTL_EXTERNAL_DIFF=meld kubectl diff -f some-resources.yaml
```

## What's next

The working group is still busy trying to improve some of these things:

- Server-side apply is trying to improve the apply scenario, by adding owner
semantics to fields! It's also going to improve support for CRDs and unions!
- Some kubectl apply features are missing from diff and could be useful, like the ability
to filter by label, or to display pruned resources.
- Eventually, kubectl diff will use server-side apply!

{{< note >}}

The flag `kubectl apply --server-dry-run` is deprecated in v1.18.
Use the flag `--dry-run=server` for using server-side dry-run in
`kubectl apply` and other subcommands.

{{< /note >}}
