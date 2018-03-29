---
reviewers:
- smarterclayton
- lavalamp
- whitlockjc
- caesarxuchao
- deads2k
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

<<<<<<< HEAD
1.7 introduced two alpha features, *Initializers* and *External Admission
Webhooks*, that address these limitations. These features allow admission
controllers to be developed out-of-tree and configured at runtime.
=======
Two features, *Admission Webhooks* (beta in 1.9) and *Initializers* (alpha),
address these limitations. They allow admission controllers to be developed
out-of-tree and configured at runtime.
>>>>>>> 4ac258363735f8d35150e4dcd0213516fcdc83b9

This page describes how to use Admission Webhooks and Initializers.

## Admission Webhooks

### What are admission webhooks?

Admission webhooks are HTTP callbacks that receive admission requests and do
something with them. You can define two types of admission webhooks,
[ValidatingAdmissionWebhooks](/docs/admin/admission-controllers.md#validatingadmissionwebhook-alpha-in-18-beta-in-19)
and
[MutatingAdmissionWebhooks](/docs/admin/admission-controllers.md#mutatingadmissionwebhook-beta-in-19).
With `ValidatingAdmissionWebhooks`, you may reject requests to enforce custom
admission policies. With `MutatingAdmissionWebhooks`, you may change requests to
enforce custom defaults.

### Experimenting with admission webhooks

Admission webhooks are essentially part of the cluster control-plane. You should
write and deploy them with great caution. Please read the [user
guides](https://github.com/kubernetes/website/pull/6836/files)(WIP) for
instructions if you intend to write/deploy production-grade admission webhooks.
In the following, we describe how to quickly experiment with admission webhooks.

### Prerequisites

* Ensure that the Kubernetes cluster is at least as new as v1.9.

* Ensure that MutatingAdmissionWebhook and ValidatingAdmissionWebhook
  admission controllers are enabled.
  [Here](/docs/admin/admission-controllers.md#is-there-a-recommended-set-of-admission-controllers-to-use)
  is a recommended set of admission controllers to enable in general.

* Ensure that the admissionregistration.k8s.io/v1beta1 API is enabled.

### Write an admission webhook server

Please refer to the implementation of the [admission webhook
server](https://github.com/kubernetes/kubernetes/blob/v1.10.0-beta.1/test/images/webhook/main.go)
that is validated in a Kubernetes e2e test. The webhook handles the
`admissionReview` requests sent by the apiservers, and sends back its decision
wrapped in `admissionResponse`.

The example admission webhook server leaves the `ClientAuth` field
[empty](https://github.com/kubernetes/kubernetes/blob/v1.10.0-beta.1/test/images/webhook/config.go#L48-L49),
which defaults to `NoClientCert`. This means that the webhook server does not
authenticate the identity of the clients, supposedly apiservers. If you need
mutual TLS or other ways to authenticate the clients, see
how to [authenticate apiservers](#authenticate-apiservers).

### Deploy the admission webhook service

The webhook server in the e2e test is deployed in the Kubernetes cluster, via
the [deployment API](/docs/reference/generated/kubernetes-api/{{page.version}}/#deployment-v1beta1-apps).
The test also creates a [service](/docs/reference/generated/kubernetes-api/{{page.version}}/#service-v1-core)
as the front-end of the webhook server. See
[code](https://github.com/kubernetes/kubernetes/blob/v1.10.0-beta.1/test/e2e/apimachinery/webhook.go#L196).

You may also deploy your webhooks outside of the cluster. You will need to update
your [webhook client configurations](https://github.com/kubernetes/kubernetes/blob/v1.10.0-beta.1/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L218) accordingly.

### Configure admission webhooks on the fly

You can dynamically configure what resources are subject to what admission
webhooks via
[ValidatingWebhookConfiguration](https://github.com/kubernetes/kubernetes/blob/v1.10.0-beta.1/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L68)
or
[MutatingWebhookConifuration](https://github.com/kubernetes/kubernetes/blob/v1.10.0-beta.1/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L98).

The following is an example `validatingWebhookConfiguration`, a mutating webhook
configuration is similar.

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
metadata:
  name: <name of this configuration object>
webhooks:
- name: <webhook name, e.g., pod-policy.example.io>
  rules:
  - apiGroups:
    - ""
    apiVersions:
    - v1
    operations:
    - CREATE
    resources:
    - pods
  clientConfig:
    service:
      namespace: <namespace of the front-end service>
      name: <name of the front-end service>
    caBundle: <pem encoded ca cert that signs the server cert used by the webhook>
```

When an apiserver receives a request that matches one of the `rules`, the
apiserver sends an `admissionReview` request to webhook as specified in the
`clientConfig`.

After you create the webhook configuration, the system will take a few seconds
to honor the new configuration.

### Authenticate apiservers

If your admission webhooks require authentication, you can configure the
apiservers to use basic auth, bearer token, or a cert to authenticate itself to
the webhooks. There are three steps to complete the configuration.

* When starting the apiserver, specify the location of the admission control
  configuration file via the `--admission-control-config-file` flag.

* In the admission control configuration file, specify where the
  MutatingAdmissionWebhook controller and ValidatingAdmissionWebhook controller
  should read the credentials. The credentials are stored in kubeConfig files
  (yes, the same schema that's used by kubectl), so the field name is
  `kubeConfigFile`. Here is an example admission control configuration file:

```yaml
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: ValidatingAdmissionWebhook
  configuration:
    apiVersion: apiserver.config.k8s.io/v1alpha1
    kind: WebhookAdmission
    kubeConfigFile: <path-to-kubeconfig-file>
- name: MutatingAdmissionWebhook
  configuration:
    apiVersion: apiserver.config.k8s.io/v1alpha1
    kind: WebhookAdmission
    kubeConfigFile: <path-to-kubeconfig-file>
```

The schema of `admissionConfiguration` is defined
[here](https://github.com/kubernetes/kubernetes/blob/v1.10.0-beta.0/staging/src/k8s.io/apiserver/pkg/apis/apiserver/v1alpha1/types.go#L27).

* In the kubeConfig file, provide the credentials:

```yaml
apiVersion: v1
kind: Config
users:
# DNS name of webhook service, i.e., <service name>.<namespace>.svc, or the URL
# of the webhook server.
- name: 'webhook1.ns1.svc'
  user:
    client-certificate-data: <pem encoded certificate>
    client-key-data: <pem encoded key>
# The `name` supports using * to wildmatch prefixing segments.
- name: '*.webhook-company.org'
  user:
    password: <password>
    username: <name>
# '*' is the default match.
- name: '*'
  user:
    token: <token>
```

Of course you need to set up the webhook server to handle these authentications.

## Initializers

### What are initializers?

*Initializer* has two meanings:

* A list of pending pre-initialization tasks, stored in every object's metadata
  (e.g., "AddMyCorporatePolicySidecar").

* A user customized controller, which actually performs those tasks. The name of the task
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

* Include "Initializers" in the `--enable-admission-plugins` flag when starting
  `kube-apiserver`. If you have multiple `kube-apiserver` replicas, all should
  have the same flag setting.

* Enable the dynamic admission controller registration API by adding
  `admissionregistration.k8s.io/v1alpha1` to the `--runtime-config` flag passed
  to `kube-apiserver`, e.g.
  `--runtime-config=admissionregistration.k8s.io/v1alpha1`. Again, all replicas
  should have the same flag setting.

### Deploy an initializer controller

You should deploy an initializer controller via the [deployment
API](/docs/reference/generated/kubernetes-api/{{page.version}}/#deployment-v1beta1-apps).

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
the pods will be stuck in an uninitialized state.

Make sure that all expansions of the `<apiGroup, apiVersions, resources>` tuple
in a `rule` are valid. If they are not, separate them in different `rules`.
<<<<<<< HEAD

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

**Note** In kubernetes versions earlier than v1.10, the admission chain depends
only on the order of the `--admission-control` option passed to `kube-apiserver`.
In versions v1.10 and later, the `--admission-control` option is replaced by the
`--enable-admission-plugins` and the `--disable-admission-plugins` options.
The order of plugins for these two options no longer matters.
{: .note}

### Enable external admission webhooks

*External Admission Webhooks* is an alpha feature, so it is disabled by default.
To turn it on, you need to

* Include "GenericAdmissionWebhook" in the `--enable-admission-plugins` flag when
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
[deployment API](/docs/reference/generated/kubernetes-api/{{page.version}}/#deployment-v1beta1-apps).
You also need to create a
[service](/docs/reference/generated/kubernetes-api/{{page.version}}/#service-v1-core) as the
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

You can also specify the `failurePolicy`. As of 1.7, the system supports `Ignore`
and `Fail` policies, meaning that upon a communication error with the webhook
admission controller, the `GenericAdmissionWebhook` can admit or reject the
operation based on the configured policy.

After you create the `externalAdmissionHookConfiguration`, the system will take a few
seconds to honor the new configuration.
=======
>>>>>>> 4ac258363735f8d35150e4dcd0213516fcdc83b9
