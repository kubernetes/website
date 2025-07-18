---
title: Common Expression Language
id: cel
date: 2025-06-04
full_link: https://cel.dev
short_description: >
  An expression language that's designed to be safe for executing user code.
tags:
- extension
- fundamental
aka:
- CEL
---
 A general-purpose expression language that's designed to be fast, portable, and
safe to execute.

<!--more-->

In Kubernetes, CEL can be used to run queries and perform fine-grained
filtering. For example, you can use CEL expressions with
[dynamic admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
to filter for specific fields in requests, and with
[dynamic resource allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
to select resources based on specific attributes.
