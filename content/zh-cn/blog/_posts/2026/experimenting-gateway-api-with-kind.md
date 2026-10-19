---
layout: blog
title: "使用 kind 体验 Gateway API"
date: 2026-01-28
slug: experimenting-gateway-api-with-kind
evergreen: true
author: >
  [Ricardo Katz](https://github.com/rikatz) (Red Hat)
translator: >
  [Xin Li](https://github.com/my-git9)
---
<!--
layout: blog
title: "Experimenting with Gateway API using kind"
date: 2026-01-28
slug: experimenting-gateway-api-with-kind
evergreen: true
author: >
  [Ricardo Katz](https://github.com/rikatz) (Red Hat)
-->

<!--
This document will guide you through setting up a local experimental environment with [Gateway API](https://gateway-api.sigs.k8s.io/) on [kind](https://kind.sigs.k8s.io/). This setup is designed for learning and testing. It helps you understand Gateway API concepts without production complexity.
-->
本文档将指导你在 [kind](https://kind.sigs.k8s.io/) 上设置一个使用
[Gateway API](https://gateway-api.sigs.k8s.io/) 的本地实验环境。
此设置专为学习和测试而设计，可帮助你在没有生产环境复杂性的情况下理解 Gateway API 概念。

{{< caution >}}
<!--
This is an experimentation learning setup, and should not be used for production. The components used on this document are not suited for production usage.
Once you're ready to deploy Gateway API in a production environment, 
select an [implementation](https://gateway-api.sigs.k8s.io/implementations/) that suits your needs.
-->
这是一个实验性学习设置，不应用于生产环境。本文档中使用的组件不适合生产使用。
当你准备在生产环境中部署 Gateway API 时，
请选择适合你需求的[实现](https://gateway-api.sigs.k8s.io/implementations/)。
{{< /caution >}}

<!--
## Overview
-->
## 概述

<!--
In this guide, you will:
- Set up a local Kubernetes cluster using kind (Kubernetes in Docker)
- Deploy [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind), which provides both LoadBalancer Services and a Gateway API controller
- Create a Gateway and HTTPRoute to route traffic to a demo application
- Test your Gateway API configuration locally
-->
在本指南中，你将：
- 使用 kind（Kubernetes in Docker）设置本地 Kubernetes 集群
- 部署 [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind)，
  它提供 LoadBalancer Service 和 Gateway API 控制器
- 创建 Gateway 和 HTTPRoute 以将流量路由到演示应用
- 在本地测试你的 Gateway API 配置

<!--
This setup is ideal for learning, development, and experimentation with Gateway API concepts.
-->
此设置非常适合学习、开发和体验 Gateway API 概念。

<!--
## Prerequisites
-->
## 前提条件

<!--
Before you begin, ensure you have the following installed on your local machine:
-->
在开始之前，请确保你的本地机器上安装了以下工具：

<!--
- **[Docker](https://docs.docker.com/get-docker/)** - Required to run kind and cloud-provider-kind
- **[kubectl](https://kubernetes.io/docs/tasks/tools/)** - The Kubernetes command-line tool
- **[kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)** - Kubernetes in Docker
- **[curl](https://curl.se/)** - Required to test the routes
-->
- **[Docker](https://docs.docker.com/get-docker/)** - 运行 kind 和 cloud-provider-kind 所需
- **[kubectl](https://kubernetes.io/docs/tasks/tools/)** - Kubernetes 命令行工具
- **[kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)** - Kubernetes in Docker
- **[curl](https://curl.se/)** - 测试路由所需

<!--
### Create a kind cluster
-->
### 创建 kind 集群

<!--
Create a new kind cluster by running:
-->
运行以下命令创建一个新的 kind 集群：

```shell
kind create cluster
```

<!--
This will create a single-node Kubernetes cluster running in a Docker container.
-->
这将创建一个在 Docker 容器中运行的单节点 Kubernetes 集群。

<!--
### Install cloud-provider-kind
-->
### 安装 cloud-provider-kind

<!--
Next, you need [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind/), which provides two key components for this setup:
- A LoadBalancer controller that assigns addresses to LoadBalancer-type Services
- A Gateway API controller that implements the Gateway API specification

It also automatically installs the Gateway API Custom Resource Definitions (CRDs) in your cluster.
-->
接下来，你需要 [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind/)，
它为此设置提供两个关键组件：
- 为 LoadBalancer 类型的 Service 分配地址的 LoadBalancer 控制器
- 实现 Gateway API 规范的 Gateway API 控制器

它还会自动在你的集群中安装 Gateway API 的自定义资源定义（CRD）。

<!--
Run cloud-provider-kind as a Docker container on the same host where you created the kind cluster:
-->
在创建 kind 集群的同一主机上，将 cloud-provider-kind 作为 Docker 容器运行：

```shell
VERSION="$(basename $(curl -s -L -o /dev/null -w '%{url_effective}' https://github.com/kubernetes-sigs/cloud-provider-kind/releases/latest))"
docker run -d --name cloud-provider-kind --rm --network host -v /var/run/docker.sock:/var/run/docker.sock registry.k8s.io/cloud-provider-kind/cloud-controller-manager:${VERSION}
```

<!--
**Note:** On some systems, you may need elevated privileges to access the Docker socket.
-->
**注意**：在某些系统上，你可能需要提升权限才能访问 Docker socket。

<!--
Verify that cloud-provider-kind is running:
-->
验证 cloud-provider-kind 是否正在运行：

```shell
docker ps --filter name=cloud-provider-kind
```

<!--
You should see the container listed and in a running state. You can also check the logs:
-->
你应该看到容器已列出并处于运行状态。你也可以检查日志：

```shell
docker logs cloud-provider-kind
```

<!--
## Experimenting with Gateway API
-->
## 体验 Gateway API

<!--
Now that your cluster is set up, you can start experimenting with Gateway API resources.

cloud-provider-kind automatically provisions a GatewayClass called `cloud-provider-kind`. You'll use this class to create your Gateway.

It is worth noticing that while kind is not a cloud provider, the project is named as `cloud-provider-kind` as it provides features that simulate a cloud-enabled environment.
-->
现在你的集群已设置完成，你可以开始体验 Gateway API 资源。

cloud-provider-kind 会自动提供一个名为 `cloud-provider-kind`
的 GatewayClass。你将使用此类来创建你的 Gateway。

值得注意的是，虽然 kind 不是云提供商，但该项目命名为
`cloud-provider-kind`，因为它提供模拟云环境的功能。

<!--
### Deploy a Gateway
-->
### 部署 Gateway

<!--
The following manifest will:
- Create a new namespace called `gateway-infra`
- Deploy a Gateway that listens on port 80
- Accept HTTPRoutes with hostnames matching the `*.exampledomain.example` pattern
- Allow routes from any namespace to attach to the Gateway. 
  **Note**: In real clusters, prefer Same or Selector values on the [`allowedRoutes` namespace selector](https://gateway-api.sigs.k8s.io/reference/spec/#fromnamespaces) field to limit attachments.
-->
以下清单将：
- 创建一个名为 `gateway-infra` 的新命名空间
- 部署一个监听端口 80 的 Gateway
- 接受主机名匹配 `*.exampledomain.example` 模式的 HTTPRoute
- 允许来自任何命名空间的路由附加到 Gateway。
  **注意**：在实际集群中，建议在
  [`allowedRoutes` namespace selector](https://gateway-api.sigs.k8s.io/reference/spec/#fromnamespaces)
  字段上使用 Same 或 Selector 值来限制附加。

<!--
Apply the following manifest:
-->
应用以下清单：

```yaml
---
apiVersion: v1
kind: Namespace
metadata:
  name: gateway-infra
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: gateway
  namespace: gateway-infra
spec:
  gatewayClassName: cloud-provider-kind
  listeners:
  - name: default
    hostname: "*.exampledomain.example"
    port: 80
    protocol: HTTP
    allowedRoutes:
      namespaces:
        from: All
```

<!--
Then verify that your Gateway is properly programmed and has an address assigned:
-->
然后验证你的 Gateway 是否已正确编程并分配了地址：

```shell
kubectl get gateway -n gateway-infra gateway
```

<!--
Expected output:
-->
预期输出：

```
NAME      CLASS                 ADDRESS      PROGRAMMED   AGE
gateway   cloud-provider-kind   172.18.0.3   True         5m6s
```

<!--
The PROGRAMMED column should show True, and the ADDRESS field should contain an IP address.
-->
PROGRAMMED 列应显示 True，ADDRESS 字段应包含 IP 地址。

<!--
### Deploy a demo application
-->
### 部署演示应用

<!--
Next, deploy a simple echo application that will help you test your Gateway configuration. This application:
- Listens on port 3000
- Echoes back request details including path, headers, and environment variables
- Runs in a namespace called `demo`
-->
接下来，部署一个简单的 echo 应用来帮助你测试 Gateway 配置。此应用：
- 监听端口 3000
- 回显请求详情，包括路径、头部和环境变量
- 在名为 `demo` 的命名空间中运行

<!--
Apply the following manifest:
-->
应用以下清单：

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: demo
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: echo
  name: echo
  namespace: demo
spec:
  ports:
  - name: http
    port: 3000
    protocol: TCP
    targetPort: 3000
  selector:
    app.kubernetes.io/name: echo
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: echo
  name: echo
  namespace: demo
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: echo
  template:
    metadata:
      labels:
        app.kubernetes.io/name: echo
    spec:
      containers:
      - env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: metadata.name
        - name: NAMESPACE
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: metadata.namespace
        image: registry.k8s.io/gateway-api/echo-basic:v20251204-v1.4.1
        name: echo-basic
```

<!--
### Create an HTTPRoute
-->
### 创建 HTTPRoute

<!--
Now create an HTTPRoute to route traffic from your Gateway to the echo application.
This HTTPRoute will:
- Respond to requests for the hostname `some.exampledomain.example`
- Route traffic to the echo application
- Attach to the Gateway in the `gateway-infra` namespace
-->
现在创建一个 HTTPRoute，将流量从你的 Gateway 路由到 echo 应用。
此 HTTPRoute 将：
- 响应对主机名 `some.exampledomain.example` 的请求
- 将流量路由到 echo 应用
- 附加到 `gateway-infra` 命名空间中的 Gateway

<!--
Apply the following manifest:
-->
应用以下清单：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: echo
  namespace: demo
spec:
  parentRefs:
  - name: gateway
    namespace: gateway-infra
  hostnames: ["some.exampledomain.example"]
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: echo
      port: 3000
```

<!--
### Test your route
-->
### 测试路由

<!--
The final step is to test your route using curl. You'll make a request to the Gateway's IP address with the hostname `some.exampledomain.example`. The command below is for POSIX shell only, and may need to be adjusted for your environment:
-->
最后一步是使用 curl 测试你的路由。你将使用主机名 `some.exampledomain.example`
向 Gateway 的 IP 地址发出请求。以下命令仅适用于 POSIX shell，
可能需要根据你的环境进行调整：

```shell
GW_ADDR=$(kubectl get gateway -n gateway-infra gateway -o jsonpath='{.status.addresses[0].value}')
curl --resolve some.exampledomain.example:80:${GW_ADDR} http://some.exampledomain.example
```

<!--
You should receive a JSON response similar to this:
-->
你应该收到类似以下的 JSON 响应：

```json
{
 "path": "/",
 "host": "some.exampledomain.example",
 "method": "GET",
 "proto": "HTTP/1.1",
 "headers": {
  "Accept": [
   "*/*"
  ],
  "User-Agent": [
   "curl/8.15.0"
  ]
 },
 "namespace": "demo",
 "ingress": "",
 "service": "",
 "pod": "echo-dc48d7cf8-vs2df"
}
```

<!--
If you see this response, congratulations! Your Gateway API setup is working correctly.
-->
如果你看到此响应，恭喜你！你的 Gateway API 设置工作正常。

<!--
## Troubleshooting
-->
## 故障排除

<!--
If something isn't working as expected, you can troubleshoot by checking the status of your resources.
-->
如果某些内容未按预期工作，你可以通过检查资源状态进行故障排除。

<!--
### Check the Gateway status
-->
### 检查 Gateway 状态

<!--
First, inspect your Gateway resource:
-->
首先，检查你的 Gateway 资源：

```shell
kubectl get gateway -n gateway-infra gateway -o yaml
```

<!--
Look at the `status` section for conditions. Your Gateway should have:
- `Accepted: True` - The Gateway was accepted by the controller
- `Programmed: True` - The Gateway was successfully configured
- `.status.addresses` populated with an IP address
-->
查看 `status` 部分的条件。你的 Gateway 应该有：
- `Accepted: True` - Gateway 已被控制器接受
- `Programmed: True` - Gateway 已成功配置
- `.status.addresses` 填充了 IP 地址

<!--
### Check the HTTPRoute status
-->
### 检查 HTTPRoute 状态

<!--
Next, inspect your HTTPRoute:
-->
接下来，检查你的 HTTPRoute：

```shell
kubectl get httproute -n demo echo -o yaml
```

<!--
Check the `status.parents` section for conditions. Common issues include:

- ResolvedRefs set to False with reason `BackendNotFound`; this means that the backend Service doesn't exist or has the wrong name
- Accepted set to False; this means that the route couldn't attach to the Gateway (check namespace permissions or hostname matching)
-->
检查 `status.parents` 部分的条件。常见问题包括：

- ResolvedRefs 设置为 False，原因是 `BackendNotFound`；这意味着后端 Service 不存在或名称错误
- Accepted 设置为 False；这意味着路由无法附加到 Gateway（检查命名空间权限或主机名匹配）

<!--
Example error when a backend is not found:
-->
后端未找到时的示例错误：

```yaml
status:
  parents:
  - conditions:
    - lastTransitionTime: "2026-01-19T17:13:35Z"
      message: backend not found
      observedGeneration: 2
      reason: BackendNotFound
      status: "False"
      type: ResolvedRefs
    controllerName: kind.sigs.k8s.io/gateway-controller
```

<!--
### Check controller logs
-->
### 检查控制器日志

<!--
If the resource statuses don't reveal the issue, check the cloud-provider-kind logs:
-->
如果资源状态没有揭示问题，请检查 cloud-provider-kind 日志：

```shell
docker logs -f cloud-provider-kind
```

<!--
This will show detailed logs from both the LoadBalancer and Gateway API controllers.
-->
这将显示 LoadBalancer 和 Gateway API 控制器的详细日志。

<!--
## Cleanup
-->
## 清理

<!--
When you're finished with your experiments, you can clean up the resources:
-->
当你完成实验后，可以清理资源：

<!--
### Remove Kubernetes resources
-->
### 删除 Kubernetes 资源

<!--
Delete the namespaces (this will remove all resources within them):
-->
删除命名空间（这将删除其中的所有资源）：

```shell
kubectl delete namespace gateway-infra
kubectl delete namespace demo
```

<!--
### Stop cloud-provider-kind
-->
### 停止 cloud-provider-kind

<!--
Stop and remove the cloud-provider-kind container:
-->
停止并移除 cloud-provider-kind 容器：

```shell
docker stop cloud-provider-kind
```

<!--
Because the container was started with the `--rm` flag, it will be automatically removed when stopped.
-->
由于容器是使用 `--rm` 标志启动的，停止时会自动移除。

<!--
### Delete the kind cluster
-->
### 删除 kind 集群

<!--
Finally, delete the kind cluster:
-->
最后，删除 kind 集群：

```shell
kind delete cluster
```

<!--
## Next steps
-->
## 下一步

<!--
Now that you've experimented with Gateway API locally, you're ready to explore production-ready implementations:

- **Production Deployments**: Review the [Gateway API implementations](https://gateway-api.sigs.k8s.io/implementations/) to find a controller that matches your production requirements
- **Learn More**: Explore the [Gateway API documentation](https://gateway-api.sigs.k8s.io/) to learn about advanced features like TLS, traffic splitting, and header manipulation
- **Advanced Routing**: Experiment with path-based routing, header matching, request mirroring and other features following [Gateway API user guides](https://gateway-api.sigs.k8s.io/guides/getting-started/)
-->
现在你已经在本地体验了 Gateway API，准备好探索生产就绪的实现了：

- **生产部署**：查看 [Gateway API 实现](https://gateway-api.sigs.k8s.io/implementations/)
  以找到符合你生产要求的控制器
- **了解更多**：探索 [Gateway API 文档](https://gateway-api.sigs.k8s.io/)了解
  TLS、流量拆分和头部操作等高级功能
- **高级路由**：按照 [Gateway API 用户指南](https://gateway-api.sigs.k8s.io/guides/getting-started/)
  体验基于路径的路由、头部匹配、请求镜像和其他功能

<!--
### A final word of caution
This _kind_ setup is for development and learning only.
Always use a production-grade Gateway API implementation for real workloads.
-->
### 最后提醒

这个 kind 设置仅用于开发和学习。
对于实际工作负载，请始终使用生产级的 Gateway API 实现。
