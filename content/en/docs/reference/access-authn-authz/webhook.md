---
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Webhook Mode
content_type: concept
weight: 36
---

<!-- overview -->
A WebHook is an HTTP callback: an HTTP POST that occurs when something happens; a simple event-notification via HTTP POST. A web application implementing WebHooks will POST a message to a URL when certain things happen.


<!-- body -->
When specified, mode `Webhook` causes Kubernetes to query an outside REST
service when determining user privileges.

## Configuration File Format

Mode `Webhook` requires a file for HTTP configuration, specify by the
`--authorization-webhook-config-file=SOME_FILENAME` flag.

The configuration file uses the [kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
file format. Within the file "users" refers to the API Server webhook and
"clusters" refers to the remote service.

A configuration example which uses HTTPS client auth:

```yaml
# Kubernetes API version
apiVersion: v1
# kind of the API object
kind: Config
# clusters refers to the remote service.
clusters:
  - name: name-of-remote-authz-service
    cluster:
      # CA for verifying the remote service.
      certificate-authority: /path/to/ca.pem
      # URL of remote service to query. Must use 'https'. May not include parameters.
      server: https://authz.example.com/authorize

# users refers to the API Server's webhook configuration.
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # cert for the webhook plugin to use
      client-key: /path/to/key.pem          # key matching the cert

# kubeconfig files require a context. Provide one for the API Server.
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authz-service
    user: name-of-api-server
  name: webhook
```

When using the [AuthorizationConfiguration](/docs/reference/access-authn-authz/authorization/#using-configuration-file-for-authorization)
file format and the `ConditionalAuthorization` feature is enabled, you can configure
a webhook to support conditional authorization by specifying the
`conditionsEndpointKubeConfigContext` field. This tells the API server where to
send `AuthorizationConditionsReview` requests to evaluate conditions:

```yaml
# In the same kubeconfig file referenced by the AuthorizationConfiguration
clusters:
  - name: name-of-remote-authz-service
    cluster:
      certificate-authority: /path/to/ca.pem
      server: https://authz.example.com/authorize
  - name: name-of-remote-authz-conditions
    cluster:
      certificate-authority: /path/to/ca.pem
      # Endpoint for evaluating authorization conditions
      server: https://authz.example.com/evaluate-conditions

users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem
      client-key: /path/to/key.pem

current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authz-service
    user: name-of-api-server
  name: webhook
- context:
    cluster: name-of-remote-authz-conditions
    user: name-of-api-server
  name: authorization-conditions
```

## Request Payloads

When faced with an authorization decision, the API Server POSTs a JSON-
serialized `authorization.k8s.io/v1beta1` `SubjectAccessReview` object describing the
action. This object contains fields describing the user attempting to make the
request, and either details about the resource being accessed or requests
attributes.

Note that webhook API objects are subject to the same [versioning compatibility rules](/docs/concepts/overview/kubernetes-api/)
as other Kubernetes API objects. Implementers should be aware of looser
compatibility promises for beta objects and check the "apiVersion" field of the
request to ensure correct deserialization. Additionally, the API Server must
enable the `authorization.k8s.io/v1beta1` API extensions group (`--runtime-config=authorization.k8s.io/v1beta1=true`).

### Conditional authorization requests {#conditional-authorization-requests}

{{< feature-state feature_gate_name="ConditionalAuthorization" >}}

When the `ConditionalAuthorization` feature is enabled, the `SubjectAccessReview`
request may include a `conditionalAuthorization` field in the spec, indicating
that the client supports receiving conditional responses:

```json
{
  "apiVersion": "authorization.k8s.io/v1",
  "kind": "SubjectAccessReview",
  "spec": {
    "conditionalAuthorization": {
      "mode": "HumanReadable"
    },
    "resourceAttributes": {
      "namespace": "dev",
      "verb": "create",
      "group": "",
      "resource": "persistentvolumes"
    },
    "user": "alice",
    "groups": ["developers"]
  }
}
```

The `mode` field can be:
- `""` (empty): The client does not support conditions. Authorizers must not return conditions.
- `"HumanReadable"`: The client prefers human-readable conditions with descriptions.
- `"Optimized"`: The client prefers optimized conditions (e.g., binary-encoded) for performance.

An example request body:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "kittensandponies",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ]
  }
}
```

The remote service is expected to fill the `status` field of
the request and respond to either allow or disallow access. The response body's
`spec` field is ignored and may be omitted. A permissive response would return:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": true
  }
}
```

For disallowing access there are two methods.

The first method is preferred in most cases, and indicates the authorization
webhook does not allow, or has "no opinion" about the request, but if other 
authorizers are configured, they are given a chance to allow the request. 
If there are no other authorizers, or none of them allow the request, the 
request is forbidden. The webhook would return:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": false,
    "reason": "user does not have read access to the namespace"
  }
}
```

The second method denies immediately, short-circuiting evaluation by other
configured authorizers. This should only be used by webhooks that have
detailed knowledge of the full authorizer configuration of the cluster.
The webhook would return:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": false,
    "denied": true,
    "reason": "user does not have read access to the namespace"
  }
}
```

### Conditional responses {#conditional-responses}

{{< feature-state feature_gate_name="ConditionalAuthorization" >}}

When the `ConditionalAuthorization` feature is enabled and the client indicates
support for conditions in the request, webhooks can return conditional responses.
A conditional response means the final authorization decision depends on the
content of the request or stored object.

To return a conditional response, the webhook sets `allowed: false` and `denied: false`,
and provides a `conditionSetChain` containing the conditions to evaluate:

```json
{
  "apiVersion": "authorization.k8s.io/v1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": false,
    "denied": false,
    "conditionSetChain": [
      {
        "authorizerName": "my-webhook",
        "conditionsType": "k8s.io/cel",
        "conditions": [
          {
            "id": "storage-class-dev",
            "effect": "Allow",
            "condition": "object.spec.storageClassName == 'dev'",
            "description": "Only allow creating PersistentVolumes with storageClassName 'dev'"
          }
        ]
      }
    ]
  }
}
```

Each condition has:
- `id`: A unique identifier for the condition within the authorizer's scope
- `effect`: One of `Allow`, `Deny`, or `NoOpinion`, indicating how a `true` evaluation should be treated
- `condition`: The condition expression to evaluate (format depends on `conditionsType`)
- `description`: Optional human-readable description

Common condition types include:
- `k8s.io/cel`: Common Expression Language (CEL) expressions
- Custom types defined by the authorizer (e.g., `mycompany.com/policy-engine`)

When conditions are returned, they are evaluated during the admission phase against
the actual request and stored objects. If the webhook returns a condition type that
Kubernetes cannot evaluate natively, Kubernetes will call back to the webhook using
the `AuthorizationConditionsReview` API.

Access to non-resource paths are sent as:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "nonResourceAttributes": {
      "path": "/debug",
      "verb": "get"
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ]
  }
}
```

{{< feature-state feature_gate_name="AuthorizeWithSelectors" >}}

When calling out to an authorization webhook, Kubernetes passes
label and field selectors in the request to the authorization webhook.
The authorization webhook can make authorization decisions
informed by the scoped field and label selectors, if it wishes.

The [SubjectAccessReview API documentation](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)
gives guidelines for how these fields should be interpreted and handled by authorization webhooks,
specifically using the parsed requirements rather than the raw selector strings,
and how to handle unrecognized operators safely.

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "verb": "list",
      "group": "",
      "resource": "pods",
      "fieldSelector": {
        "requirements": [
          {"key":"spec.nodeName", "operator":"In", "values":["mynode"]}
        ]
      },
      "labelSelector": {
        "requirements": [
          {"key":"example.com/mykey", "operator":"In", "values":["myvalue"]}
        ]
      }
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ]
  }
}
```

Non-resource paths include: `/api`, `/apis`, `/metrics`,
`/logs`, `/debug`, `/healthz`, `/livez`, `/openapi/v2`, `/readyz`, and
`/version.` Clients require access to `/api`, `/api/*`, `/apis`, `/apis/*`,
and `/version` to discover what resources and versions are present on the server.
Access to other non-resource paths can be disallowed without restricting access
to the REST api.

## AuthorizationConditionsReview API {#authorization-conditions-review}

{{< feature-state feature_gate_name="ConditionalAuthorization" >}}

When a webhook authorizer returns conditions that Kubernetes cannot evaluate
natively (i.e., conditions not using the built-in `k8s.io/cel` type), Kubernetes
needs to call back to the webhook during the admission phase to evaluate those
conditions.

For this purpose, webhooks must implement the `AuthorizationConditionsReview` API
at the endpoint specified by `conditionsEndpointKubeConfigContext` in the
webhook configuration.

### Request format

The API server POSTs a JSON-serialized `AuthorizationConditionsReview` request:

```json
{
  "apiVersion": "authorization.k8s.io/v1alpha1",
  "kind": "AuthorizationConditionsReview",
  "request": {
    "conditionSetChain": [
      {
        "authorizerName": "my-webhook",
        "conditionsType": "mycompany.com/policy-engine",
        "conditions": [
          {
            "id": "policy-check-1",
            "effect": "Allow",
            "condition": "base64-encoded-policy-blob"
          }
        ]
      }
    ],
    "operation": "CREATE",
    "object": {
      "apiVersion": "v1",
      "kind": "PersistentVolume",
      "metadata": { "name": "my-pv" },
      "spec": { "storageClassName": "dev" }
    },
    "oldObject": null,
    "options": null
  }
}
```

The request includes:
- `conditionSetChain`: The conditions that need to be evaluated
- `operation`: The operation being performed (`CREATE`, `UPDATE`, `DELETE`, `CONNECT`)
- `object`: The request object (for `CREATE`, `UPDATE`, `CONNECT`)
- `oldObject`: The stored object (for `UPDATE`, `DELETE`)
- `options`: Operation-specific options

### Response format

The webhook evaluates the conditions and returns a concrete decision:

```json
{
  "apiVersion": "authorization.k8s.io/v1alpha1",
  "kind": "AuthorizationConditionsReview",
  "response": {
    "allowed": true,
    "denied": false,
    "reason": "Policy check passed",
    "evaluationError": ""
  }
}
```

The response must contain:
- `allowed`: `true` if the conditions evaluate to allow
- `denied`: `true` if the conditions evaluate to deny
- `reason`: Optional explanation of the decision
- `evaluationError`: Optional error message if evaluation failed

The webhook can also return another `conditionSetChain` if evaluation of the
conditions depends on additional context (for example, in constrained impersonation
scenarios where authorization depends on both the impersonated request and the
final request object).

For further information, refer to the
[SubjectAccessReview API documentation](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)
and
[webhook.go implementation](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/plugin/pkg/authorizer/webhook/webhook.go).

