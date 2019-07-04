## Running Kubernetes on Tencent Kubernetes Engine

### Tencent Kubernetes Engine

[腾讯云容器服务（TKE）](https://intl.cloud.tencent.com/product/tke)能够为你提供简单易用、更原生的Kubernetes容器管理服务，你只需简单的几步操作就可以进行kubernetes集群的部署与管理，具体操作步骤可以参考[Deploy Tencent Kubernetes Engine](https://intl.cloud.tencent.com/document/product/457/11741).

[腾讯云容器服务（TKE）](https://intl.cloud.tencent.com/product/tke)在完全兼容原生 kubernetes API 的基础上，扩展了腾讯云的 CBS、CLB 等 kubernetes 插件，打造了一整套完整的容器服务功能体系。关于[TKE](https://intl.cloud.tencent.com/product/tke)的更多的使用指南，欢迎查看[腾讯云容器服务官方文档](https://intl.cloud.tencent.com/document/product/457).

### 自定义部署

[腾讯云容器服务（TKE）](https://intl.cloud.tencent.com/product/tke)的核心代码已在GitHub上开源，你可以[点击这里](https://github.com/TencentCloud/tencentcloud-cloud-controller-manager/blob/master)获取。

使用[腾讯云容器服务（TKE）](https://intl.cloud.tencent.com/product/tke)新建kubernetes集群时，支持选择集群托管模式以及独立部署模式。此外，你还可以按需进行自定义部署，比如可以选择已有CVM创建集群、开启Kube-proxy IPVS功能等。

你可以参照[腾讯云容器服务官方文档](https://intl.cloud.tencent.com/document/product/457)直接使用。