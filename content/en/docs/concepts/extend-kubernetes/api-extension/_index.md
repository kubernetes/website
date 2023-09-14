---
title: Extending the Kubernetes API
weight: 30
---

Custom resources are extensions of the Kubernetes API. Kubernetes provides two ways to add custom resources to your cluster:

- The [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
API resource allows you to define a CRD object creates a new custom resource with a name and schema that you specify.
The Kubernetes API serves and handles the storage of your custom resource. CRDs allow users to create new types of resources without adding another API server. 
- The [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) sits behind the primary API server, which acts as a proxy. This arrangement is called API Aggregation(AA). To users, the Kubernetes API appears extended.
