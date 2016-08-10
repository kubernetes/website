---
assignees:
- erictune
- lavalamp

---

In Kubernetes, authorization happens as a separate step from authentication.
See the [Accessing Control Overview](/docs/admin/accessing-the-api/) for an
overview of how authentication and authorization are applied to requests.

Authorization applies to all HTTP accesses on the main (secure) apiserver port.

The authorization check for any request compares attributes of the context of
the request, (such as user, resource, and namespace) with access
policies.  An API call must be allowed by some policy in order to proceed.

The following implementations are available, and are selected by flag:

  - `--authorization-mode=AlwaysDeny` blocks all requests (used in tests).
  - `--authorization-mode=AlwaysAllow` allows all requests; use if you don't
need authorization.
  - `--authorization-mode=ABAC` allows for a simple local-file-based user-configured
authorization policy.  ABAC stands for Attribute-Based Access Control.
authorization policy.
  - `--authorization-mode=RBAC` is an experimental implementation which allows
for authorization to be driven by the Kubernetes API.
RBAC stands for Roles-Based Access Control.
  - `--authorization-mode=Webhook` allows for authorization to be driven by a
remote service using REST.

If multiple modes are provided the set is unioned, and only a single authorizer is required to admit the action.  This means the flag:

```
--authorization-mode=AlwaysDeny,AlwaysAllow
```

will always allow.

## Request Attributes

A request has the following attributes that can be considered for authorization:

  - user (the user-string which a user was authenticated as).
  - group (the list of group names the authenticated user is a member of).
  - "extra" (a map of arbitrary string keys to string values, provided by the authentication layer)
  - whether the request is for an API resource.
  - the request path.
    - allows authorizing access to miscellaneous non-resource endpoints like `/api` or `/healthz` (see [kubectl](#kubectl)).
  - the request verb.
    - API verbs `get`, `list`, `create`, `update`, `patch`, `watch`, `proxy`, `redirect`, `delete`, and `deletecollection` are used for resource requests
    - HTTP verbs `get`, `post`, `put`, and `delete` are used for non-resource requests
  - what resource is being accessed (for resource requests only)
  - what subresource is being accessed (for resource requests only)
  - the namespace of the object being accessed (for namespaced resource requests only)
  - the API group being accessed (for resource requests only)

The request verb for a resource API endpoint can be determined by the HTTP verb used and whether or not the request acts on an individual resource or a collection of resources:

HTTP verb | request verb
----------|---------------
POST      | create
GET, HEAD | get (for individual resources), list (for collections)
PUT       | update
PATCH     | patch
DELETE    | delete (for individual resources), deletecollection (for collections)


## ABAC Mode

### Policy File Format

For mode `ABAC`, also specify `--authorization-policy-file=SOME_FILENAME`.

The file format is [one JSON object per line](http://jsonlines.org/).  There
should be no enclosing list or map, just one map per line.

Each line is a "policy object".  A policy object is a map with the following
properties:

  - Versioning properties:
    - `apiVersion`, type string; valid values are "abac.authorization.kubernetes.io/v1beta1". Allows versioning and conversion of the policy format.
    - `kind`, type string: valid values are "Policy". Allows versioning and conversion of the policy format.
  - `spec` property set to a map with the following properties:
    - Subject-matching properties:
      - `user`, type string; the user-string from `--token-auth-file`. If you specify `user`, it must match the username of the authenticated user. `*` matches all requests.
      - `group`, type string; if you specify `group`, it must match one of the groups of the authenticated user. `*` matches all requests.
    - `readonly`, type boolean, when true, means that the policy only applies to get, list, and watch operations.
    - Resource-matching properties:
      - `apiGroup`, type string; an API group, such as `extensions`. `*` matches all API groups.
      - `namespace`, type string; a namespace string. `*` matches all resource requests.
      - `resource`, type string; a resource, such as `pods`. `*` matches all resource requests.
    - Non-resource-matching properties:
    - `nonResourcePath`, type string; matches the non-resource request paths (like `/version` and `/apis`). `*` matches all non-resource requests. `/foo/*` matches `/foo/` and all of its subpaths.

An unset property is the same as a property set to the zero value for its type
(e.g. empty string, 0, false). However, unset should be preferred for
readability.

In the future, policies may be expressed in a JSON format, and managed via a
REST interface.

### Authorization Algorithm

A request has attributes which correspond to the properties of a policy object.

When a request is received, the attributes are determined.  Unknown attributes
are set to the zero value of its type (e.g. empty string, 0, false).

A property set to `"*"` will match any value of the corresponding attribute.

The tuple of attributes is checked for a match against every policy in the
policy file. If at least one line matches the request attributes, then the
request is authorized (but may fail later validation).

To permit any user to do something, write a policy with the user property set to
`"*"`.

To permit a user to do anything, write a policy with the apiGroup, namespace,
resource, and nonResourcePath properties set to `"*"`.

### Kubectl

Kubectl uses the `/api` and `/apis` endpoints of api-server to negotiate
client/server versions. To validate objects sent to the API by create/update
operations, kubectl queries certain swagger resources. For API version `v1`
those would be `/swaggerapi/api/v1` & `/swaggerapi/experimental/v1`.

When using ABAC authorization, those special resources have to be explicitly
exposed via the `nonResourcePath` property in a policy (see [examples](#examples) below):

* `/api`, `/api/*`, `/apis`, and `/apis/*` for API version negotiation.
* `/version` for retrieving the server version via `kubectl version`.
* `/swaggerapi/*` for create/update operations.

To inspect the HTTP calls involved in a specific kubectl operation you can turn
up the verbosity:

    kubectl --v=8 version

### Examples

 1. Alice can do anything to all resources:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "alice", "namespace": "*", "resource": "*", "apiGroup": "*"}}
    ```
 2. Kubelet can read any pods:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "pods", "readonly": true}}
    ```
 3. Kubelet can read and write events:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "kubelet", "namespace": "*", "resource": "events"}}
    ```
 4. Bob can just read pods in namespace "projectCaribou":

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "bob", "namespace": "projectCaribou", "resource": "pods", "readonly": true}}
    ```
 5. Anyone can make read-only requests to all non-resource paths:

    ```json
    {"apiVersion": "abac.authorization.kubernetes.io/v1beta1", "kind": "Policy", "spec": {"user": "*", "readonly": true, "nonResourcePath": "*"}}
    ```

[Complete file example](http://releases.k8s.io/{{page.githubbranch}}/pkg/auth/authorizer/abac/example_policy_file.jsonl)

### A quick note on service accounts

A service account automatically generates a user. The user's name is generated
according to the naming convention:

```shell
system:serviceaccount:<namespace>:<serviceaccountname>
```
Creating a new namespace also causes a new service account to be created, of
this form:

```shell
system:serviceaccount:<namespace>:default
```

For example, if you wanted to grant the default service account in the
kube-system full privilege to the API, you would add this line to your policy
file:

```json
{"apiVersion":"abac.authorization.kubernetes.io/v1beta1","kind":"Policy","spec":{"user":"system:serviceaccount:kube-system:default","namespace":"*","resource":"*","apiGroup":"*"}}
```

The apiserver will need to be restarted to pickup the new policy lines.

## RBAC Mode

When specified "RBAC" (Role-Based Access Control) uses the
"rbac.authorization.k8s.io" API group to drive authorization decisions,
allowing admins to dynamically configure permission policies through the
Kubernetes API.

As of 1.3 RBAC mode is in alpha and considered experimental.

To use RBAC, you must both enable the authorization module with `--authorization-mode=RBAC`,
and [enable the API version](
docs/admin/cluster-management.md/#Turn-on-or-off-an-api-version-for-your-cluster),
with a `--runtime-config=` that includes `rbac.authorization.k8s.io/v1alpha1`.

### Roles, RolesBindings, ClusterRoles, and ClusterRoleBindings

The RBAC API Group declares four top level types which will be covered in this
section. Users can interact with these resources as they would with any other
API resource. Through `kubectl`, direct calls to the API, etc. For instance,
`kubectl create -f (resource).yml` can be used with any of these examples,
though readers who wish to follow along should review the following section on
bootstrapping first.

In the RBAC API Group, roles hold a logical grouping of permissions. These
permissions map very closely to ABAC policies, but only contain information
about requests being made. Permission are purely additive, rules may only omit
permissions they do not wish to grant.

Here's an example of a role which grants read access to pods within the
"default" namespace.

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1alpha1
metadata:
  namespace: default
  name: pod-reader
rules:
  - apiGroups: [""] # The API group "" indicates the default API Group.
    resources: ["pods"]
    verbs: ["get", "watch", "list"]
    nonResourceURLs: []
```

`ClusterRoles` hold the same information as a `Role` but can apply to any
namespace as well as non-namespaced resources (such as `Nodes`,
`PersistentVolume`, etc.). The following `ClusterRole` can grant permissions to
read secrets in any namespace.

```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1alpha1
metadata:
  # "namespace" omitted since ClusterRoles are not namespaced.
  name: secret-reader
rules:
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get", "watch", "list"]
    nonResourceURLs: []
```

`RoleBindings` perform the task of granting the permission to a user or set of
users. They hold a list of subjects which they apply to, and a reference to the
`Role` being assigned.

The following `RoleBinding` assigns the "pod-reader" role to the user "jane"
within the "default" namespace, and allows jane to read pods.

```yaml
# This role binding allows "jane" to read pods in the namespace "default"
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1alpha1
metadata:
  name: read-pods
  namespace: default
subjects:
  - kind: User # May be "User", "Group" or "ServiceAccount"
    name: jane
roleRef:
  kind: Role
  namespace: default
  name: pod-reader
  apiVersion: rbac.authorization.k8s.io/v1alpha1
```

`RoleBindings` may also refer to a `ClusterRole`. However, a `RoleBinding` that
refers to a `ClusterRole` only applies in the `RoleBinding`'s namespace, not at
the cluster level. This allows admins to define a set of common roles for the
entire cluster, then reuse them in multiple namespaces.

For instance, even though the following `RoleBinding` refers to a `ClusterRole`,
"dave" (the subject) will only be able read secrets in the "development"
namespace, the namespace of the `RoleBinding`.

```yaml
# This role binding allows "dave" to read secrets in the namespace "development"
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1alpha1
metadata:
  name: read-secrets
  namespace: development # This binding only applies in the "development" namespace
subjects:
  - kind: User # May be "User", "Group" or "ServiceAccount"
    name: dave
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiVersion: rbac.authorization.k8s.io/v1alpha1
```

Finally a `ClusterRoleBinding` may be used to grant permissions in all
namespaces. The following `ClusterRoleBinding` allows any user in the group
"manager" to read secrets in any namepsace.

```yaml
# This cluster role binding allows anyone in the "manager" group to read secrets in any namespace.
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1alpha1
metadata:
  name: read-secrets
subjects:
  - kind: Group # May be "User", "Group" or "ServiceAccount"
    name: manager
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiVersion: rbac.authorization.k8s.io/v1alpha1
```

### Privilege Escalation Prevention and Bootstrapping

The `rbac.authorization.k8s.io` API group inherently attempts to prevent users
from escalating privileges. Simply put, __a user can't grant permissions they
don't already have even when the RBAC authorizer it disabled__. If "user-1"
does not have the ability to read secrets in "namespace-a", they cannot create
a binding that would grant that permission to themselves or any other user.

For bootstrapping the first roles, it becomes necessary for someone to get
around these limitations. For the alpha release of RBAC, an API Server flag was
added to allow one user to step around all RBAC authorization and privilege
escalation checks. NOTE: _This is subject to change with future releases._

```
--authorization-rbac-super-user=admin
```

Once set the specified super user, in this case "admin", can be used to create
the roles and role bindings to initialize the system.

This flag is optional and once the initial bootstrapping is performed can be
unset.

## Webhook Mode

When specified, mode `Webhook` causes Kubernetes to query an outside REST
service when determining user privileges.

### Configuration File Format

Mode `Webhook` requires a file for HTTP configuration, specify by the
`--authorization-webhook-config-file=SOME_FILENAME` flag.

The configuration file uses the [kubeconfig](/docs/user-guide/kubeconfig-file/)
file format. Within the file "users" refers to the API Server webhook and
"clusters" refers to the remote service.

A configuration example which uses HTTPS client auth:

```yaml
# clusters refers to the remote service.
clusters:
  - name: name-of-remote-authz-service
    cluster:
      certificate-authority: /path/to/ca.pem      # CA for verifying the remote service.
      server: https://authz.example.com/authorize # URL of remote service to query. Must use 'https'.

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
    user: name-of-api-sever
  name: webhook
```

### Request Payloads

When faced with an authorization decision, the API Server POSTs a JSON
serialized api.authorization.v1beta1.SubjectAccessReview object describing the
action. This object contains fields describing the user attempting to make the
request, and either details about the resource being accessed or requests
attributes.

Note that webhook API objects are subject to the same [versioning compatibility rules](/docs/api/)
as other Kubernetes API objects. Implementers should be aware of loser
compatibility promises for beta objects and check the "apiVersion" field of the
request to ensure correct deserialization. Additionally, the API Server must
enable the `authorization.k8s.io/v1beta1` API extensions group (`--runtime-config=authorization.k8s.io/v1beta1=true`).

An example request body:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "kittensandponies",
      "verb": "GET",
      "group": "*",
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

The remote service is expected to fill the SubjectAccessReviewStatus field of
the request and respond to either allow or disallow access. The response body's
"spec" field is ignored and may be omitted. A permissive response would return:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": true
  }
}
```

To disallow access, the remote service would return:

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

Access to non-resource paths are sent as:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "nonResourceAttributes": {
      "path": "/debug",
      "verb": "GET"
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ]
  }
}
```

Non-resource paths include: `/api`, `/apis`, `/metrics`, `/resetMetrics`,
`/logs`, `/debug`, `/healthz`, `/swagger-ui/`, `/swaggerapi/`, `/ui`, and
`/version.` Clients require access to `/api`, `/api/*/`, `/apis/`, `/apis/*`,
`/apis/*/*`, and `/version` to discover what resources and versions are present
on the server. Access to other non-resource paths can be disallowed without
restricting access to the REST api.

For further documentation refer to the authorization.v1beta1 API objects and
plugin/pkg/auth/authorizer/webhook/webhook.go.

## Module Development

Other implementations can be developed fairly easily.
The APIserver calls the Authorizer interface:

```go
type Authorizer interface {
  Authorize(a Attributes) error
}
```

to determine whether or not to allow each API action.

An authorization plugin is a module that implements this interface.
Authorization plugin code goes in `pkg/auth/authorizer/$MODULENAME`.

An authorization module can be completely implemented in go, or can call out
to a remote authorization service.  Authorization modules can implement
their own caching to reduce the cost of repeated authorization calls with the
same or similar arguments.  Developers should then consider the interaction
between caching and revocation of permissions.
