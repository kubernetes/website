---
layout: blog
title: "Kubernetes v1.36：Service ExternalIPs 的弃用和移除"
date: 2026-05-14T10:35:00-08:00
slug: kubernetes-v1-36-deprecation-and-removal-of-service-externalips
author: >
  Adrian Moisey (independent)、
  Dan Winship (Red Hat)
translator: >
  [Xin Li](https://github.com/my-git9)
---
<!--
layout: blog
title: "Kubernetes v1.36: Deprecation and removal of Service ExternalIPs"
date: 2026-05-14T10:35:00-08:00
slug: kubernetes-v1-36-deprecation-and-removal-of-service-externalips # optional
author: >
  Adrian Moisey (independent),
  Dan Winship (Red Hat),
-->

<!--
The `.spec.externalIPs` field for [Service](/docs/concepts/services-networking/service/) was an early attempt to provide
cloud-load-balancer-like functionality for non-cloud clusters.
Unfortunately, the API assumes that every user in the cluster is fully
trusted, and in any situation where that is not the case, it enables
various security exploits, as described in
[CVE-2020-8554](https://www.cvedetails.com/cve/CVE-2020-8554/).
-->
[Service](/zh-cn/docs/concepts/services-networking/service/) 的
`.spec.externalIPs` 字段是为非云集群提供类似云负载均衡器功能的早期尝试。
不幸的是，该 API 假设集群中的每个用户都是完全可信的，
而在任何不满足此条件的情况下，它会导致各种安全漏洞，
如 [CVE-2020-8554](https://www.cvedetails.com/cve/CVE-2020-8554/) 中所述。

<!--
Since Kubernetes 1.21, the Kubernetes project has recommended that all users disable
`.spec.externalIPs`. To make that easier, Kubernetes also added an admission controller
(`DenyServiceExternalIPs`) that can be enabled to do this. At the time,
SIG Network felt that blocking the functionality by default was too large a
breaking change to consider.
-->
自 Kubernetes 1.21 起，Kubernetes 项目建议所有用户禁用 `.spec.externalIPs`。
为了简化这一过程，Kubernetes 还添加了一个准入控制器（`DenyServiceExternalIPs`），
可以启用它来实现此目的。当时，SIG Network 认为默认阻止该特性是一个太大的破坏性变更，不予考虑。

<!--
However, the security problems are still there, and as a project we're increasingly
unhappy with the "insecure by default" state of the feature.
Additionally, there are now several better alternatives for non-cloud
clusters wanting load-balancer-like functionality.
-->
然而，安全问题仍然存在，作为一个项目，我们对该特性"默认不安全"的状态越来越不满意。
此外，对于想要类似负载均衡器功能的非云集群，现在有几种更好的替代方案。

<!--
As a result, the `.spec.externalIPs` field for Service is now formally deprecated in Kubernetes 1.36.
We expect that a future minor release of Kubernetes will drop
implementation of the behavior from `kube-proxy`, and will update the
Kubernetes [conformance](https://www.cncf.io/training/certification/software-conformance/) criteria to require that conforming implementations
**do not** provide support.
-->
因此，Service 的 `.spec.externalIPs` 字段现在在 Kubernetes 1.36 中正式弃用。
我们预计 Kubernetes 的未来次要版本将从 `kube-proxy` 中删除该行为的实现，
并更新 Kubernetes [一致性](https://www.cncf.io/training/certification/software-conformance/)标准，
要求一致性实现**不**提供支持。

<!--
## A note on terminology, and what hasn't been deprecated {#terminology}
-->
## 关于术语的说明，以及未被弃用的内容   {#terminology}

<!--
The phrase _external IP_ is somewhat overloaded in Kubernetes:
-->
短语 **external IP** 在 Kubernetes 中有些过度使用：

<!--
  - The Service API has a field `.spec.externalIPs` that can be used
    to add additional IP addresses that a Service will respond on.
-->
  - Service API 有一个字段 `.spec.externalIPs`，可用于添加 Service 将响应的额外 IP 地址。

<!--
  - The Node API's `.status.addresses` field can list addresses of
    several different types, one of which is called `ExternalIP`.
-->
  - Node API 的 `.status.addresses` 字段可以列出几种不同类型的地址，其中一种称为 `ExternalIP`。

<!--
  - The `kubectl` tool, when displaying information about a Service of type
    LoadBalancer in the default output format, will show the load
    balancer IP address under the column heading `EXTERNAL-IP`.
-->
  - `kubectl` 工具在以默认输出格式显示 LoadBalancer 类型的 Service 信息时，
    会在列标题 `EXTERNAL-IP` 下显示负载均衡器 IP 地址。

<!--
This deprecation is about the first of those. If you are not setting
the field `externalIPs` in any of your Services, then it does not
apply to you.
-->
此弃用是关于第一项的。如果你没有在任何 Service 中设置 `externalIPs` 字段，则这不适用于你。

<!--
That said, as a precaution, you may still want to enable the [DenyServiceExternalIPs](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips) admission controller to
block any future use of the `externalIPs` field.
-->
话虽如此，作为预防措施，你可能仍希望启用
[DenyServiceExternalIPs](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
准入控制器来阻止将来对 `externalIPs` 字段的任何使用。

<!--
## Alternatives to `externalIPs` {#alternatives}
-->
## `externalIPs` 的替代方案 {#alternatives}

<!--
If you are using `.spec.externalIPs`, then there are several alternatives.
-->
如果你正在使用 `.spec.externalIPs`，那么有几种替代方案。

<!--
Consider a Service like the following:
-->
考虑如下的 Service：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-example-service
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: my-example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  externalIPs:
    - "192.0.2.4"
```

<!--
### Using manually-managed LoadBalancer Services instead of `externalIPs` {#alternative-LoadBalancer}
-->
### 使用手动管理的 LoadBalancer Service 代替 `externalIPs` {#alternative-LoadBalancer}

<!--
The easiest (but also worst) option is to just switch from using
`externalIPs` to using a `type: LoadBalancer` service, and assigning a
load balancer IP by hand. This is, essentially, exactly the same as
`externalIPs`, with one important difference: the load balancer IP is
part of the Service's `.status`, not its `.spec`, and in a cluster
with RBAC enabled, it can't be edited by ordinary users by default.
Thus, this replacement for `externalIPs` would only be available to
users who were given permission by the admins (although those users
would then be fully empowered to replicate CVE-2020-8554; there would
still not be any further checks to ensure that one user wasn't
stealing another user's IPs, etc.)
-->
最简单（但也最糟糕）的选择是从使用 `externalIPs` 切换到使用 `type: LoadBalancer` 服务，
并手动分配负载均衡器 IP。这本质上与 `externalIPs` 完全相同，
但有一个重要区别：负载均衡器 IP 是 Service 的 `.status` 的一部分，
而不是 `.spec`，在启用 RBAC 的集群中，默认情况下普通用户无法编辑它。
因此，这种 `externalIPs` 的替代方案仅对管理员授予权限的用户可用
（尽管这些用户随后将完全有能力复制 CVE-2020-8554；
仍然不会有任何进一步的检查来确保一个用户没有窃取另一个用户的 IP 等）。

<!--
Because of the way that `.status` works in Kubernetes, you must create the
Service without a load balancer IP, and then add the IP as a second step:
-->
由于 `.status` 在 Kubernetes 中的工作方式，你必须创建不带负载均衡器 IP 的 Service，
然后在第二步添加 IP：

```console
$ cat loadbalancer-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-example-service
spec:
  # prevent any real load balancer controllers from managing this service
  # by using a non-existent loadBalancerClass
  loadBalancerClass: non-existent-class
  type: LoadBalancer
  selector:
    app.kubernetes.io/name: my-example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
$ kubectl apply -f loadbalancer-service.yaml
service/my-example-service created
$ kubectl patch service my-example-service --subresource=status --type=merge -p '{"status":{"loadBalancer":{"ingress":[{"ip":"192.0.2.4"}]}}}'
```

<!--
### Using a non-cloud based load balancer controller {#alternative-load-balancer-controller}
-->
### 使用非云负载均衡器控制器 {#alternative-load-balancer-controller}

<!--
Although `LoadBalancer` services were originally designed to be backed by
cloud load balancers, Kubernetes can also support them on non-cloud platforms
by using a third-party load balancer controller such as [MetalLB](https://metallb.io/).
This solves the security problems associated with `externalIPs` because the
administrator can configure what ranges of IP addresses the controller will assign
to services, and the controller will ensure that two services can't both use the same
IP.
-->
虽然 `LoadBalancer` 服务最初设计为由云负载均衡器支持，
但 Kubernetes 也可以通过使用第三方负载均衡器控制器（如 [MetalLB](https://metallb.io/)）
在非云平台上支持它们。
这解决了与 `externalIPs` 相关的安全问题，因为管理员可以配置控制器将分配给服务的 IP 地址范围，
并且控制器将确保两个服务不能同时使用同一个 IP。

<!--
So, for example, after [installing](https://metallb.io/installation/) and
[configuring](https://metallb.io/configuration/) MetalLB, a cluster administrator
could configure a pool of IP addresses for use in the cluster:
-->
因此，例如，在[安装](https://metallb.io/installation/)和
[配置](https://metallb.io/configuration/) MetalLB 后，
集群管理员可以配置集群中使用的 IP 地址池：

```yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: production
  namespace: metallb-system
spec:
  addresses:
  - 192.0.2.0/24
  autoAssign: true
  avoidBuggyIPs: false
```

<!--
After which a user can create a `type: LoadBalancer` Service and MetalLB will handle the
assignment of the IP address. MetalLB even supports the deprecated `loadBalancerIP`
field in Service, so the end user can request a specific IP (assuming it is available)
for backward-compatibility with the `externalIPs` approach, rather than being
assigned one at random:
-->
之后，用户可以创建 `type: LoadBalancer` Service，MetalLB 将处理 IP 地址的分配。
MetalLB 甚至支持 Service 中已弃用的 `loadBalancerIP` 字段，
因此最终用户可以请求特定的 IP（假设可用）以实现与 `externalIPs` 方法的向后兼容性，
而不是随机分配一个：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-example-service
spec:
  type: LoadBalancer
  selector:
    app.kubernetes.io/name: my-example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  loadBalancerIP: "192.0.2.4"
```

<!--
Similar approaches would work with other load balancer controllers.
This approach can allow cluster administrators to have control over which IP addresses are assigned,
rather than users.
-->
类似的方法也适用于其他负载均衡器控制器。
这种方法允许集群管理员控制分配哪些 IP 地址，而不是由用户控制。

<!--
### Using Gateway API {#alternative-gateway-api}
-->
### 使用 Gateway API {#alternative-gateway-api}

<!--
Another potential solution is to use an implementation of the
[Gateway API](https://gateway-api.sigs.k8s.io/).
-->
另一个可能的解决方案是使用
[Gateway API](https://gateway-api.sigs.k8s.io/) 的实现。

<!--
Gateway API allows cluster administrators to define a Gateway resource, which can have an IP address
attached to it via the `.spec.addresses` field. Since Gateway resources are designed to be managed by
[cluster administrators](https://gateway-api.sigs.k8s.io/concepts/security/), RBAC rules can be put in place to only allow privileged users to manage them.
-->
Gateway API 允许集群管理员定义 Gateway 资源，
该资源可以通过 `.spec.addresses` 字段附加 IP 地址。
由于 Gateway 资源设计为由[集群管理员](https://gateway-api.sigs.k8s.io/concepts/security/)管理，
因此可以设置 RBAC 规则，仅允许特权用户管理它们。

<!--
An example of how this could look is:
-->
示例如下：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-gateway-class
  addresses:
  - type: IPAddress
    value: "192.0.2.4"
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-route
spec:
  parentRefs:
  - name: example-gateway
  rules:
  - backendRefs:
    - name: example-svc
      port: 80
---
apiVersion: v1
kind: Service
metadata:
  name: example-svc
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: example-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

<!--
The Gateway API project is the next generation of Kubernetes Ingress, Load Balancing, and Service Mesh APIs within Kubernetes.
Gateway API was designed to fix the shortcomings of the Service and Ingress resource, making it a very reliable robust solution
that is under active development.
-->
Gateway API 项目是 Kubernetes 中 Kubernetes Ingress、负载均衡和服务网格 API 的下一代。
Gateway API 旨在修复 Service 和 Ingress 资源的缺点，
使其成为正在积极开发的非常可靠的稳健解决方案。

<!--
## Timeline for `externalIPs` deprecation
-->
## `externalIPs` 弃用时间表

<!--
The rough timeline for this deprecation is as follows:
-->
此弃用的粗略时间表如下：

<!--
1. With the release of Kubernetes 1.36, the field was deprecated;
   Kubernetes now emits [warnings](/blog/2020/09/03/warnings/) when a user uses this field
2. About a year later (v1.40 at the earliest) support for `.spec.externalIPs` will be disabled in kube-proxy, but users will have a way to opt back in should they require more time to migrate away
3. About another year later - (v1.43 at the earliest) support will be disabled completely; users won't have a way to opt back in
-->
1. 随着 Kubernetes 1.36 的发布，该字段被弃用；
   当用户使用此字段时，Kubernetes 现在会发出[警告](/blog/2020/09/03/warnings/)
2. 大约一年后（最早为 v1.40），对 `.spec.externalIPs` 的支持将在 kube-proxy 中被禁用，
   但用户将有一种方法可以选择重新启用，以便他们需要更多时间进行迁移
3. 大约再过一年后（最早为 v1.43），支持将被完全禁用；用户将无法选择重新启用
