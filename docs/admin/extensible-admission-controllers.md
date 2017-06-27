---
assignees:
- smarterclayton
- lavalamp
- whitlockjc
- caesrxuchao
title: Dynamic Admission Control
---

* TOC
{:toc}

## Overview

The [admission controllers documentation](/doc/admin/admission-controllers.md) introduces how to use standard, plugin-style admission controllers. However, plugin admission controllers are not flexible enough for all use cases, due to the following:
* They need to be compiled into kube-apiserver.
* They are only configurable when the apiserver starts up.

1.7 introduces two alpha features, *Initializers* and *External Admission Hooks*, that address these limitations. These features allow admission controllers to be developed out-of-tree and configured at runtime.

This page describes how to use Initializers and External Admission Hooks.

## Initializers

### what are initializers?

Two meanings:
* A list of pending pre-initialization tasks, stored in every object's metadata (e.g., "AddMyCorporatePolicySidecar").
* The controllers which actually perform those tasks. The name of the task corresponds to the controller which performs the task.

Once the controller has performed its assigned task, it removes its name from the the list. For example, it may send a PATCH that inserts a container in a pod and also removes its name from `metadata.initalizers`. Initializers may make mutations to objects.

Objects which have a non-empty initializer list are considered uninitialized, and are not visible in the API unless specifically requested (`?includeUninitialized=true`).

### How are initializers triggered?

When an object is POSTed, it is checked against all existing `InitializerConfiguration` objects (explained below). For all that it matches, all `spec.initializers[].name`s are appended to the new object's `metadata.initializers` field.

### Enable initializers alpha feature

Initializers are an alpha feature, which is disabled by default. To turn it on, you need to:

* Include "Initializer" in the `--admission-control` flag when starting `kube-apiserver`. If you have multiple `kube-apiserver` replicas, all should have the same flag setting.

* Enable the dynamic admission controller registration API by adding `admissionregistration.k8s.io/v1alpha1` to the `--runtime-config` flag passed to `kube-apiserver`, e.g. `--runtime-config=admissionregistration.k8s.io/v1alpha1`. Again, all replicas should have the same flag setting.

### Write an initializer controller (@Clayton)

### Deploy an initializer (@Clayton)

### Configure initializers on the fly

You can configure what initializers are enabled and what resources are subject to the initializers by creating initiallizerconfigurations.

We suggest that you first deploy the initializer controller and make sure it is working properly before creating the initiallizerconfigurations, otherwise any newly created resources will be stuck in an uninitialized state.

The following is an example InitiallizerConfiguration.

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: InitializerConfiguration
metadata:
  name: example-config
spec:
  initializers:
    # the name needs to be fully qualified, i.e., containing at least two "."
    - name: podimage.example.com
      rules:
        # apiGroups, apiVersion, resources all support wildcard "*".
        # "*" cannot be mixed with non-wildcard.
        - apiGroups:
            - ""
          apiVersions:
            - v1
          resources:
            - pods
```

For a Create request received by the apiserver, if the request matches any of the `rules` of an initializer, the `Initializer` admission controller will add the initializer to the `metadata.initializers` field of the created object. Thus the initializer controller will notice the creation and initialize the object.

Make sure that all expansions of the `<apiGroup, apiVersions, resources>` tuple in a `rule` are valid; if they are not, separate them in different `rules`.

After you create the `initializerConfiguration`,  the system will take a few seconds to honor the new configuration.

## External Admission Webhooks (assigned to @whitlockjc)

### What are admission webhooks? (assigned to @whitlockjc)
External webhook: non-mutating, called in parallel

### When are they called? (assigned to @whitlockjc)

TODO: explain the "GenericAdmissionWebhook" plugin admission controller

AdmissionChain, depends on the admission-controller-config

Recommended plug-in order:
???
```
--admission-control=Initializer,NamespaceLifecycle,LimitRanger,ServiceAccount,PersistentVolumeLabel,DefaultStorageClass,ResourceQuota,DefaultTolerationSeconds,GenericAdmissionWebhook"
```

### Enable external admission webhooks

External Admission Webhooks is an alpha feature, which is disabled by default. To turn it on, you need to

* include "GenericAdmissionWebhook" in the `--admission-control` flag when starting the apiserver. If you are using HA-master or aggregated apiservers, you need to do so for each apiserver.

* enable the dynamic admission controller registration API by setting `--runtime-config=admissionregistration.k8s.io/v1alpha1` when starts the kube-apiserver.


### Write a webhook admission controller

***TODO: find a home for the example***
See (https://github.com/caesarxuchao/example-webhook-admission-controller) for an example webhook admission controller.

The communication between the webhook admission controller and the apiserver, or more precisely, the GenericAdmissionWebhook admission controller, needs to be TLS secured. You need to generate a CA cert and use it to sign the server cert used by your webhook admission controller. The pem formatted CA cert is supplied to the apiserver via the dynamic registration API `externaladmissionhookconfigurations.clientConfig.caBundle`.

***TODO: link to admissionReview api doc when there is one***
For each request received by the apiserver, the GenericAdmissionWebhook admission controller sends an `admissionReview` to the relevant webhook admission controller. The webhook admission controller gathers information like `object`, `oldobject`, and `userInfo`, from `admissionReview.spec`, sends back a response with the body also being the `admissionReview`, whose `status` field is filled with the admission decision.

### Deploy the webhook admission controller

***TODO: find a home for the example***
See (https://github.com/caesarxuchao/example-webhook-admission-controller/tree/master/deployment) for an example deployment.

We suggest that deploying the webhook admission controller via the [deployment API](https://kubernetes.io/docs/api-reference/v1.6/#deployment-v1beta1-apps). You also need to create a [service](https://kubernetes.io/docs/api-reference/v1.6/#service-v1-core) as the front-end of the deployment.

### Configure webhook admission controller on the fly

You can configure what webhook admission controller are enabled and what resources are subject to the admission controller via creating externaladmissionhookconfigurations.

We suggest that you first deploy the webhook admission controller and make sure it is working properly before creating the externaladmissionhookconfigurations, otherwise depending whether the webhook is configured as fail open or fail closed, operations will be unconditionally accepted or rejected. 

The following is an example externaladmissionhookconfiguration.

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ExternalAdmissionHookConfiguration
metadata:
  name: example-config
externalAdmissionHooks:
- name: pod-image.k8s.io
  rules:
  - apiGroups:
    - ""
    apiVersions:
    - v1
    operations:
    - CREATE
    resources:
    - pods
  failurePolicy: Ignore
  clientConfig:
    caBundle: <pem encoded ca cert that signs the server cert used by the webhook>
    service:
      name: <name of the front-end service>
      namespace: <namespace of the front-end service>
```

For a request received by the apiserver, if the request matches any of the `rules` of an `externalAdmissionHook`, the `GenericAdmissionWebhook` admission controller will send an `admissionReview` request to the `externalAdmissionHook` to ask for admission decision.

The `rule` is similar to the `rule` in `initializerConfiguration`, with two differences:
* the addition of the `operations` field, specifying what operations the webhook is interested in;
* the `resources` field accepts subresources in the form or resource/subresource.

Make sure that all expansions of the `<apiGroup, apiVersions,resources>` tuple in a `rule` are valid; if they are not, separate them to different `rules`.

You can also specify the `failurePolicy`. In 1.7, the system supports `Ignore` and `Fail` policies, meaning upon an communication error with the webhook admission controller, if the `GenericAdmissionWebhook` will admit or reject the operation.

After you create the `initializerConfiguration`,  the system will take a few seconds to honor the new configuration.
