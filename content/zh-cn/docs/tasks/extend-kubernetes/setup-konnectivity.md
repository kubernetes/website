---
title: 设置 Konnectivity 服务
content_type: task
weight: 70
---

<!-- overview -->
<!--
The Konnectivity service provides a TCP level proxy for the control plane to cluster
communication.
-->
Konnectivity 服务为控制平面提供集群通信的 TCP 级别代理。

## {{% heading "prerequisites" %}}

<!--
You need to have a Kubernetes cluster, and the kubectl command-line tool must
be configured to communicate with your cluster. It is recommended to run this
tutorial on a cluster with at least two nodes that are not acting as control
plane hosts. If you do not already have a cluster, you can create one by using
[minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/).
-->
你需要有一个 Kubernetes 集群，并且 kubectl 命令可以与集群通信。
建议在至少有两个不充当控制平面主机的节点的集群上运行本教程。
如果你还没有集群，可以使用
[minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/) 创建一个集群。

<!-- steps -->
<!--
## Configure the Konnectivity service

The following steps require an egress configuration, for example:
-->
## 配置 Konnectivity 服务   {#configure-the-konnectivity-service}

接下来的步骤需要出口配置，比如：

{{< code_sample file="admin/konnectivity/egress-selector-configuration.yaml" >}}

<!--
You need to configure the API Server to use the Konnectivity service
and direct the network traffic to the cluster nodes:

1. Make sure that
[Service Account Token Volume Projection](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)
feature enabled in your cluster. It is enabled by default since Kubernetes v1.20.
1. Create an egress configuration file such as `admin/konnectivity/egress-selector-configuration.yaml`.
1. Set the `--egress-selector-config-file` flag of the API Server to the path of
your API Server egress configuration file.
1. If you use UDS connection, add volumes config to the kube-apiserver:
-->
你需要配置 API 服务器来使用 Konnectivity 服务，并将网络流量定向到集群节点：

1. 确保[服务账号令牌卷投射](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)特性被启用。
   该特性自 Kubernetes v1.20 起默认已被启用。
1. 创建一个出站流量配置文件，比如 `admin/konnectivity/egress-selector-configuration.yaml`。
1. 将 API 服务器的 `--egress-selector-config-file` 参数设置为你的 API
   服务器的离站流量配置文件路径。
1. 如果你在使用 UDS 连接，须将卷配置添加到 kube-apiserver：

   ```yaml
   spec:
     containers:
       volumeMounts:
       - name: konnectivity-uds
         mountPath: /etc/kubernetes/konnectivity-server
         readOnly: false
     volumes:
     - name: konnectivity-uds
       hostPath:
         path: /etc/kubernetes/konnectivity-server
         type: DirectoryOrCreate
   ```

<!--
Generate or obtain a certificate and kubeconfig for konnectivity-server.
For example, you can use the OpenSSL command line tool to issue a X.509 certificate,
using the cluster CA certificate `/etc/kubernetes/pki/ca.crt` from a control-plane host.
-->
为 konnectivity-server 生成或者取得证书和 kubeconfig 文件。
例如，你可以使用 OpenSSL 命令行工具，基于存放在某控制面主机上
`/etc/kubernetes/pki/ca.crt` 文件中的集群 CA 证书来发放一个 X.509 证书。

```bash
openssl req -subj "/CN=system:konnectivity-server" -new -newkey rsa:2048 -nodes -out konnectivity.csr -keyout konnectivity.key
openssl x509 -req -in konnectivity.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out konnectivity.crt -days 375 -sha256
SERVER=$(kubectl config view -o jsonpath='{.clusters..server}')
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-credentials system:konnectivity-server --client-certificate konnectivity.crt --client-key konnectivity.key --embed-certs=true
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-cluster kubernetes --server "$SERVER" --certificate-authority /etc/kubernetes/pki/ca.crt --embed-certs=true
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-context system:konnectivity-server@kubernetes --cluster kubernetes --user system:konnectivity-server
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config use-context system:konnectivity-server@kubernetes
rm -f konnectivity.crt konnectivity.key konnectivity.csr
```

<!--
Next, you need to deploy the Konnectivity server and agents.
[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy)
is a reference implementation.

Deploy the Konnectivity server on your control plane node. The provided
`konnectivity-server.yaml` manifest assumes
that the Kubernetes components are deployed as a {{< glossary_tooltip text="static Pod"
term_id="static-pod" >}} in your cluster. If not, you can deploy the Konnectivity
server as a DaemonSet.
-->
接下来，你需要部署 Konnectivity 服务器和代理。
[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy)
是一个参考实现。

在控制面节点上部署 Konnectivity 服务。
下面提供的 `konnectivity-server.yaml` 配置清单假定在你的集群中
Kubernetes 组件都是部署为{{< glossary_tooltip text="静态 Pod" term_id="static-pod" >}} 的。
如果不是，你可以将 Konnectivity 服务部署为 DaemonSet。

{{< code_sample file="admin/konnectivity/konnectivity-server.yaml" >}}

<!--
Then deploy the Konnectivity agents in your cluster:
-->
在你的集群中部署 Konnectivity 代理：

{{< code_sample file="admin/konnectivity/konnectivity-agent.yaml" >}}

<!--
Last, if RBAC is enabled in your cluster, create the relevant RBAC rules:
-->
最后，如果你的集群启用了 RBAC，请创建相关的 RBAC 规则：

{{< codenew file="admin/konnectivity/konnectivity-rbac.yaml" >}}

