---
reviewers:
- smarterclayton
- lavalamp
- whitlockjc
- caesarxuchao
- deads2k
title: Dynamic Admission Control
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
The [admission controllers documentation](/docs/reference/access-authn-authz/admission-controllers/)
introduces how to use standard, plugin-style admission controllers. However,
plugin admission controllers are not flexible enough for all use cases, due to
the following:

* They need to be compiled into kube-apiserver.
* They are only configurable when the apiserver starts up.

Two features, *Admission Webhooks* (beta in 1.9) and *Initializers* (alpha),
address these limitations. They allow admission controllers to be developed
out-of-tree and configured at runtime.

This page describes how to use Admission Webhooks and Initializers.
{{% /capture %}}

{{% capture body %}}
## Admission Webhooks

### What are admission webhooks?

Admission webhooks are HTTP callbacks that receive admission requests and do
something with them. You can define two types of admission webhooks,
[validating admission Webhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
and
[mutating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook).
With validating admission Webhooks, you may reject requests to enforce custom
admission policies. With mutating admission Webhooks, you may change requests to
enforce custom defaults.

### Experimenting with admission webhooks

Admission webhooks are essentially part of the cluster control-plane. You should
write and deploy them with great caution. Please read the [user
guides](/docs/reference/access-authn-authz/extensible-admission-controllers/#write-an-admission-webhook-server) for
instructions if you intend to write/deploy production-grade admission webhooks.
In the following, we describe how to quickly experiment with admission webhooks.

### Prerequisites

* Ensure that the Kubernetes cluster is at least as new as v1.9.

* Ensure that MutatingAdmissionWebhook and ValidatingAdmissionWebhook
  admission controllers are enabled.
  [Here](/docs/reference/access-authn-authz/admission-controllers/#is-there-a-recommended-set-of-admission-controllers-to-use)
  is a recommended set of admission controllers to enable in general.

* Ensure that the admissionregistration.k8s.io/v1beta1 API is enabled.

### Write an admission webhook server

Please refer to the implementation of the [admission webhook
server](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/images/webhook/main.go)
that is validated in a Kubernetes e2e test. The webhook handles the
`admissionReview` requests sent by the apiservers, and sends back its decision
wrapped in `admissionResponse`.

The example admission webhook server leaves the `ClientAuth` field
[empty](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/images/webhook/config.go#L47-L48),
which defaults to `NoClientCert`. This means that the webhook server does not
authenticate the identity of the clients, supposedly apiservers. If you need
mutual TLS or other ways to authenticate the clients, see
how to [authenticate apiservers](#authenticate-apiservers).

### Deploy the admission webhook service

The webhook server in the e2e test is deployed in the Kubernetes cluster, via
the [deployment API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1beta1-apps).
The test also creates a [service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
as the front-end of the webhook server. See
[code](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/e2e/apimachinery/webhook.go#L227).

You may also deploy your webhooks outside of the cluster. You will need to update
your [webhook client configurations](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L247) accordingly.

### Configure admission webhooks on the fly

You can dynamically configure what resources are subject to what admission
webhooks via
[ValidatingWebhookConfiguration](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L84)
or
[MutatingWebhookConfiguration](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L114).

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

{{< note >}}
When using `clientConfig.service`, the server cert must be valid for
`<svc_name>.<svc_namespace>.svc`.
{{< /note >}}

When an apiserver receives a request that matches one of the `rules`, the
apiserver sends an `admissionReview` request to webhook as specified in the
`clientConfig`.

After you create the webhook configuration, the system will take a few seconds
to honor the new configuration.

{{< note >}}
When the webhook plugin is deployed into the Kubernetes cluster as a
service, it has to expose its service on the 443 port. The communication
between the API server and the webhook service may fail if a different port
is used.
{{< /note >}}

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
[here](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/apiserver/pkg/apis/apiserver/v1alpha1/types.go#L27).

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
[AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
admission controller), or to inject defaults (e.g., the
[DefaultStorageClass](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
admission controller), etc.

{{< note >}}
If your use case does not involve mutating objects, consider using
external admission webhooks, as they have better performance.
{{< /note >}}

### How are initializers triggered?

When an object is POSTed, it is checked against all existing
`initializerConfiguration` objects (explained below). For all that it matches,
all `spec.initializers[].name`s are appended to the new object's
`metadata.initializers.pending` field.

An initializer controller should list and watch for uninitialized objects, by
using the query parameter `?includeUninitialized=true`. If using client-go, just
set
[listOptions.includeUninitialized](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/apimachinery/pkg/apis/meta/v1/types.go#L332)
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
API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1beta1-apps).

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
{{% /capture %}}
