---
layout: blog
title: "Kubernetes v1.34: Service Account Token Integration for Image Pulls Graduates to Beta"
date: XXXX-XX-XX
slug: kubernetes-v1-34-sa-tokens-image-pulls-beta
draft: true
author: >
  [Anish Ramasekar](https://github.com/aramase) (Microsoft)
---

The Kubernetes community continues to advance security best practices
by reducing reliance on long-lived credentials.
Following the successful [alpha release in Kubernetes v1.33](/blog/2025/05/07/kubernetes-v1-33-wi-for-image-pulls/),
**Service Account Token Integration for Kubelet Credential Providers**
has now graduated to **beta** in Kubernetes v1.34,
bringing us closer to eliminating long-lived image pull secrets from Kubernetes clusters.

This enhancement allows credential providers
to use workload-specific service account tokens to obtain registry credentials,
providing a secure, ephemeral alternative to traditional image pull secrets.

## What's new in beta?

The beta graduation brings several important changes
that make the feature more robust and production-ready:

### Required `cacheType` field

**Breaking change from alpha**: The `cacheType` field is **required**
in the credential provider configuration when using service account tokens.
This field is new in beta and must be specified to ensure proper caching behavior.

```yaml
tokenAttributes:
  serviceAccountTokenAudience: "my-registry-audience"
  cacheType: "ServiceAccount"  # Required field in beta
  requireServiceAccount: true
```

Choose between two caching strategies:
- **`Token`**: Cache credentials per service account token
  (use when credential lifetime is tied to the token).
  This is useful when the credential provider transforms the service account token into registry credentials
  with the same lifetime as the token, or when registries support Kubernetes service account tokens directly.
  Note: The kubelet cannot send service account tokens directly to registries;
  credential provider plugins are needed to transform tokens into the username/password format expected by registries.
- **`ServiceAccount`**: Cache credentials per service account identity
  (use when credentials are valid for all pods using the same service account)

### Full integration with Ensure Secret Pull Images

Beta brings **complete compatibility**
with the [Ensure Secret Pull Images](/docs/concepts/containers/images/#ensureimagepullcredentialverification) feature.
This integration ensures that:

- **Service account coordinates are tracked**:
  The system tracks which ServiceAccount (namespace, name, UID) was used to pull each image
- **Proper authorization enforcement**:
  Pods can only access images that were pulled using credentials
  from ServiceAccounts they're authorized to use
- **Lifecycle management**:
  Administrators can revoke access by deleting and recreating ServiceAccounts,
  which invalidates cached credentials

The authorization model works as follows:

- **Different ServiceAccounts for the same image**:
  Pods using different ServiceAccounts will trigger a fresh image pull from the registry
  since they have different service account coordinates
- **Same ServiceAccount for the same image**:
  Pods using the exact same ServiceAccount (matching namespace, name, and UID)
  will be allowed to reuse the previously pulled image without triggering a new registry pull
- **ServiceAccount lifecycle management**:
  If administrators want to revoke access to previously pulled images for a ServiceAccount,
  they can delete and recreate the ServiceAccount.
  This changes the UID, which invalidates any cached image credentials
  associated with the old ServiceAccount coordinates

## How it works

### Configuration

Credential providers opt into using service account tokens
by configuring the `tokenAttributes` field:

```yaml
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
#
apiVersion: kubelet.config.k8s.io/v1
kind: CredentialProviderConfig
providers:
- name: my-credential-provider
  matchImages:
  - "*.myregistry.io/*"
  defaultCacheDuration: "10m"
  apiVersion: credentialprovider.kubelet.k8s.io/v1
  tokenAttributes:
    serviceAccountTokenAudience: "my-registry-audience"
    cacheType: "ServiceAccount"  # New in beta
    requireServiceAccount: true
    requiredServiceAccountAnnotationKeys:
    - "myregistry.io/identity-id"
    optionalServiceAccountAnnotationKeys:
    - "myregistry.io/optional-annotation"
```

### Image pull flow

At a high level, `kubelet` coordinates with your credential provider
and the container runtime as follows:

- When the image is not present locally:
  - `kubelet` checks its credential cache using the configured `cacheType`
    (`Token` or `ServiceAccount`)
  - If needed, `kubelet` requests a ServiceAccount token for the pod's ServiceAccount
    and passes it, plus any required annotations, to the credential provider
  - The provider exchanges that token for registry credentials
    and returns them to `kubelet`
  - `kubelet` caches credentials per the `cacheType` strategy
    and pulls the image with those credentials
  - `kubelet` records the ServiceAccount coordinates (namespace, name, UID)
    associated with the pulled image for later authorization checks

- When the image is already present locally:
  - `kubelet` verifies the pod's ServiceAccount coordinates
    match the coordinates recorded for the cached image
  - If they match exactly, the cached image can be used
    without pulling from the registry
  - If they differ, `kubelet` performs a fresh pull
    using credentials for the new ServiceAccount

- With Ensure Secret Pull Images enabled:
  - Authorization is enforced using the recorded ServiceAccount coordinates,
    ensuring pods only use images pulled by a ServiceAccount
    they are authorized to use
  - Administrators can revoke access by deleting and recreating a ServiceAccount;
    the UID changes and previously recorded authorization no longer matches

### Audience restriction

The beta release builds on the `ServiceAccountNodeAudienceRestriction` feature
(beta since v1.33) to ensure `kubelet` can only request tokens for authorized audiences.
Administrators configure allowed audiences using RBAC:

```yaml
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
#
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubelet-credential-provider-audiences
rules:
- verbs: ["request-serviceaccounts-token-audience"]
  apiGroups: [""]
  resources: ["my-registry-audience"]
  resourceNames: ["registry-access-sa"]  # Optional: specific SA
```

## Getting started with beta

### Prerequisites

1. **Kubernetes v1.34 or later**
2. **Feature gate enabled**:
   `KubeletServiceAccountTokenForCredentialProviders=true` (beta, enabled by default)
3. **Credential provider support**:
   Update your credential provider to handle ServiceAccount tokens

### Migration from alpha

If you're already using the alpha version,
the migration to beta requires minimal changes:

1. **Add `cacheType` field**:
   Update your credential provider configuration to include the required `cacheType` field
2. **Review caching strategy**:
   Choose between `Token` and `ServiceAccount` cache types based on your provider's behavior
3. **Test audience restrictions**:
   Ensure your RBAC configuration properly restricts token audiences

### Example setup

Here's a complete example
for setting up a credential provider with service account tokens:

```yaml
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
#

# Service Account with registry annotations
apiVersion: v1
kind: ServiceAccount
metadata:
  name: registry-access-sa
  namespace: default
  annotations:
    myregistry.io/identity-id: "user123"
---
# RBAC for audience restriction
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: registry-audience-access
rules:
- verbs: ["request-serviceaccounts-token-audience"]
  apiGroups: [""]
  resources: ["my-registry-audience"]
  resourceNames: ["registry-access-sa"]  # Optional: specific ServiceAccount
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kubelet-registry-audience
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: registry-audience-access
subjects:
- kind: Group
  name: system:nodes
  apiGroup: rbac.authorization.k8s.io
---
# Pod using the ServiceAccount
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: registry-access-sa
  containers:
  - name: my-app
    image: myregistry.io/my-app:latest
```

## What's next?

For Kubernetes v1.35, we expect the feature to stay in beta,
and we will continue to solicit feedback.

You can learn more about this feature
on the [service account token for image pulls](/docs/tasks/administer-cluster/kubelet-credential-provider/#service-account-token-for-image-pulls)
page in the Kubernetes documentation.

You can also follow along on the
[KEP-4412](https://kep.k8s.io/4412)
to track progress across the coming Kubernetes releases.

## Call to action

In this blog post,
we have covered the beta graduation of Service Account Token Integration
for Kubelet Credential Providers in Kubernetes v1.34.
We have discussed the key improvements,
including the required `cacheType` field
and enhanced integration with Ensure Secret Pull Images.

We have been receiving positive feedback from the community during the alpha phase
and would love to hear more as we stabilize this feature for GA.
In particular, we would like feedback from credential provider implementors
as they integrate with the new beta API and caching mechanisms.
Please reach out to us on the [#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA) channel on Kubernetes Slack.

## How to get involved

If you are interested in getting involved in the development of this feature,
share feedback, or participate in any other ongoing SIG Auth projects,
please reach out on the [#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY) channel on Kubernetes Slack.

You are also welcome to join the bi-weekly [SIG Auth meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings),
held every other Wednesday.
