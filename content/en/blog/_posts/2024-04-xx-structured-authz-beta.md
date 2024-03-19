---
layout: blog
title: 'Multi-Webhook Authorization Made Easy'
date: 2024-04-nn
slug: multi-webhook-authorization-made-easy
---

**Authors:** [Rita Zhang](https://github.com/ritazh) (Microsoft), [Jordan
Liggitt](https://github.com/liggitt) (Google), [Nabarun
Pal](https://github.com/palnabarun) (VMware)

# Enhancing Kubernetes Authorization with Multiple Webhooks and Structured Configuration

## Introduction
Kubernetes continuous to evolve to meet the intricate requirements of system
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
providing explicit control mechanisms such as the explicit Deny authorizer.

## The Need for Improvement
Cluster administrators have long sought the ability to specify multiple
authorization webhooks within the API Server handler chain. This need arises
from the desire to create layered security policies, where requests can be
validated against multiple criteria or sets of rules in a specific order. The
previous limitations also made it difficult to declaratively configure the
authorizer chain, leaving no room to efficiently manage complex authorization
scenarios.

The [Structured Authorization Configuration
feature](/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file)
addresses these limitations by introducing a configuration file format to
configure Kubernetes API Server Authorization chain. This format allows
specifying multiple webhooks in the authorization chain while all other types of
authorizers should at most be specified once. Each webhook authorizer comes with
its well-defined parameters, including timeout settings, failure policies, and
conditions for invocation with [CEL](/docs/reference/using-api/cel/) rules to
pre-filter requests before they are dispatched to webhooks, helping you to
prevent unnecessary invocations. The configuration also supports automatic
reloading, ensuring changes can be applied dynamically without restarting the
kube-apiserver. This feature not only addresses current limitations, but also
opens up new possibilities for securing and managing Kubernetes clusters more
effectively.

## Sample Configurations
These configuration examples illustrate real world scenarios that need the
ability to specify multiple webhooks with distinct settings, precedence order,
and failure modes.

### Protecting Installed CRDs
Ensuring the availability of Custom Resource Definitions (CRDs) at cluster
startup has been a key demand, One of the blockers for having a controller
reconciling those CRDs is to have a protection mechanism for them, which can be
achieved through multiple Authorization Webhooks. This was not possible before.
Now with the Structured Authorization Configuration feature, administrators can
specify multiple webhooks offering a solution where RBAC falls short, especially
in denying permissions to 'non-system' users for certain CRDs.

Assuming the following for this scenario:
- The "protected" CRDs are installed in the kube-system namespace.
- They can only be modified by users in the group
  `system:serviceaccounts:kube-superuser`

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
        kubeConfigFile: /kube-system-authz-webhook.yaml
      matchConditions:
      # only send resource requests to the webhook
      - expression: has(request.resourceAttributes)
      # only intercept requests to kube-system
      - expression: request.resourceAttributes.namespace == 'kube-system'
      # don't intercept requests from kube-system service accounts
      - expression: !('system:serviceaccounts:kube-system' in request.user.groups)
      # only intercept update, delete or deletecollection requests
      - expression: request.resourceAttributes.verb in ['update', 'delete','deletecollection']
  - type: Node
  - type: RBAC
```

### Preventing unnecessarily nested webhooks
A system administrator wants to apply specific validations to requests before
handling them off to webhooks using frameworks like Open Policy Agent. In the
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
  - name: system-crd-protector
    type: Webhook
    webhook:
      unauthorizedTTL: 30s
      timeout: 3s
      subjectAccessReviewVersion: v1
      matchConditionSubjectAccessReviewVersion: v1
      failurePolicy: Deny
      connectionInfo:
        type: KubeConfig
        kubeConfigFile: /kube-system-authz-webhook.yaml
      matchConditions:
      # only send resource requests to the webhook
      - expression: has(request.resourceAttributes)
      # only intercept requests to kube-system
      - expression: request.resourceAttributes.namespace == 'kube-system'
      # don't intercept requests from kube-system service accounts
      - expression: !('system:serviceaccounts:kube-system' in request.user.groups)
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
        kubeConfigFile: /opa-default-authz-webhook.yaml
      matchConditions:
      # only send resource requests to the webhook
      - expression: has(request.resourceAttributes)
      # only intercept requests to default namespace
      - expression: request.resourceAttributes.namespace == 'default'
      # don't intercept requests from default service accounts
      - expression: !('system:serviceaccounts:default' in request.user.groups)
```

## What's next?
For Kubernetes v1.31, we expect the feature to stay in beta while we get more
feedback. Then once the feature is ready for GA, the feature flag will be
removed.

You can learn more about this feature on the [structured authorization
configuration](/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file)
Kubernetes doc website. You can also follow along on the
[KEP-3221](https://kep.k8s.io/3221) to track progress across the coming
Kubernetes releases.

## Call to action
In this post, we have covered the benefits the Structured Authorization
Configuration feature brings in Kubernetes v1.30 and few sample configurations
for real world scenarios. To use this feature, you must specify the path to the
authorization configuration using the `--authorization-config` command line
argument. From Kubernetes 1.30, the feature is in beta and enabled by default.
If you want to keep using command line flags instead of a configuration file,
those will continue to work as-is. 

We would love to hear your feedback on this feature. In particular, we would
like feedback from Kubernetes cluster administrators and authorization webhook
implementors as they go through the process of building their integrations with
this new API. Please reach out to us on the
[#sig-auth-authorizers-dev](https://kubernetes.slack.com/archives/C05EZFX1Z2L)
channel on Kubernetes Slack.

## How to get involved
If you are interested in getting involved in the development of this feature,
share feedback, or participate in any other ongoing SIG Auth projects, please
reach out on the [#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY)
channel on Kubernetes Slack.

You are also welcome to join the bi-weekly [SIG Auth
meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings)
held every-other Wednesday.

## Acknowledgements
This feature has been an effort driven by contributors from several different
companies. We would like to extend a huge thank you to everyone that contributed
their time and effort to help make this possible.