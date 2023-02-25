---
title: "kubectl-convert overview"
description: >-
  A kubectl plugin that allows you to convert manifests from one version
  of a Kubernetes API to a different version.
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

A plugin for Kubernetes command-line tool `kubectl`, which allows you to convert manifests between different API 
versions. This can be particularly helpful to migrate manifests to a non-deprecated api version with newer Kubernetes release.
For more info, visit [migrate to non deprecated apis](/docs/reference/using-api/deprecation-guide/#migrate-to-non-deprecated-apis)