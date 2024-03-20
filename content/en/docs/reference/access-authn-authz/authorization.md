---
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Authorization Overview
content_type: concept
weight: 60
---

<!-- overview -->
Learn more about Kubernetes authorization, including details about creating
policies using the supported authorization modules.


<!-- body -->
In Kubernetes, you must be authenticated (logged in) before your request can be
authorized (granted permission to access). For information about authentication,
see [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/).

Kubernetes expects attributes that are common to REST API requests. This means
that Kubernetes authorization works with existing organization-wide or
cloud-provider-wide access control systems which may handle other APIs besides
the Kubernetes API.

## Determine Whether a Request is Allowed or Denied
Kubernetes authorizes API requests using the API server. It evaluates all of the
request attributes against all policies and allows or denies the request. All
parts of an API request must be allowed by some policy in order to proceed. This
means that permissions are denied by default.

(Although Kubernetes uses the API server, access controls and policies that
depend on specific fields of specific kinds of objects are handled by Admission
Controllers.)

When multiple authorization modules are configured, each is checked in sequence.
If any authorizer approves or denies a request, that decision is immediately
returned and no other authorizer is consulted. If all modules have no opinion on
the request, then the request is denied. A deny returns an HTTP status code 403.

## Review Your Request Attributes
Kubernetes reviews only the following API request attributes:

 * **user** - The `user` string provided during authentication.
 * **group** - The list of group names to which the authenticated user belongs.
 * **extra** - A map of arbitrary string keys to string values, provided by the authentication layer.
 * **API** - Indicates whether the request is for an API resource.
 * **Request path** - Path to miscellaneous non-resource endpoints like `/api` or `/healthz`.
 * **API request verb** - API verbs like `get`, `list`, `create`, `update`, `patch`, `watch`, `delete`, and `deletecollection` are used for resource requests. To determine the request verb for a resource API endpoint, see [Determine the request verb](/docs/reference/access-authn-authz/authorization/#determine-the-request-verb).
 * **HTTP request verb** - Lowercased HTTP methods like `get`, `post`, `put`, and `delete` are used for non-resource requests.
 * **Resource** - The ID or name of the resource that is being accessed (for resource requests only) -- For resource requests using `get`, `update`, `patch`, and `delete` verbs, you must provide the resource name.
 * **Subresource** - The subresource that is being accessed (for resource requests only).
 * **Namespace** - The namespace of the object that is being accessed (for namespaced resource requests only).
 * **API group** - The {{< glossary_tooltip text="API Group" term_id="api-group" >}} being accessed (for resource requests only). An empty string designates the _core_ [API group](/docs/reference/using-api/#api-groups).

## Determine the Request Verb

**Non-resource requests**
Requests to endpoints other than `/api/v1/...` or `/apis/<group>/<version>/...`
are considered "non-resource requests", and use the lower-cased HTTP method of the request as the verb.
For example, a `GET` request to endpoints like `/api` or `/healthz` would use `get` as the verb.

**Resource requests**
To determine the request verb for a resource API endpoint, review the HTTP verb
used and whether or not the request acts on an individual resource or a
collection of resources:

HTTP verb | request verb
----------|---------------
POST      | create
GET, HEAD | get (for individual resources), list (for collections, including full object content), watch (for watching an individual resource or collection of resources)
PUT       | update
PATCH     | patch
DELETE    | delete (for individual resources), deletecollection (for collections)

{{< caution >}}
The `get`, `list` and `watch` verbs can all return the full details of a resource. In terms of the returned data they are equivalent. For example, `list` on `secrets` will still reveal the `data` attributes of any returned resources.
{{< /caution >}}

Kubernetes sometimes checks authorization for additional permissions using specialized verbs. For example:

* [RBAC](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * `bind` and `escalate` verbs on `roles` and `clusterroles` resources in the `rbac.authorization.k8s.io` API group.
* [Authentication](/docs/reference/access-authn-authz/authentication/)
  * `impersonate` verb on `users`, `groups`, and `serviceaccounts` in the core API group, and the `userextras` in the `authentication.k8s.io` API group.

## Authorization Modes {#authorization-modules}

The Kubernetes API server may authorize a request using one of several authorization modes:

 * **Node** - A special-purpose authorization mode that grants permissions to kubelets based on the pods they are scheduled to run. To learn more about using the Node authorization mode, see [Node Authorization](/docs/reference/access-authn-authz/node/).
 * **ABAC** - Attribute-based access control (ABAC) defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together. The policies can use any type of attributes (user attributes, resource attributes, object, environment attributes, etc). To learn more about using the ABAC mode, see [ABAC Mode](/docs/reference/access-authn-authz/abac/).
 * **RBAC** - Role-based access control (RBAC) is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise. In this context, access is the ability of an individual user to perform a specific task, such as view, create, or modify a file. To learn more about using the RBAC mode, see [RBAC Mode](/docs/reference/access-authn-authz/rbac/)
   * When specified RBAC (Role-Based Access Control) uses the `rbac.authorization.k8s.io` API group to drive authorization decisions, allowing admins to dynamically configure permission policies through the Kubernetes API.
   * To enable RBAC, start the apiserver with `--authorization-mode=RBAC`.
 * **Webhook** - A WebHook is an HTTP callback: an HTTP POST that occurs when something happens; a simple event-notification via HTTP POST. A web application implementing WebHooks will POST a message to a URL when certain things happen. To learn more about using the Webhook mode, see [Webhook Mode](/docs/reference/access-authn-authz/webhook/).

#### Checking API Access

`kubectl` provides the `auth can-i` subcommand for quickly querying the API authorization layer.
The command uses the `SelfSubjectAccessReview` API to determine if the current user can perform
a given action, and works regardless of the authorization mode used.


```bash
kubectl auth can-i create deployments --namespace dev
```

The output is similar to this:

```
yes
```

```shell
kubectl auth can-i create deployments --namespace prod
```

The output is similar to this:

```
no
```

Administrators can combine this with [user impersonation](/docs/reference/access-authn-authz/authentication/#user-impersonation)
to determine what action other users can perform.

```bash
kubectl auth can-i list secrets --namespace dev --as dave
```

The output is similar to this:

```
no
```

Similarly, to check whether a ServiceAccount named `dev-sa` in Namespace `dev`
can list Pods in the Namespace `target`:

```bash
kubectl auth can-i list pods \
	--namespace target \
	--as system:serviceaccount:dev:dev-sa
```

The output is similar to this:

```
yes
```

`SelfSubjectAccessReview` is part of the `authorization.k8s.io` API group, which
exposes the API server authorization to external services. Other resources in
this group include:

* `SubjectAccessReview` - Access review for any user, not only the current one. Useful for delegating authorization decisions to the API server. For example, the kubelet and extension API servers use this to determine user access to their own APIs.
* `LocalSubjectAccessReview` - Like `SubjectAccessReview` but restricted to a specific namespace.
* `SelfSubjectRulesReview` - A review which returns the set of actions a user can perform within a namespace. Useful for users to quickly summarize their own access, or for UIs to hide/show actions.

These APIs can be queried by creating normal Kubernetes resources, where the response "status"
field of the returned object is the result of the query.

```bash
kubectl create -f - -o yaml << EOF
apiVersion: authorization.k8s.io/v1
kind: SelfSubjectAccessReview
spec:
  resourceAttributes:
    group: apps
    resource: deployments
    verb: create
    namespace: dev
EOF
```

The generated `SelfSubjectAccessReview` is:
```yaml
apiVersion: authorization.k8s.io/v1
kind: SelfSubjectAccessReview
metadata:
  creationTimestamp: null
spec:
  resourceAttributes:
    group: apps
    resource: deployments
    namespace: dev
    verb: create
status:
  allowed: true
  denied: false
```

## Using Flags for Your Authorization Module

You must include a flag in your policy to indicate which authorization module
your policies include:

The following flags can be used:

  * `--authorization-mode=ABAC` Attribute-Based Access Control (ABAC) mode allows you to configure policies using local files.
  * `--authorization-mode=RBAC` Role-based access control (RBAC) mode allows you to create and store policies using the Kubernetes API.
  * `--authorization-mode=Webhook` WebHook is an HTTP callback mode that allows you to manage authorization using a remote REST endpoint.
  * `--authorization-mode=Node` Node authorization is a special-purpose authorization mode that specifically authorizes API requests made by kubelets.
  * `--authorization-mode=AlwaysDeny` This flag blocks all requests. Use this flag only for testing.
  * `--authorization-mode=AlwaysAllow` This flag allows all requests. Use this flag only if you do not require authorization for your API requests.

You can choose more than one authorization module. Modules are checked in order
so an earlier module has higher priority to allow or deny a request.

## Configuring the API Server using an Authorization Config File

{{< feature-state feature_gate_name="StructuredAuthorizationConfiguration" >}}

The Kubernetes API server's authorizer chain can be configured using a
configuration file.

This feature enables the creation of authorization chains with multiple webhooks with well-defined parameters that validate requests in a particular order and allows fine-grained control – such as explicit Deny on failures. The configuration file approach even allows you to specify [CEL](/docs/reference/using-api/cel/) rules to pre-filter requests before they are dispatched to webhooks, helping you to prevent unnecessary invocations. The API server also automatically reloads the authorizer chain when the configuration file is modified. An example configuration with all possible values is provided below.

You must specify the path to the authorization configuration using the `--authorization-config`command line argument. If you want to keep using command line flags instead of a configuration file, those will continue to work as-is. To gain access to new authorization webhook capabilities like multiple webhooks, failure policy, and pre-filter rules, switch to putting options in an `--authorization-config` file. 

Starting Kubernetes v{{< skew currentVersion >}}, the configuration file format is
beta-level, and only requires specifying `--authorization-config` since the `StructuredAuthorizationConfiguration` feature gate is enabled by default.

{{< caution >}}
If you want to keep using command line flags to configure authorization instead of a configuration file, those will continue to work as-is. 

When the feature is enabled, setting both `--authorization-config` and
configuring an authorization webhook using the `--authorization-mode` and
`--authorization-webhook-*` command line flags is not allowed. If done, there
will be an error and API Server would exit right away.

Authorization Config file reloads when an observed file event occurs or a 1 minute poll is encountered. All non-webhook authorizer types are required to remain unchanged in the file on reload. Reload must not add or remove Node or RBAC 
authorizers. They can be reordered, but cannot be added or removed.

When configuring the authorizer chain using a config file, make sure all the
apiserver nodes have the file. Take a note of the apiserver configuration
when upgrading/downgrading the clusters. For example, if upgrading to v1.29+
clusters and using the config file, you would need to make sure the config file
exists before upgrading the cluster. When downgrading to v1.28, you would need
to add the flags back to their bootstrap mechanism.
{{< /caution >}}

```yaml
#
# DO NOT USE THE CONFIG AS IS. THIS IS AN EXAMPLE.
#
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthorizationConfiguration
authorizers:
  - type: Webhook
    # Name used to describe the authorizer
    # This is explicitly used in monitoring machinery for metrics
    # Note:
    #   - Validation for this field is similar to how K8s labels are validated today.
    # Required, with no default
    name: webhook
    webhook:
      # The duration to cache 'authorized' responses from the webhook
      # authorizer.
      # Same as setting `--authorization-webhook-cache-authorized-ttl` flag
      # Default: 5m0s
      authorizedTTL: 30s
      # The duration to cache 'unauthorized' responses from the webhook
      # authorizer.
      # Same as setting `--authorization-webhook-cache-unauthorized-ttl` flag
      # Default: 30s
      unauthorizedTTL: 30s
      # Timeout for the webhook request
      # Maximum allowed is 30s.
      # Required, with no default.
      timeout: 3s
      # The API version of the authorization.k8s.io SubjectAccessReview to
      # send to and expect from the webhook.
      # Same as setting `--authorization-webhook-version` flag
      # Required, with no default
      # Valid values: v1beta1, v1
      subjectAccessReviewVersion: v1
      # MatchConditionSubjectAccessReviewVersion specifies the SubjectAccessReview
      # version the CEL expressions are evaluated against
      # Valid values: v1
      # Required, no default value
      matchConditionSubjectAccessReviewVersion: v1
      # Controls the authorization decision when a webhook request fails to
      # complete or returns a malformed response or errors evaluating
      # matchConditions.
      # Valid values:
      #   - NoOpinion: continue to subsequent authorizers to see if one of
      #     them allows the request
      #   - Deny: reject the request without consulting subsequent authorizers
      # Required, with no default.
      failurePolicy: Deny
      connectionInfo:
        # Controls how the webhook should communicate with the server.
        # Valid values:
        # - KubeConfig: use the file specified in kubeConfigFile to locate the
        #   server.
        # - InClusterConfig: use the in-cluster configuration to call the
        #   SubjectAccessReview API hosted by kube-apiserver. This mode is not
        #   allowed for kube-apiserver.
        type: KubeConfig
        # Path to KubeConfigFile for connection info
        # Required, if connectionInfo.Type is KubeConfig
        kubeConfigFile: /kube-system-authz-webhook.yaml
        # matchConditions is a list of conditions that must be met for a request to be sent to this
        # webhook. An empty list of matchConditions matches all requests.
        # There are a maximum of 64 match conditions allowed.
        #
        # The exact matching logic is (in order):
        #   1. If at least one matchCondition evaluates to FALSE, then the webhook is skipped.
        #   2. If ALL matchConditions evaluate to TRUE, then the webhook is called.
        #   3. If at least one matchCondition evaluates to an error (but none are FALSE):
        #      - If failurePolicy=Deny, then the webhook rejects the request
        #      - If failurePolicy=NoOpinion, then the error is ignored and the webhook is skipped
      matchConditions:
      # expression represents the expression which will be evaluated by CEL. Must evaluate to bool.
      # CEL expressions have access to the contents of the SubjectAccessReview in v1 version.
      # If version specified by subjectAccessReviewVersion in the request variable is v1beta1,
      # the contents would be converted to the v1 version before evaluating the CEL expression.
      #
      # Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/
      #
      # only send resource requests to the webhook
      - expression: has(request.resourceAttributes)
      # only intercept requests to kube-system
      - expression: request.resourceAttributes.namespace == 'kube-system'
      # don't intercept requests from kube-system service accounts
      - expression: !('system:serviceaccounts:kube-system' in request.user.groups)
  - type: Node
    name: node
  - type: RBAC
    name: rbac
  - type: Webhook
    name: in-cluster-authorizer
    webhook:
      authorizedTTL: 5m
      unauthorizedTTL: 30s
      timeout: 3s
      subjectAccessReviewVersion: v1
      failurePolicy: NoOpinion
      connectionInfo:
        type: InClusterConfig
```

## Privilege escalation via workload creation or edits {#privilege-escalation-via-pod-creation}

Users who can create/edit pods in a namespace, either directly or through a [controller](/docs/concepts/architecture/controller/)
such as an operator, could escalate their privileges in that namespace.

{{< caution >}}
System administrators, use care when granting access to create or edit workloads.
Details of how these can be misused are documented in [escalation paths](/docs/reference/access-authn-authz/authorization/#escalation-paths)
{{< /caution >}}

### Escalation paths {#escalation-paths}
- Mounting arbitrary secrets in that namespace
  - Can be used to access secrets meant for other workloads
  - Can be used to obtain a more privileged service account's service account token
- Using arbitrary Service Accounts in that namespace
  - Can perform Kubernetes API actions as another workload (impersonation)
  - Can perform any privileged actions that Service Account has
- Mounting configmaps meant for other workloads in that namespace
  - Can be used to obtain information meant for other workloads, such as DB host names.
- Mounting volumes meant for other workloads in that namespace
  - Can be used to obtain information meant for other workloads, and change it.

{{< caution >}}
System administrators should be cautious when deploying CRDs that
change the above areas. These may open privilege escalations paths.
This should be considered when deciding on your RBAC controls.
{{< /caution >}}

## {{% heading "whatsnext" %}}

* To learn more about Authentication, see **Authentication** in [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/).
* To learn more about Admission Control, see [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/).
