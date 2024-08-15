---
layout: blog
title: 'Kubernetes 1.30: Multi-Webhook and Modular Authorization Made Much Easier'
date: 2024-04-26
slug: multi-webhook-and-modular-authorization-made-much-easier
author: >
  [Rita Zhang](https://github.com/ritazh) (Microsoft),
  [Jordan Liggitt](https://github.com/liggitt) (Google),
  [Nabarun Pal](https://github.com/palnabarun) (VMware),
  [Leigh Capili](https://github.com/stealthybox) (VMware)
---

With Kubernetes 1.30, we (SIG Auth) are moving Structured Authorization
Configuration to beta.

Today's article is about _authorization_: deciding what someone can and cannot
access. Check a previous article from yesterday to find about what's new in
Kubernetes v1.30 around _authentication_ (finding out who's performing a task,
and checking that they are who they say they are).

## Introduction
Kubernetes continues to evolve to meet the intricate requirements of system
administrators and developers alike. A critical aspect of Kubernetes that
ensures the security and integrity of the cluster is the API server
authorization. Until recently, the configuration of the authorization chain in
kube-apiserver was somewhat rigid, limited to a set of command-line flags and
allowing only a single webhook in the authorization chain. This approach, while
functional, restricted the flexibility needed by cluster administrators to
define complex, fine-grained authorization policies. The latest Structured
Authorization Configuration feature ([KEP-3221](https://kep.k8s.io/3221)) aims
to revolutionize this aspect by introducing a more structured and versatile way
to configure the authorization chain, focusing on enabling multiple webhooks and
providing explicit control mechanisms.

## The Need for Improvement
Cluster administrators have long sought the ability to specify multiple
authorization webhooks within the API Server handler chain and have control over
detailed behavior like timeout and failure policy for each webhook. This need
arises from the desire to create layered security policies, where requests can
be validated against multiple criteria or sets of rules in a specific order. The
previous limitations also made it difficult to dynamically configure the
authorizer chain, leaving no room to manage complex authorization scenarios
efficiently.

The [Structured Authorization Configuration
feature](/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file)
addresses these limitations by introducing a configuration file format to
configure the Kubernetes API Server Authorization chain. This format allows
specifying multiple webhooks in the authorization chain (all other authorization
types are specified no more than once). Each webhook authorizer has well-defined
parameters, including timeout settings, failure policies, and conditions for
invocation with [CEL](/docs/reference/using-api/cel/) rules to pre-filter
requests before they are dispatched to webhooks, helping you prevent unnecessary
invocations. The configuration also supports automatic reloading, ensuring
changes can be applied dynamically without restarting the kube-apiserver. This
feature addresses current limitations and opens up new possibilities for
securing and managing Kubernetes clusters more effectively.

## Sample Configurations
Here is a sample structured authorization configuration along with descriptions
for all fields, their defaults, and possible values.

```yaml
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

The following configuration examples illustrate real-world scenarios that need
the ability to specify multiple webhooks with distinct settings, precedence
order, and failure modes.

### Protecting Installed CRDs
Ensuring of Custom Resource Definitions (CRDs) availability at cluster startup
has been a key demand. One of the blockers of having a controller reconcile
those CRDs is having a protection mechanism for them, which can be achieved
through multiple authorization webhooks. This was not possible before as
specifying multiple authorization webhooks in the Kubernetes API Server
authorization chain was simply not possible. Now, with the Structured
Authorization Configuration feature, administrators can specify multiple
webhooks, offering a solution where RBAC falls short, especially when denying
permissions to 'non-system' users for certain CRDs.

Assuming the following for this scenario:
- The "protected" CRDs are installed.
- They can only be modified by users in the group `admin`.

```yaml
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthorizationConfiguration
authorizers:
  - type: Webhook
    name: system-crd-protector
    webhook:
      unauthorizedTTL: 30s
      timeout: 3s
      subjectAccessReviewVersion: v1
      matchConditionSubjectAccessReviewVersion: v1
      failurePolicy: Deny
      connectionInfo:
        type: KubeConfig
        kubeConfigFile: /files/kube-system-authz-webhook.yaml
      matchConditions:
      # only send resource requests to the webhook
      - expression: has(request.resourceAttributes)
      # only intercept requests for CRDs
      - expression: request.resourceAttributes.resource.resource = "customresourcedefinitions"
      - expression: request.resourceAttributes.resource.group = ""
      # only intercept update, patch, delete, or deletecollection requests
      - expression: request.resourceAttributes.verb in ['update', 'patch', 'delete','deletecollection']
  - type: Node
  - type: RBAC
```

### Preventing unnecessarily nested webhooks
A system administrator wants to apply specific validations to requests before
handing them off to webhooks using frameworks like Open Policy Agent. In the
past, this would require running nested webhooks within the one added to the
authorization chain to achieve the desired result. The Structured Authorization
Configuration feature simplifies this process, offering a structured API to
selectively trigger additional webhooks when needed. It also enables
administrators to set distinct failure policies for each webhook, ensuring more
consistent and predictable responses.

```yaml
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthorizationConfiguration
authorizers:
  - type: Webhook
    name: system-crd-protector
    webhook:
      unauthorizedTTL: 30s
      timeout: 3s
      subjectAccessReviewVersion: v1
      matchConditionSubjectAccessReviewVersion: v1
      failurePolicy: Deny
      connectionInfo:
        type: KubeConfig
        kubeConfigFile: /files/kube-system-authz-webhook.yaml
      matchConditions:
      # only send resource requests to the webhook
      - expression: has(request.resourceAttributes)
      # only intercept requests for CRDs
      - expression: request.resourceAttributes.resource.resource = "customresourcedefinitions"
      - expression: request.resourceAttributes.resource.group = ""
      # only intercept update, patch, delete, or deletecollection requests
      - expression: request.resourceAttributes.verb in ['update', 'patch', 'delete','deletecollection']
  - type: Node
  - type: RBAC
  - name: opa
    type: Webhook
    webhook:
      unauthorizedTTL: 30s
      timeout: 3s
      subjectAccessReviewVersion: v1
      matchConditionSubjectAccessReviewVersion: v1
      failurePolicy: Deny
      connectionInfo:
        type: KubeConfig
        kubeConfigFile: /files/opa-default-authz-webhook.yaml
      matchConditions:
      # only send resource requests to the webhook
      - expression: has(request.resourceAttributes)
      # only intercept requests to default namespace
      - expression: request.resourceAttributes.namespace == 'default'
      # don't intercept requests from default service accounts
      - expression: !('system:serviceaccounts:default' in request.user.groups)
```

## What's next?
From Kubernetes 1.30, the feature is in beta and enabled by default. For
Kubernetes v1.31, we expect the feature to stay in beta while we get more
feedback from users. Once it is ready for GA, the feature flag will be removed,
and the configuration file version will be promoted to v1.

Learn more about this feature on the [structured authorization
configuration](/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file)
Kubernetes doc website. You can also follow along with
[KEP-3221](https://kep.k8s.io/3221) to track progress in coming Kubernetes
releases.

## Call to action
In this post, we have covered the benefits of the Structured Authorization
Configuration feature in Kubernetes v1.30 and a few sample configurations for
real-world scenarios. To use this feature, you must specify the path to the
authorization configuration using the `--authorization-config` command line
argument. From Kubernetes 1.30, the feature is in beta and enabled by default.
If you want to keep using command line flags instead of a configuration file,
those will continue to work as-is. Specifying both `--authorization-config` and
`--authorization-modes`/`--authorization-webhook-*` won't work. You need to drop
the older flags from your kube-apiserver command. 

The following kind Cluster configuration sets that command argument on the
APIserver to load an AuthorizationConfiguration from a file
(`authorization_config.yaml`) in the files folder. Any needed kubeconfig and
certificate files can also be put in the files directory.
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
featureGates:
  StructuredAuthorizationConfiguration: true  # enabled by default in v1.30
kubeadmConfigPatches:
  - |
    kind: ClusterConfiguration
    metadata:
      name: config
    apiServer:
      extraArgs:
        authorization-config: "/files/authorization_config.yaml"
      extraVolumes:
      - name: files
        hostPath: "/files"
        mountPath: "/files"
        readOnly: true
nodes:
- role: control-plane
  extraMounts:
  - hostPath: files
    containerPath: /files
```

We would love to hear your feedback on this feature. In particular, we would
like feedback from Kubernetes cluster administrators and authorization webhook
implementors as they build their integrations with this new API. Please reach
out to us on the
[#sig-auth-authorizers-dev](https://kubernetes.slack.com/archives/C05EZFX1Z2L)
channel on Kubernetes Slack.

## How to get involved
If you are interested in helping develop this feature, sharing feedback, or
participating in any other ongoing SIG Auth projects, please reach out on the
[#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY) channel on
Kubernetes Slack.

You are also welcome to join the bi-weekly [SIG Auth
meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings)
held every other Wednesday.

## Acknowledgments
This feature was driven by contributors from several different companies. We
would like to extend a huge thank you to everyone who contributed their time and
effort to make this possible.