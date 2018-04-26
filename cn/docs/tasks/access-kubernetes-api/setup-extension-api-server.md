---
title: 配置扩展 API 服务器
approvers:
- lavalamp
- cheftako
- chenopis
cn-approvers:
- zhangqx2010
---
<!--
---
title: Setup an extension API server
approvers:
- lavalamp
- cheftako
- chenopis
---
-->

{% capture overview %}
<!--
Setting up an extension API server to work the aggregation layer allows the Kubernetes apiserver to be extended with additional APIs, which are not part of the core Kubernetes APIs.
 -->
建立一个扩展 API 服务器作用于汇聚层（aggregation layer），使得 Kubernetes apiserver 能扩展额外的非 Kubernetes 核心 API。

{% endcapture %}

{% capture prerequisites %}

<!--
* You need to have a Kubernetes cluster running.
* You must [configure the aggregation layer](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) and enable the apiserver flags.
-->
* 您需要有一个正在运行的 Kubernetes 集群
* 您必须 [配置汇聚层](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/)，并启用 apiserver 标记。

{% endcapture %}

{% capture steps %}

<!--
## Setup an extension api-server to work with the aggregation layer
-->
## 配置一个作用于汇聚层的扩展 api-server

<!--
The following steps describe how to set up an extension-apiserver *at a high level*. For a concrete example of how they can be implemented, you can look at the [sample-apiserver](https://github.com/kubernetes/sample-apiserver/blob/master/README.md) in the Kubernetes repo.

Alternatively, you can use an existing 3rd party solution, such as [apiserver-builder](https://github.com/Kubernetes-incubator/apiserver-builder/blob/master/README.md), which should generate a skeleton and automate all of the following steps for you.

1. Make sure the APIService API is enabled (check `--runtime-config`). It should be on by default, unless it's been deliberately turned off in your cluster.
2. You may need to make an RBAC rule allowing you to add APIService objects, or get your cluster administrator to make one. (Since API extensions affect the entire cluster, it is not recommended to do testing/development/debug of an API extension in a live cluster.)
3. Create the Kubernetes namespace you want to run your extension api-service in.
4. Create/get a CA cert to be used to sign the server cert the extension api-server uses for HTTPS.
5. Create a server cert/key for the api-server to use for HTTPS. This cert should be signed by the above CA. It should also have a CN of the Kube DNS name. This is derived from the Kubernetes service and be of the form <service name>.<service name namespace>.svc
6. Create a Kubernetes secret with the server cert/key in your namespace.
7. Create a Kubernetes deployment for the extension api-server and make sure you are loading the secret as a volume. It should contain a reference to a working image of your extension api-server. The deployment should also be in your namespace.
8. Make sure that your extension-apiserver loads those certs from that volume and that they are used in the HTTPS handshake.
9. Create a Kubernetes service account in your namespace.
10. Create a Kubernetes cluster role for the operations you want to allow on your resources.
11. Create a Kubernetes cluster role binding from the default service account in your namespace to the cluster role you just created.
12. Create a Kubernetes apiservice. The CA cert above should be base 64 encoded, stripped of new lines and used as the spec.caBundle in the apiservce.  This should not be namespaced.
13. Use kubectl to get your resource. It should return "No resources found." Which means that everything worked but you currently have no objects of that resource type created yet.
-->
以下步骤 *高度概括* 地描述了如何建立扩展 apiserver。对于可实施的具体例子，您可以查阅 Kubernetes repo 中的 [apiserver 例子](https://github.com/kubernetes/sample-apiserver/blob/master/README.md)。

或者，您可以使用现有的第三方方案，比如 [apiserver-builder](https://github.com/Kubernetes-incubator/apiserver-builder/blob/master/README.md)，能够实现下面步骤的自动化。

1. 确保 APIServer API 是启用的（检查 `--runtime-config`）。除非特意关闭，该配置默认启用。
2. 您需要创建 RBAC 规则，以让您能有权限添加 APIserver 对象，或者让集群管理员创建一个。(由于 API 扩展对于整个集群生效，所以不推荐在生产集群中对 API 扩展进行 测试/开发/debug。)
3. 创建一个 Kubernetes namespace 用于运行扩展 api-service。
4. 创建／获取一张 CA 证书用于对 api-server 的 HTTPS 的服务器证书进行签名。
5. 创建服务器证书／秘钥用于 api-server 的 HTTPS 服务。这个证书应该由上面提及的 CA 签名。它也应该包含含有 Kube DNS 名的 CN。这来自于 Kubernetes 服务并且是 <service name>.<service name namespace>.svc 的形式。
6. 在这个 namespace 中使用服务器证书／秘钥创建 Kubernetes secret。
7. 为扩展 api-server 创建 Kubernetes deployment，并确认使用卷的方式加载 secret。它应改包含一个关于您扩展 api-server 镜像的 reference。deployment 也应该存在之前创建的 namespace 中。
8. 确保 api-server 通过卷加载这些证书，并用于 HTTPS 握手。
9. 在这个 namespace 中创建一个 Kubernetes service account。
10. 创建一个 Kubernetes cluster role 用于允许对您对资源进行操作。
11. 使用在这个 namespace 中默认的 service account 为您刚刚创建的 cluster role 创建一个 Kubernetes cluster rolebinding。
12. 创建一个 Kubernetes apiservice。上面提到的 CA 证书应该用 base64 加密，去除换行符并作为 spec.caBundle 在 apiservice 中使用。这不应该在 namespace 中。
13. 使用 kubectl 获得您的资源。它应该返回 "No resources found."，意味着一切工作正常，但是您目前还没有创建那个类型的资源对象。

{% endcapture %}

{% capture whatsnext %}

<!--
* If you haven't already, [configure the aggregation layer](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) and enable the apiserver flags.
* For a high level overview, see [Extending the Kubernetes API with the aggregation layer](/docs/concepts/api-extension/apiserver-aggregation/).
* Learn how to [Extend the Kubernetes API Using Custom Resource Definitions](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).
-->
如果你还没有配置好，请参考 [配置汇聚层](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) 并启用 apiserver 标记。
对于概览，请参考 [使用汇聚层扩展 Kubernetes API](/docs/concepts/api-extension/apiserver-aggregation/)。
学习如何 [使用自定义资源扩展 Kubernetes API](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)。

{% endcapture %}

{% include templates/task.md %}

