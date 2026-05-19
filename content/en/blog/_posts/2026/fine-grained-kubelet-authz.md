---
layout: blog
title: "Kubernetes v1.36: Fine-Grained Kubelet API Authorization Graduates to GA"
date: 2026-04-24T10:35:00-08:00
slug: kubernetes-v1-36-fine-grained-kubelet-authorization-ga
author: >
   Vinayak Goyal (Google)
---

On behalf of Kubernetes SIG Auth and SIG Node, we are pleased to announce the
graduation of fine-grained `kubelet` API authorization to General Availability
(GA) in Kubernetes v1.36!

The `KubeletFineGrainedAuthz` feature gate was introduced as an opt-in alpha
feature in Kubernetes v1.32, then graduated to beta (enabled by default) in
v1.33. Now, the feature is generally available and the feature gate is locked
to enabled. This feature enables more precise, least-privilege access control
over the `kubelet`'s HTTPS API, replacing the need to grant the overly broad
`nodes/proxy` permission for common monitoring and observability use cases.

## Motivation: the `nodes/proxy` problem

The `kubelet` exposes an HTTPS endpoint with several APIs that give access to data
of varying sensitivity, including pod listings, node metrics, container logs,
and, critically, the ability to execute commands inside running containers.

Prior to this feature, `kubelet` authorization used a coarse-grained model. When
webhook authorization was enabled, almost all `kubelet` API paths were mapped to a
single `nodes/proxy` subresource. This meant that any workload needing to read
metrics or health status from the `kubelet` required `nodes/proxy` permission,
the same permission that also grants the ability to execute arbitrary commands
in any container running on the node.

### What's wrong with that?

Granting `nodes/proxy` to monitoring agents, log collectors, or health-checking
tools violates the principle of least privilege. If any of those workloads were
compromised, an attacker would gain the ability to run commands in every
container on the node. The `nodes/proxy` permission is effectively a node-level
superuser capability, and granting it broadly dramatically increases the blast
radius of a security incident.

This problem has been well understood in the community for years (see 
[kubernetes/kubernetes#83465](https://github.com/kubernetes/kubernetes/issues/83465)),
and was the driving motivation behind this enhancement [KEP-2862](https://kep.k8s.io/2862).

### The `nodes/proxy GET` WebSocket RCE risk

The situation is more severe than it might appear at first glance. Security
researchers [demonstrated in early 2026](https://grahamhelton.com/blog/nodes-proxy-rce)
that `nodes/proxy GET` alone, which is the minimal read-only permission routinely
granted to monitoring tools, can be abused to execute commands in any pod on
reachable nodes.

The root cause is a mismatch between how WebSocket connections work and how the
`kubelet` maps HTTP methods to RBAC verbs. The
[WebSocket protocol (RFC 6455)](https://datatracker.ietf.org/doc/html/rfc6455#section-1.2)
requires an HTTP `GET` request for the initial connection handshake. The `kubelet`
maps this `GET` to the RBAC `get` verb and authorizes the request without
performing a secondary check to confirm that `CREATE` permission is also present
for the write operation that follows. Using a WebSocket client like `websocat`,
an attacker can reach the `kubelet`'s `/exec` endpoint directly on port 10250 and
execute arbitrary commands:

```bash
websocat --insecure \
  --header "Authorization: Bearer $TOKEN" \
  --protocol v4.channel.k8s.io \
  "wss://$NODE_IP:10250/exec/default/nginx/nginx?output=1&error=1&command=id"

uid=0(root) gid=0(root) groups=0(root)
```

## Fine-grained `kubelet` authorization: how it works

With `KubeletFineGrainedAuthz`, the `kubelet` now performs an additional, more
specific authorization check before falling back to the `nodes/proxy`
subresource. Several commonly used `kubelet` API paths are mapped to their own
dedicated subresources:

| `kubelet` API | Resource | Subresource |
|---|---|---|
| `/stats/*` | nodes | stats |
| `/metrics/*` | nodes | metrics |
| `/logs/*` | nodes | log |
| `/pods` | nodes | pods, proxy |
| `/runningPods/` | nodes | pods, proxy |
| `/healthz` | nodes | healthz, proxy |
| `/configz` | nodes | configz, proxy |
| `/spec/*` | nodes | spec |
| `/checkpoint/*` | nodes | checkpoint |
| all others | nodes | proxy |

For the endpoints that now have fine-grained subresources (`/pods`,
`/runningPods/`, `/healthz`, `/configz`), the `kubelet` first sends a
`SubjectAccessReview` for the specific subresource. If that check succeeds, the
request is authorized. If it fails, the `kubelet` retries with the coarse-grained
`nodes/proxy` subresource for backward compatibility.

This dual-check approach ensures a smooth migration path. Existing workloads
with `nodes/proxy` permissions continue to work, while new deployments can adopt
least-privilege access from day one.

## What this means in practice

Consider a Prometheus node exporter or a monitoring `DaemonSet` that needs to
scrape `/metrics` from the `kubelet`. Previously, you would need an RBAC
`ClusterRole` like this:

```yaml
# Old approach: overly broad
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-agent
rules:
- apiGroups: [""]
  resources: ["nodes/proxy"]
  verbs: ["get"]
```

This grants the monitoring agent far more access than it needs. With
fine-grained authorization, you can now scope the permissions precisely:

```yaml
# New approach: least privilege
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-agent
rules:
- apiGroups: [""]
  resources: ["nodes/metrics", "nodes/stats"]
  verbs: ["get"]
```

The monitoring agent can now read metrics and stats from the `kubelet` without
ever being able to execute commands in containers.

## Updated `system:kubelet-api-admin` `ClusterRole`

When RBAC authorization is enabled, the built-in `system:kubelet-api-admin`
`ClusterRole` is automatically updated to include permissions for all the new
fine-grained subresources. This ensures that cluster administrators who already
use this role, including the API server's `kubelet` client, continue to have
full access without any manual configuration changes.

The role now includes permissions for:

- `nodes/proxy`
- `nodes/stats`
- `nodes/metrics`
- `nodes/log`
- `nodes/spec`
- `nodes/checkpoint`
- `nodes/configz`
- `nodes/healthz`
- `nodes/pods`

## Upgrade considerations

Because the `kubelet` performs a dual authorization check (fine-grained first,
then falling back to `nodes/proxy`), upgrading to v1.36 should be seamless for
most clusters:

- **Existing workloads** with `nodes/proxy` permissions continue to work without
changes. The fallback to `nodes/proxy` ensures backward compatibility.
- **The API server** always has `nodes/proxy` permissions via
`system:kubelet-api-admin`, so `kube-apiserver`-to-`kubelet` communication is
unaffected regardless of feature gate state.
- **Mixed-version clusters** are handled gracefully. If a `kubelet` supports
fine-grained authorization but the API server does not (or vice versa),
`nodes/proxy` permissions serve as the fallback.

## Verifying the feature is enabled

You can confirm that the feature is active on a given node by checking the
`kubelet` metrics endpoint. Since the metrics endpoint on port 10250 requires
authorization, you'll first need to create appropriate RBAC bindings for the pod
or `ServiceAccount` making the request.

**Step 1: Create a `ServiceAccount` and `ClusterRole`**

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: kubelet-metrics-checker
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubelet-metrics-reader
rules:
- apiGroups: [""]
  resources: ["nodes/metrics"]
  verbs: ["get"]
```

**Step 2: Bind the `ClusterRole` to the `ServiceAccount`**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kubelet-metrics-checker
subjects:
- kind: ServiceAccount
  name: kubelet-metrics-checker
  namespace: default
roleRef:
  kind: ClusterRole
  name: kubelet-metrics-reader
  apiGroup: rbac.authorization.k8s.io
```

Apply both manifests:

```bash
kubectl apply -f serviceaccount.yaml
kubectl apply -f clusterrole.yaml
kubectl apply -f clusterrolebinding.yaml
```

**Step 3: Run a pod with the `ServiceAccount` and check the feature flag**

```bash
kubectl run kubelet-check \
  --image=curlimages/curl \
  --serviceaccount=kubelet-metrics-checker \
  --restart=Never \
  --rm -it \
  -- sh
```

Then from within the pod, retrieve the node IP and query the metrics endpoint:

```bash
# Get the token
TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)

# Query the kubelet metrics and filter for the feature gate
curl -sk \
  --header "Authorization: Bearer $TOKEN" \
  https://$NODE_IP:10250/metrics \
  | grep kubernetes_feature_enabled \
  | grep KubeletFineGrainedAuthz
```

If the feature is enabled, you should see output like:

```
kubernetes_feature_enabled{name="KubeletFineGrainedAuthz",stage="GA"} 1
```

> **Note:** Replace `$NODE_IP` with the IP address of the node you want to check.
You can retrieve node IPs with `kubectl get nodes -o wide`.

## The journey from alpha to GA

| Release | Stage | Details |
|---|---|---|
| v1.32 | Alpha | Feature gate `KubeletFineGrainedAuthz` introduced, disabled by default |
| v1.33 | Beta | Enabled by default; fine-grained checks for `/pods`, `/runningPods/`, `/healthz`, `/configz` |
| v1.36 | GA | Feature gate locked to enabled; fine-grained `kubelet` authorization is always active |

## What's next?

With fine-grained `kubelet` authorization now GA, the Kubernetes community can
begin recommending and eventually enforcing the use of specific subresources
instead of `nodes/proxy` for monitoring and observability workloads. The urgency
of this migration is underscored by
[research showing that `nodes/proxy GET` can be abused for unlogged remote code execution](https://grahamhelton.com/blog/nodes-proxy-rce) via the WebSocket protocol. This risk is present in the default RBAC
configurations of dozens of widely deployed Helm charts. Over time, we expect:

- **Ecosystem adoption:** Monitoring tools like Prometheus, Datadog agents, and
other `DaemonSets` can update their default RBAC configurations to use
`nodes/metrics`, `nodes/stats`, and `nodes/pods` instead of `nodes/proxy`. This
directly eliminates the WebSocket RCE attack surface for those workloads.
- **Policy enforcement:** Admission controllers and policy engines can flag or
reject RBAC bindings that grant `nodes/proxy` when fine-grained alternatives
exist, helping organizations adopt least-privilege access at scale.
- **Deprecation path:** As adoption grows, `nodes/proxy` may eventually be
deprecated for monitoring use cases, further reducing the attack surface of
Kubernetes clusters.

## Getting involved

This enhancement was driven by SIG Auth and SIG Node. If you are interested in
contributing to the security and authorization features of Kubernetes, please
join us:

- [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth)
- [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)
- Slack: `#sig-auth` and `#sig-node`
- [KEP-2862: Fine-Grained Kubelet API Authorization](https://github.com/kubernetes/enhancements/issues/2862)

We look forward to hearing your feedback and experiences with this feature!
