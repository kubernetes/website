---
title: Extending the Kubernetes API
weight: 30
---

Custom resources are extensions of the Kubernetes API. Kubernetes provides two ways to add custom resources to your cluster:

- The [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  (CRD) mechanism allows you to declaratively define a new custom API with an API group, kind, and
  schema that you specify.
  The Kubernetes control plane serves and handles the storage of your custom resource. CRDs allow you to
  create new types of resources for your cluster without writing and running a custom API server. 
- The [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
  sits behind the primary API server, which acts as a proxy.
  This arrangement is called API Aggregation (AA), which allows you to provide
  specialized implementations for your custom resources by writing and
  deploying your own API server.
  The main API server delegates requests to your API server for the custom APIs that you specify,
  making them available to all of its clients.
