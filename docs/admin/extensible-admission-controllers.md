---
assignees:
- smarterclayton
- lavalamp
- whitlockjc
- caesrxuchao
title: Extending admission controllers
---

* TOC
{:toc}

## The plugin-style admission controllers are not flexible enough

[Using Admission Controllers documentation](/doc/admin/admission-controllers.md) introduces how to use the plugin-style admission controllers.The plugin admission controllers need to be compiled in-tree, and are only configurable when the apiserver starts up.

## How do I extend admission controllers?

In 1.7, we introduce two alpha features, *Initializers* and *External Admission Hooks*, they allow admission controllers to be developed out-of-tree and to be configured at runtime.

We will first describe initializers and then describe external admission hooks.

## Initializers

###what are they?
* muntating AC; called in serial
* a plugin-style initializer admission controller sets the default list of initializers for objects in the CREATE request. The default list of initializers can be dynamically configured via `InitializersConfiguration`, see XXX
* an `initializer agent` is the worker that mutates the objects. is a controller watch for objects with `metadata.finalizers[0]==<initializer id>`

* uninitialized objects are not visible ...

### When are initializers called?

## External Admission Webhooks (assigned to @whitlockjc)

###What are they? (assigned to @whitlockjc)
External webhook: non-mutating, called in parallel

### When are they called? (assigned to @whitlockjc)

AdmissionChain, depends on the admission-controller-config

Recommended plug-in order:
???
```
--admission-control=Initializer,NamespaceLifecycle,LimitRanger,ServiceAccount,PersistentVolumeLabel,DefaultStorageClass,ResourceQuota,DefaultTolerationSeconds,GenericAdmissionWebhook"
```

## How to enable initializers and external admission webhooks?

Initializers and External Admission Webhooks are alpha features, which are disabled by default. To turn them on, you need to

* include "Initializer" and "GenericAdmissionWebhook" in the `--admission-control` flag when starting the apiserver. If you are using HA-master or aggregated apiservers, you need to do so for each apiserver.

* enable the dynamic admission controller registration API by setting `--runtime-config=admissionregistration.k8s.io/v1alpha1` when starts the kube-apiserver.

## How to write an initializer (@Clayton)
## How to deploy an initializer (@Clayton)
## How to configure initializers on the fly?

You can configure what initializers are enabled and what resources are subject to the initializers via creating initiallizerconfigurations.

We suggest that you first deploy the initializer controller and make sure it is working properly before creating the initiallizerconfigurations, otherwise the resources will stuck in the uninitialized state.

The following is an example initiallizerconfigurations.

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: InitializerConfiguration
metadata:
  name: example-config
spec:
  initializers:
    # the name needs to be fully qualified, i.e., containing two "."
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

For a Create request received by the apiserver, if the request matches any of the `rules` of an initializer, the `Initializer` admission controller will add the initializer to the `metadate.initializers` field of the created object, thus the initializer controller will notice the creation and initialize the object.

It is recommended to make sure that all expansions of the `<apiGroup, apiVersions,resources>` tuple in a `rule` are valid; if they are not, separate them to different `rules`.

After you create the initializerConfiguration, please give the system a few seconds to honor the new configuration.

## How to write a webhook admission controller?

***TODO: find a home for the example***
See (https://github.com/caesarxuchao/example-webhook-admission-controller) for an example webhook admission controller.

The communication between the webhook admission controller and the apiserver, or more precisely, the GenericAdmissionWebhook admission controller, needs to be TLS secured. You need to generate a CA cert and use it to sign the server cert used by your webhook admission controller. The pem formatted CA cert is supplied to the apiserver via the dynamic registration API `externaladmissionhookconfigurations.clientConfig.caBundle`.

***TODO: link to admissionReview api doc when there is one***
For each request received by the apiserver, the GenericAdmissionWebhook admission controller sends an `admissionReview` to the relevant webhook admission controller. The webhook admission controller gathers information like `object`, `oldobject`, and `userInfo`, from `admissionReview.spec`, sends back a response with the body also being the `admissionReview`, whose `status` field is filled with the admission decision.

## How to deploy the webhook admission controller?

***TODO: find a home for the example***
See (https://github.com/caesarxuchao/example-webhook-admission-controller/tree/master/deployment) for an example deployment.

We suggest that deploying the webhook admission controller via the [deployment API](https://kubernetes.io/docs/api-reference/v1.6/#deployment-v1beta1-apps). You also need to create a [service](https://kubernetes.io/docs/api-reference/v1.6/#service-v1-core) as the front-end of the deployment.

## How to configure webhook admission controller on the fly?

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

It is recommended to make sure that all expansions of the `<apiGroup, apiVersions,resources>` tuple in a `rule` are valid; if they are not, separate them to different `rules`.

You can also specify the `failurePolicy`. In 1.7, the system supports `Ignore` and `Fail` policies, meaning upon an communication error with the webhook admission controller, if the `GenericAdmissionWebhook` will admit or reject the operation.

After you create the initializerConfiguration, please give the system a few seconds to honor the new configuration.
