---
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Authorization
content_type: concept
weight: 30
description: >
  Details of Kubernetes authorization mechanisms and supported authorization modes.
---

<!-- overview -->

Kubernetes authorization takes place following
[authentication](/docs/reference/access-authn-authz/authentication/).
Usually, a client making a request must be authenticated (logged in) before its
request can be allowed; however, Kubernetes also allows anonymous requests in
some circumstances.

For an overview of how authorization fits into the wider context of API access
control, read
[Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/).

<!-- body -->

## Authorization verdicts {#determine-whether-a-request-is-allowed-or-denied}

Kubernetes authorization of API requests takes place within the API server.
The API server evaluates all of the request attributes against all policies,
potentially also consulting external services, and then allows or denies the
request.

All parts of an API request must be allowed by some authorization
mechanism in order to proceed. In other words: access is denied by default.

{{% note %}}
Access controls and policies that
depend on specific fields of specific kinds of objects are handled by
{{< glossary_tooltip text="admission controllers" term_id="admission-controller" >}}.

Kubernetes admission control happens after authorization has completed (and,
therefore, only when the authorization decision was to allow the request).
{{% /note %}}

When multiple [authorization modules](#authorization-modules) are configured,
each is checked in sequence.
If any authorizer _approves_ or _denies_ a request, that decision is immediately
returned and no other authorizer is consulted. If all modules have _no opinion_
on the request, then the request is denied. An overall deny verdict means that
the API server rejects the request and responds with an HTTP 403 (Forbidden)
status.

### Conditional authorization {#conditional-authorization}

{{< feature-state feature_gate_name="ConditionalAuthorization" >}}

Conditional authorization enables more fine-grained access control policies that
span both the authorization and admission phases. For example, an authorizer can
express: "allow user Alice to create PersistentVolumeClaims, but only when
spec.storageClassName is 'dev'".

Starting with Kubernetes v1.38, authorizers can return _conditional_ responses
in addition to the standard _allow_, _deny_, or _no opinion_ verdicts. A conditional
response means that the final authorization decision depends on the content of
the API request or stored object, rather than just metadata like resource name
or namespace.

When an authorizer returns a conditional response:

1. During the **authorization phase**, the authorizer performs partial evaluation
   of its policies based on available metadata, returning a set of conditions
   that must be satisfied for the request to be allowed.
2. During the **admission phase**, the `AuthorizationConditionsEnforcer` admission
   controller resolves the conditions the authorizer produced in the authorization
   phase by calling that authorizer back with the request object, yielding a final
   allow or deny. For the well-known condition type `authorizer.kubernetes.io/cel`,
   the API server can evaluate the condition in-process rather than making another
   webhook call.

Conditional authorization is supported for requests that are intercepted by admission:

- `create`, `update`, `patch`, `delete`, `deletecollection` verbs
- Connect requests (for example, `pods/exec`, `pods/portforward`)

For read requests (`get`, `list`, `watch`) and other operations, authorizers
must return unconditional (Allow, Deny, NoOpinion) decisions only.

For details of how conditions are produced and resolved, see
[How conditional authorization works](#how-conditional-authorization-works).

## Request attributes used in authorization

Kubernetes reviews only the following API request attributes:

 * **user** - The `user` string provided during authentication.
 * **group** - The list of group names to which the authenticated user belongs.
 * **extra** - A map of arbitrary string keys to string values, provided by the authentication layer.
 * **API** - Indicates whether the request is for an API resource.
 * **Request path** - Path to miscellaneous non-resource endpoints like `/api` or `/healthz`.
 * **API request verb** - API verbs like `get`, `list`, `create`, `update`, `patch`, `watch`, `delete`, and `deletecollection` are used for resource requests. To determine the request verb for a resource API endpoint, see [request verbs and authorization](/docs/reference/access-authn-authz/authorization/#determine-the-request-verb).
 * **HTTP request verb** - Lowercased HTTP methods like `get`, `post`, `put`, and `delete` are used for non-resource requests.
 * **Resource** - The ID or name of the resource that is being accessed (for resource requests only) -- For resource requests using `get`, `update`, `patch`, and `delete` verbs, you must provide the resource name.
 * **Subresource** - The subresource that is being accessed (for resource requests only). This can be a standard subresource (for example, `status` or `scale`) or a synthetic subresource used for fine-grained authorization.
 * **Namespace** - The namespace of the object that is being accessed (for namespaced resource requests only).
 * **API group** - The {{< glossary_tooltip text="API Group" term_id="api-group" >}} being accessed (for resource requests only). An empty string designates the _core_ [API group](/docs/reference/using-api/#api-groups).

### Request verbs and authorization {#determine-the-request-verb}

#### Non-resource requests {#request-verb-non-resource}

Requests to endpoints other than `/api/v1/...` or `/apis/<group>/<version>/...`
are considered _non-resource requests_, and use the lower-cased HTTP method of the request as the verb.
For example, making a `GET` request using HTTP to endpoints such as `/api` or `/healthz` would use **get** as the verb.

#### Resource requests {#request-verb-resource}

To determine the request verb for a resource API endpoint, Kubernetes maps the HTTP verb
used and considers whether or not the request acts on an individual resource or on a
collection of resources:

HTTP verb     | request verb
--------------|---------------
`POST`        | **create**
`GET`, `HEAD` | **get** (for individual resources), **list** (for collections, including full object content), **watch** (for watching an individual resource or collection of resources)
`PUT`         | **update**
`PATCH`       | **patch**
`DELETE`      | **delete** (for individual resources), **deletecollection** (for collections)

{{< caution >}}
+The **get**, **list** and **watch** verbs can all return the full details of a resource. In
terms of access to the returned data they are equivalent. For example, **list** on `secrets`
will reveal the **data** attributes of any returned resources.
{{< /caution >}}

Kubernetes sometimes checks authorization for additional permissions using specialized verbs. For example:

* Special cases of [authentication](/docs/reference/access-authn-authz/authentication/)
  * **impersonate** verb on `users`, `groups`, and `serviceaccounts` in the core API group, and the `userextras` in the `authentication.k8s.io` API group.
* [Authorization of CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#authorization)
  * **approve** verb for CertificateSigningRequests, and **update** for revisions to existing approvals
* [RBAC](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * **bind** and **escalate** verbs on `roles` and `clusterroles` resources in the `rbac.authorization.k8s.io` API group.
* [Dynamic Resource Allocation (DRA)](/docs/concepts/resource-management/dynamic-resource-allocation/)
  * Synthetic subresources such as `resourceclaims/binding` and `resourceclaims/driver` in the `resource.k8s.io` API group.
  * Node-aware verbs such as `associated-node:update`, `associated-node:patch`, `arbitrary-node:update`, and `arbitrary-node:patch` for DRA driver `resourceclaims/status` updates.
* [Force deletion of corrupt resources](/docs/reference/using-api/api-concepts/#force-deletion)
  * **unsafe-delete-ignore-read-errors** verb on the resource, checked in addition to the **delete** verb.

## Authorization context

Kubernetes expects attributes that are common to REST API requests. This means
that Kubernetes authorization works with existing organization-wide or
cloud-provider-wide access control systems which may handle other APIs besides
the Kubernetes API.

## Authorization modes {#authorization-modules}

The Kubernetes API server may authorize a request using one of several authorization modes:

`AlwaysAllow`
: This mode allows all requests, which brings [security risks](#warning-always-allow). Use this authorization mode only if you do not require authorization for your API requests (for example, for testing).

`AlwaysDeny`
: This mode blocks all requests. Use this authorization mode only for testing.

`ABAC` ([attribute-based access control](/docs/reference/access-authn-authz/abac/))
: Kubernetes ABAC mode defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together. The policies can use any type of attributes (user attributes, resource attributes, object, environment attributes, etc).

`RBAC` ([role-based access control](/docs/reference/access-authn-authz/rbac/))
: Kubernetes RBAC is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise. In this context, access is the ability of an individual user to perform a specific task, such as view, create, or modify a file.  
  In this mode, Kubernetes uses the `rbac.authorization.k8s.io` API group to drive authorization decisions, allowing you to dynamically configure permission policies through the Kubernetes API.

`Node`
: A special-purpose authorization mode that grants permissions to kubelets based on the pods they are scheduled to run. To learn more about the Node authorization mode, see [Node Authorization](/docs/reference/access-authn-authz/node/).

`Webhook`
: Kubernetes [webhook mode](/docs/reference/access-authn-authz/webhook/) for authorization makes a synchronous HTTP callout, blocking the request until the remote HTTP service responds to the query. You can write your own software to handle the callout, or use solutions from the ecosystem. Webhook authorizers can return [conditional responses](#conditional-authorization) when the `ConditionalAuthorization` feature is enabled.

<a id="warning-always-allow" />

{{< warning >}}
Enabling the `AlwaysAllow` mode bypasses authorization; do not use this on a cluster where
you do not trust **all** potential API clients, including the workloads that you run.

Authorization mechanisms typically return either a _deny_ or _no opinion_ result; see
[authorization verdicts](#determine-whether-a-request-is-allowed-or-denied) for more on this.
Activating the `AlwaysAllow` means that if all other authorizers return “no opinion”,
the request is allowed. For example, `--authorization-mode=AlwaysAllow,RBAC` has the
same effect as `--authorization-mode=AlwaysAllow` because Kubernetes RBAC does not
provide negative (deny) access rules.

You should not use the `AlwaysAllow` mode on a Kubernetes cluster where the API server
is reachable from the public internet.
{{< /warning >}}

### The system:masters group

The `system:masters` group is a built-in Kubernetes group that grants unrestricted
access to the API server. Any user assigned to this group has full cluster administrator
privileges, bypassing any authorization restrictions imposed by the RBAC or Webhook mechanisms.
[Avoid adding users](/docs/concepts/security/rbac-good-practices/#least-privilege)
to this group. If you do need to grant a user cluster-admin rights, you can create a
[ClusterRoleBinding](/docs/reference/access-authn-authz/rbac/#user-facing-roles)
to the built-in `cluster-admin` ClusterRole.

### Authorization mode configuration {#choice-of-authz-config}

You can configure the Kubernetes API server's authorizer chain using either
a [configuration file](#using-configuration-file-for-authorization) only or
[command line arguments](#using-flags-for-your-authorization-module).

You have to pick one of the two configuration approaches; setting both `--authorization-config`
path and configuring an authorization webhook using the `--authorization-mode` and
`--authorization-webhook-*` command line arguments is not allowed.
If you try this, the API server reports an error message during startup, then exits immediately.

<!-- keep legacy hyperlinks working -->
<a id="configuring-the-api-server-using-an-authorization-config-file" />

### Configuring the API Server using an authorization config file {#using-configuration-file-for-authorization}

{{< feature-state feature_gate_name="StructuredAuthorizationConfiguration" >}}

Kubernetes lets you configure authorization chains that can include multiple
webhooks. The authorization items in that chain can have well-defined parameters that validate
requests in a particular order, offering you fine-grained control, such as explicit Deny on failures.

The configuration file approach even allows you to specify
[CEL](/docs/reference/using-api/cel/) rules to pre-filter requests before they are dispatched
to webhooks, helping you to prevent unnecessary invocations. The API server also automatically
reloads the authorizer chain when the configuration file is modified.

You specify the path to the authorization configuration using the
`--authorization-config` command line argument.

If you want to use command line arguments instead of a configuration file, that's also a valid and supported approach.
Some authorization capabilities (for example: multiple webhooks, webhook failure policy, and pre-filter rules)
are only available if you use an authorization configuration file.

#### Example configuration {#authz-config-example}

{{< highlight yaml "linenos=false,hl_lines=2-4" >}}
---
#
# DO NOT USE THE CONFIG AS IS. THIS IS AN EXAMPLE.
#
apiVersion: apiserver.config.k8s.io/v1
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
      # If set to false, 'authorized' responses from the webhook are not cached
      # and the specified authorizedTTL is ignored/has no effect.
      # Same as setting `--authorization-webhook-cache-authorized-ttl` flag to `0`.
      # Note: Setting authorizedTTL to `0` results in its default value being used.
      # Default: true
      cacheAuthorizedRequests: true
      # The duration to cache 'unauthorized' responses from the webhook
      # authorizer.
      # Same as setting `--authorization-webhook-cache-unauthorized-ttl` flag
      # Default: 30s
      unauthorizedTTL: 30s
      # If set to false, 'unauthorized' responses from the webhook are not cached
      # and the specified unauthorizedTTL is ignored/has no effect.
      # Same as setting `--authorization-webhook-cache-unauthorized-ttl` flag to `0`.
      # Note: Setting unauthorizedTTL to `0` results in its default value being used.
      # Default: true
      cacheUnauthorizedRequests: true
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
      # conditionsReview enables conditional authorization support for this webhook.
      # When set, the webhook authorizer may return conditional (ConditionsMap / Union)
      # responses, which are evaluated via the AuthorizationConditionsReview API.
      # Optional; if omitted, this webhook only supports unconditional
      # (Allow / Deny / NoOpinion) decisions.
      conditionsReview:
        # kubeConfigContextName is the name of the context within the webhook's
        # kubeconfig file to use for AuthorizationConditionsReview requests.
        # May only be set when connectionInfo.type = KubeConfigFile.
        # Optional; if unset, the default kubeconfig context is used, meaning the API
        # server sends both SubjectAccessReview and AuthorizationConditionsReview
        # payloads to the same endpoint, which must distinguish them via TypeMeta.
        kubeConfigContextName: authorization-conditions
        # The API version of the authorization.k8s.io AuthorizationConditionsReview to
        # send to and expect from the webhook when evaluating conditions.
        # Valid values: v1alpha1
        # Required (no default) when conditionsReview is set.
        version: v1alpha1
      connectionInfo:
        # Controls how the webhook should communicate with the server.
        # Valid values:
        # - KubeConfigFile: use the file specified in kubeConfigFile to locate the
        #   server.
        # - InClusterConfig: use the in-cluster configuration to call the
        #   SubjectAccessReview API hosted by kube-apiserver. This mode is not
        #   allowed for kube-apiserver.
        type: KubeConfigFile
        # Path to KubeConfigFile for connection info
        # Required, if connectionInfo.Type is KubeConfigFile
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
      - expression: "!('system:serviceaccounts:kube-system' in request.groups)"
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
{{< /highlight >}}

When configuring the authorizer chain using a configuration file, make sure all the
control plane nodes have the same file contents. Take a note of the API server
configuration when upgrading / downgrading your clusters. For example, if upgrading
from Kubernetes {{< skew currentVersionAddMinor -1 >}} to Kubernetes {{< skew currentVersion >}},
you would need to make sure the config file is in a format that Kubernetes {{< skew currentVersion >}}
can understand, before you upgrade the cluster. If you downgrade to {{< skew currentVersionAddMinor -1 >}},
you would need to set the configuration appropriately.

#### Authorization configuration and reloads

Kubernetes reloads the authorization configuration file when the API server observes a change
to the file, and also on a 60 second schedule if no change events were observed.

{{< note >}}
You must ensure that all non-webhook authorizer types remain unchanged in the file on reload.

A reload **must not** add or remove Node or RBAC authorizers (they can be reordered,
but cannot be added or removed).
{{< /note >}}

### Command line authorization mode configuration {#using-flags-for-your-authorization-module}

You can use the following modes:

* `--authorization-mode=ABAC` (Attribute-based access control mode)
* `--authorization-mode=RBAC` (Role-based access control mode)
* `--authorization-mode=Node` (Node authorizer)
* `--authorization-mode=Webhook` (Webhook authorization mode)
* `--authorization-mode=AlwaysAllow` (always allows requests; carries [security risks](#warning-always-allow))
* `--authorization-mode=AlwaysDeny` (always denies requests)

You can choose more than one authorization mode; for example:
`--authorization-mode=Node,RBAC,Webhook`

Kubernetes checks authorization modules based on the order that you specify them
on the API server's command line, so an earlier module has higher priority to allow
or deny a request.

You cannot combine the `--authorization-mode` command line argument with the
`--authorization-config` command line argument used for
[configuring authorization using a local file](#using-configuration-file-for-authorization).

For more information on command line arguments to the API server, read the
[`kube-apiserver` reference](/docs/reference/command-line-tools-reference/kube-apiserver/).

## Privilege escalation via workload creation or edits {#privilege-escalation-via-pod-creation}

Users who can create/edit pods in a namespace, either directly or through an object that
enables indirect [workload management](/docs/concepts/architecture/controller/), may be
able to escalate their privileges in that namespace. The potential routes to privilege
escalation include Kubernetes [API extensions](/docs/concepts/extend-kubernetes/#api-extensions)
and their associated {{< glossary_tooltip term_id="controller" text="controllers" >}}.

{{< caution >}}
As a cluster administrator, use caution when granting access to create or edit workloads.
Some details of how these can be misused are documented in
[escalation paths](/docs/reference/access-authn-authz/authorization/#escalation-paths).
{{< /caution >}}

### Escalation paths {#escalation-paths}

There are different ways that an attacker or untrustworthy user could gain additional
privilege within a namespace, if you allow them to run arbitrary Pods in that namespace:

- Mounting arbitrary Secrets in that namespace
  - Can be used to access confidential information meant for other workloads
  - Can be used to obtain a more privileged ServiceAccount's service account token
- Using arbitrary ServiceAccounts in that namespace
  - Can perform Kubernetes API actions as another workload (impersonation)
  - Can perform any privileged actions that ServiceAccount has
- Mounting or using ConfigMaps meant for other workloads in that namespace
  - Can be used to obtain information meant for other workloads, such as database host names.
- Mounting volumes meant for other workloads in that namespace
  - Can be used to obtain information meant for other workloads, and change it.

{{< caution >}}
As a system administrator, you should be cautious when deploying CustomResourceDefinitions
that let users make changes to the above areas. These may open privilege escalations paths.
Consider the consequences of this kind of change when deciding on your authorization controls.
{{< /caution >}}

## How conditional authorization works {#how-conditional-authorization-works}

{{< feature-state feature_gate_name="ConditionalAuthorization" >}}

When the `ConditionalAuthorization` feature is enabled, the authorization and
admission phases work together to enforce fine-grained policies:

1. **Authorization phase**: The authorizer performs _partial evaluation_ of its
   policies based on available metadata, such as user, verb, resource, and namespace.
   If the policy cannot be fully evaluated without seeing the request content,
   the authorizer returns conditions.

2. **Request processing**: If the authorization decision was a conditional allow
   (meaning the request could be allowed if conditions are met), the API server
   proceeds with normal request processing, including mutation by admission controllers.

3. **Admission phase**: The `AuthorizationConditionsEnforcer` admission controller
   (guaranteed to be enabled when conditional authorization is used) evaluates all
   returned conditions against the fully-mutated request and stored objects. If
   the conditions evaluate to allow, the request proceeds; otherwise, it's denied.

### Built-in CEL evaluation {#built-in-cel-evaluation}

Conditions using the built-in `authorizer.kubernetes.io/cel` type can be handled by
Kubernetes API server's own CEL evaluator, avoiding the webhook callback and improving
performance while maintaining the same security guarantees. The API server may also send
an `AuthorizationConditionsReview` to a webhook to evaluate this well-known condition type.

To use custom condition types, a custom webhook may be used. Configure
`AuthorizationConfiguration.conditionsReview` as seen in the [above example](#authz-config-example).
Custom condition types (for example, `type: example.com/custom-policy`) always require the
callback, since only the webhook knows how to evaluate them.

Because of this, a webhook authorizer must be able to evaluate any condition it authors —
including `authorizer.kubernetes.io/cel` conditions — via the `AuthorizationConditionsReview` API.

In the examples below, the conditions use CEL (Common Expression Language) expressions like
`object.spec.storageClassName == 'dev'`, indicated by `type: authorizer.kubernetes.io/cel`
(the type field may be omitted for CEL expressions).

### Condition evaluation {#condition-evaluation}

#### What is a condition? {#condition-what-is-it}

Specific to Conditional Authorization, a condition is a deferred check
from an authorizer. It is used by the admission controller to evaluate
whether a user is authorized to perform an action, depending on a defined
context at admission time.

#### What is a conditions map? {#conditions-map-what-is-it}

A conditions map (`conditionsMap`) is a map of conditions where each
condition is unique, and has an `Allow`, `Deny` or `NoOpinion` effect.

#### How are conditions evaluated? {#conditions-how-are-evaluated}

A condition's effect is determined by which list it appears in within `conditionsMap`
(`allowConditions`, `denyConditions`, or `noOpinionConditions`):

- **Deny** (a condition in `denyConditions`): If the condition evaluates to `true`, the
  request is immediately denied, short-circuiting evaluation of other authorizers.
- **NoOpinion** (a condition in `noOpinionConditions`): If the condition evaluates to
  `true`, this authorizer has no opinion, but other authorizers in the chain may still
  allow or deny the request.
- **Allow** (a condition in `allowConditions`): If the condition evaluates to `true`, it
  contributes to allowing the request (unless overridden by any deny or no opinion
  conditions).

Within a single `conditionsMap`, the effect groups are considered in priority order
(`Deny`, then `NoOpinion`, then `Allow`), as shown in the diagram above.

#### Combining decisions across authorizers {#combining-decisions}

Multiple authorizers can return conditions for the same request. Each authorizer's
conditions are first resolved into a single verdict, as described above. Those
verdicts are then combined in the order the authorizers appear in the chain, and the
first conclusive one wins:

- A `Deny` denies the request, and no later authorizer is consulted.
- An `Allow` allows the request, and no later authorizer is consulted.
- A `ConditionsMap` is resolved during admission. Whatever verdict it resolves to is
  treated as that authorizer's decision at this point in the chain.
- A `NoOpinion` is skipped, and evaluation moves on to the next authorizer.

If every authorizer returns `NoOpinion`, the chain as a whole has no opinion and the
request is denied.

When a review API reports this combined result, it does so as a `Union` decision. See
[Checking API access](#checking-api-access) for an example.

```mermaid
graph LR
    Start([Evaluate Conditions]) --> Q1{Any effect=Deny<br>evaluates to true?}

    Q1 -- Yes --> DENY((DENY))
    Q1 -- No --> Q2{Any effect=Deny<br>evaluates to error?}

    Q2 -- "Yes (with error)" --> DENY
    Q2 -- No --> Q3{Any effect=NoOpinion<br>evaluates to true?}

    Q3 -- Yes --> NO_OPINION((NO OPINION))
    Q3 -- No --> Q4{Any effect=NoOpinion<br>evaluates to error?}

    Q4 -- "Yes (with error)" --> NO_OPINION
    Q4 -- No --> Q5{Any effect=Allow<br>evaluates to true?}

    Q5 -- Yes --> ALLOW((ALLOW))
    Q5 -- No --> NO_OPINION

    %% Styling
    style Start fill:#dcf0d1,stroke:#333
    style Q1 fill:#fce4e4,stroke:#333
    style Q2 fill:#f9b19e,stroke:#333
    style Q3 fill:#8e246d,stroke:#333,color:#fff
    style Q4 fill:#58264e,stroke:#333,color:#fff
    style Q5 fill:#dcf0d1,stroke:#333

    style DENY fill:#a63228,stroke:#333,color:#fff
    style NO_OPINION fill:#912671,stroke:#333,color:#fff
    style ALLOW fill:#2e5a3d,stroke:#333,color:#fff
```

#### Understanding NoOpinion effect {#understanding-noopinion-effect}

The NoOpinion effect is useful for factoring out common preconditions from multiple
Allow conditions. Instead of repeating the same precondition in every Allow condition,
you can express it once as a NoOpinion condition.

For example, suppose you want to allow certain operations only when a namespace has
a specific label. Without NoOpinion, you would need to repeat this check:

```yaml
conditionsMap:
  allowConditions:
  - id: allow-create-pods
    condition: "namespace.metadata.labels['team'] == 'platform' && object.spec.containers.size() <= 5"
    type: authorizer.kubernetes.io/cel
  - id: allow-create-deployments
    condition: "namespace.metadata.labels['team'] == 'platform' && object.spec.replicas <= 10"
    type: authorizer.kubernetes.io/cel
```

Using NoOpinion, you can factor out the common precondition:

```yaml
conditionsMap:
  noOpinionConditions:
  - id: team-precondition
    condition: "namespace.metadata.labels['team'] != 'platform'"
    type: authorizer.kubernetes.io/cel
  allowConditions:
  - id: allow-create-pods
    condition: "object.spec.containers.size() <= 5"
    type: authorizer.kubernetes.io/cel
  - id: allow-create-deployments
    condition: "object.spec.replicas <= 10"
    type: authorizer.kubernetes.io/cel
```

When `namespace.metadata.labels['team'] != 'platform'`, the NoOpinion condition
evaluates to true, causing this authorizer to have no opinion (effectively overriding
all the Allow conditions). When the label equals 'platform', the NoOpinion condition
evaluates to false and is ignored, allowing the Allow conditions to be evaluated
normally.

This approach is clearer and more maintainable, especially when you have many Allow
conditions that share the same precondition.

#### Handling evaluation errors {#handling-evaluation-errors}

An authorizer reports an evaluationError if it fails to evaluate a condition.
Common causes are a malformed expression, a timed-out external lookup, or
missing data. Unlike `reason` (see failed evaluation report below), the field
changes how the API server treats the decision:

| Decision | `evaluationError` set | Outcome |
|----------|----------------------|---------|
| `Allow`  | yes | Request proceeds. The error is not surfaced to the client. |
| `Deny`   | yes | Request fails with `500 Internal Server Error`, not `403 Forbidden`. The deny `reason` is not shown to the client. |
| `NoOpinion` | yes | Evaluation continues with the remaining authorizers. If one of them allows or denies, the error is discarded. If none does, the request fails with `500 Internal Server Error`. |

An authorizer that wants a clean `403` must return `Deny` with a non-empty
`reason` and no `evaluationError`. Set `evaluationError` only when the error
genuinely reflects partial information that an operator should see.

The same rules apply to conditions evaluated in-process by the API server. In a
`ConditionsMap`, a condition that errors is treated conservatively, as if it had
evaluated to true for its own effect:

- a `denyConditions` entry that errors makes the map evaluate to `Deny`
- a `noOpinionConditions` entry that errors makes the map evaluate to `NoOpinion`
- an `allowConditions` entry that errors makes the map evaluate to `NoOpinion`,
  never `Allow`

Because the effect groups are considered in priority order, a group that resolves
to `true` determines the outcome and the remaining conditions are not evaluated.
Errors from those unevaluated conditions, whether in the same group or in a
lower-priority group, are therefore never reported.

A webhook reporting a failed evaluation returns:

```yaml
apiVersion: authorization.k8s.io/v1alpha1
kind: AuthorizationConditionsReview
response:
  # Must be copied from request.admissionRequest.uid.
  uid: 705ab4f5-6393-11e8-b7cc-42010a800002
  decision:
    type: NoOpinion
    noOpinion:
      reason: 'could not evaluate condition "example.com/owner-match"'
      evaluationError: "unable to access external policy database: connection timeout"
```

#### Returning only possible decisions

An authorizer must return a decision that was possible given the conditions it
was asked to evaluate. For a `ConditionsMap`, that means:

- `NoOpinion` is always allowed
- `Allow` only if the map contains `allowConditions`
- `Deny` only if the map contains `denyConditions`

The API server may refine a decision before sending it — for example by dropping
conditions it already evaluated to false — so the authorizer must determine the
possible outcomes from the decision in `request.decision`, not from the decision
it originally authored.

If the authorizer returns an outcome that was not possible, the API server
discards it and fails closed to the strictest outcome the conditions allowed:
`Deny` if a deny was possible, otherwise `NoOpinion`. Because this is also
recorded as an evaluation error, such a fail-closed `Deny` surfaces as
`500 Internal Server Error`.

## Checking API access

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

SelfSubjectAccessReview is part of the `authorization.k8s.io` API group, which
exposes the API server authorization to external services. Other resources in
this group include:

SubjectAccessReview
: Access review for any user, not only the current one. Useful for delegating authorization decisions to the API server. For example, the kubelet and extension API servers use this to determine user access to their own APIs.

LocalSubjectAccessReview
: Like SubjectAccessReview but restricted to a specific namespace.

SelfSubjectRulesReview
: A review which returns the set of actions a user can perform within a namespace. Useful for users to quickly summarize their own access, or for UIs to hide/show actions.

AuthorizationConditionsReview
: {{< feature-state feature_gate_name="ConditionalAuthorization" >}}
  Allows evaluating authorization conditions returned by conditional authorizers. Used
  internally by the API server during admission, and can be called by aggregated API servers.

These APIs can be queried by creating normal Kubernetes resources, where the response `status`
field of the returned object is the result of the query. For example:

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

The generated SelfSubjectAccessReview is similar to:

{{< highlight yaml "linenos=false,hl_lines=11-13" >}}
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
{{< /highlight >}}

When the `ConditionalAuthorization` feature is enabled, you can request conditional
authorization by setting `spec.authorizationOptions.handledDecisionTypes` to
include the conditional decision types in your `SelfSubjectAccessReview`. If an
authorizer returns a conditional response, the status includes a `conditionalDecision`
field instead of simple `allowed: true` or `denied: true`. For example:

{{< highlight yaml "linenos=false,hl_lines=6-12 17-26" >}}
apiVersion: authorization.k8s.io/v1
kind: SelfSubjectAccessReview
metadata:
  creationTimestamp: null
spec:
  authorizationOptions:
    handledDecisionTypes:
    - Allow
    - Deny
    - NoOpinion
    - ConditionsMap
    - Union
  resourceAttributes:
    group: ""
    resource: persistentvolumeclaims
    verb: create
status:
  allowed: false
  conditionalDecision:
    type: ConditionsMap
    conditionsMap:
      allowConditions:
      - id: storage-class-restriction
        condition: object.spec.storageClassName == "dev"
        type: authorizer.kubernetes.io/cel
        description: "User can only create PersistentVolumeClaims with storageClassName 'dev'"
{{< /highlight >}}

You only receive a `conditionalDecision` if `handledDecisionTypes` includes the
conditional types; otherwise the review fails closed to an unconditional result, even
when an authorizer would have returned conditions. The field behaves exactly as it does
for webhook
[conditional authorization requests](/docs/reference/access-authn-authz/webhook/#conditional-authorization-requests),
which describes the full set of rules.

The `conditionalDecision` represents an ordered list of condition sets from different
authorizers. Each condition set contains one or more conditions that must be
evaluated against the actual request object during the admission phase.

When multiple authorizers are configured in a chain (using
[AuthorizationConfiguration](#using-configuration-file-for-authorization)),
and at least one returns a conditional decision, the response uses `type: Union`
to show the decision tree from all authorizers:

{{< highlight yaml "linenos=false,hl_lines=20-41" >}}
apiVersion: authorization.k8s.io/v1
kind: SubjectAccessReview
metadata:
  creationTimestamp: null
spec:
  resourceAttributes:
    group: ""
    resource: configmaps
    verb: create
    namespace: default
  authorizationOptions:
    handledDecisionTypes:
    - Allow
    - Deny
    - NoOpinion
    - ConditionsMap
    - Union
status:
  allowed: false
  conditionalDecision:
    type: Union
    union:
    - authorizerName: privileged-check.authorizer.kubernetes.io
      decision:
        type: NoOpinion
        noOpinion:
          reason: "not a privileged user"
    - authorizerName: allow.authorizer.kubernetes.io
      decision:
        type: ConditionsMap
        conditionsMap:
          allowConditions:
          - id: allow-safe-prefix
            condition: object.metadata.name.startsWith('safe-')
            type: authorizer.kubernetes.io/cel
            description: "only allow configmaps with safe- prefix"
    - authorizerName: rbac.authorizer.kubernetes.io
      decision:
        type: NoOpinion
        noOpinion:
          reason: "no matching RBAC rules"
{{< /highlight >}}

The `union` array contains the decision from each authorizer, in the order the
authorizers are configured in the chain. For how those decisions are combined into a
final verdict, see
[Combining decisions across authorizers](#combining-decisions).

## {{% heading "whatsnext" %}}

* To learn more about Authentication, see [Authentication](/docs/reference/access-authn-authz/authentication/).
* For an overview, read [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/).
* To learn more about Admission Control, see [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/).
* Read more about [Common Expression Language in Kubernetes](/docs/reference/using-api/cel/).
