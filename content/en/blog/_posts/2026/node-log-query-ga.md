---
layout: blog
title: "Kubernetes 1.36: Node Log Query Graduates to GA"
draft: true
slug: node-log-query-ga
author: >
  JR Valdes (sig-windows)
---


If you have ever had to SSH into a Linux or Windows node at 2 AM to figure out why
the service is misbehaving, or open a remote-desktop session into a Windows Server
machine to scroll through Event Viewer looking for a error buried
among thousands of entries, then Node Log Query was built for you.

This post covers what the feature does, why it matters, and how to start
using it today.

## A quick recap

Node Log Query first appeared as an alpha feature in Kubernetes 1.27.
The original motivation was straightforward: cluster administrators
should not need direct shell access to a node in order to read system
service logs.

Before this feature existed, the debugging workflow for a node-level
issue looked something like this:

1. Notice pods stuck in `ContainerCreating` on a particular node.
2. Run `kubectl describe node` and see nothing obviously wrong.
3. Realize the problem is in the node's system logs, maybe the
   container runtime, maybe the CNI plugin, maybe the kubelet itself.
4. Request SSH or RDP credentials.
5. Wait for access approval.
6. Log in and manually search through `journalctl` output in Linux or for Windows
   the Event Viewer.

With Node Log Query, steps 4 through 6 collapse into a single
`kubectl` command.

## How it works

The kubelet exposes the `/logs/` HTTP endpoint, and you can access this by
proxying through the Kubernetes API server. When you issue a query, the request
travels similar to any other `kubectl` operation involving a Node, that is: 
client to API server authorization. 

On the node side, the kubelet delegates to the operating system's native
log infrastructure:

Linux
: `journalctl` for journald log entries, with fallback to direct file reads from `/var/log/`.

Windows
: `Get-WinEvent` for Windows Event Log entries, plus file reads from `C:\var\log\`.

With the implemented heuristic discovery mechanism means you do not need to 
know where a particular service stores its logs. When you ask for the logs of a 
specific service, for example `service-one`, the kubelet first checks the
native OS log infrastructure. If there is no match, it looks in the 
filesystem on the following order:

- a) a file with the same name of the service `/var/log/service-one`, then 
- b) file with the same name of the service with `log` as an extension, `/var/log/service-one.log`, then
- c) a directory with the same name of the service containing a file as b), `/var/log/service-one/service-one.log`. 

The query is OS-agnostic, works whether the node runs Linux or Windows, and
abstracts away the differences in log storage and querying between the two
operating systems. 

## Getting started

If you are running Kubernetes 1.36, the `NodeLogQuery` feature gate is
locked to enabled. However, the kubelet does not expose the log query
endpoint by default. You must explicitly opt in by setting both
`enableSystemLogHandler` and `enableSystemLogQuery` to `true` in the
kubelet configuration:

```yaml
enableSystemLogHandler: true
enableSystemLogQuery: true
```

Because `enableSystemLogQuery` increases the kubelet's attack surface,
the recommendation is to enable it on a need basis for debugging and
disable it otherwise.

If you are running an older Kubernetes version (1.30 through 1.35), the
feature is available in beta -- set the `NodeLogQuery` feature gate to
`true` in your kubelet configuration.

## How to use it

Query the logs for a service with name `service-one` on a node named 
`worker-one`:

```bash
kubectl get --raw "/api/v1/nodes/worker-one/proxy/logs/?query=service-one"
```

Filter for lines containing "error" in the last hour:

```bash
kubectl get --raw "/api/v1/nodes/worker-one/proxy/logs/?query=service-one&pattern=error&sinceTime=2026-01-15T10:00:00Z"
```

Filter for last 50 lines :

```bash
kubectl get --raw "/api/v1/nodes/worker-one/proxy/logs/?query=service-one&tailLines=50"
```

Note that the node named `worker-one` used in the example, could be a Linux 
node or a Windows node, and the same query would work on either. The kubelet 
abstracts away the differences in log storage and querying between the two
operating systems.

### Full set of query parameters:

| Parameter   | Description                                                                            |
|-------------|----------------------------------------------------------------------------------------|
| `boot`      | Linux only; select entries from a specific boot (negative integers for previous boots) |
| `pattern`   | PCRE regex to filter lines                                                             |
| `query`     | Service name or log file path                                                          |
| `sinceTime` | RFC 3339 timestamp; only return entries after this time                                |
| `tailLines` | Return this many lines from the end of the log                                         |
| `untilTime` | RFC 3339 timestamp; only return entries before this time                               |

## The kubectl node-logs plugin

If you find the raw API complex and hard to use, the `kubectl node-logs` plugin 
provides a friendlier syntax:

```bash
kubectl node-logs worker-one --query service-one --pattern error --tail 50
```

It also supports label selectors and role-based targeting:

```bash
# Query all worker nodes
kubectl node-logs --role worker --query service-one --pattern error

# Query all Windows worker nodes
kubectl node-logs --label kubernetes.io/os=windows --query service-one
```

The plugin is available in the [Krew Index](https://github.com/kubernetes-sigs/krew-index/blob/master/plugins/node-logs.yaml)
and you can install it with the following command:
```bash
kubectl krew install node-logs
```

## Why this matters for Windows node operators

Linux administrators have always had `journalctl` a shell session away.
The workflow is familiar, the tooling is mature, and SSH access is
usually available. Node Log Query is convenient for Linux, but for
Windows it is transformative.

Debugging Windows nodes in Kubernetes has historically been painful.

A common scenario: a Windows node reports `Ready`, but pods on that
node sit in `ContainerCreating` indefinitely. The cause is often a CNI
misconfiguration that only surfaces in the Windows Event Log, not in
any pod event or API status field. Before Node Log Query, the only
option was to RDP into the machine and navigate Event Viewer manually or
run `Get-WinEvent` PowerShell commandlet with the right filters. Definetly, a 
slow, clunky, and error-prone process that requires a lot of manual effort
and expertise.

Now you can identify the exact problem in seconds:

```bash
kubectl get --raw "/api/v1/nodes/win-node-one/proxy/logs/?query=kubelet&pattern=CNI&tailLines=50"
```

No SSH or RDP session. No Event Viewer. No waiting for access approval. The
same command works identically on a Linux node, which means your
incident response runbooks do not need OS-specific expertises.

## The road from alpha to GA

Node Log Query has been in development for three years and has shipped
in seven Kubernetes releases. Here is how the feature matured:

**Kubernetes 1.27 (April 2023) -- Alpha.**
The initial implementation landed with basic `journalctl` and
`Get-WinEvent` integration. The API surface was intentionally minimal
to gather feedback on real-world usage patterns.

**Kubernetes 1.30 (April 2024) -- Beta.**
The feature gate was enabled by default. Additional filtering
parameters were refined, Windows Event Log querying was hardened, and
the heuristic log discovery mechanism was stabilized. The `kubectl
node-logs` plugin was developed to provide a better command-line
experience.

**January 2025 -- CVE-2024-9042.**
A command injection vulnerability was discovered in the Windows
implementation. An attacker with node proxy access could inject
PowerShell commands via the `pattern` parameter. The issue was
responsibly disclosed, patched promptly, and fixed in Kubernetes
1.30.8, 1.31.4, and 1.32.1. This was an important hardening event
that strengthened input validation across the entire feature.

**Kubernetes 1.36 (2026) -- GA.**
The feature gate is locked to enabled. The API is stable. Input
validation and security controls have been battle-tested across
multiple releases. Production readiness review is complete.

## Security model

Node-level system logs can contain sensitive information: authentication
tokens in service startup flags, IP addresses, hostnames, and
configuration details that could aid an attacker. The security model
reflects this:

**Three layers of defense:**

1. **Feature gate.** In prior releases, the cluster administrator
   had to explicitly enable `NodeLogQuery`. At GA, the gate is locked
   on, but the kubelet configuration flags still provide a toggle.

2. **Kubelet configuration.** Two boolean flags --
   `enableSystemLogHandler` and `enableSystemLogQuery` -- must both be
   true. `enableSystemLogQuery` defaults to `false` and is recommended
   to stay disabled unless specifically needed for debugging, because
   enabling it increases the kubelet's attack surface.

3. **RBAC.** The requesting user needs `get` and `create` verbs on the
   `nodes/proxy` resource. This is a privileged operation by design.

A minimal ClusterRole that permits log queries

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-log-query
rules:
- apiGroups: [""]
  resources: ["nodes/proxy"]
  verbs: ["get"]
```

Bind this only to specific users or groups, because it grants broad
access to privileged kubelet API operations. See [Access to proxy subresource of Nodes](/docs/concepts/security/rbac-good-practices/#access-to-proxy-subresource-of-nodes)

{{< warning >}}
Granting permissions to `nodes/proxy` (even just **get** permission) also authorizes access to powerful kubelet
APIs that can be used to execute commands in any container running on the node, so be careful about how you manage them.
See [Kubelet authentication/authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/#get-nodes-proxy-warning)
for more information.
{{< /warning >}}

## Scripting for quick incident response

Because the endpoint is a standard HTTP API, it integrates naturally
into shell scripts and automation. A quick example that pulls the last
20 error entries from every worker node for the `kubelet` service:

```bash
for node in $(kubectl get nodes -l node-role.kubernetes.io/worker -o jsonpath='{.items[*].metadata.name}'); do
  echo "--- $node ---"
  kubectl get --raw "/api/v1/nodes/${node}/proxy/logs/?query=kubelet&pattern=error&tailLines=20"
done
```

This kind of one-liner turns a 20-minute manual investigation into a 
sub-minute automated scan.

## What Node Log Query does not replace

This feature is not a substitute for centralized log aggregation. If
you are running a log pipeline with Fluentd, Fluent Bit, the OpenTelemetry
Collector, or a similar tool, keep doing that. Centralized logging gives
you historical retention, cross-node correlation, alerting, and
dashboards that Node Log Query is not designed to provide.

Think of Node Log Query as the tool you reach for during live
troubleshooting, when you need to see what a node is doing right now,
without waiting for logs to ship through a pipeline. It complements
your existing observability stack; it does not compete with it.

## Further reading

- [KEP-2258: Node Log Query](https://github.com/kubernetes/enhancements/tree/master/keps/sig-windows/2258-node-log-query)
- [System Logs documentation](https://kubernetes.io/docs/concepts/cluster-administration/system-logs/#log-query)
- [Alpha announcement blog post (Kubernetes 1.27)](https://kubernetes.io/blog/2023/04/21/node-log-query-alpha/)
- [kubectl-node-logs plugin](https://github.com/aravindhp/kubectl-node-logs)
- [CVE-2024-9042 advisory](https://discuss.kubernetes.io/t/security-advisory-cve-2024-9042)

## Acknowledgments

Node Log Query was designed and implemented by contributors across
SIG Windows and SIG Node. Special thanks to Aravindh Puthiyaparambil
for driving and supporting the feature from inception through GA.

If you run into issues, have feedback, or want to contribute, find us
on the Kubernetes Slack in `#sig-windows` or join a
[SIG Windows meeting](https://github.com/kubernetes/community/tree/master/sig-windows).
