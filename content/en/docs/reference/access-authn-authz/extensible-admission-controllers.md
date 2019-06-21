---
reviewers:
- smarterclayton
- lavalamp
- caesarxuchao
- deads2k
- liggitt
- mbohlool
- jpbetz
title: Dynamic Admission Control
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
In addition to [compiled-in admission plugins](/docs/reference/access-authn-authz/admission-controllers/),
admission plugins can be developed as extensions and run as webhooks configured at runtime.
This page describes how to build, configure, and use admission webhooks.
{{% /capture %}}

{{% capture body %}}
## What are admission webhooks?

Admission webhooks are HTTP callbacks that receive admission requests and do
something with them. You can define two types of admission webhooks,
[validating admission Webhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
and
[mutating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook).
Mutating admission Webhooks are invoked first, and can modify objects sent to the API server to enforce custom defaults.
After all object modifications are complete, and after the incoming object is validated by the API server,
validating admission webhooks are invoked and can reject requests to enforce custom policies.

{{< note >}}
Admission webhooks that need to guarantee they see the final state of the object in order to enforce policy
should use a validating admission webhook, since objects can be modified after being seen by mutating webhooks.
{{< /note >}}

## Experimenting with admission webhooks

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
`AdmissionReview` request sent by the apiservers, and sends back its decision
as an `AdmissionReview` object in the same version it received.

See the [webhook request](#request) section for details on the data sent to webhooks.

See the [webhook response](#response) section for the data expected from webhooks.

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
[ValidatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhookconfiguration-v1beta1-admissionregistration-k8s-io)
or
[MutatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#mutatingwebhookconfiguration-v1beta1-admissionregistration-k8s-io).

The following is an example `validatingWebhookConfiguration`, a mutating webhook
configuration is similar. See the [webhook configuration](#webhook-configuration) section for details about each config field.

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
    scope: "Namespaced"
  clientConfig:
    service:
      namespace: <namespace of the front-end service>
      name: <name of the front-end service>
    caBundle: <pem encoded ca cert that signs the server cert used by the webhook>
  admissionReviewVersions:
  - v1beta1
  timeoutSeconds: 1
```

The scope field specifies if only cluster-scoped resources ("Cluster") or namespace-scoped
resources ("Namespaced") will match this rule. "*" means that there are no scope restrictions.

{{< note >}}
When using `clientConfig.service`, the server cert must be valid for
`<svc_name>.<svc_namespace>.svc`.
{{< /note >}}

{{< note >}}
Default timeout for a webhook call is 30 seconds but starting in kubernetes 1.14 you
can set the timeout and it is encouraged to use a very small timeout for webhooks.
If the webhook call times out, the request is handled according to the webhook's 
failure policy.
{{< /note >}}

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
[here](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/apiserver/pkg/apis/apiserver/v1alpha1/types.go#L27).
See the [webhook configuration](#webhook-configuration) section for details about each config field.

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

## Webhook request and response

### Request

Webhooks are sent a POST request, with `Content-Type: application/json`,
with an `AdmissionReview` API object in the `admission.k8s.io` API group
serialized to JSON as the body.

Webhooks can specify what versions of `AdmissionReview` objects they accept
with the `admissionReviewVersions` field in their configuration:

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  admissionReviewVersions: ["v1beta1"]
  ...
```

If no `admissionReviewVersions` are specified, the default when creating 
`admissionregistration.k8s.io/v1beta1` webhook configurations is `v1beta1`.

API servers send the first `AdmissionReview` version in the `admissionReviewVersions` list they support.
If none of the versions in the list are supported by the API server, the configuration will not be allowed to be created.
If an API server encounters a webhook configuration that was previously created and does not support any of the `AdmissionReview`
versions the API server knows how to send, attempts to call to the webhook will fail and be subject to the [failure policy](#failure-policy).

This example shows the data contained in an `AdmissionReview` object
for a request to update the `scale` subresource of an `apps/v1` `Deployment`:

```json
{
  "apiVersion": "admission.k8s.io/v1beta1",
  "kind": "AdmissionReview",
  "request": {
    // Random uid uniquely identifying this admission call
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",

    // Fully-qualified group/version/kind of the incoming object
    "kind": {"group":"autoscaling","version":"v1","kind":"Scale"},
    // Fully-qualified group/version/kind of the resource being modified
    "resource": {"group":"apps","version":"v1","resource":"deployments"},
    // subresource, if the request is to a subresource
    "subResource": "scale",

    // Fully-qualified group/version/kind of the incoming object in the original request to the API server.
    // This only differs from `kind` if the webhook specified `matchPolicy: Equivalent` and the 
    // original request to the API server was converted to a version the webhook registered for.
    // Only sent by v1.15+ API servers.
    "requestKind": {"group":"autoscaling","version":"v1","kind":"Scale"},
    // Fully-qualified group/version/kind of the resource being modified in the original request to the API server.
    // This only differs from `resource` if the webhook specified `matchPolicy: Equivalent` and the 
    // original request to the API server was converted to a version the webhook registered for.
    // Only sent by v1.15+ API servers.
    "requestResource": {"group":"apps","version":"v1","resource":"deployments"},
    // subresource, if the request is to a subresource
    // This only differs from `subResource` if the webhook specified `matchPolicy: Equivalent` and the 
    // original request to the API server was converted to a version the webhook registered for.
    // Only sent by v1.15+ API servers.
    "requestSubResource": "scale",

    // Name of the resource being modified
    "name": "my-deployment",
    // Namespace of the resource being modified, if the resource is namespaced (or is a Namespace object)
    "namespace": "my-namespace",

    // operation can be CREATE, UPDATE, DELETE, or CONNECT
    "operation": "UPDATE",

    "userInfo": {
      // Username of the authenticated user making the request to the API server
      "username": "admin",
      // UID of the authenticated user making the request to the API server
      "uid": "014fbff9a07c",
      // Group memberships of the authenticated user making the request to the API server
      "groups": ["system:authenticated","my-admin-group"],
      // Arbitrary extra info associated with the user making the request to the API server.
      // This is populated by the API server authentication layer and should be included
      // if any SubjectAccessReview checks are performed by the webhook.
      "extra": {
        "some-key":["some-value1", "some-value2"]
      }
    },

    // object is the new object being admitted.
    // It is null for DELETE operations.
    "object": {"apiVersion":"autoscaling/v1","kind":"Scale",...},
    // oldObject is the existing object.
    // It is null for CREATE and CONNECT operations (and for DELETE operations in API servers prior to v1.15.0)
    "oldObject": {"apiVersion":"autoscaling/v1","kind":"Scale",...},
    // options contains the options for the operation being admitted, like meta.k8s.io/v1 CreateOptions, UpdateOptions, or DeleteOptions.
    // It is null for CONNECT operations.
    // Only sent by v1.15+ API servers.
    "options": {"apiVersion":"meta.k8s.io/v1","kind":"UpdateOptions",...},

    // dryRun indicates the API request is running in dry run mode and will not be persisted.
    // Webhooks with side effects should avoid actuating those side effects when dryRun is true.
    // See http://k8s.io/docs/reference/using-api/api-concepts/#make-a-dry-run-request for more details.
    "dryRun": false
  }
}
```

### Response

Webhooks respond with a 200 HTTP status code, `Content-Type: application/json`,
and a body containing an `AdmissionReview` object (in the same version they were sent),
with the `response` stanza populated, serialized to JSON.

At a minimum, the `response` stanza must contain the following fields:
* `uid`, copied from the `request.uid` sent to the webhook
* `allowed`, either set to `true` or `false`

Example of a minimal response from a webhook to allow a request:
```json
{
  "apiVersion": "admission.k8s.io/v1beta1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": true
  }
}
```

Example of a minimal response from a webhook to forbid a request:
```json
{
  "apiVersion": "admission.k8s.io/v1beta1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": false
  }
}
```

When rejecting a request, the webhook can customize the http code and message returned to the user using the `status` field.
The specified status object is returned to the user.
See [API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.14/#status-v1-meta) for details about the status type.
Example of a response to forbid a request, customizing the HTTP status code and message presented to the user:
```json
{
  "apiVersion": "admission.k8s.io/v1beta1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": false,
    "status": {
      "code": 403,
      "message": "You cannot do this because it is Tuesday and your name starts with A"
    }
  }
}
```

When allowing a request, a mutating admission webhook may optionally modify the incoming object as well.
This is done using the `patch` and `patchType` fields in the response.
The only currently supported `patchType` is `JSONPatch`.
See [JSON patch](http://jsonpatch.com/) documentation for more details.
For `patchType: JSONPatch`, the `patch` field contains a base64-encoded array of JSON patch operations.

As an example, a single patch operation that would set `spec.replicas` would be `[{"op": "add", "path": "/spec/replicas", "value": 3}]`

Base64-encoded, this would be `W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0=`

So a webhook response to add that label would be:
```json
{
  "apiVersion": "admission.k8s.io/v1beta1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": true,
    "patchType": "JSONPatch",
    "patch": "W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0="
  }
}
```

## Webhook configuration

To register admission webhooks, create `MutatingWebhookConfiguration` or `ValidatingWebhookConfiguration` API objects.
Each configuration can contain one or more webhooks. Each webhook defines the following things.

### Matching requests: rules

Each webhook must specify a list of rules used to determine if a request to the API server should be sent to the webhook.
Each rule specifies one or more operations, apiGroups, apiVersions, and resources, and a resource scope:

* `operations` lists one or more operations to match. Can be `"CREATE"`, `"UPDATE"`, `"DELETE"`, `"CONNECT"`, or `"*"` to match all.
* `apiGroups` lists one or more API groups to match. `""` is the core API group. `"*"` matches all API groups.
* `apiVersions` lists one or more API versions to match. `"*"` matches all API versions.
* `resources` lists one or more resources to match.
    * `"*"` matches all resources, but not subresources.
    * `"*/*"` matches all resources and subresources.
    * `"pods/*"` matches all subresources of pods.
    * `"*/status"` matches all status subresources.
* `scope` specifies a scope to match. Valid values are `"Cluster"`, `"Namespaced"`, and `"*"`. Subresources match the scope of their parent resource. Supported in v1.14+. Default is `"*"`, matching pre-1.14 behavior.
    * `"Cluster"` means that only cluster-scoped resources will match this rule (Namespace API objects are cluster-scoped).
    * `"Namespaced"` means that only namespaced resources will match this rule.
    * `"*"` means that there are no scope restrictions.

If an incoming request matches one of the specified operations, groups, versions, resources, and scope for any of a webhook's rules, the request is sent to the webhook.

Here are other examples of rules that could be used to specify which resources should be intercepted.

Match `CREATE` or `UPDATE` requests to `apps/v1` and `apps/v1beta1` `deployments` and `replicasets`:

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  rules:
  - operations: ["CREATE", "UPDATE"] 
    apiGroups: ["apps"]
    apiVersions: ["v1", "v1beta1"]
    resources: ["deployments", "replicasets"]
    scope: "Namespaced"
  ...
```

Match create requests for all resources (but not subresources) in all API groups and versions:

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  rules:
  - operations: ["CREATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*"]
    scope: "*"
  ...
```

Match update requests for all `status` subresources in all API groups and versions:

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  rules:
  - operations: ["UPDATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*/status"]
    scope: "*"
  ...
```

### Matching requests: objectSelector

In v1.15+, webhooks may optionally limit which requests are intercepted based on the labels of the
objects they would be sent, by specifying an `objectSelector`. If specified, the objectSelector
is evaluated against both the object and oldObject that would be sent to the webhook,
and is considered to match if either object matches the selector.

A null object (oldObject in the case of create, or newObject in the case of delete),
or an object that cannot have labels (like a `DeploymentRollback` or a `PodProxyOptions` object)
is not considered to match.

Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels.

This example shows a mutating webhook that would match a `CREATE` of any resource with the label `foo: bar`:

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  objectSelector:
    matchLabels:
      foo: bar
  rules:
  - operations: ["CREATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*"]
    scope: "*"
  ...
```

See https://kubernetes.io/docs/concepts/overview/working-with-objects/labels for more examples of label selectors.

### Matching requests: namespaceSelector

Webhooks may optionally limit which requests for namespaced resources are intercepted,
based on the labels of the containing namespace, by specifying a `namespaceSelector`.

The `namespaceSelector` decides whether to run the webhook on a request for a namespaced resource
(or a Namespace object), based on whether the namespace's labels match the selector.
If the object itself is a namespace, the matching is performed on object.metadata.labels.
If the object is a cluster scoped resource other than a Namespace, `namespaceSelector` has no effect.

This example shows a mutating webhook that matches a `CREATE` of any namespaced resource inside a namespace
that does not have a "runlevel" label of "0" or "1":

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  namespaceSelector:
    matchExpressions:
    - key: runlevel
      operator: NotIn
      values: ["0","1"]
  rules:
  - operations: ["CREATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*"]
    scope: "Namespaced"
  ...
```

This example shows a validating webhook that matches a `CREATE` of any namespaced resource inside a namespace
that is associated with the "environment" of "prod" or "staging":

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  namespaceSelector:
    matchExpressions:
    - key: environment
      operator: In
      values: ["prod","staging"]
  rules:
  - operations: ["CREATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*"]
    scope: "Namespaced"
  ...
```

See https://kubernetes.io/docs/concepts/overview/working-with-objects/labels for more examples of label selectors.

### Matching requests: matchPolicy

API servers can make objects available via multiple API groups or versions.
For example, the Kubernetes API server allows creating and modifying `Deployment` objects
via `extensions/v1beta1`, `apps/v1beta1`, `apps/v1beta2`, and `apps/v1` APIs.

For example, if a webhook only specified a rule for some API groups/versions (like `apiGroups:["apps"], apiVersions:["v1","v1beta1"]`),
and a request was made to modify the resource via another API group/version (like `extensions/v1beta1`),
the request would not be sent to the webhook.

In v1.15+, `matchPolicy` lets a webhook define how its `rules` are used to match incoming requests.
Allowed values are `Exact` or `Equivalent`. The default in `v1beta1` is `Exact`.

* `Exact` means a request should be intercepted only if it exactly matches a specified rule.
* `Equivalent` means a request should be intercepted if modifies a resource listed in `rules`, even via another API group or version.

In the example given above, the webhook that only registered for `apps/v1` could use `matchPolicy`:
* `matchPolicy: Exact` would mean the `extensions/v1beta1` request would not be sent to the webhook
* `matchPolicy: Equivalent` means the `extensions/v1beta1` request would be sent to the webhook (with the objects converted to a version the webhook had specified: `apps/v1`)

Specifying `Equivalent` is recommended, and ensures that webhooks continue to intercept the 
resources they expect when upgrades enable new versions of the resource in the API server.

When a resource stops being served by the API server, it is no longer considered equivalent to other versions of that resource that are still served.
For example, deprecated `extensions/v1beta1` deployments are scheduled to stop being served by default in v1.16.
Once that occurs, a webhook with a `apiGroups:["extensions"], apiVersions:["v1beta1"], resources:["deployments"]` rule
would no longer intercept deployments created via `apps/v1` APIs. For that reason, webhooks should prefer registering
for stable versions of resources.

This example shows a validating webhook that intercepts modifications to deployments (no matter the API group or version),
and is always sent an `apps/v1` `Deployment` object:

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  matchPolicy: Equivalent
  rules:
  - operations: ["CREATE","UPDATE","DELETE"]
    apiGroups: ["apps"]
    apiVersions: ["v1"]
    resources: ["deployments"]
    scope: "Namespaced"
  ...
```

### Contacting the webhook

Once the API server has determined a request should be sent to a webhook,
it needs to know how to contact the webhook. This is specified in the `clientConfig`
stanza of the webhook configuration.

Webhooks can either be called via a URL or a service reference,
and can optionally include a custom CA bundle to use to verify the TLS connection.

#### URL

`url` gives the location of the webhook, in standard URL form
(`scheme://host:port/path`).

The `host` should not refer to a service running in the cluster; use
a service reference by specifying the `service` field instead.
The host might be resolved via external DNS in some apiservers
(e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would 
be a layering violation). `host` may also be an IP address.

Please note that using `localhost` or `127.0.0.1` as a `host` is
risky unless you take great care to run this webhook on all hosts
which run an apiserver which might need to make calls to this
webhook. Such installs are likely to be non-portable, i.e., not easy
to turn up in a new cluster.

The scheme must be "https"; the URL must begin with "https://".

Attempting to use a user or basic auth e.g. "user:password@" is not allowed.
Fragments ("#...") and query parameters ("?...") are also not allowed.

Here is an example of a mutating webhook configured to call a URL
(and expects the TLS certificate to be verified using system trust roots, so does not specify a caBundle):
```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  clientConfig:
    url: "https://my-webhook.example.com:9443/my-webhook-path"
  ...
```

#### Service reference

The `service` stanza inside `clientConfig` is a reference to the service for this webhook.
If the webhook is running within the cluster, then you should use `service` instead of `url`.
The service namespace and name are required. The port is optional and defaults to 443.
The path is optional and defaults to "/".

Here is an example of a mutating webhook configured to call a service on port "1234"
at the subpath "/my-path", and to verify the TLS connection against the ServerName
`my-service-name.my-service-namespace.svc` using a custom CA bundle:

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  clientConfig:
    caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
    service:
      namespace: my-service-namespace
      name: my-service-name
      path: /my-path
      port: 1234
  ...
```

### Side effects

Webhooks typically operate only on the content of the `AdmissionReview` sent to them.
Some webhooks, however, make out-of-band changes as part of processing admission requests.

Webhooks that make out-of-band changes ("side effects") must also have a reconcilation mechanism
(like a controller) that periodically determines the actual state of the world, and adjusts
the out-of-band data modified by the admission webhook to reflect reality.
This is because a call to an admission webhook does not guarantee the admitted object will be persisted as is, or at all.
Later webhooks can modify the content of the object, a conflict could be encountered while writing to storage,
or the server could power off before persisting the object.

Additionally, webhooks with side effects should skip those side-effects when `dryRun: true` admission requests are handled.
A webhook must explicitly indicate that it will not have side-effects when run with `dryRun`,
or the dry-run request will not be sent to the webhook and the API request fill fail instead.

Webhooks indicate whether they have side effects using the `sideEffects` field in the webhook configuration.
`sideEffects` may be set to `Unknown`, `None`, `Some`, `NoneOnDryRun`. The default is `Unknown`.

* `Unknown`: no information is known about the side effects of calling the webhook.
If a request with `dryRun: true` would trigger a call to this webhook, the request will instead fail, and the webhook will not be called.
* `None`: calling the webhook will have no side effects.
* `Some`: calling the webhook will possibly have side effects.
If a request with the dry-run attribute would trigger a call to this webhook, the request will instead fail, and the webhook will not be called.
* `NoneOnDryRun`: calling the webhook will possibly have side effects,
but if a request with `dryRun: true` is sent to the webhook, the webhook will suppress the side effects (the webhook is `dryRun`-aware).

Here is an example of a validating webhook indicating it has no side effects on `dryRun: true` requests:
```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  sideEffects: NoneOnDryRun
  ...
```

### Timeouts

Because webhooks add to API request latency, they should evaluate as quickly as possible.
`timeoutSeconds` allows configuring how long the API server should wait for a webhook to respond
before treating the call as a failure.

If the timeout expires before the webhook responds, the webhook call will be ignored or 
the API call will be rejected based on the [failure policy](#failure-policy).

The timeout value must be between 1 and 30 seconds, and defaults to 30 seconds.

Here is an example of a validating webhook with a custom timeout of 2 seconds:
```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  timeoutSeconds: 2
  ...
```

### Reinvocation policy

A single ordering of mutating admissions plugins (including webhooks) does not work for all cases
(see https://issue.k8s.io/64333 as an example). A mutating webhook can add a new sub-structure 
to the object (like adding a `container` to a `pod`), and other mutating plugins which have already 
run may have opinions on those new structures (like setting an `imagePullPolicy` on all containers).

In v1.15+, to allow mutating admission plugins to observe changes made by other plugins,
built-in mutating admission plugins are re-run if a mutating webhook modifies an object,
and mutating webhooks can specify a `reinvocationPolicy` to control whether they are reinvoked as well.

`reinvocationPolicy` may be set to `Never` or `IfNeeded`. It defaults to `Never`.

* `Never`: the webhook must not be called more than once in a single admission evaluation
* `IfNeeded`: the webhook may be called again as part of the admission evaluation if the object
being admitted is modified by other admission plugins after the initial webhook call.

The important elements to note are:

* The number of additional invocations is not guaranteed to be exactly one.
* If additional invocations result in further modifications to the object, webhooks are not guaranteed to be invoked again.
* Webhooks that use this option may be reordered to minimize the number of additional invocations.
* To validate an object after all mutations are guaranteed complete, use a validating admission webhook instead (recommended for webhooks with side-effects).

Here is an example of a mutating webhook opting into being re-invoked if later admission plugins modify the object:

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  reinvocationPolicy: IfNeeded
  ...
```

Mutating webhooks must be idempotent, able to successfully process an object they have already admitted
and potentially modified. This is true for all mutating admission webhooks, since any change they can make
in an object could already exist in the user-provided object, but it is essential for webhooks that opt into reinvocation.

### Failure policy

`failurePolicy` defines how unrecognized errors and timeout errors from the admission webhook
are handled. Allowed values are `Ignore` or `Fail`. Defaults to `Ignore` in v1beta1.

* `Ignore` means that an error calling the webhook is ignored and the API request is allowed to continue.
* `Fail` means that an error calling the webhook causes the admission to fail and the API request to be rejected.

Here is a mutating webhook configured to reject an API request if errors are encountered calling the admission webhook:

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  failurePolicy: Fail
  ...
```

{{% /capture %}}
