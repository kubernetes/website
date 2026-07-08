---
layout: blog
title: "Ingress2Gateway 1.0 正式发布：通往 Gateway API 的途径"
slug: ingress2gateway-1-0-release
author: >
    [Beka Modebadze](https://github.com/bexxmodd) (Google),
    [Steven Jin](https://github.com/Stevenjin8) (Microsoft)
translator: >
  [Xin Li](https://github.com/my-git9) (Daocloud)
date: 2026-03-20T11:00:00-08:00
---
<!--
layout: blog
title: "Announcing Ingress2Gateway 1.0: Your Path to Gateway API"
slug: ingress2gateway-1-0-release
author: >
    [Beka Modebadze](https://github.com/bexxmodd) (Google),
    [Steven Jin](https://github.com/Stevenjin8) (Microsoft)
date: 2026-03-20T11:00:00-08:00
-->

<!--
With the Ingress-NGINX [retirement](/blog/2025/11/11/ingress-nginx-retirement/) scheduled for March 2026, the Kubernetes networking landscape is at a turning point.
For most organizations, the question isn't whether to migrate to [Gateway API](https://gateway-api.sigs.k8s.io/), but how to do so safely.

Migrating from Ingress to Gateway API is a fundamental shift in API design.
Gateway API provides a modular, extensible API with strong support for Kubernetes-native RBAC.
Conversely, the Ingress API is simple, and implementations such as Ingress-NGINX extend the API through esoteric annotations, ConfigMaps, and CRDs.
Migrating away from Ingress controllers such as Ingress-NGINX presents the daunting task of capturing all the nuances of the Ingress controller,
and mapping that behavior to Gateway API.
-->
随着 Ingress-NGINX 计划于 2026 年 3 月正式退役，Kubernetes 网络图景正处于一个转折点。
对于大多数组织而言，问题不在于是否迁移到 Gateway API，而在于如何安全地完成迁移。

从 Ingress 迁移到 Gateway API 是 API 设计的根本性转变。
Gateway API 提供了一个模块化、可扩展的 API，并对 Kubernetes 原生的基于角色的访问控制（RBAC）提供了强大的支持。
相反，Ingress API 较为简单，而像 Ingress-NGINX 这样的实现则通过晦涩难懂的注解、ConfigMap 和 CRD 来扩展 API。
从 Ingress-NGINX 等 Ingress 控制器迁移过来，面临着一项艰巨的任务：
捕捉 Ingress 控制器的所有细微差别，并将这种行为映射到 Gateway API。

<!--
Ingress2Gateway is an assistant that helps teams confidently move from Ingress to Gateway API.
It translates Ingress resources/manifests along with implementation-specific annotations to Gateway API while warning you about untranslatable configuration and offering suggestions.

Today, SIG Network is proud to announce the **1.0 release of Ingress2Gateway**.
This milestone represents a stable, tested migration assistant for teams ready to modernize their networking stack.
-->
Ingress2Gateway 是一款辅助工具，旨在帮助团队自信地从 Ingress API 迁移到 Gateway API。
它会将 Ingress 资源/清单以及特定于实现的注解转换为 Gateway API，并在出现无法转换的配置时发出警告并提供建议。

今天，SIG Network 自豪地宣布 Ingress2Gateway 1.0 版本正式发布。
这一里程碑标志着 Ingress2Gateway 正式上线，它是一款稳定且经过测试的迁移辅助工具，能够帮助团队实现网络架构的现代化。

<!--
## Ingress2Gateway 1.0

### Ingress-NGINX annotation support

The main improvement for the 1.0 release is more comprehensive Ingress-NGINX support.
Before the 1.0 release, Ingress2Gateway only supported three Ingress-NGINX annotations.
For the 1.0 release, Ingress2Gateway supports over 30 common annotations (CORS, backend TLS, regex matching, path rewrite, etc.).
-->
## Ingress2Gateway 1.0

### Ingress-NGINX 注解支持

1.0 版本的主要改进在于更全面的 Ingress-NGINX 支持。
在 1.0 版本之前，Ingress2Gateway 仅支持三种 Ingress-NGINX 注解。
在 1.0 版本中，Ingress2Gateway 支持超过 30 种常用注解（CORS、后端 TLS、正则表达式匹配、路径重写等）。

<!--
### Comprehensive integration testing

Each supported Ingress-NGINX annotation, and representative combinations of common annotations, is backed by controller-level integration tests that verify the behavioral equivalence of the Ingress-NGINX configuration and the generated Gateway API.
These tests exercise real controllers in live clusters and compare runtime behavior (routing, redirects, rewrites, etc.), not just YAML structure.
-->
### 全面的集成测试

每个受支持的 Ingress-NGINX 注解以及常用注解的典型组合，都由控制器级别的集成测试提供支持，
以验证 Ingress-NGINX 配置与生成的 Gateway API 的行为等效性。

这些测试在实际集群中运行，并比较运行时行为（路由、重定向、重写等），而不仅仅是 YAML 结构。

<!--
The tests:

* spin up an Ingress-NGINX controller
* spin up multiple Gateway API controllers
* apply Ingress resources that have implementation-specific configuration
* translate Ingress resources to Gateway API with `ingress2gateway` and apply generated manifests
* verify that the Gateway API controllers and the Ingress controller exhibit equivalent behavior.

A comprehensive test suite not only catches bugs in development, but also ensures the correctness of the translation, especially given [surprising edge cases and unexpected defaults](/blog/2026/ingress-nginx-before-you-migrate),
so that you don't find out about them in production.
-->
测试内容：

* 启动一个 Ingress-NGINX 控制器
* 启动多个 Gateway API 控制器
* 应用具有特定于实现的配置的 Ingress 资源
* 使用 `ingress2gateway` 将 Ingress 资源转换为 Gateway API，并应用生成的清单
* 验证 Gateway API 控制器和 Ingress 控制器是否表现出相同的行为。

一套全面的测试套件不仅可以捕获开发中的错误，还可以确保转换的正确性，
尤其是在考虑到[意想不到的极端情况和意外的默认值](/blog/2026/ingress-nginx-before-you-migrate)的情况下，
从而避免在生产环境中发现这些问题。

<!--
### Notification & error handling

Migration is not a "one-click" affair.
Surfacing subtleties and untranslatable behavior is as important as translating supported configuration.
The 1.0 release cleans up the formatting and content of notifications, so it is clear what is missing and how you can fix it.
-->
### 通知与错误处理

迁移并非“一键式”操作。
揭示细微差别和难以翻译的行为与翻译受支持的配置同样重要。
1.0 版本优化了通知的格式和内容，让你清楚地了解缺失的内容以及如何修复。

<!--
## Using Ingress2Gateway

Ingress2Gateway is a migration assistant, not a one-shot replacement.
Its goal is to

* migrate supported Ingress configuration and behavior
* identify unsupported configuration and suggest alternatives
* reevaluate and potentially discard undesirable configuration

The rest of the section shows you how to safely migrate the following Ingress-NGINX configuration
-->
## 使用 Ingress2Gateway

Ingress2Gateway 是一个迁移助手，而非一劳永逸的替代方案。

它的目标是：

* 迁移受支持的 Ingress 配置和行为
* 识别不受支持的配置并提供替代方案
* 重新评估并可能舍弃不理想的配置

本节的其余部分将向你展示如何安全地迁移以下 Ingress-NGINX 配置。

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "1G"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "1"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "1"
    nginx.ingress.kubernetes.io/enable-cors: "true"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "Request-Id: $req_id";
  name: my-ingress
  namespace: my-ns
spec:
  ingressClassName: nginx
  rules:
    - host: my-host.example.com
      http:
        paths:
          - backend:
              service:
                name: website-service
                port:
                  number: 80
            path: /users/(\d+)
            pathType: ImplementationSpecific
  tls:
    - hosts:
        - my-host.example.com
      secretName: my-secret
```

<!--
### 1. Install Ingress2Gateway

If you have a Go environment set up, you can install Ingress2Gateway with
-->
### 1. 安装 Ingress Gateway

如果你已设置好 Go 环境，则可以使用以下命令安装 Ingress Gateway：

```bash
go install github.com/kubernetes-sigs/ingress2gateway@v1.0.0
```

<!--
Otherwise,
-->
否则，

```bash
brew install ingress2gateway
```

<!--
You can also download the binary from [GitHub](https://github.com/kubernetes-sigs/ingress2gateway/releases/tag/v1.0.0) or [build from source](https://github.com/kubernetes-sigs/ingress2gateway/).

### 2. Run Ingress2Gateway

You can pass Ingress2Gateway Ingress manifests, or have the tool read directly from your cluster.
-->
你还可以从 [GitHub](https://github.com/kubernetes-sigs/ingress2gateway/releases/tag/v1.0.0)
下载二进制文件，或者[从源代码构建](https://github.com/kubernetes-sigs/ingress2gateway/)。

### 2. 运行 Ingress2Gateway

你可以传递 Ingress2Gateway 的 Ingress 清单，或者让该工具直接从你的集群读取清单。

<!--
```bash
# Pass it files
ingress2gateway print --input-file my-manifest.yaml,my-other-manifest.yaml --providers=ingress-nginx > gwapi.yaml
# Use a namespace in your cluster
ingress2gateway print --namespace my-api --providers=ingress-nginx > gwapi.yaml
# Or your whole cluster
ingress2gateway print --providers=ingress-nginx --all-namespaces > gwapi.yaml
```
-->
```bash
# 传递文件
ingress2gateway print --input-file my-manifest.yaml,my-other-manifest.yaml --providers=ingress-nginx > gwapi.yaml

# 使用集群中的命名空间
ingress2gateway print --namespace my-api --providers=ingress-nginx > gwapi.yaml

# 或者使用整个集群
ingress2gateway print --providers=ingress-nginx --all-namespaces > gwapi.yaml

```

{{< note >}}
<!--
You can also pass `--emitter <agentgateway|envoy-gateway|kgateway>` to output implementation-specific extensions.
-->
你还可以传递 `--emitter <agentgateway|envoy-gateway|kgateway>`
来输出特定于实现的扩展。
{{< /note >}}


<!--
### 3. Review the output

This is the most critical step.
The commands from the previous section output a Gateway API manifest to `gwapi.yaml`, and they also emit warnings that explain what did not translate exactly and what to review manually.
-->
### 3. 检查输出

这是最关键的一步。

上一节中的命令会将 Gateway API 清单输出到 `gwapi.yaml` 文件，
同时还会发出警告，说明哪些内容翻译不准确以及需要手动检查哪些内容。


```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: nginx
  namespace: my-ns
spec:
  gatewayClassName: nginx
  listeners:
  - hostname: my-host.example.com
    name: my-host-example-com-http
    port: 80
    protocol: HTTP
  - hostname: my-host.example.com
    name: my-host-example-com-https
    port: 443
    protocol: HTTPS
    tls:
      certificateRefs:
      - group: ""
        kind: Secret
        name: my-secret
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: my-ingress-my-host-example-com
  namespace: my-ns
spec:
  hostnames:
  - my-host.example.com
  parentRefs:
  - name: nginx
    port: 443
  rules:
  - backendRefs:
    - name: website-service
      port: 80
    filters:
    - cors:
        allowCredentials: true
        allowHeaders:
        - DNT
        - Keep-Alive
        - User-Agent
        - X-Requested-With
        - If-Modified-Since
        - Cache-Control
        - Content-Type
        - Range
        - Authorization
        allowMethods:
        - GET
        - PUT
        - POST
        - DELETE
        - PATCH
        - OPTIONS
        allowOrigins:
        - '*'
        maxAge: 1728000
      type: CORS
    matches:
    - path:
        type: RegularExpression
        value: (?i)/users/(\d+).*
    name: rule-0
    timeouts:
      request: 10s
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: my-ingress-my-host-example-com-ssl-redirect
  namespace: my-ns
spec:
  hostnames:
  - my-host.example.com
  parentRefs:
  - name: nginx
    port: 80
  rules:
  - filters:
    - requestRedirect:
        scheme: https
        statusCode: 308
      type: RequestRedirect
```

<!--
Ingress2Gateway successfully translated some annotations into their Gateway API equivalents.
For example, the `nginx.ingress.kubernetes.io/enable-cors` annotation was translated into a CORS filter.
But upon closer inspection, the `nginx.ingress.kubernetes.io/proxy-{read,send}-timeout` and `nginx.ingress.kubernetes.io/proxy-body-size` annotations do not map perfectly.
The logs show the reason for these omissions as well as reasoning behind the translation.
-->
Ingress2Gateway 已成功将部分注解转换为对应的 Gateway API。
例如，`nginx.ingress.kubernetes.io/enable-cors` 注解被转换为 CORS 过滤器。
但仔细检查后发现，`nginx.ingress.kubernetes.io/proxy-{read,send}-timeout`
和 `nginx.ingress.kubernetes.io/proxy-body-size` 注解并未完全映射。
日志显示了这些缺失的原因以及转换背后的逻辑。


```
┌─ WARN  ────────────────────────────────────────
│  Unsupported annotation nginx.ingress.kubernetes.io/configuration-snippet
│  source: INGRESS-NGINX
│  object: Ingress: my-ns/my-ingress
└─
┌─ INFO  ────────────────────────────────────────
│  Using case-insensitive regex path matches. You may want to change this.
│  source: INGRESS-NGINX
│  object: HTTPRoute: my-ns/my-ingress-my-host-example-com
└─
┌─ WARN  ────────────────────────────────────────
│  ingress-nginx only supports TCP-level timeouts; i2gw has made a best-effort translation to Gateway API timeouts.request. Please verify that this meets your needs. See documentation: https://gateway-api.sigs.k8s.io/guides/http-timeouts/
│  source: INGRESS-NGINX
│  object: HTTPRoute: my-ns/my-ingress-my-host-example-com
└─
┌─ WARN  ────────────────────────────────────────
│  Failed to apply my-ns.my-ingress.metadata.annotations."nginx.ingress.kubernetes.io/proxy-body-size" from my-ns/my-ingress: Most Gateway API implementations have reasonable body size and buffering defaults
│  source: STANDARD_EMITTER
│  object: HTTPRoute: my-ns/my-ingress-my-host-example-com
└─
┌─ WARN  ────────────────────────────────────────
│  Gateway API does not support configuring URL normalization (RFC 3986, Section 6). Please check if this matters for your use case and consult implementation-specific details.
│  source: STANDARD_EMITTER
└─
```

<!--
There is a warning that Ingress2Gateway does not support the `nginx.ingress.kubernetes.io/configuration-snippet` annotation.
You will have to check your Gateway API implementation documentation to see if there is a way to achieve equivalent behavior.

The tool also notified us that Ingress-NGINX regex matches are case-insensitive prefix matches, which is why there is a match pattern of `(?i)/users/(\d+).*`.
Most organizations will want to change this behavior to be an exact case-sensitive match by removing the leading `(?i)` and the trailing `.*` from the path pattern.
-->
警告信息显示，Ingress2Gateway 不支持 `nginx.ingress.kubernetes.io/configuration-snippet` 注解。
你需要查看 Gateway API 的实现文档，了解是否有其他方法可以实现相同的功能。

该工具还提示我们，Ingress-NGINX 的正则表达式匹配是不区分大小写的前缀匹配，因此匹配模式为 `(?i)/users/(\d+).*`。
大多数组织希望通过移除路径模式开头的 `(?i)` 和结尾的 `.*` 来将其更改为区分大小写的精确匹配。

<!--
Ingress2Gateway made a best-effort translation from the `nginx.ingress.kubernetes.io/proxy-{send,read}-timeout` annotations to a 10 second [request timeout](https://gateway-api.sigs.k8s.io/guides/http-timeouts/) in our HTTP route.
If requests for this service should be much shorter, say 3 seconds, you can make the corresponding changes to your Gateway API manifests.

Also, `nginx.ingress.kubernetes.io/proxy-body-size` does not have a Gateway API equivalent, and was thus not translated.
However, most Gateway API implementations have reasonable defaults for maximum body size and buffering, so this might not be a problem in practice.
Further, some emitters might offer support for this annotation through implementation-specific extensions.
For example, adding the `--emitter agentgateway`, `--emitter envoy-gateway`, or `--emitter kgateway` flag to the previous `ingress2gateway print` command would have resulted in additional implementation-specific configuration in the generated Gateway API manifests that attempted to capture the body size configuration.
-->
Ingress2Gateway 已尽力将 `nginx.ingress.kubernetes.io/proxy-{send,read}-timeout`
注解转换为 HTTP 路由中的 10 秒请求超时（https://gateway-api.sigs.k8s.io/guides/http-timeouts/）。
如果此服务的请求超时时间需要更短，例如 3 秒，你可以相应地修改 Gateway API 清单。

此外，`nginx.ingress.kubernetes.io/proxy-body-size` 在 Gateway API 中没有对应的注解，因此未进行转换。
但是，大多数 Gateway API 实现都为最大请求体大小和缓冲设置了合理的默认值，因此这在实践中可能不会造成问题。
此外，一些消息发送器可能会通过特定于实现的扩展来支持此注解。
例如，在之前的 `ingress2gateway print` 命令中添加
`--emitter agentgateway`、`--emitter envoy-gateway` 或 `--emitter kgateway`
标志，会在生成的 Gateway API 清单中添加额外的特定于实现的配置，以尝试捕获请求体大小配置。

<!--
We also see a warning about URL normalization.
Gateway API implementations such as Agentgateway, Envoy Gateway, Kgateway, and Istio have some level of URL normalization, but the behavior varies across implementations and is not configurable through standard Gateway API.
You should check and test the URL normalization behavior of your Gateway API implementation to ensure it is compatible with your use case.

To match Ingress-NGINX default behavior, Ingress2Gateway also added a listener on port 80 and a [HTTP Request redirect filter](https://gateway-api.sigs.k8s.io/reference/spec/#httprequestredirectfilter) to redirect HTTP traffic to HTTPS.
You may not want to serve HTTP traffic at all and remove the listener on port 80 and the corresponding HTTPRoute.
-->
我们还看到了关于 URL 规范化的警告。
诸如 Agentgateway、Envoy Gateway、Kgateway 和 Istio 等网关 API
实现都具有一定程度的 URL 规范化功能，但不同实现的行为各不相同，且无法通过标准网关 API 进行配置。
你应该检查并测试你的网关 API 实现的 URL 规范化行为，以确保其与你的使用场景兼容。

为了与 Ingress-NGINX 的默认行为保持一致，Ingress2Gateway 还在 80 端口上添加了一个监听器和一个
[HTTP 请求重定向过滤器](https://gateway-api.sigs.k8s.io/reference/spec/#httprequestredirectfilter)，
用于将 HTTP 流量重定向到 HTTPS。
你可能根本不需要处理 HTTP 流量，因此可以移除 80 端口上的监听器和相应的 HTTPRoute。

{{< caution >}}
<!--
Always thoroughly review the generated output and logs.
-->
务必仔细检查生成的输出和日志。
{{< /caution >}}

<!--
After manually applying these changes, the Gateway API manifests might look as follows.
-->
手动应用这些更改后，网关 API 清单可能如下所示。

```yaml
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: nginx
  namespace: my-ns
spec:
  gatewayClassName: nginx
  listeners:
  - hostname: my-host.example.com
    name: my-host-example-com-https
    port: 443
    protocol: HTTPS
    tls:
      certificateRefs:
      - group: ""
        kind: Secret
        name: my-secret
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: my-ingress-my-host-example-com
  namespace: my-ns
spec:
  hostnames:
  - my-host.example.com
  parentRefs:
  - name: nginx
    port: 443
  rules:
  - backendRefs:
    - name: website-service
      port: 80
    filters:
    - cors:
        allowCredentials: true
        allowHeaders:
        - DNT
        ...
        allowMethods:
        - GET
        ...
        allowOrigins:
        - '*'
        maxAge: 1728000
      type: CORS
    matches:
    - path:
        type: RegularExpression
        value: /users/(\d+)
    name: rule-0
    timeouts:
      request: 3s
```

<!--
### 4. Verify

Now that you have Gateway API manifests, you should thoroughly test them in a development cluster.
In this case, you should at least double-check that your Gateway API implementation's maximum body size defaults are appropriate for you and verify that a three-second timeout is enough.
-->
### 4. 验证

现在你已经拥有了 Gateway API 清单文件，应该在开发集群中对其进行全面测试。
在这种情况下，你至少应该仔细检查 Gateway API
实现的最大请求体大小默认值是否符合你的需求，并验证三秒超时是否足够。

<!--
After validating behavior in a development cluster, deploy your Gateway API configuration alongside your existing Ingress.
We strongly suggest that you then gradually shift traffic using weighted DNS, your cloud load balancer, or traffic-splitting features of your platform.
This way, you can quickly recover from any misconfiguration that made it through your tests.

Finally, when you have shifted all your traffic to your Gateway API controller, delete your Ingress resources and uninstall your Ingress controller.
-->
在开发集群中验证行为后，将你的 Gateway API 配置部署到现有 Ingress 旁边。
我们强烈建议你使用加权 DNS、云负载均衡器或平台流量拆分功能逐步转移流量。
这样，你可以快速从测试中遗留的任何配置错误中恢复。

最后，当你将所有流量转移到 Gateway API 控制器后，请删除 Ingress 资源并卸载 Ingress 控制器。

<!--
## Conclusion

The Ingress2Gateway 1.0 release is just the beginning, and we hope that you use Ingress2Gateway to safely migrate to Gateway API.
As we approach the March 2026 Ingress-NGINX retirement, we invite the community to help us increase our configuration coverage, expand testing, and improve UX.
-->
## 总结

Ingress2Gateway 1.0 的发布仅仅是个开始，我们希望你能使用
Ingress2Gateway 安全地迁移到 Gateway API。
随着 Ingress-NGINX 将于 2026 年 3 月停止服务，
我们诚邀社区成员帮助我们提升配置覆盖率、扩展测试范围并改进用户体验。

<!--
## Resources about Gateway API

The scope of Gateway API can be daunting.
Here are some resources to help you work with Gateway API:

* [Listener sets](https://gateway-api.sigs.k8s.io/geps/gep-1713/?h=listenersets) allow application developers to manage gateway listeners.
* [`gwctl`](https://github.com/kubernetes-sigs/gwctl) gives you a comprehensive view of your Gateway resources, such as attachments and linter errors.
* Gateway API Slack: `#sig-network-gateway-api` on [Kubernetes Slack](https://kubernetes.slack.com)
* Ingress2Gateway Slack: `#sig-network-ingress2gateway` on [Kubernetes Slack](https://kubernetes.slack.com)
* GitHub: [kubernetes-sigs/ingress2gateway](https://github.com/kubernetes-sigs/ingress2gateway)
-->
## Gateway API 相关资源

Gateway API 的功能非常强大，可能会让你感到不知所措。
以下是一些可以帮助你使用 Gateway API 的资源：

* [监听器集](https://gateway-api.sigs.k8s.io/geps/gep-1713/?h=listenersets) 允许应用程序开发人员管理 Gateway 监听器。
* [`gwctl`](https://github.com/kubernetes-sigs/gwctl) 为你提供 Gateway 资源的全面视图，例如附件和代码检查错误。
* Gateway API Slack：Kubernetes Slack 频道上的 `#sig-network-gateway-api` 讨论区（https://kubernetes.slack.com）
* Ingress2Gateway Slack：Kubernetes Slack 频道上的 `#sig-network-ingress2gateway` 讨论区（https://kubernetes.slack.com）
* GitHub：[kubernetes-sigs/ingress2gateway](https://github.com/kubernetes-sigs/ingress2gateway)
