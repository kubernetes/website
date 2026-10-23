---
title: 使用金丝雀部署发布版本
content_type: tutorial
weight: 10
card:
  name: tutorials
  weight: 60
  title: "执行金丝雀部署"
---
<!--
title: Deploy a Release Using a Canary Deployment
content_type: tutorial
weight: 10
card:
  name: tutorials
  weight: 60
  title: "Deploy a Canary Deployment"
-->

<!-- overview -->

<!--
This tutorial walks you through deploying a canary release in Kubernetes. A canary deployment allows you to safely test a new application version with a small portion of production traffic before rolling it out completely. This approach helps minimize risk and enables rapid feedback from real users.
-->
本教程引导你在 Kubernetes 中部署金丝雀版本。金丝雀部署让你可以在完全上线之前，
用一小部分生产流量安全地测试新的应用版本。这种方法有助于降低风险，
并能从真实用户那里快速获得反馈。

<!--
For an overview of canary deployments, see [Canary deployments](/docs/concepts/workloads/management/#canary-deployments) in the Managing Workloads concept page.
-->
关于金丝雀部署的概述，
请参阅管理工作负载概念页面中的[金丝雀部署](/zh-cn/docs/concepts/workloads/management/#canary-deployments)。

## {{% heading "objectives" %}}

<!--
* Deploy a stable version of an application
* Deploy a canary version alongside the stable version
* Route traffic to both versions using a Service
* Monitor the canary deployment
* Complete the rollout by scaling the canary and removing the stable version
-->
* 部署应用的稳定版本
* 在稳定版本之外部署金丝雀版本
* 使用 Service 将流量路由到两个版本
* 监控金丝雀部署
* 通过扩大金丝雀的规模并移除稳定版本完成上线

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- lessoncontent -->

<!--
## Understanding canary deployments
-->
## 理解金丝雀部署 {#understanding-canary-deployments}

<!--
A canary deployment is a strategy where you deploy a new version of your application alongside the existing version. The new version (canary) receives a small percentage of traffic, allowing you to:
-->
金丝雀部署是一种策略：在现有版本之外部署应用的新版本。新版本（金丝雀）接收一小部分流量，这样你就可以：

<!--
* Test the new version with real production traffic
* Monitor for errors, performance issues, or unexpected behavior
* Roll back quickly if issues are detected
* Gradually increase traffic to the new version if it performs well
-->
* 用真实的生产流量测试新版本
* 监控错误、性能问题或意外行为
* 一旦发现问题就能快速回滚
* 如果新版本表现良好，逐步增加流向它的流量

<!--
In this tutorial, you'll use the `track` label to differentiate between the stable and canary releases. The stable release uses `track: stable`, and the canary release uses `track: canary`. Both deployments share common labels (`app.kubernetes.io/name: rollout-demo`) that allow the Service to route traffic to both sets of Pods.
-->
在本教程中，你将使用 `track` 标签来区分稳定版本和金丝雀版本。
稳定版本使用 `track: stable`，金丝雀版本使用 `track: canary`。
两个 Deployment 共享公共标签（`app.kubernetes.io/name: rollout-demo`），
这使得 Service 可以将流量路由到这两组 Pod。

<!--
You'll deploy the stable version with 3 replicas and the canary version with 1 replica. Since both versions share the same Service selector (`app.kubernetes.io/name: rollout-demo`), Kubernetes will load-balance traffic across all 4 pods. With this ratio, approximately 25% of traffic goes to the canary and 75% to the stable version.
-->
你将部署带 3 个副本的稳定版本和带 1 个副本的金丝雀版本。
由于两个版本共享同一个 Service 选择算符（`app.kubernetes.io/name: rollout-demo`），
Kubernetes 会在全部 4 个 Pod 之间对流量进行负载均衡。
按此比例，大约 25% 的流量流向金丝雀，75% 流向稳定版本。

<!--
## Deploying the stable version

First, deploy the stable version of your application:
-->
## 部署稳定版本 {#deploying-the-stable-version}

首先，部署应用的稳定版本：

{{% code_sample file="application/canary/app-v1-deployment.yaml" %}}

<!--
Apply the stable Deployment:
-->
应用这个稳定 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-v1-deployment.yaml
```

<!--
Verify that the Deployment was created and the Pods are running:
-->
验证 Deployment 已创建且 Pod 正在运行：

```shell
kubectl get deployments -l app.kubernetes.io/name=rollout-demo
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
rollout-demo-stable    3/3     3            3           10s
```

<!--
Check the Pods:
-->
检查 Pod：

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME                                  READY   STATUS    RESTARTS   AGE
rollout-demo-stable-7d4b9b8c5d-abc12   1/1     Running   0          15s
rollout-demo-stable-7d4b9b8c5d-def34   1/1     Running   0          15s
rollout-demo-stable-7d4b9b8c5d-ghi56   1/1     Running   0          15s
```

<!--
## Creating a service
-->
## 创建 Service {#creating-a-service}

<!--
Create a Service to expose your application. The Service selector uses the common label (`app.kubernetes.io/name: rollout-demo`) and omits the `track` label, which allows it to route traffic to both the stable and canary Pods:
-->
创建一个 Service 来公开你的应用。该 Service 的选择算符使用公共标签
（`app.kubernetes.io/name: rollout-demo`）并省略 `track` 标签，
这样就可以将流量路由到稳定版本和金丝雀版本的 Pod：

{{% code_sample file="application/canary/app-service.yaml" %}}

<!--
Apply the Service:
-->
应用这个 Service：

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-service.yaml
```

<!--
Verify the Service was created:
-->
验证 Service 已创建：

```shell
kubectl get service rollout-demo-service
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
rollout-demo-service   ClusterIP   10.96.123.45    <none>        80/TCP    5s
```

<!--
Test the Service by creating a temporary Pod and making a request:
-->
通过创建一个临时 Pod 并发出请求来测试 Service：

```shell
kubectl run curl-test --image=curlimages/curl:latest --rm -it --restart=Never -- curl http://rollout-demo-service
```

<!--
You should see responses from the stable Pods. Run this command multiple times to see different Pod hostnames, but all responses should show version v1.
-->
你应该会看到来自稳定版本 Pod 的响应。多次运行此命令可以看到不同的 Pod 主机名，
但所有响应都应显示版本 v1。

<!--
At this point, your application is in a steady state. In a real-world scenario, you would typically pause here and operate the stable version until you have a new version to deploy. The next steps demonstrate how to introduce a canary version.
-->
此时，你的应用处于稳定状态。在真实场景中，你通常会在这里停下来，
运行稳定版本，直到有新的版本需要部署。接下来的步骤演示如何引入金丝雀版本。

<!--
## Deploying the canary version
-->
## 部署金丝雀版本 {#deploying-the-canary-version}

<!--
To create a canary Deployment, you can copy the stable Deployment manifest and make a few changes:
-->
要创建金丝雀 Deployment，你可以复制稳定 Deployment 的清单并做几处修改：

<!--
- Change the `metadata.name` (for example, to `rollout-demo-canary`)
- Change the `track` label from `stable` to `canary` in both `metadata.labels` and `spec.selector.matchLabels`/`spec.template.metadata.labels`
- Set a lower number of replicas (for example, 1)
- Update the container image to the new version
-->
- 修改 `metadata.name`（例如改为 `rollout-demo-canary`）
- 在 `metadata.labels` 和 `spec.selector.matchLabels`/`spec.template.metadata.labels`
  中把 `track` 标签从 `stable` 改为 `canary`
- 设置较少的副本数（例如 1）
- 把容器镜像更新为新版本

<!--
The updated manifest should look like:
-->
更新后的清单应类似于：

{{% code_sample file="application/canary/app-v2-deployment.yaml" %}}

<!--
You can use `kubectl` to apply your local manifest, or if you prefer you can use this checked example:
-->
你可以使用 `kubectl` 应用本地的清单，或者如果你愿意，也可以使用下面这个经过校验的示例：

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-v2-deployment.yaml
```

<!--
Verify both Deployments are running:
-->
验证两个 Deployment 都在运行：

```shell
kubectl get deployments -l app.kubernetes.io/name=rollout-demo
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
rollout-demo-stable    3/3     3            3           2m
rollout-demo-canary    1/1     1            1           10s
```

<!--
Check all Pods:
-->
检查所有 Pod：

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo -o wide
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME                                  READY   STATUS    RESTARTS   AGE   IP           NODE
rollout-demo-stable-7d4b9b8c5d-abc12   1/1     Running   0          2m    10.244.1.5   node1
rollout-demo-stable-7d4b9b8c5d-def34   1/1     Running   0          2m    10.244.1.6   node1
rollout-demo-stable-7d4b9b8c5d-ghi56   1/1     Running   0          2m    10.244.2.7   node2
rollout-demo-canary-8e5c0d9f6a-xyz78   1/1     Running   0          15s   10.244.2.8   node2
```

<!--
Notice that you now have 4 Pods total: 3 stable Pods and 1 canary Pod.

## Testing traffic distribution
-->
注意现在你一共有 4 个 Pod：3 个稳定版本 Pod 和 1 个金丝雀 Pod。

## 测试流量分布 {#testing-traffic-distribution}

<!--
Since both Deployments use the same Service selector (`app.kubernetes.io/name: rollout-demo`), the Service routes traffic to all Pods. With 3 stable Pods and 1 canary Pod, approximately 25% of requests go to the canary.
-->
由于两个 Deployment 使用相同的 Service 选择算符（`app.kubernetes.io/name: rollout-demo`），
Service 会将流量路由到所有 Pod。在 3 个稳定版本 Pod 和 1 个金丝雀 Pod 的情况下，
大约 25% 的请求会流向金丝雀。

<!--
Test the Service multiple times to see traffic distribution:
-->
多次测试该 Service 以查看流量分布：

```shell
kubectl run curl-test --image=docker.io/library/curlimages/curl:latest --rm -it --restart=Never -- \
  sh -c 'for i in $(seq 1 10); do curl -s http://rollout-demo-service; echo; done'
```

<!--
You should see responses from both stable and canary versions. The ratio may vary, but you should see some canary responses mixed with stable responses.
-->
你应该会看到来自稳定版本和金丝雀版本的响应。比例可能有所不同，
但你应该会看到一些金丝雀响应混杂在稳定版本响应中。

<!--
Check the Service EndpointSlices to verify both versions are receiving traffic:
-->
检查 Service 的 EndpointSlice，验证两个版本都在接收流量：

```shell
kubectl get endpointslices -l kubernetes.io/service-name=rollout-demo-service
```

<!--
The output is similar to (one EndpointSlice per address family; the ENDPOINTS column is truncated by default):
-->
输出类似于（每个地址族一个 EndpointSlice；ENDPOINTS 列默认被截断）：

```
NAME                          ADDRESSTYPE   PORTS   ENDPOINTS                              AGE
rollout-demo-service-abc12    IPv4          8080    10.244.1.5,10.244.1.6,10.244.2.7 + 1 more...   3m
```

<!--
To see all endpoint addresses, use `-o yaml`.
-->
要查看所有端点地址，请使用 `-o yaml`。

<!--
## Monitoring the canary deployment
-->
## 监控金丝雀部署 {#monitoring-the-canary-deployment}

<!--
Monitor your canary deployment for errors, performance issues, or unexpected behavior:
-->
监控金丝雀部署是否有错误、性能问题或意外行为：

<!--
Check Pod logs for the canary:
-->
查看金丝雀的 Pod 日志：

```shell
kubectl logs -l app.kubernetes.io/name=rollout-demo,track=canary --tail=50
```

<!--
Monitor Pod status:
-->
监控 Pod 状态：

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo -w
```

<!--
Press Ctrl+C to stop watching.

Check resource usage:
-->
按 Ctrl+C 停止监视。

检查资源用量：

```shell
kubectl top pods -l app.kubernetes.io/name=rollout-demo
```

{{< note >}}
<!--
The `kubectl top` command requires the [metrics-server](https://github.com/kubernetes-sigs/metrics-server) to be installed in your cluster. If it's not available, you can monitor using other methods like Prometheus or cloud provider monitoring tools.
-->
`kubectl top` 命令要求在集群中安装
[metrics-server](https://github.com/kubernetes-sigs/metrics-server)。
如果没有该组件，你可以使用 Prometheus 或云服务商监控工具等其他方法进行监控。
{{< /note >}}

<!--
## Adjusting traffic distribution

If the canary is performing well, you can gradually increase traffic to it by scaling it up:

Scale the canary to 2 replicas (now 40% of traffic):
-->
## 调整流量分布 {#adjusting-traffic-distribution}

如果金丝雀表现良好，你可以通过扩容来逐步增加流向它的流量：

将金丝雀扩容到 2 个副本（此时占 40% 的流量）：

```shell
kubectl scale deployment/rollout-demo-canary --replicas=2
```

<!--
Verify the new Pod is running:
-->
验证新 Pod 正在运行：

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo
```

<!--
Continue monitoring. If everything looks good, you can scale the canary further and scale down the stable version.
-->
继续监控。如果一切正常，你可以进一步扩大金丝雀并缩小稳定版本。

<!--
## Completing the rollout

If your monitoring instead uncovered issues with the canary, you would roll back instead.
To practice for a problem scenario, you could skip ahead to [Rolling back a canary deployment](#rolling-back-a-canary-deployment).
-->
## 完成上线 {#completing-the-rollout}

如果你的监控反而发现了金丝雀的问题，那么你会改为回滚。
要演练问题场景，你可以跳到[回滚金丝雀部署](#rolling-back-a-canary-deployment)。

<!--
To complete the rollout with a single Deployment, first scale the stable Deployment back up so you do not lose capacity if the new image fails to pull. Then update the image and the `VERSION` environment variable to match the new version, wait for the rollout to complete, and remove the canary Deployment:
-->
要用单个 Deployment 完成上线，首先把稳定 Deployment 扩容回来，
这样即使新镜像拉取失败也不会损失容量。然后更新镜像和 `VERSION` 环境变量以匹配新版本，
等待上线完成，再移除金丝雀 Deployment：

<!--
```shell
kubectl scale deployment/rollout-demo-stable --replicas=3

# Outside of this tutorial, you wouldn't set the
# environment variable $VERSION.
# However, your new application code might need
# other configuration changes after an upgrade.
kubectl set image deployment/rollout-demo-stable rollout-demo=gcr.io/google-samples/hello-app:2.0
kubectl set env deployment/rollout-demo-stable VERSION=v2

# Wait for the rollout to complete
kubectl rollout status deployment/rollout-demo-stable

kubectl delete deployment rollout-demo-canary
```
-->
```shell
kubectl scale deployment/rollout-demo-stable --replicas=3

# 在本教程之外，你不会设置
# 环境变量 $VERSION。
# 但升级之后，你的新应用代码可能
# 还需要其他配置变更。
kubectl set image deployment/rollout-demo-stable rollout-demo=gcr.io/google-samples/hello-app:2.0
kubectl set env deployment/rollout-demo-stable VERSION=v2

# 等待上线完成
kubectl rollout status deployment/rollout-demo-stable

kubectl delete deployment rollout-demo-canary
```

<!--
Because this has succeeded, you're now ready to move on to the [cleanup](#cleaning-up)
section. No need to follow the immediate next section about rolling back.
-->
由于这一步已经成功，你现在可以继续前往[清理](#cleaning-up)一节。
不需要看紧接着的关于回滚的一节。

<!--
Alternatively, you can read the rest of the page before you start cleaning up -
there's a few more topics to cover.
-->
或者，你也可以在开始清理之前读完本页其余内容 —— 还有几个主题要介绍。

<!--
## Rolling back a canary deployment

If you detect issues with the canary version, you can quickly roll back:

Scale down the canary deployment:
-->
## 回滚金丝雀部署 {#rolling-back-a-canary-deployment}

如果你发现金丝雀版本有问题，可以快速回滚：

缩容金丝雀 Deployment：

```shell
kubectl scale deployment/rollout-demo-canary --replicas=0
```

<!--
Scaling to zero preserves the canary Deployment so you can inspect its configuration while you investigate. Once you've finished, delete it with `kubectl delete deployment rollout-demo-canary`.

Scale the stable version back up if needed:
-->
缩容到 0 会保留金丝雀 Deployment，以便你在调查时检查其配置。
调查完成后，可用 `kubectl delete deployment rollout-demo-canary` 删除它。

如果需要，把稳定版本扩容回来：

```shell
kubectl scale deployment/rollout-demo-stable --replicas=3
```

<!--
Investigate the issues with the canary before attempting another canary deployment.
-->
在下一次金丝雀部署之前，先调查清楚金丝雀的问题。

<!--
## Splitting traffic using HTTPRoute (optional)
-->
## 使用 HTTPRoute 切分流量（可选） {#splitting-traffic-using-httproute-optional}

<!--
If you're using the [Gateway API](https://gateway-api.sigs.k8s.io/), you can use HTTPRoute to have more precise control over traffic splitting between the stable and canary versions. This approach allows you to specify exact percentages for traffic distribution rather than relying on replica counts.
-->
如果你使用 [Gateway API](https://gateway-api.sigs.k8s.io/)，
可以用 HTTPRoute 更精确地控制稳定版本与金丝雀版本之间的流量切分。
这种方法让你能够指定确切的流量分配百分比，而不必依赖副本数量。

<!--
First, create separate Services for the stable and canary versions. This approach is also useful for debugging, even if you are not using Gateway API. By having separate Services, you can directly test or monitor each version independently.
-->
首先，为稳定版本和金丝雀版本分别创建 Service。即使你不使用 Gateway API，
这种方法对调试也很有用。有了各自的 Service，你就可以独立地测试或监控每个版本。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: rollout-demo-stable-service
spec:
  selector:
    app.kubernetes.io/name: rollout-demo
    track: stable
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: rollout-demo-canary-service
spec:
  selector:
    app.kubernetes.io/name: rollout-demo
    track: canary
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
```

<!--
Then create an HTTPRoute that splits traffic between the two Services:
-->
然后创建一个在两个 Service 之间切分流量的 HTTPRoute：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rollout-demo-route
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "rollout-demo.example.com"
  rules:
  - backendRefs:
    - name: rollout-demo-stable-service
      port: 80
      weight: 90
    - name: rollout-demo-canary-service
      port: 80
      weight: 10
```

<!--
This configuration routes 90% of traffic to the stable Service and 10% to the canary Service, regardless of the number of replicas.

You can also use header-based routing to send specific traffic to the canary:
-->
此配置将 90% 的流量路由到稳定 Service，10% 路由到金丝雀 Service，与副本数量无关。

你还可以使用基于标头的路由，把特定流量发送到金丝雀：

<!--
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rollout-demo-route
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "rollout-demo.example.com"
  rules:
  # Rule 1: Route traffic with canary header to canary service
  - matches:
    - headers:
      - type: Exact
        name: env
        value: canary
    backendRefs:
    - name: rollout-demo-canary-service
      port: 80
  # Rule 2: Split remaining traffic 90/10
  - backendRefs:
    - name: rollout-demo-stable-service
      port: 80
      weight: 90
    - name: rollout-demo-canary-service
      port: 80
      weight: 10
```
-->
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rollout-demo-route
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "rollout-demo.example.com"
  rules:
  # 规则 1：将带有金丝雀标头的流量路由到金丝雀 Service
  - matches:
    - headers:
      - type: Exact
        name: env
        value: canary
    backendRefs:
    - name: rollout-demo-canary-service
      port: 80
  # 规则 2：按 90/10 切分剩余流量
  - backendRefs:
    - name: rollout-demo-stable-service
      port: 80
      weight: 90
    - name: rollout-demo-canary-service
      port: 80
      weight: 10
```

<!--
This configuration sends all traffic with the `env: canary` header to the canary Service, while other traffic is split 90/10 between stable and canary.
-->
此配置将带有 `env: canary` 标头的所有流量发送到金丝雀 Service，
其余流量则在稳定版本和金丝雀之间按 90/10 切分。

{{< note >}}
<!--
The Gateway API requires a Gateway controller to be installed in your cluster. See the [Gateway API documentation](https://gateway-api.sigs.k8s.io/) for installation instructions and supported implementations.
-->
Gateway API 要求集群中安装 Gateway 控制器。
有关安装说明和支持的实现，请参阅 [Gateway API 文档](https://gateway-api.sigs.k8s.io/)。
{{< /note >}}

<!--
## Automating canary rollouts
-->
## 自动化金丝雀上线 {#automating-canary-rollouts}

<!--
In production environments, canary rollouts are typically managed by controllers or CI/CD systems that automate traffic shifting, monitoring, and promotion or rollback. Tools such as Flux, Argo Rollouts, GitLab, and many others can handle progressive delivery, analysis, and rollback for you. This reduces manual steps and helps ensure safe, repeatable deployments. For more information, see the documentation for your chosen deployment tool or controller.
-->
在生产环境中，金丝雀上线通常由控制器或 CI/CD 系统管理，这些系统会自动处理流量切换、
监控以及晋级或回滚。Flux、Argo Rollouts、GitLab 等众多工具可以代你完成渐进式交付、
分析和回滚。这减少了手工步骤，有助于确保部署安全且可重复。
更多信息请参阅你选用的部署工具或控制器的文档。

## {{% heading "cleanup" %}} {#cleaning-up}

<!--
Delete the resources created in this tutorial:
-->
删除本教程中创建的资源：

```shell
kubectl delete deployment rollout-demo-stable rollout-demo-canary
kubectl delete service rollout-demo-service
```

<!--
If you created separate Services for HTTPRoute, delete those as well:
-->
如果你为 HTTPRoute 创建了单独的 Service，也请删除它们：

```shell
kubectl delete service rollout-demo-stable-service rollout-demo-canary-service
kubectl delete httproute rollout-demo-route
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [canary deployments](/docs/concepts/workloads/management/#canary-deployments) in the Managing Workloads concept page.
* Read about [Deployments](/docs/concepts/workloads/controllers/deployment/) and how they manage your application lifecycle.
* Read about [Services](/docs/concepts/services-networking/service/) and how they enable service discovery and load balancing.
* Explore the [Gateway API](/docs/concepts/services-networking/gateway/) for advanced traffic management capabilities.
* Consider using [Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/) to automatically adjust replica counts based on metrics.
-->
* 在管理工作负载概念页面中进一步了解[金丝雀部署](/zh-cn/docs/concepts/workloads/management/#canary-deployments)。
* 阅读 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)，
  了解其如何管理你的应用生命周期。
* 阅读 [Service](/zh-cn/docs/concepts/services-networking/service/)，
  了解其如何实现服务发现和负载均衡。
* 探索 [Gateway API](/zh-cn/docs/concepts/services-networking/gateway/)，
  了解高级流量管理能力。
* 考虑使用
  [Pod 水平自动扩缩](/zh-cn/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)根据指标自动调整副本数量。
