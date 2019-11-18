---
title: Running Kubernetes on Tencent Kubernetes Engine
---

## Tencent Kubernetes Engine

 [Tencent Cloud Tencent Kubernetes Engine (TKE)](https://intl.cloud.tencent.com/product/tke) provides native Kubernetes container management services. You can deploy and manage a Kubernetes cluster with TKE in just a few steps. For detailed directions, see [Deploy Tencent Kubernetes Engine](https://intl.cloud.tencent.com/document/product/457/11741).

 TKE is a [Certified Kubernetes product](https://www.cncf.io/certification/software-conformance/).It is fully compatible with the native Kubernetes API.

## Custom Deployment

 The core of Tencent Kubernetes Engine is open source and available [on GitHub](https://github.com/TencentCloud/tencentcloud-cloud-controller-manager/).

 When using TKE to create a Kubernetes cluster, you can choose managed mode or independent deployment mode. In addition, you can customize the deployment as needed; for example, you can choose an existing Cloud Virtual Machine instance for cluster creation or enable Kube-proxy in IPVS mode.

## What's Next

 To learn more, see the [TKE documentation](https://intl.cloud.tencent.com/document/product/457).