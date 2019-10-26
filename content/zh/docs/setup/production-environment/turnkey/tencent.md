---
title: 在腾讯云容器服务上运行 Kubernetes
---

<!--
---
title: Running Kubernetes on Tencent Kubernetes Engine
---
-->

<!--
## Tencent Kubernetes Engine

 [Tencent Cloud Tencent Kubernetes Engine (TKE)](https://intl.cloud.tencent.com/product/tke) provides native Kubernetes container management services. You can deploy and manage a Kubernetes cluster with TKE in just a few steps. For detailed directions, see [Deploy Tencent Kubernetes Engine](https://intl.cloud.tencent.com/document/product/457/11741).

 TKE is a [Certified Kubernetes product](https://www.cncf.io/certification/software-conformance/).It is fully compatible with the native Kubernetes API.
-->
## 腾讯云容器服务

[腾讯云容器服务（TKE）](https://intl.cloud.tencent.com/product/tke)提供本地 Kubernetes 容器管理服务。您只需几个步骤即可使用 TKE 部署和管理 Kubernetes 集群。有关详细说明，请参阅[部署腾讯云容器服务](https://intl.cloud.tencent.com/document/product/457/11741)。

 TKE 是[认证的 Kubernetes 产品](https://www.cncf.io/certification/software-conformance/)。它与原生 Kubernetes API 完全兼容。

<!--
## Custom Deployment

 The core of Tencent Kubernetes Engine is open source and available [on GitHub](https://github.com/TencentCloud/tencentcloud-cloud-controller-manager/).

 When using TKE to create a Kubernetes cluster, you can choose managed mode or independent deployment mode. In addition, you can customize the deployment as needed; for example, you can choose an existing Cloud Virtual Machine instance for cluster creation or enable Kube-proxy in IPVS mode.
-->
## 定制部署

腾讯 Kubernetes Engine 的核心是开源的，并且可以在 [GitHub](https://github.com/TencentCloud/tencentcloud-cloud-controller-manager/) 上使用。

使用 TKE 创建 Kubernetes 集群时，可以选择托管模式或独立部署模式。另外，您可以根据需要自定义部署。例如，您可以选择现有的 Cloud Virtual Machine 实例来创建集群，也可以在 IPVS 模式下启用 Kube-proxy。

<!--
## What's Next

 To learn more, see the [TKE documentation](https://intl.cloud.tencent.com/document/product/457).
-->
## 下一步

 要了解更多信息，请参阅 [TKE 文档](https://intl.cloud.tencent.com/document/product/457)。