---
title: 設置 Konnectivity 服務
content_type: task
weight: 70
---

<!-- overview -->
<!--
The Konnectivity service provides a TCP level proxy for the control plane to cluster
communication.
-->
Konnectivity 服務爲控制平面提供集羣通信的 TCP 級別代理。

## {{% heading "prerequisites" %}}

<!--
You need to have a Kubernetes cluster, and the kubectl command-line tool must
be configured to communicate with your cluster. It is recommended to run this
tutorial on a cluster with at least two nodes that are not acting as control
plane hosts. If you do not already have a cluster, you can create one by using
[minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/).
-->
你需要有一個 Kubernetes 集羣，並且 kubectl 命令可以與集羣通信。
建議在至少有兩個不充當控制平面主機的節點的集羣上運行本教程。
如果你還沒有集羣，可以使用
[minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/) 創建一個集羣。

<!-- steps -->
<!--
## Configure the Konnectivity service

The following steps require an egress configuration, for example:
-->
## 配置 Konnectivity 服務   {#configure-the-konnectivity-service}

接下來的步驟需要出口配置，比如：

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
你需要配置 API 服務器來使用 Konnectivity 服務，並將網絡流量定向到集羣節點：

1. 確保[服務賬號令牌卷投射](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)特性被啓用。
   該特性自 Kubernetes v1.20 起默認已被啓用。
1. 創建一個出站流量配置文件，比如 `admin/konnectivity/egress-selector-configuration.yaml`。
1. 將 API 服務器的 `--egress-selector-config-file` 參數設置爲你的 API
   服務器的離站流量配置文件路徑。
1. 如果你在使用 UDS 連接，須將卷配置添加到 kube-apiserver：

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
爲 konnectivity-server 生成或者取得證書和 kubeconfig 文件。
例如，你可以使用 OpenSSL 命令行工具，基於存放在某控制面主機上
`/etc/kubernetes/pki/ca.crt` 文件中的集羣 CA 證書來發放一個 X.509 證書。

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
接下來，你需要部署 Konnectivity 服務器和代理。
[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy)
是一個參考實現。

在控制面節點上部署 Konnectivity 服務。
下面提供的 `konnectivity-server.yaml` 配置清單假定在你的集羣中
Kubernetes 組件都是部署爲{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}} 的。
如果不是，你可以將 Konnectivity 服務部署爲 DaemonSet。

{{< code_sample file="admin/konnectivity/konnectivity-server.yaml" >}}

<!--
Then deploy the Konnectivity agents in your cluster:
-->
在你的集羣中部署 Konnectivity 代理：

{{< code_sample file="admin/konnectivity/konnectivity-agent.yaml" >}}

<!--
Last, if RBAC is enabled in your cluster, create the relevant RBAC rules:
-->
最後，如果你的集羣啓用了 RBAC，請創建相關的 RBAC 規則：

{{< codenew file="admin/konnectivity/konnectivity-rbac.yaml" >}}

