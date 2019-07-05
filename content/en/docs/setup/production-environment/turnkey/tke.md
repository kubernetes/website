## Running Kubernetes on Tencent Kubernetes Engine

### Tencent Kubernetes Engine

[Tencent Cloud Tencent Kubernetes Engine (TKE)](https://intl.cloud.tencent.com/product/tke) provides easy-to-use and powerful native Kubernetes container management services, enabling you deploy and manage a Kubernetes cluster in just a few steps. For detailed directions, see [Deploy Tencent Kubernetes Engine](https://intl.cloud.tencent.com/document/product/457/11741).

In addition to full compatibility with the native Kubernetes API, [TKE](https://intl.cloud.tencent.com/product/tke) features plugins such as CBS and CLB, helping you build a complete system of container services and functions. For more information about how to use [TKE](https://intl.cloud.tencent.com/product/tke), see the [official documentation of TKE](https://intl.cloud.tencent.com/document/product/457).

### Custom Deployment

The core code of [TKE](https://intl.cloud.tencent.com/product/tke) has been made open source on GitHub, which can be obtained [here](https://github.com/TencentCloud/tencentcloud-cloud-controller-manager/blob/master).

When using [TKE](https://intl.cloud.tencent.com/product/tke) to create a Kubernetes cluster, you can choose managed mode or independent deployment mode. In addition, you can customize the deployment as needed; for example, you can choose an existing CVM instance for cluster creation or enable Kube-proxy IPVS.

For more information about usage, see the [official documentation of TKE](https://intl.cloud.tencent.com/document/product/457).