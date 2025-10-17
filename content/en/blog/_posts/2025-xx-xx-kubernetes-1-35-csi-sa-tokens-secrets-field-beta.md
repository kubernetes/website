---
layout: blog
title: "Kubernetes v1.35: A Better Way to Pass Service Account Tokens to CSI Drivers"
date: 2025-xx-xxT10:30:00-08:00
slug: kubernetes-v1-35-csi-sa-tokens-secrets-field-beta
draft: true
author: >
  [Anish Ramasekar](https://github.com/aramase) (Microsoft)
---

If you maintain a CSI driver that uses service account tokens,
Kubernetes v1.35 brings a refinement you'll want to know about.
Since the introduction of the [TokenRequests feature](https://kubernetes-csi.github.io/docs/token-requests.html),
service account tokens requested by CSI drivers have been passed to them through the `volume_context` field.
While this has worked, it's not the ideal place for sensitive information,
and we've seen instances where tokens were accidentally logged in CSI drivers.

Kubernetes v1.35 introduces a beta solution to address this:
*CSI Driver Opt-in for Service Account Tokens via Secrets Field*.
This allows CSI drivers to receive service account tokens
through the `secrets` field in `NodePublishVolumeRequest`,
which is the appropriate place for sensitive data in the CSI specification.

## Understanding the current approach

When CSI drivers use the [TokenRequests feature](https://kubernetes-csi.github.io/docs/token-requests.html),
they can request service account tokens for workload identity
by configuring the `TokenRequests` field in the CSIDriver spec.
These tokens are passed to drivers as part of the volume attributes map,
using the key `csi.storage.k8s.io/serviceAccount.tokens`.

The `volume_context` field works, but it's not designed for sensitive data.
Because of this, there are a few challenges:

First, the [`protosanitizer`](https://github.com/kubernetes-csi/csi-lib-utils/tree/master/protosanitizer) tool that CSI drivers use doesn't treat volume context as sensitive,
so service account tokens can end up in logs when gRPC requests are logged.
This happened with [CVE-2023-2878](https://github.com/kubernetes-sigs/secrets-store-csi-driver/security/advisories/GHSA-g82w-58jf-gcxx) in the Secrets Store CSI Driver
and [CVE-2024-3744](https://github.com/kubernetes/kubernetes/issues/124759) in the Azure File CSI Driver.

Second, each CSI driver that wants to avoid this issue needs to implement its own sanitization logic,
which leads to inconsistency across drivers.

The CSI specification already has a `secrets` field in `NodePublishVolumeRequest`
that's designed exactly for this kind of sensitive information.
The challenge is that we can't just change where we put the tokens
without breaking existing CSI drivers that expect them in volume context.

## How the opt-in mechanism works

Kubernetes v1.35 introduces an opt-in mechanism that lets CSI drivers choose
how they receive service account tokens.
This way, existing drivers continue working as they do today,
and drivers can move to the more appropriate secrets field when they're ready.

CSI drivers can set a new field in their CSIDriver spec:

```yaml
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
#
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: example-csi-driver
spec:
  # ... existing fields ...
  tokenRequests:
  - audience: "example.com"
    expirationSeconds: 3600
  # New field for opting into secrets delivery
  serviceAccountTokenInSecrets: true  # defaults to false
```

The behavior depends on the `serviceAccountTokenInSecrets` field:

When set to `false` (the default), tokens are placed in `VolumeContext` with the key `csi.storage.k8s.io/serviceAccount.tokens`, just like today.
When set to `true`, tokens are placed only in the `Secrets` field with the same key.

## About the beta release

The `CSIServiceAccountTokenSecrets` feature gate is enabled by default
on both kubelet and kube-apiserver.
Since the `serviceAccountTokenInSecrets` field defaults to `false`,
enabling the feature gate doesn't change any existing behavior.
All drivers continue receiving tokens via volume context unless they explicitly opt in.
This is why we felt comfortable starting at beta rather than alpha.

## Guide for CSI driver authors

If you maintain a CSI driver that uses service account tokens, here's how to adopt this feature.

### Adding fallback logic

First, update your driver code to check both locations for tokens.
This makes your driver compatible with both the old and new approaches:

```go
const serviceAccountTokenKey = "csi.storage.k8s.io/serviceAccount.tokens"

func getServiceAccountTokens(req *csi.NodePublishVolumeRequest) (string, error) {
    // Check secrets field first (new behavior when driver opts in)
    if tokens, ok := req.Secrets[serviceAccountTokenKey]; ok {
        return tokens, nil
    }
    
    // Fall back to volume context (existing behavior)
    if tokens, ok := req.VolumeContext[serviceAccountTokenKey]; ok {
        return tokens, nil
    }
    
    return "", fmt.Errorf("service account tokens not found")
}
```

This fallback logic is backward compatible and safe to ship in any driver version,
even before clusters upgrade to v1.35.

### Rollout sequence

CSI driver authors need to follow a specific sequence when adopting this feature to avoid breaking existing volumes.

**Driver preparation** (can happen anytime)

You can start preparing your driver right away by adding fallback logic that checks both the secrets field and volume context for tokens.
This code change is backward compatible and safe to ship in any driver version, even before clusters upgrade to v1.35.
We encourage you to add this fallback logic early, cut releases, and even backport to maintenance branches where feasible.

**Cluster upgrade and feature enablement**

Once your driver has the fallback logic deployed, here's the safe rollout order for enabling the feature in a cluster:

1. Complete the kube-apiserver upgrade to 1.35 or later
2. Complete kubelet upgrade to 1.35 or later on all nodes
3. Ensure CSI driver version with fallback logic is deployed (if not already done in preparation phase)
4. Fully complete CSI driver DaemonSet rollout across all nodes
5. Update your CSIDriver manifest to set `serviceAccountTokenInSecrets: true`

### Important constraints

The most important thing to remember is timing.
If your CSI driver DaemonSet and CSIDriver object are in the same manifest or Helm chart,
you need two separate updates.
Deploy the new driver version with fallback logic first,
wait for the DaemonSet rollout to complete,
then update the CSIDriver spec to set `serviceAccountTokenInSecrets: true`.

Also, don't update the CSIDriver before all driver pods have rolled out.
If you do, volume mounts will fail on nodes still running the old driver version,
since those pods only check volume context.

## Why this matters

Adopting this feature helps in a few ways:

- It eliminates the risk of accidentally logging service account tokens as part of volume context in gRPC requests
- It uses the CSI specification's designated field for sensitive data, which feels right
- The `protosanitizer` tool automatically handles the secrets field correctly, so you don't need driver-specific workarounds
- It's opt-in, so you can migrate at your own pace without breaking existing deployments

## Call to action

We encourage CSI driver authors to adopt this feature and provide feedback on the migration experience.
If you have thoughts on the API design or run into any issues during adoption,
please reach out to us on the
[#csi](https://kubernetes.slack.com/archives/C8EJ01Z46) channel on Kubernetes Slack
(for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)).

You can follow along on
[KEP-5538](https://kep.k8s.io/5538)
to track progress across the coming Kubernetes releases.
