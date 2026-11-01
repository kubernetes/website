---
layout: blog
title: "Kubernetes v1.33: From Secrets to Service Accounts: Kubernetes Image Pulls Evolved"
date: 2025-05-07T10:30:00-08:00
slug: kubernetes-v1-33-wi-for-image-pulls
author: >
  [Anish Ramasekar](https://github.com/aramase) (Microsoft)
---

Kubernetes has steadily evolved to reduce reliance on long-lived credentials
stored in the API.
A prime example of this shift is the transition of Kubernetes Service Account (KSA) tokens
from long-lived, static tokens to ephemeral, automatically rotated tokens
with OpenID Connect (OIDC)-compliant semantics.
This advancement enables workloads to securely authenticate with external services
without needing persistent secrets.

However, one major gap remains: **image pull authentication**.
Today, Kubernetes clusters rely on image pull secrets stored in the API,
which are long-lived and difficult to rotate,
or on node-level kubelet credential providers,
which allow any pod running on a node to access the same credentials.
This presents security and operational challenges.

To address this, Kubernetes is introducing **Service Account Token Integration
for Kubelet Credential Providers**, now available in **alpha**.
This enhancement allows credential providers to use pod-specific service account tokens
to obtain registry credentials, which kubelet can then use for image pulls —
eliminating the need for long-lived image pull secrets.

## The problem with image pull secrets

Currently, Kubernetes administrators have two primary options
for handling private container image pulls:

1. **Image pull secrets stored in the Kubernetes API**
   - These secrets are often long-lived because they are hard to rotate.
   - They must be explicitly attached to a service account or pod.
   - Compromise of a pull secret can lead to unauthorized image access.

2. **Kubelet credential providers**
   - These providers fetch credentials dynamically at the node level.
   - Any pod running on the node can access the same credentials.
   - There’s no per-workload isolation, increasing security risks.

Neither approach aligns with the principles of **least privilege**
or **ephemeral authentication**, leaving Kubernetes with a security gap.

## The solution: Service Account token integration for Kubelet credential providers

This new enhancement enables kubelet credential providers
to use **workload identity** when fetching image registry credentials.
Instead of relying on long-lived secrets, credential providers can use
service account tokens to request short-lived credentials
tied to a specific pod’s identity.

This approach provides:

- **Workload-specific authentication**:
  Image pull credentials are scoped to a particular workload.
- **Ephemeral credentials**:
  Tokens are automatically rotated, eliminating the risks of long-lived secrets.
- **Seamless integration**:
  Works with existing Kubernetes authentication mechanisms,
  aligning with cloud-native security best practices.

## How it works

### 1. Service Account tokens for credential providers

Kubelet generates **short-lived, automatically rotated** tokens for service accounts
if the credential provider it communicates with has opted into receiving
a service account token for image pulls.
These tokens conform to OIDC ID token semantics
and are provided to the credential provider
as part of the `CredentialProviderRequest`.
The credential provider can then use this token
to authenticate with an external service.

### 2. Image registry authentication flow

- When a pod starts, the kubelet requests credentials from a **credential provider**.
- If the credential provider has opted in,
  the kubelet generates a **service account token** for the pod.
- The **service account token is included in the `CredentialProviderRequest`**,
  allowing the credential provider to authenticate
  and exchange it for **temporary image pull credentials**
  from a registry (e.g. AWS ECR, GCP Artifact Registry, Azure ACR).
- The kubelet then uses these credentials
  to pull images on behalf of the pod.

## Benefits of this approach

- **Security**:
  Eliminates long-lived image pull secrets, reducing attack surfaces.
- **Granular Access Control**:
  Credentials are tied to individual workloads rather than entire nodes or clusters.
- **Operational Simplicity**:
  No need for administrators to manage and rotate image pull secrets manually.
- **Improved Compliance**:
  Helps organizations meet security policies
  that prohibit persistent credentials in the cluster.

## What's next?

For Kubernetes **v1.34**, we expect to ship this feature in **beta**
while continuing to gather feedback from users.

In the coming releases, we will focus on:

- Implementing **caching mechanisms**
  to improve performance for token generation.
- Giving more **flexibility to credential providers**
  to decide how the registry credentials returned to the kubelet are cached.
- Making the feature work with
  [Ensure Secret Pulled Images](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2535-ensure-secret-pulled-images)
  to ensure pods that use an image
  are authorized to access that image
  when service account tokens are used for authentication.

You can learn more about this feature
on the [service account token for image pulls](/docs/tasks/administer-cluster/kubelet-credential-provider/#service-account-token-for-image-pulls)
page in the Kubernetes documentation.

You can also follow along on the
[KEP-4412](https://kep.k8s.io/4412)
to track progress across the coming Kubernetes releases.

## Try it out

To try out this feature:

1. **Ensure you are running Kubernetes v1.33 or later**.
2. **Enable the `ServiceAccountTokenForKubeletCredentialProviders` feature gate**
   on the kubelet.
3. **Ensure credential provider support**:
   Modify or update your credential provider
   to use service account tokens for authentication.
4. **Update the credential provider configuration**
   to opt into receiving service account tokens
   for the credential provider by configuring the `tokenAttributes` field.
5. **Deploy a pod**
   that uses the credential provider to pull images from a private registry.

We would love to hear your feedback on this feature.
Please reach out to us on the
[#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA)
channel on Kubernetes Slack
(for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)).

## How to get involved

If you are interested in getting involved
in the development of this feature,
sharing feedback, or participating in any other ongoing **SIG Auth** projects,
please reach out on the
[#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY)
channel on Kubernetes Slack.

You are also welcome to join the bi-weekly
[SIG Auth meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings),
held every other Wednesday.
