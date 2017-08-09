---
approvers:
- smarterclayton
- lavalamp
- whitlockjc
- caesarxuchao
title: Dynamic Admission Control
---

* TOC
{:toc}

## Overview

The [admission controllers documentation](/docs/admin/admission-controllers/)
introduces how to use standard, plugin-style admission controllers. However,
plugin admission controllers are not flexible enough for all use cases, due to
the following:

* They need to be compiled into kube-apiserver.
* They are only configurable when the apiserver starts up.

1.7 introduces two alpha features, *Initializers* and *External Admission
Webhooks*, that address these limitations. These features allow admission
controllers to be developed out-of-tree and configured at runtime.

This page describes how to use Initializers and External Admission Webhooks.

## Initializers

### What are initializers?

*Initializer* has two meanings:

* A list of pending pre-initialization tasks, stored in every object's metadata
  (e.g., "AddMyCorporatePolicySidecar").

* A user customized controller, which actually perform those tasks. The name of the task
  corresponds to the controller which performs the task. For clarity, we call
  them *initializer controllers* in this page.

Once the controller has performed its assigned task, it removes its name from
the list. For example, it may send a PATCH that inserts a container in a pod and
also removes its name from `metadata.initializers.pending`. Initializers may make
mutations to objects.

Objects which have a non-empty initializer list are considered uninitialized,
and are not visible in the API unless specifically requested by using the query parameter,
`?includeUninitialized=true`.

### When to use initializers?

Initializers are useful for admins to force policies (e.g., the
[AlwaysPullImages](/docs/admin/admission-controllers/#alwayspullimages)
admission controller), or to inject defaults (e.g., the
[DefaultStorageClass](/docs/admin/admission-controllers/#defaultstorageclass)
admission controller), etc.

**Note:** If your use case does not involve mutating objects, consider using
external admission webhooks, as they have better performance.

### How are initializers triggered?

When an object is POSTed, it is checked against all existing
`initializerConfiguration` objects (explained below). For all that it matches,
all `spec.initializers[].name`s are appended to the new object's
`metadata.initializers.pending` field.

An initializer controller should list and watch for uninitialized objects, by
using the query parameter `?includeUninitialized=true`. If using client-go, just
set 
[listOptions.includeUninitialized](https://github.com/kubernetes/kubernetes/blob/v1.7.0-rc.1/staging/src/k8s.io/apimachinery/pkg/apis/meta/v1/types.go#L315)
to true.

For the observed uninitialized objects, an initializer controller should first
check if its name matches `metadata.initializers.pending[0]`. If so, it should then
perform its assigned task and remove its name from the list.

### Enable initializers alpha feature

*Initializers* is an alpha feature, so it is disabled by default. To turn it on,
you need to:

* Include "Initializers" in the `--admission-control` flag when starting
  `kube-apiserver`. If you have multiple `kube-apiserver` replicas, all should
  have the same flag setting.

* Enable the dynamic admission controller registration API by adding
  `admissionregistration.k8s.io/v1alpha1` to the `--runtime-config` flag passed
  to `kube-apiserver`, e.g.
  `--runtime-config=admissionregistration.k8s.io/v1alpha1`. Again, all replicas
  should have the same flag setting.

### Deploy an initializer controller

You should deploy an initializer controller via the [deployment
API](/docs/api-reference/{{page.version}}/#deployment-v1beta1-apps).

### Configure initializers on the fly

You can configure what initializers are enabled and what resources are subject
to the initializers by creating `initializerConfiguration` resources.

You should first deploy the initializer controller and make sure that it is
working properly before creating the `initializerConfiguration`. Otherwise, any
newly created resources will be stuck in an uninitialized state.

The following is an example `initializerConfiguration`:

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: InitializerConfiguration
metadata:
  name: example-config
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

After you create the `initializerConfiguration`, the system will take a few
seconds to honor the new configuration. Then, `"podimage.example.com"` will be
appended to the `metadata.initializers.pending` field of newly created pods. You
should already have a ready "podimage" initializer controller that handles pods
whose `metadata.initializers.pending[0].name="podimage.example.com"`. Otherwise
the pods will stuck uninitialized.

Make sure that all expansions of the `<apiGroup, apiVersions, resources>` tuple
in a `rule` are valid. If they are not, separate them in different `rules`.

## External Admission Webhooks

### What are external admission webhooks?

External admission webhooks are HTTP callbacks that are intended to receive
admission requests and do something with them. What an external admission
webhook does is up to you, but there is an
[interface](https://github.com/kubernetes/kubernetes/blob/v1.7.0-rc.1/pkg/apis/admission/v1alpha1/types.go)
that it must adhere to so that it responds with whether or not the
admission request should be allowed. 

Unlike initializers or the plugin-style admission controllers, external
admission webhooks are not allowed to mutate the admission request in any way.

Because admission is a high security operation, the external admission webhooks
must support TLS.

### When to use admission webhooks?

A simple example use case for an external admission webhook is to do semantic validation
of Kubernetes resources. Suppose that your infrastructure requires that all `Pod`
resources have a common set of labels, and you do not want any `Pod` to be
persisted to Kubernetes if those needs are not met. You could write your
external admission webhook to do this validation and respond accordingly.

### How are external admission webhooks triggered?

Whenever a request comes in, the `GenericAdmissionWebhook` admission plugin will
get the list of interested external admission webhooks from
`externalAdmissionHookConfiguration` objects (explained below) and call them in
parallel. If **all** of the external admission webhooks approve the admission
request, the admission chain continues. If **any** of the external admission
webhooks deny the admission request, the admission request will be denied, and
the reason for doing so will be based on the _first_ external admission webhook
denial reason. _This means if there is more than one external admission webhook
that denied the admission request, only the first will be returned to the
user._ If there is an error encountered when calling an external admission
webhook, that request is ignored and will not be used to approve/deny the
admission request.

**Note:** The admission chain depends solely on the order of the
`--admission-control` option passed to `kube-apiserver`.

### Enable external admission webhooks

*External Admission Webhooks* is an alpha feature, so it is disabled by default.
To turn it on, you need to

* Include "GenericAdmissionWebhook" in the `--admission-control` flag when
  starting the apiserver. If you have multiple `kube-apiserver` replicas, all
  should have the same flag setting.

* Enable the dynamic admission controller registration API by adding
  `admissionregistration.k8s.io/v1alpha1` to the `--runtime-config` flag passed
  to `kube-apiserver`, e.g.
  `--runtime-config=admissionregistration.k8s.io/v1alpha1`. Again, all replicas
  should have the same flag setting.

### Write a webhook admission controller

See [caesarxuchao/example-webhook-admission-controller](https://github.com/caesarxuchao/example-webhook-admission-controller)
for an example webhook admission controller.

The communication between the webhook admission controller and the apiserver, or
more precisely, the GenericAdmissionWebhook admission controller, needs to be
TLS secured. You need to generate a CA cert and use it to sign the server cert
used by your webhook admission controller. The pem formatted CA cert is supplied
to the apiserver via the dynamic registration API
`externaladmissionhookconfigurations.clientConfig.caBundle`.

For each request received by the apiserver, the GenericAdmissionWebhook
admission controller sends an
[admissionReview](https://github.com/kubernetes/kubernetes/blob/v1.7.0-rc.1/pkg/apis/admission/v1alpha1/types.go#L27)
to the relevant webhook admission controller. The webhook admission controller
gathers information like `object`, `oldobject`, and `userInfo`, from
`admissionReview.spec`, sends back a response with the body also being the
`admissionReview`, whose `status` field is filled with the admission decision.

### Deploy the webhook admission controller

See [caesarxuchao/example-webhook-admission-controller deployment](https://github.com/caesarxuchao/example-webhook-admission-controller/tree/master/deployment)
for an example deployment.

The webhook admission controller should be deployed via the
[deployment API](/docs/api-reference/{{page.version}}/#deployment-v1beta1-apps).
You also need to create a
[service](/docs/api-reference/{{page.version}}/#service-v1-core) as the
front-end of the deployment.

### Configure webhook admission controller on the fly

You can configure what webhook admission controllers are enabled and what
resources are subject to the admission controller via creating
externaladmissionhookconfigurations.

We suggest that you first deploy the webhook admission controller and make sure
it is working properly before creating the externaladmissionhookconfigurations.
Otherwise, depending whether the webhook is configured as fail open or fail
closed, operations will be unconditionally accepted or rejected. 

The following is an example `externaladmissionhookconfiguration`:

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

For a request received by the apiserver, if the request matches any of the
`rules` of an `externalAdmissionHook`, the `GenericAdmissionWebhook` admission
controller will send an `admissionReview` request to the `externalAdmissionHook`
to ask for admission decision.

The `rule` is similar to the `rule` in `initializerConfiguration`, with two
differences:

* The addition of the `operations` field, specifying what operations the webhook
  is interested in;

* The `resources` field accepts subresources in the form or resource/subresource.

Make sure that all expansions of the `<apiGroup, apiVersions,resources>` tuple
in a `rule` are valid. If they are not, separate them to different `rules`.

You can also specify the `failurePolicy`. In 1.7, the system supports `Ignore`
and `Fail` policies, meaning that upon a communication error with the webhook
admission controller, the `GenericAdmissionWebhook` can admit or reject the
operation based on the configured policy.

After you create the `externalAdmissionHookConfiguration`, the system will take a few
seconds to honor the new configuration.
