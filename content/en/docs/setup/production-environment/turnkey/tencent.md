## Running Kubernetes on Tencent Kubernetes Engine

### Tencent Kubernetes Engine

 [Tencent Cloud Tencent Kubernetes Engine (TKE)](https://intl.cloud.tencent.com/product/tke) provides native Kubernetes container management services. You can deploy and manage a Kubernetes cluster with TKE in just a few steps. For detailed directions, see [Deploy Tencent Kubernetes Engine](https://intl.cloud.tencent.com/document/product/457/11741).

 In addition to full compatibility with the native Kubernetes API,TKE features Kubernetes plugins of Tencent Cloud such as [Cloud Block Storage](https://intl.cloud.tencent.com/product/cbs) and [Cloud Load Balancer](https://intl.cloud.tencent.com/product/clb), helping you build a complete system of container services and functions. For learn more about TKE in its official [TKE documentation](https://intl.cloud.tencent.com/document/product/457).

### Custom Deployment

 The core of Tencent Kubernetes Engine is open source and available [on GitHub](https://github.com/TencentCloud/tencentcloud-cloud-controller-manager/).

 When using TKE to create a Kubernetes cluster, you can choose managed mode or independent deployment mode. In addition, you can customize the deployment as needed; for example, you can choose an existing CVM instance for cluster creation or enable Kube-proxy IPVS.
