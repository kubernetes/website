---
layout: blog
title: "Custom resource field selectors are GA in Kubernetes 1.32"
slug: kubernetes-1-32-custom-resource-field-selectors
date: 2024-XX-XX
author: "Joe Betz"
---

SIG API Machinery is excited to announce that *[Custom resource field selectors](/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resource-field-selectors)*
have graduated to stable in Kubernetes v1.32! This enhancement simplifies how you interact with your 
custom resources and is now enabled by default.

## What are Custom Resource Field Selectors?

CustomResourceDefinitions (CRDs) often involve managing large collections of custom resources. While label selectors are useful, they're not always the most effective way to filter custom resources.  Why duplicate data in labels when the information you need already exists in the resource itself?

*Custom resource field selectors* allow you to filter custom resources directly by their field values. This eliminates the need to maintain redundant labels and ensures data consistency.

## How do they work?

To enable field selectors for your CRD, simply add the `selectableFields` section to your CRD definition.
For example:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: shirts.stable.example.com
spec:
  group: stable.example.com
  scope: Namespaced
  names:
    plural: shirts
    singular: shirt
    kind: Shirt
  versions:
  - name: v1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              color:
                type: string
              size:
                type: string
    selectableFields:
    - jsonPath: .spec.color
    - jsonPath: .spec.size
    additionalPrinterColumns:
    - jsonPath: .spec.color
      name: Color
      type: string
    - jsonPath: .spec.size
      name: Size
      type: string
```

Once defined, you can use kubectl with the `--field-selector` flag to filter your custom resources:

```sh
kubectl get shirts.stable.example.com --field-selector spec.color=blue
```

This command will return all shirts with the color "blue".

Field selectors are not just for `kubectl`.  List and watch operations also support this feature. This means controllers can use filtered informers to reconcile resources more efficiently.

Advanced features like [authorize with selectors](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/4601-authorize-with-selectors/README.md) build on this enhancement,
allowing for fine-grained authorization based on custom resource field values.

SIG API Machinery is excited for the community to leverage this feature to make CRDs more convenient
and useful!


## Acknowledgments

Special thanks to [David Eads](https://github.com/deads2k) for feedback and reviews!