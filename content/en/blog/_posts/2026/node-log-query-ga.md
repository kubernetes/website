---
layout: blog
title: "Kubernetes 1.36: Node Log Query Graduates to GA"
draft: true
slug: node-log-query-ga
author: >
  JR Valdes (sig-windows)
---


This blog announces the graduation of the _Node Log Query_ feature to 
general availability (GA) in Kubernetes 1.36. 

_Node Log Query_ provides a standardized API for querying service logs on both
Linux and Windows nodes, so that you can access critical diagnostic 
information without needing direct shell access to the node. For example, if 
you have ever had to SSH into a Linux or Windows node at 2 AM to figure out 
why a service is misbehaving, or open a remote desktop session into a Windows 
Server virtual machine to navigate the Windows Event Viewer among thousands of 
entries, then _Node Log Query_ is for you.

This post explains what the feature does, why it matters, how to use it,
and the security trade-offs to think through before enabling it.

## A quick recap

_Node log query_ first appeared as an Alpha feature in Kubernetes 1.27. The 
original motivation was to help cluster administrators, because they should not need
direct shell access to a node in order to read system and/or service logs.

Before this feature, the debugging workflow for a node-level
issue looked something like this:

1. Notice pods stuck in `ContainerCreating` on a particular node.
2. Run `kubectl describe node` and see nothing obviously wrong.
3. Realize the problem is in the node's services, maybe the
   container runtime or the CNI plugin.
4. Request SSH or RDP credentials to the affected node.
5. Wait for access approval.
6. Log in to manually search with `journalctl` on Linux or `Get-EventLog` on 
   Windows (the Windows Event Viewer).

With _Node log query_, steps 4 through 6 collapse into a single
`kubectl` command. Access is managed via Kubernetes, and you can automate the
fine-grained access grant that allows you to do this securely.

## How it works

The kubelet exposes a `/logs/` HTTP endpoint, and you can access it by proxying
through the Kubernetes API server. When you issue a query, the request follows
the same broad path as other `kubectl` operations that target a node, that is,
from the client to the API server, then to the kubelet.

On the node side, the kubelet delegates to the operating system's native
log infrastructure or filesystem to find the relevant log entries. On Linux,
the feature assumes nodes use systemd and that service logs are available
through journald.

The heuristic depends on the host OS, and the general approach is:

Linux
: `journalctl` for journald log entries, with fallback to direct file reads from `/var/log/`.

Windows
: `Get-WinEvent` for Windows Event Log entries, and fallback file reads to `C:\var\log\`.

This discovery mechanism means you do not need to know the host OS or even 
where a particular service stores its logs. When you ask for the logs of a 
specific service, for example `service-one`, the kubelet first checks the 
native OS log infrastructure, and if there is no match it looks in the
filesystem in the following order:

- a) a file with the same name as the service, `/var/log/service-one`, then
- b) a file with the same name as the service and a `log` extension, `/var/log/service-one.log`, then
- c) a directory with the same name as the service containing a file as in _b)_, `/var/log/service-one/service-one.log`.

The same query works for Linux and Windows nodes, so you do not need different
troubleshooting steps for each operating system.

## Getting started

If you are running Kubernetes 1.36, the `NodeLogQuery` feature gate is locked
to _enabled_. However, the kubelet **does not** expose the `logs/?query` 
handler by default. You must explicitly opt in by setting both 
`enableSystemLogHandler` and `enableSystemLogQuery` to `true` in the 
[kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1)
and then restarting the kubelet on the nodes where you want to use the
feature.

As an example, this is a snippet of the relevant section in the kubelet 
configuration:
```yaml
enableSystemLogHandler: true
enableSystemLogQuery: true
```

The `enableSystemLogQuery` option defaults to `false` because enabling it exposes 
direct access to the node through the kubelet. Therefore, the recommendation 
is to enable it only while actively debugging and disable it again afterward.

For a safer way to manage production debugging access, see [Securing Production Debugging in Kubernetes](/blog/2026/03/18/securing-production-debugging-in-kubernetes/).

For older Kubernetes versions (1.30 through 1.35), the _Node log query_
feature is available in Beta and is disabled by default, so you need to set
the `NodeLogQuery` feature gate to `true` in addition to enabling the two
previous kubelet settings, `enableSystemLogHandler` and
`enableSystemLogQuery`.

You also need authorization to use the node proxy path shown in this post. In
clusters that use RBAC, that typically means granting highly privileged 
access to `nodes/proxy`. The latter, is security-sensitive and authorization is 
checked through the Kubernetes API, but access to the kubelet API via 
`nodes/proxy` is not covered by standard Kubernetes audit logging, so do not 
rely on the audit log as your only record of access.

{{< warning >}}
Granting permissions to `nodes/proxy` (even just **get** permission) also authorizes access to powerful kubelet
APIs that can be used to execute commands in any container running on the node, so be careful about how you manage them.
See [Kubelet authentication/authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/#get-nodes-proxy-warning)
for more information.
{{< /warning >}}

## How to use it

To query the log entries for an operating system service named `service-one` on a node with 
name `worker-one`:

```bash
kubectl get --raw "/api/v1/nodes/worker-one/proxy/logs/?query=service-one"
```

Filter log entries containing the text "error" within a specific time:

```bash
kubectl get --raw "/api/v1/nodes/worker-one/proxy/logs/?query=service-one&pattern=error&sinceTime=2026-01-15T10:00:00Z"
```

Fetch the trailing 50 log entries:

```bash
kubectl get --raw "/api/v1/nodes/worker-one/proxy/logs/?query=service-one&tailLines=50"
```

The same request works whether `worker-one` is a Linux or Windows node, and 
have a `service-one` service in `journalctl` or in the Windows Event Log, 
respectively. You do not need to know the underlying OS or log storage 
details to get the information you need.

### Available query parameters

| Parameter   | Description                                                                            |
|-------------|----------------------------------------------------------------------------------------|
| `boot`      | Linux only; select entries from a specific boot (negative integers for previous boots) |
| `pattern`   | PCRE regex to filter log entries                                                       |
| `query`     | Service name or log file path                                                          |
| `sinceTime` | RFC 3339 timestamp; only return log entries after this time                            |
| `tailLines` | Return this many log entries from the end of the log                                   |
| `untilTime` | RFC 3339 timestamp; only return log entries before this time                           |

## The `node-logs` kubectl plugin

If you find the raw API complex and hard to use, the kubectl plugin `node-logs` 
provides a friendlier syntax. For example, to get the last 50 log entries
containing "error" for `service-one` on `worker-one`:
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

The plugin is distributed through [Krew](https://krew.sigs.k8s.io/plugins/).
If you do not already have Krew installed, follow the
[Krew installation guide](https://krew.sigs.k8s.io/docs/user-guide/setup/install/).

After that, you can install the plugin with:

```bash
kubectl krew install node-logs
```

{{< warning >}}
Use at your own risk. The _node-logs_ kubectl plugin is a community plugin 
and is not part of kubectl itself, so review the plugin and use it with the
same care you would apply to any third-party tool.
{{< /warning >}}

## Why this matters most for Windows node operators

Linux administrators have always had `journalctl` just a terminal session 
away, where SSH access is usually available, and they are familiar with the 
tooling and the workflow. For Linux nodes, _Node log query_ is convenient; 
for Windows, in contrast, it can be transformative for fast incident response.

Debugging Windows nodes in Kubernetes has historically been painful.

A common scenario is that a Windows node reports `Ready`, but pods are stuck in 
`ContainerCreating` indefinitely. The cause is often a CNI misconfiguration 
that only surfaces in the Windows Event Viewer, not in any pod event or API 
status field. Before _Node log query_, the only option was to RDP into the 
virtual machine and navigate Event Viewer manually or run the `Get-WinEvent` 
PowerShell cmdlet with the appropriate filters. That is a slow and very 
error-prone process that requires time and specialized Windows knowledge.

With _Node log query_, you can identify the exact problem in seconds with the 
following command, without even leaving your terminal:
```bash
kubectl get --raw "/api/v1/nodes/winworker-one/proxy/logs/?query=kubelet&pattern=CNI"
```

## The road from alpha to GA

_Node log query_ has been in development for three years and has evolved across
ten Kubernetes releases:

**Kubernetes 1.27 (April 2023) — Alpha.**
The initial implementation landed with basic `journalctl` and
`Get-WinEvent` integration. The API surface was intentionally minimal
to gather feedback on real-world usage patterns.

**Kubernetes 1.30 (April 2024) — Beta.**
The feature graduated to Beta, but still required explicit enablement. 
Additional filtering parameters were refined, Windows Event Viewer querying 
was hardened, and the heuristic log discovery mechanism was stabilized. The 
`kubectl node-logs` plugin was developed to provide a better command-line
experience.

CVE-2024-9042: A command injection vulnerability was discovered in the Windows 
implementation. The issue was patched and backported to supported versions. This
was an important hardening event that strengthened input validation across 
the entire feature.

**Kubernetes 1.36 (2026) — GA.**
The API is stable and the `NodeLogQuery` feature gate is now locked to 
_enabled_. The kubelet still does not expose log query by default: you must 
enable `enableSystemLogQuery`, and keep in mind that doing so increases the
kubelet's security risk. See [Securing Production Debugging in Kubernetes](/blog/2026/03/18/securing-production-debugging-in-kubernetes/).

## Security considerations

Node-level system logs can contain sensitive information: authentication
tokens in service startup flags, IP addresses, hostnames, and
configuration details that could aid an attacker. 

Enabling access for _Node log query_ has serious implications for 
overall cluster security, so read the following carefully:

- **Feature state.** In Kubernetes 1.36, the `NodeLogQuery` feature gate is
  locked to _enabled_. That is not, by itself, a security control, given that kubelet
  configuration still determines whether the `logs/?query` handler is exposed.

- **Kubelet configuration.** Two boolean settings
  (`enableSystemLogHandler` and `enableSystemLogQuery`) must both be true. 
  Note that `enableSystemLogQuery` defaults to `false` and is recommended to stay
  disabled unless specifically needed for debugging, because enabling it
  increases the kubelet's exposure to attacks.

- **Authorization.** For the API path shown in this article, the caller
  needs highly privileged access to `nodes/proxy` to reach the node 
  proxy path. Although the operation you perform is a logs _read_, to 
  perform  that fetch  you must have been granted full access to proxy the 
  kubelet's internal API  (Kubernetes checks that you can perform both 
  **get** and **create** on the `proxy` subresource for that node). Reading
  logs is a privileged operation, and allowing anyone to read logs also lets
  them perform any other privileged operation such as launching a privileged
  Pod.

For example, if you use the widely-used RBAC authorization mode, here is a 
minimal ClusterRole that allows full access to the Kubelet's privileged API, 
including log queries:
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-log-query-cr-use-with-caution
rules:
- apiGroups: [""]
  resources: ["nodes/proxy"]
  verbs: ["get"]
```

Bind this only to specific users or groups, because it grants broad access to
privileged kubelet API operations. See [Access to proxy subresource of Nodes](/docs/concepts/security/rbac-good-practices/#access-to-proxy-subresource-of-nodes)

{{< warning >}}
Granting permissions to `nodes/proxy` (even just **get** permission) also authorizes access to powerful kubelet
APIs that can be used to execute commands in any container running on the node, so be careful about how you manage them.
See [Kubelet authentication/authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/#get-nodes-proxy-warning)
for more information.
{{< /warning >}}

## Scripting for quick incident response

Because the endpoint is a standard HTTP API, it integrates naturally
into shell scripts and automation. For reference, see the example below,
which retrieves the last 20 log entries containing the text "error" from the
`kubelet` service on all worker nodes, whether they are Linux or Windows:
```bash
for node in $(kubectl get nodes -l node-role.kubernetes.io/worker -o jsonpath='{.items[*].metadata.name}'); do
  echo "--- $node ---"
  kubectl get --raw "/api/v1/nodes/${node}/proxy/logs/?query=kubelet&pattern=error&tailLines=20"
done
```

Used carefully, a small script like the above can replace a lengthy manual
investigation process with just a cluster-wide check.

## What _Node log query_ does not replace

This feature is not a substitute for centralized log aggregation. If
you are running a log pipeline with Fluentd, Fluent Bit, OpenTelemetry
Collector, or a similar tool, keep doing that. Centralized logging gives
you historical retention, cross-node correlation, alerting, and
dashboards that _Node log query_ is not designed to provide.

Use _Node log query_ for live troubleshooting when you need a quick look at 
what a node is doing right now without waiting for logs to move through your
centralized pipeline. It complements your existing observability stack; it does
not replace it.

## Further reading

- [KEP-2258: Node Log Query](https://kep.k8s.io/2258)
- [System Logs documentation](https://kubernetes.io/docs/concepts/cluster-administration/system-logs/#log-query)
- [Alpha announcement blog post (Kubernetes 1.27)](https://kubernetes.io/blog/2023/04/21/node-log-query-alpha/)
- [kubectl-node-logs plugin](https://github.com/aravindhp/kubectl-node-logs)
- [CVE-2024-9042 advisory](https://discuss.kubernetes.io/t/security-advisory-cve-2024-9042)

## Acknowledgments

Node log query was designed and implemented by contributors across
[SIG Windows](https://www.kubernetes.dev/community/community-groups/sigs/windows/) and
[SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).
Special thanks to Aravindh Puthiyaparambil for driving and supporting the 
feature from inception through GA.

If you run into issues, have feedback, or want to contribute, find us
on the Kubernetes Slack in `#sig-windows` or join a
[SIG Windows meeting](https://github.com/kubernetes/community/tree/master/sig-windows).
