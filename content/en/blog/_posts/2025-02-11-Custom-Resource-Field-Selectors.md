---
layout: blog
title: "Custom resource field selectors are GA in Kubernetes 1.32"
slug: kubernetes-1-32-custom-resource-field-selectors
date: 2025-02-11
author: "Joe Betz"
draft: true
---

Ever wish you had more control over how your custom resources are filtered?
Great news! Kubernetes v1.32 introduces stable support for 
*[Custom resource field selectors](/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resource-field-selectors)*.

# Here's how to use it

## 1. Define Selectable Fields in your CRD:

Update your CRD definition with the `selectableFields` section. This tells Kubernetes
which fields you want to filter by.

For example, let's say you have a `Shirt` CRD with color and size fields in the spec:

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

## 2. Filter CRDs with `kubectl`:


Use the `--field-selector` flag with kubectl get to filter by your defined fields.
The `=` and `!=` operators are supported.

```sh
kubectl get shirts.stable.example.com --field-selector spec.color=blue
```

This command will return all shirts with the color "blue".

Benefits:

- **Reduced Redundancy**: Avoids the practice of duplicating data into labels.
- **Improved Consistency**: Ensure data accuracy by filtering based on actual field values.
- **Efficient Operations**: Utilize filtered informers in controllers for better resource reconciliation.


Field selectors are also supported in list and watch operations, enabling
controllers to work more efficiently. Additionally, this feature lays the
groundwork for advanced functionalities like fine-grained authorization based
on CRD field values.

Try it out today!

Start filtering your CRDs with ease using custom resource field selectors in
Kubernetes 1.32 and experience a more streamlined workflow.

## Acknowledgments

Special thanks to [David Eads](https://github.com/deads2k) for feedback and reviews!