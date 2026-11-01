---
layout: blog
title: "Kubernetes v1.36：细粒度 kubelet API 鉴权正式发布（GA）"
date: 2026-04-24T10:35:00-08:00
slug: kubernetes-v1-36-fine-grained-kubelet-authorization-ga
author: >
  Vinayak Goyal (Google)
translator: >
  [Paco Xu](https://github.com/pacoxu)(DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.36: Fine-Grained Kubelet API Authorization Graduates to GA"
date: 2026-04-24T10:35:00-08:00
slug: kubernetes-v1-36-fine-grained-kubelet-authorization-ga
author: >
   Vinayak Goyal (Google)
-->

<!--
On behalf of Kubernetes SIG Auth and SIG Node, we are pleased to announce the
graduation of fine-grained `kubelet` API authorization to General Availability
(GA) in Kubernetes v1.36!
-->
我谨代表 Kubernetes SIG Auth 和 SIG Node 宣布，
细粒度 `kubelet` API 鉴权已在 Kubernetes v1.36 中正式发布（GA）！

<!--
The `KubeletFineGrainedAuthz` feature gate was introduced as an opt-in alpha
feature in Kubernetes v1.32, then graduated to beta (enabled by default) in
v1.33. Now, the feature is generally available and the feature gate is locked
to enabled. This feature enables more precise, least-privilege access control
over the `kubelet`'s HTTPS API, replacing the need to grant the overly broad
`nodes/proxy` permission for common monitoring and observability use cases.
-->
`KubeletFineGrainedAuthz` 特性门控在 Kubernetes v1.32 中作为可选启用的
Alpha 特性引入，并在 v1.33 中进入 Beta 阶段（默认启用）。
如今，该特性已正式发布，且特性门控被锁定为启用状态。
此特性可针对 `kubelet` 的 HTTPS API 提供更精确、遵循最小权限原则的访问控制，
替代在常见监控与可观测性场景下授予范围过宽的 `nodes/proxy` 权限的做法。

<!--
## Motivation: the `nodes/proxy` problem
-->
## 动机：`nodes/proxy` 问题

<!--
The `kubelet` exposes an HTTPS endpoint with several APIs that give access to data
of varying sensitivity, including pod listings, node metrics, container logs,
and, critically, the ability to execute commands inside running containers.
-->
`kubelet` 暴露了一个 HTTPS 端点，其中包含多个 API，可访问敏感程度不同的数据，
包括 Pod 列表、节点指标、容器日志，以及至关重要的在运行中的容器内执行命令的能力。

<!--
Prior to this feature, `kubelet` authorization used a coarse-grained model. When
webhook authorization was enabled, almost all `kubelet` API paths were mapped to a
single `nodes/proxy` subresource. This meant that any workload needing to read
metrics or health status from the `kubelet` required `nodes/proxy` permission,
the same permission that also grants the ability to execute arbitrary commands
in any container running on the node.
-->
在此特性出现之前，`kubelet` 鉴权采用的是一种粗粒度模型。
启用 webhook 鉴权时，几乎所有 `kubelet` API 路径都会映射到单一的
`nodes/proxy` 子资源。
这意味着，任何需要从 `kubelet` 读取指标或健康状态的工作负载，
都必须拥有 `nodes/proxy` 权限，而这一权限同时也赋予了在节点上运行的任意容器中执行任意命令的能力。

<!--
### What's wrong with that?
-->
### 这有什么问题？

<!--
Granting `nodes/proxy` to monitoring agents, log collectors, or health-checking
tools violates the principle of least privilege. If any of those workloads were
compromised, an attacker would gain the ability to run commands in every
container on the node. The `nodes/proxy` permission is effectively a node-level
superuser capability, and granting it broadly dramatically increases the blast
radius of a security incident.
-->
将 `nodes/proxy` 授予监控代理、日志采集器或健康检查工具，违背了最小权限原则。
一旦这些工作负载中的任何一个被攻破，攻击者就能够在该节点上的每一个容器中执行命令。
`nodes/proxy` 权限实质上相当于节点级的超级用户能力，
而将其广泛授予会显著扩大安全事件的影响范围。

<!--
This problem has been well understood in the community for years (see 
[kubernetes/kubernetes#83465](https://github.com/kubernetes/kubernetes/issues/83465)),
and was the driving motivation behind this enhancement [KEP-2862](https://kep.k8s.io/2862).
-->
这个问题多年来一直被社区充分认识到（参见
[kubernetes/kubernetes#83465](https://github.com/kubernetes/kubernetes/issues/83465)），
也是推动此增强项 [KEP-2862](https://kep.k8s.io/2862) 的核心动因。

<!--
### The `nodes/proxy GET` WebSocket RCE risk
-->
### `nodes/proxy GET` 的 WebSocket 远程代码执行风险

<!--
The situation is more severe than it might appear at first glance. Security
researchers [demonstrated in early 2026](https://grahamhelton.com/blog/nodes-proxy-rce)
that `nodes/proxy GET` alone, which is the minimal read-only permission routinely
granted to monitoring tools, can be abused to execute commands in any pod on
reachable nodes.
-->
实际情况比乍看起来更严重。安全研究人员在
[2026 年初的研究中演示](https://grahamhelton.com/blog/nodes-proxy-rce)，
仅凭 `nodes/proxy GET` 这一通常授予监控工具的最小只读权限，
就可以被滥用来在可访问节点上的任意 Pod 中执行命令。

<!--
The root cause is a mismatch between how WebSocket connections work and how the
`kubelet` maps HTTP methods to RBAC verbs. The
[WebSocket protocol (RFC 6455)](https://datatracker.ietf.org/doc/html/rfc6455#section-1.2)
requires an HTTP `GET` request for the initial connection handshake. The `kubelet`
maps this `GET` to the RBAC `get` verb and authorizes the request without
performing a secondary check to confirm that `CREATE` permission is also present
for the write operation that follows. Using a WebSocket client like `websocat`,
an attacker can reach the `kubelet`'s `/exec` endpoint directly on port 10250 and
execute arbitrary commands:
-->
根本原因在于 WebSocket 连接的工作方式与 `kubelet` 将 HTTP 方法映射到
RBAC 动词的方式之间存在不匹配。
[WebSocket 协议（RFC 6455）](https://datatracker.ietf.org/doc/html/rfc6455#section-1.2)
要求在初始连接握手时发起一个 HTTP `GET` 请求。
`kubelet` 会将这个 `GET` 映射为 RBAC `get` 动词，并在鉴权时不进行二次检查，
以确认后续写操作所需的 `create` 权限是否同时存在。
攻击者借助 `websocat` 之类的 WebSocket 客户端，
可以直接访问 10250 端口上的 `kubelet` `/exec` 端点，并执行任意命令：

```bash
websocat --insecure \
  --header "Authorization: Bearer $TOKEN" \
  --protocol v4.channel.k8s.io \
  "wss://$NODE_IP:10250/exec/default/nginx/nginx?output=1&error=1&command=id"

uid=0(root) gid=0(root) groups=0(root)
```

<!--
## Fine-grained `kubelet` authorization: how it works
-->
## 细粒度 `kubelet` 鉴权如何工作

<!--
With `KubeletFineGrainedAuthz`, the `kubelet` now performs an additional, more
specific authorization check before falling back to the `nodes/proxy`
subresource. Several commonly used `kubelet` API paths are mapped to their own
dedicated subresources:
-->
启用 `KubeletFineGrainedAuthz` 后，`kubelet` 现在会在回退到 `nodes/proxy`
子资源之前，先执行一次额外且更具体的鉴权检查。
多个常用的 `kubelet` API 路径被映射到了各自专属的子资源：

| `kubelet` API | 资源 | 子资源 |
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
| 其他所有路径 | nodes | proxy |

<!--
For the endpoints that now have fine-grained subresources (`/pods`,
`/runningPods/`, `/healthz`, `/configz`), the `kubelet` first sends a
`SubjectAccessReview` for the specific subresource. If that check succeeds, the
request is authorized. If it fails, the `kubelet` retries with the coarse-grained
`nodes/proxy` subresource for backward compatibility.
-->
对于现在拥有细粒度子资源的端点（`/pods`、`/runningPods/`、`/healthz` 和
`/configz`），`kubelet` 会先针对具体子资源发送一次 `SubjectAccessReview`。
如果该检查成功，请求即获准通过；如果失败，`kubelet` 会再使用粗粒度的
`nodes/proxy` 子资源重试，以保持向后兼容。

<!--
This dual-check approach ensures a smooth migration path. Existing workloads
with `nodes/proxy` permissions continue to work, while new deployments can adopt
least-privilege access from day one.
-->
这种双重检查方式确保了平滑的迁移路径。
已有的、依赖 `nodes/proxy` 权限的工作负载仍可继续运行，
而新的部署则可以从一开始就采用最小权限访问方式。

<!--
## What this means in practice
-->
## 这在实践中意味着什么

<!--
Consider a Prometheus node exporter or a monitoring `DaemonSet` that needs to
scrape `/metrics` from the `kubelet`. Previously, you would need an RBAC
`ClusterRole` like this:
-->
以 Prometheus node exporter 或某个需要从 `kubelet` 抓取 `/metrics` 的监控
`DaemonSet` 为例。过去，你需要像下面这样配置一个 RBAC `ClusterRole`：

```yaml
# 旧方式：权限范围过宽
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-agent
rules:
- apiGroups: [""]
  resources: ["nodes/proxy"]
  verbs: ["get"]
```

<!--
This grants the monitoring agent far more access than it needs. With
fine-grained authorization, you can now scope the permissions precisely:
-->
这赋予了监控代理远超实际所需的访问权限。
有了细粒度鉴权后，你现在可以精确限定权限范围：

```yaml
# 新方式：遵循最小权限原则
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-agent
rules:
- apiGroups: [""]
  resources: ["nodes/metrics", "nodes/stats"]
  verbs: ["get"]
```

<!--
The monitoring agent can now read metrics and stats from the `kubelet` without
ever being able to execute commands in containers.
-->
这样一来，监控代理就可以从 `kubelet` 读取 `metrics` 与 `stats`，
同时完全不具备在容器中执行命令的能力。

<!--
## Updated `system:kubelet-api-admin` `ClusterRole`
-->
## 已更新的 `system:kubelet-api-admin` `ClusterRole`

<!--
When RBAC authorization is enabled, the built-in `system:kubelet-api-admin`
`ClusterRole` is automatically updated to include permissions for all the new
fine-grained subresources. This ensures that cluster administrators who already
use this role, including the API server's `kubelet` client, continue to have
full access without any manual configuration changes.
-->
启用 RBAC 鉴权时，内置的 `system:kubelet-api-admin` `ClusterRole`
会自动更新，以包含所有新的细粒度子资源权限。
这可确保已经在使用该角色的集群管理员（包括 API server 所使用的 `kubelet` 客户端）
无需任何手动配置变更，仍然保有完整访问能力。

<!--
The role now includes permissions for:
-->
该角色现在包含以下权限：

- `nodes/proxy`
- `nodes/stats`
- `nodes/metrics`
- `nodes/log`
- `nodes/spec`
- `nodes/checkpoint`
- `nodes/configz`
- `nodes/healthz`
- `nodes/pods`

<!--
## Upgrade considerations
-->
## 升级注意事项

<!--
Because the `kubelet` performs a dual authorization check (fine-grained first,
then falling back to `nodes/proxy`), upgrading to v1.36 should be seamless for
most clusters:
-->
由于 `kubelet` 会执行双重鉴权检查（先细粒度检查，再回退到 `nodes/proxy`），
升级到 v1.36 对大多数集群来说应当是无缝的：

<!--
- **Existing workloads** with `nodes/proxy` permissions continue to work without
changes. The fallback to `nodes/proxy` ensures backward compatibility.
- **The API server** always has `nodes/proxy` permissions via
`system:kubelet-api-admin`, so `kube-apiserver`-to-`kubelet` communication is
unaffected regardless of feature gate state.
- **Mixed-version clusters** are handled gracefully. If a `kubelet` supports
fine-grained authorization but the API server does not (or vice versa),
`nodes/proxy` permissions serve as the fallback.
-->
- **现有工作负载**：已经拥有 `nodes/proxy` 权限的工作负载无需任何改动即可继续运行。
  回退到 `nodes/proxy` 的机制保证了向后兼容。
- **API server**：始终通过 `system:kubelet-api-admin` 拥有 `nodes/proxy`
  权限，因此无论特性门控状态如何，`kube-apiserver` 与 `kubelet` 之间的通信都不受影响。
- **混合版本集群**：也能被平滑处理。如果 `kubelet` 支持细粒度鉴权而 API server 不支持
  （或反过来），`nodes/proxy` 权限就会作为回退机制发挥作用。

<!--
## Verifying the feature is enabled
-->
## 验证该特性是否已启用

<!--
You can confirm that the feature is active on a given node by checking the
`kubelet` metrics endpoint. Since the metrics endpoint on port 10250 requires
authorization, you'll first need to create appropriate RBAC bindings for the pod
or `ServiceAccount` making the request.
-->
你可以通过检查 `kubelet` 的 metrics 端点，确认该特性是否在某个节点上处于启用状态。
由于 10250 端口上的 metrics 端点需要鉴权，
你首先需要为发起请求的 Pod 或服务账号创建适当的 RBAC 绑定。

<!--
**Step 1: Create a `ServiceAccount` and `ClusterRole`**
-->
**第 1 步：创建 `ServiceAccount` 和 `ClusterRole`**

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

<!--
**Step 2: Bind the `ClusterRole` to the `ServiceAccount`**
-->
**第 2 步：将 `ClusterRole` 绑定到 `ServiceAccount`**

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

<!--
Apply both manifests:
-->
应用这些清单：

```bash
kubectl apply -f serviceaccount.yaml
kubectl apply -f clusterrole.yaml
kubectl apply -f clusterrolebinding.yaml
```

<!--
**Step 3: Run a pod with the `ServiceAccount` and check the feature flag**
-->
**第 3 步：使用该 `ServiceAccount` 运行一个 Pod，并检查特性标志**

```bash
kubectl run kubelet-check \
  --image=curlimages/curl \
  --serviceaccount=kubelet-metrics-checker \
  --restart=Never \
  --rm -it \
  -- sh
```

<!--
Then from within the pod, retrieve the node IP and query the metrics endpoint:
-->
然后在 Pod 内获取节点 IP，并查询 metrics 端点：

```bash
# 获取令牌
TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)

# 查询 kubelet 指标，并筛选特性门控
curl -sk \
  --header "Authorization: Bearer $TOKEN" \
  https://$NODE_IP:10250/metrics \
  | grep kubernetes_feature_enabled \
  | grep KubeletFineGrainedAuthz
```

<!--
If the feature is enabled, you should see output like:
-->
如果该特性已启用，你应当会看到类似下面的输出：

```
kubernetes_feature_enabled{name="KubeletFineGrainedAuthz",stage="GA"} 1
```

<!--
> **Note:** Replace `$NODE_IP` with the IP address of the node you want to check.
You can retrieve node IPs with `kubectl get nodes -o wide`.
-->
> **注意**： 请将 `$NODE_IP` 替换为你要检查的节点 IP 地址。
> 你可以使用 `kubectl get nodes -o wide` 获取节点 IP。

<!--
## The journey from alpha to GA
-->
## 从 Alpha 到 GA 的历程

| 版本 | 阶段 | 说明 |
|---|---|---|
| v1.32 | Alpha | 引入 `KubeletFineGrainedAuthz` 特性门控，默认禁用 |
| v1.33 | Beta | 默认启用；为 `/pods`、`/runningPods/`、`/healthz`、`/configz` 增加细粒度检查 |
| v1.36 | GA | 特性门控被锁定为启用状态；细粒度 `kubelet` 鉴权始终处于活动状态 |

<!--
## What's next?
-->
## 下一步是什么？

<!--
With fine-grained `kubelet` authorization now GA, the Kubernetes community can
begin recommending and eventually enforcing the use of specific subresources
instead of `nodes/proxy` for monitoring and observability workloads. The urgency
of this migration is underscored by
[research showing that `nodes/proxy GET` can be abused for unlogged remote code execution](https://grahamhelton.com/blog/nodes-proxy-rce) via the WebSocket protocol. This risk is present in the default RBAC
configurations of dozens of widely deployed Helm charts. Over time, we expect:
-->
随着细粒度 `kubelet` 鉴权现已 GA，Kubernetes 社区可以开始建议，
并最终强制要求监控与可观测性工作负载使用特定子资源，而不是 `nodes/proxy`。
之所以需要尽快推进这一迁移，是因为已有
[研究表明 `nodes/proxy GET` 可通过 WebSocket 协议被滥用，从而实现无日志记录的远程代码执行](https://grahamhelton.com/blog/nodes-proxy-rce)。
这一风险存在于数十个被广泛部署的 Helm Chart 的默认 RBAC 配置中。
随着时间推移，我们预计会出现以下变化：

<!--
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
-->
- **生态系统采用**：Prometheus、Datadog agent 以及其他 `DaemonSet` 等监控工具，
  可以更新其默认 RBAC 配置，改用 `nodes/metrics`、`nodes/stats` 和 `nodes/pods`，
  而不再使用 `nodes/proxy`。这会直接消除这些工作负载面临的 WebSocket RCE 攻击面。
- **策略执行**：当存在细粒度替代方案时，准入控制器与策略引擎可以标记或拒绝授予
  `nodes/proxy` 的 RBAC 绑定，帮助组织以规模化方式落实最小权限访问。
- **弃用路径**：随着采用范围扩大，`nodes/proxy` 最终可能会在监控用途中被弃用，
  从而进一步缩小 Kubernetes 集群的攻击面。

<!--
## Getting involved
-->
## 参与其中

<!--
This enhancement was driven by SIG Auth and SIG Node. If you are interested in
contributing to the security and authorization features of Kubernetes, please
join us:
-->
这一增强项由 SIG Auth 和 SIG Node 推动。
如果你有兴趣为 Kubernetes 的安全与鉴权特性贡献力量，欢迎加入我们：

- [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth)
- [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)
- Slack：`#sig-auth` 和 `#sig-node`
- [KEP-2862：细粒度 kubelet API 鉴权](https://github.com/kubernetes/enhancements/issues/2862)

<!--
We look forward to hearing your feedback and experiences with this feature!
-->
期待听到你对这一特性的反馈与使用经验！
