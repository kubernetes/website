---
layout: blog
title: "Kubernetes 1.35：版本化 z-pages API 带来更强大的调试能力"
draft: true
slug: kubernetes-1-35-structured-zpages
author: >
  [Richa Banker](https://github.com/richabanker),
  [Han Kang](https://github.com/cncf/memorials/blob/main/han-kang.md)
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---
<!--
layout: blog
title: "Kubernetes 1.35: Enhanced Debugging with Versioned z-pages APIs"
draft: true
slug: kubernetes-1-35-structured-zpages
author: >
  [Richa Banker](https://github.com/richabanker),
  [Han Kang](https://github.com/cncf/memorials/blob/main/han-kang.md)
-->

<!--
Debugging Kubernetes control plane components can be challenging, especially when you need to quickly understand the runtime state of a component or verify its configuration. With Kubernetes 1.35, we're enhancing the z-pages debugging endpoints with structured, machine-parseable responses that make it easier to build tooling and automate troubleshooting workflows.
-->
调试 Kubernetes 控制平面组件可能很具挑战性，
尤其是在需要快速理解组件运行时状态或验证配置时。
在 Kubernetes 1.35 中，我们为 z-pages 调试端点带来结构化、可被机器解析的响应，
让构建工具和自动化排障流程变得更加轻松。

<!--
## What are z-pages?
-->
## 什么是 z-pages？ {#what-are-z-pages}

<!--
z-pages are special debugging endpoints exposed by Kubernetes control plane components. Introduced as an alpha feature in Kubernetes 1.32, these endpoints provide runtime diagnostics for components like `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `kubelet` and `kube-proxy`. The name "z-pages" comes from the convention of using `/*z` paths for debugging endpoints.
-->
z-pages 是 Kubernetes 控制平面组件所公开的特殊调试端点。
它们在 Kubernetes 1.32 中以 Alpha 特性引入，为 `kube-apiserver`、`kube-controller-manager`、
`kube-scheduler`、`kubelet` 与 `kube-proxy` 等组件提供运行时诊断。
"z-pages" 这一名称源自使用 `/*z` 路径来公开调试端点的惯例。

<!--
Currently, Kubernetes supports two primary z-page endpoints:

`/statusz`
: Displays high-level component information including version information, start time, uptime, and available debug paths

`/flagz`
: Shows all command-line arguments and their values used to start the component (with confidential values redacted for security)
-->
目前，Kubernetes 支持两个主要的 z-page 端点：

`/statusz`
: 显示组件的高级信息，包括版本、启动时间、运行时长以及可用调试路径

`/flagz`
: 展示用于启动组件的全部命令行参数及其取值（敏感值会出于安全考虑被屏蔽）

<!--
These endpoints are valuable for human operators who need to quickly inspect component state, but until now, they only returned plain text output that was difficult to parse programmatically.
-->
这些端点对于需要快速检查组件状态的人工运维人员非常有价值，
但在此之前它们只返回难以通过程序解析的纯文本输出。

<!--
## What's new in Kubernetes 1.35?
-->
## Kubernetes 1.35 有哪些新内容？ {#whats-new-in-kubernetes-1-35}

<!--
Kubernetes 1.35 introduces structured, versioned responses for both `/statusz` and `/flagz` endpoints. This enhancement maintains backward compatibility with the existing plain text format while adding support for machine-readable JSON responses.
-->
Kubernetes 1.35 为 `/statusz` 与 `/flagz` 两个端点都引入了结构化、具备版本控制的响应。
这一增强在保留现有纯文本格式向后兼容性的同时，新增了对机器可读 JSON 响应的支持。

<!--
### Backward compatible design
-->
### 向后兼容的设计 {#backward-compatible-design}

<!--
The new structured responses are opt-in. Without specifying an `Accept` header, the endpoints continue to return the familiar plain text format:
-->
新的结构化响应是按需启用的。
如果未指定 `Accept` 头，端点仍会返回熟悉的纯文本格式：

```
$ curl --cert /etc/kubernetes/pki/apiserver-kubelet-client.crt \
  --key /etc/kubernetes/pki/apiserver-kubelet-client.key \
  --cacert /etc/kubernetes/pki/ca.crt \
  https://localhost:6443/statusz

kube-apiserver statusz
Warning: This endpoint is not meant to be machine parseable, has no formatting compatibility guarantees and is for debugging purposes only.

Started: Wed Oct 16 21:03:43 UTC 2024
Up: 0 hr 00 min 16 sec
Go version: go1.23.2
Binary version: 1.35.0-alpha.0.1595
Emulation version: 1.35
Paths: /healthz /livez /metrics /readyz /statusz /version
```

<!--
### Structured JSON responses
-->
### 结构化 JSON 响应 {#structured-json-responses}

<!--
To receive a structured response, include the appropriate `Accept` header:
-->
若要获得结构化响应，需要提供合适的 `Accept` 头：

```
Accept: application/json;v=v1alpha1;g=config.k8s.io;as=Statusz
```

<!--
This returns a versioned JSON response:
-->
这样即可返回具备版本号的 JSON 响应：

```json
{
  "kind": "Statusz",
  "apiVersion": "config.k8s.io/v1alpha1",
  "metadata": {
    "name": "kube-apiserver"
  },
  "startTime": "2025-10-29T00:30:01Z",
  "uptimeSeconds": 856,
  "goVersion": "go1.23.2",
  "binaryVersion": "1.35.0",
  "emulationVersion": "1.35",
  "paths": [
    "/healthz",
    "/livez",
    "/metrics",
    "/readyz",
    "/statusz",
    "/version"
  ]
}
```

<!--
Similarly, `/flagz` supports structured responses with the header:
-->
类似地，`/flagz` 也支持结构化响应，只需设置以下头部：

```
Accept: application/json;v=v1alpha1;g=config.k8s.io;as=Flagz
```

<!--
Example response:
-->
响应示例如下：

```json
{
  "kind": "Flagz",
  "apiVersion": "config.k8s.io/v1alpha1",
  "metadata": {
    "name": "kube-apiserver"
  },
  "flags": {
    "advertise-address": "192.168.8.4",
    "allow-privileged": "true",
    "authorization-mode": "[Node,RBAC]",
    "enable-priority-and-fairness": "true",
    "profiling": "true"
  }
}
```

<!--
## Why structured responses matter
-->
## 结构化响应为什么很重要 {#why-structured-responses-matter}

<!--
The addition of structured responses opens up several new possibilities:
-->
引入结构化响应使得一系列新的用例成为可能：

<!--
### 1. **Automated health checks and monitoring**

Instead of parsing plain text, monitoring tools can now easily extract specific fields. For example, you can programmatically check if a component has been running with an unexpected emulated version or verify that critical flags are set correctly.
-->
### 1. **自动化健康检查与监控** {#1-automated-health-checks-and-monitoring}

相比解析纯文本，监控工具现在可以轻松提取特定字段。
例如，你可以通过程序检查组件是否以异常的模拟版本运行，或确认关键参数是否配置正确。

<!--
### 2. **Better debugging tools**

Developers can build sophisticated debugging tools that compare configurations across multiple components or track configuration drift over time. The structured format makes it trivial to `diff` configurations or validate that components are running with expected settings.
-->
### 2. **更好的调试工具** {#2-better-debugging-tools}

开发者能够构建更加智能的调试工具，用于跨组件比较配置或随时间追踪配置漂移。
结构化格式让对配置执行 `diff` 或验证组件是否按预期设置运行变得轻而易举。

<!--
### 3. **API versioning and stability**

By introducing versioned APIs (starting with `v1alpha1`), we provide a clear path to stability. As the feature matures, we'll introduce `v1beta1` and eventually `v1`, giving you confidence that your tooling won't break with future Kubernetes releases.
-->
### 3. **API 版本化与稳定性** {#3-api-versioning-and-stability}

通过引入带版本的 API（从 `v1alpha1` 开始），我们为稳定性提供了明确路径。
随着特性不断成熟，我们会发布 `v1beta1` 甚至 `v1`，
让你更有信心确保这些工具在未来的 Kubernetes 版本中依然能够正常工作。

<!--
## How to use structured z-pages
-->
## 如何使用结构化 z-pages {#how-to-use-structured-z-pages}

<!--
### Prerequisites

Both endpoints require feature gates to be enabled:

- `/statusz`: Enable the `ComponentStatusz` feature gate
- `/flagz`: Enable the `ComponentFlagz` feature gate
-->
### 前提条件 {#prerequisites}

两个端点都需要启用相应的特性门控：

- `/statusz`：启用 `ComponentStatusz` 特性门控
- `/flagz`：启用 `ComponentFlagz` 特性门控

<!--
### Example: Getting structured responses

Here's an example using `curl` to retrieve structured JSON responses from the kube-apiserver:
-->
### 示例：获取结构化响应 {#example-getting-structured-responses}

下面示例展示如何使用 `curl` 从 kube-apiserver 中获取结构化 JSON 响应：

<!--
```bash
# Get structured statusz response
curl \
  --cert /etc/kubernetes/pki/apiserver-kubelet-client.crt \
  --key /etc/kubernetes/pki/apiserver-kubelet-client.key \
  --cacert /etc/kubernetes/pki/ca.crt \
  -H "Accept: application/json;v=v1alpha1;g=config.k8s.io;as=Statusz" \
  https://localhost:6443/statusz | jq .

# Get structured flagz response
curl \
  --cert /etc/kubernetes/pki/apiserver-kubelet-client.crt \
  --key /etc/kubernetes/pki/apiserver-kubelet-client.key \
  --cacert /etc/kubernetes/pki/ca.crt \
  -H "Accept: application/json;v=v1alpha1;g=config.k8s.io;as=Flagz" \
  https://localhost:6443/flagz | jq .
```
-->
```bash
# 获取结构化状态响应
curl \
  --cert /etc/kubernetes/pki/apiserver-kubelet-client.crt \
  --key /etc/kubernetes/pki/apiserver-kubelet-client.key \
  --cacert /etc/kubernetes/pki/ca.crt \
  -H "Accept: application/json;v=v1alpha1;g=config.k8s.io;as=Statusz" \
  https://localhost:6443/statusz | jq .

# 获取结构化标记响应
curl \
  --cert /etc/kubernetes/pki/apiserver-kubelet-client.crt \
  --key /etc/kubernetes/pki/apiserver-kubelet-client.key \
  --cacert /etc/kubernetes/pki/ca.crt \
  -H "Accept: application/json;v=v1alpha1;g=config.k8s.io;as=Flagz" \
  https://localhost:6443/flagz | jq .
```

{{< note >}}
<!--
The examples above use client certificate authentication and verify the server's certificate using `--cacert`. 
If you need to bypass certificate verification in a test environment, you can use `--insecure` (or `-k`), 
but this should never be done in production as it makes you vulnerable to man-in-the-middle attacks.
-->
上述示例使用客户端证书认证，并通过 `--cacert` 验证服务器证书。
如果在测试环境中需要跳过证书验证，可以使用 `--insecure`（或 `-k`），
但在生产环境切勿这样做，否则会暴露在中间人攻击风险之下。
{{< /note >}}

<!--
## Important considerations
-->
## 重要注意事项 {#important-considerations}

<!--
### Alpha feature status

The structured z-page responses are an **alpha** feature in Kubernetes 1.35. This means:

- The API format may change in future releases
- These endpoints are intended for debugging, not production automation
- You should avoid relying on them for critical monitoring workflows until they reach beta or stable status
-->
### Alpha 特性状态 {#alpha-feature-status}

结构化 z-page 响应在 Kubernetes 1.35 中仍是 **Alpha** 特性，这意味着：

- API 格式可能会在未来版本中发生变化
- 这些端点用于调试，而非生产自动化
- 在其达到 Beta 或稳定版之前，不应把它们作为关键监控工作流的依赖

<!--
### Security and access control
-->
### 安全与访问控制 {#security-and-access-control}

<!--
z-pages expose internal component information and require proper access controls. Here are the key security considerations:
-->
z-pages 会公开组件内部信息，因此必须设置恰当的访问控制，重点注意以下安全事项：

<!--
**Authorization**: Access to z-page endpoints is restricted to members of the `system:monitoring` group, which follows the same authorization model as other debugging endpoints like `/healthz`, `/livez`, and `/readyz`. This ensures that only authorized users and service accounts can access debugging information. If your cluster uses RBAC, you can manage access by granting appropriate permissions to this group.
-->
**鉴权**：访问 z-page 端点仅限 `system:monitoring` 组成员，
遵循与 `/healthz`、`/livez`、`/readyz` 等调试端点相同的鉴权模型。
这样可确保只有获授权的用户和服务账号才能获取调试信息。
如果集群使用 RBAC，可以通过赋予该组适当权限来管理访问。

<!--
**Authentication**: The authentication requirements for these endpoints depend on your cluster's configuration. Unless anonymous authentication is enabled for your cluster, you typically need to use authentication mechanisms (such as client certificates) to access these endpoints.
-->
**身份认证**：这些端点的身份认证要求取决于集群配置。
除非集群启用了匿名身份认证，否则通常需要使用身份认证机制（如客户端证书）来访问这些端点。

<!--
**Information disclosure**: These endpoints reveal configuration details about your cluster components, including:
- Component versions and build information
- All command-line arguments and their values (with confidential values redacted)
- Available debug endpoints
-->
**信息披露**：这些端点会泄露集群组件的配置细节，包括：
- 组件版本与构建信息
- 所有命令行参数及其取值（敏感值会被屏蔽）
- 可用的调试端点

<!--
Only grant access to trusted operators and debugging tools. Avoid exposing these endpoints to unauthorized users or automated systems that don't require this level of access.
-->
务必仅向受信任的运维人员和调试工具授予访问权限，
避免对无关用户或不需要该访问级别的自动化系统开放这些端点。

<!--
### Future evolution

As the feature matures, we (Kubernetes SIG Instrumentation) expect to:

- Introduce `v1beta1` and eventually `v1` versions of the API
- Gather community feedback on the response schema
- Potentially add additional z-page endpoints based on user needs
-->
### 未来演进 {#future-evolution}

随着特性愈发成熟，Kubernetes SIG Instrumentation 计划：

- 引入 `v1beta1` 并最终提供 `v1` 版本的 API
- 收集社区对响应模式的反馈
- 根据用户需求，潜在新增更多 z-page 端点

<!--
## Try it out

We encourage you to experiment with structured z-pages in a test environment:
-->
## 动手试试 {#try-it-out}

我们鼓励你在测试环境体验结构化 z-pages：

<!--
1. Enable the `ComponentStatusz` and `ComponentFlagz` feature gates on your control plane components
2. Try querying the endpoints with both plain text and structured formats
3. Build a simple tool or script that uses the structured data
4. Share your feedback with the community
-->
1. 在控制平面组件上启用 `ComponentStatusz` 与 `ComponentFlagz` 特性门控
2. 使用纯文本与结构化两种格式查询端点
3. 构建一个使用结构化数据的简单工具或脚本
4. 向社区分享你的反馈

<!--
## Learn more

- [z-pages documentation](/docs/reference/instrumentation/zpages/)
- [KEP-4827: Component Statusz](https://github.com/kubernetes/enhancements/blob/master/keps/sig-instrumentation/4827-component-statusz/README.md)
- [KEP-4828: Component Flagz](https://github.com/kubernetes/enhancements/blob/master/keps/sig-instrumentation/4828-component-flagz/README.md)
- Join the discussion in the [#sig-instrumentation](https://kubernetes.slack.com/archives/C20HH14P7) channel on Kubernetes Slack
-->
## 了解更多 {#learn-more}

- [z-pages 文档](/zh-cn/docs/reference/instrumentation/zpages/)
- [KEP-4827：Component Statusz](https://github.com/kubernetes/enhancements/blob/master/keps/sig-instrumentation/4827-component-statusz/README.md)
- [KEP-4828：Component Flagz](https://github.com/kubernetes/enhancements/blob/master/keps/sig-instrumentation/4828-component-flagz/README.md)
- 加入 Kubernetes Slack 中的 [#sig-instrumentation](https://kubernetes.slack.com/archives/C20HH14P7) 频道参与讨论

<!--
## Get involved
-->
## 参与其中 {#get-involved}

<!--
We'd love to hear your feedback! The structured z-pages feature is designed to make Kubernetes easier to debug and monitor. Whether you're building internal tooling, contributing to open source projects, or just exploring the feature, your input helps shape the future of Kubernetes observability.
-->
我们非常期待你的反馈！结构化 z-pages 旨在让 Kubernetes 调试和监控更轻松。
无论你是在构建内部工具、为开源项目做贡献，还是只是探索该特性，
你的意见都将帮助塑造 Kubernetes 可观测性的未来。

<!--
If you have questions, suggestions, or run into issues, please reach out to SIG Instrumentation. You can find us on Slack or at our regular [community meetings](https://github.com/kubernetes/community/tree/master/sig-instrumentation).
-->
如果你有问题、建议或遇到问题，请联系 SIG Instrumentation。
你可以在 Slack 中找到我们，或参加常规的[社区会议](https://github.com/kubernetes/community/tree/master/sig-instrumentation)。

<!--
Happy debugging!
-->
祝你调试愉快！
