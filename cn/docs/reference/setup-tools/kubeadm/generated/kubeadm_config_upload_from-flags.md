
<!--
Create the in-cluster configuration file for the first time from using flags.
-->
首次使用参数（flag）来创建集群内部配置文件。

<!--
### Synopsis
-->
### 摘要



<!--
Using this command, you can upload configuration to the ConfigMap in the cluster using the same flags you gave to 'kubeadm init'.
If you initialized your cluster using a v1.7.x or lower kubeadm client and set certain flags, you need to run this command with the
same flags before upgrading to v1.8 using 'kubeadm upgrade'.
-->
使用此命令，您可以上传配置到集群中的 ConfigMap，上传时使用的是 'kubeadm init' 中传入的相同的参数。
如果您使用 v1.7.x 或更低版本的 kubeadm 客户端，并设置某些参数来初始化您的集群，那么在使用 'kubeadm upgrade'
升级到 v1.8 之前，您需要使用同样的参数运行此命令。

<!--
The configuration is located in the "kube-system" namespace in the "kubeadm-config" ConfigMap.
-->
配置位于 “kube-system” 名字空间内名为 “kubeadm-config” 的 ConfigMap 中。


```
kubeadm config upload from-flags
```

<!--
### Options

```
      --apiserver-advertise-address string      The IP address the API Server will advertise it's listening on. Specify '0.0.0.0' to use the address of the default network interface.
      --apiserver-bind-port int32               Port for the API Server to bind to. (default 6443)
      --apiserver-cert-extra-sans stringSlice   Optional extra Subject Alternative Names (SANs) to use for the API Server serving certificate. Can be both IP addresses and DNS names.
      --cert-dir string                         The path where to save and store the certificates. (default "/etc/kubernetes/pki")
      --feature-gates string                    A set of key=value pairs that describe feature gates for various features. Options are:
CoreDNS=true|false (ALPHA - default=false)
DynamicKubeletConfig=true|false (ALPHA - default=false)
HighAvailability=true|false (ALPHA - default=false)
SelfHosting=true|false (BETA - default=false)
StoreCertsInSecrets=true|false (ALPHA - default=false)
SupportIPVSProxyMode=true|false (ALPHA - default=false)
      --kubernetes-version string               Choose a specific Kubernetes version for the control plane. (default "stable-1.8")
      --node-name string                        Specify the node name.
      --pod-network-cidr string                 Specify range of IP addresses for the pod network. If set, the control plane will automatically allocate CIDRs for every node.
      --service-cidr string                     Use alternative range of IP address for service VIPs. (default "10.96.0.0/12")
      --service-dns-domain string               Use alternative domain for services, e.g. "myorg.internal". (default "cluster.local")
      --token string                            The token to use for establishing bidirectional trust between nodes and masters.
      --token-ttl duration                      The duration before the bootstrap token is automatically deleted. If set to '0', the token will never expire. (default 24h0m0s)
```
-->
### 选项

```
      --apiserver-advertise-address string      API 服务器将通知监听的 IP 地址。 指定 '0.0.0.0' 以使用默认网络接口的地址。
      --apiserver-bind-port int32               API 服务器所绑定的端口 （默认为 6443）
      --apiserver-cert-extra-sans stringSlice   用于 API 服务器证书的可选附加主体别名（SAN）。 可以是 IP 地址和 DNS 名称。
      --cert-dir string                         保存和存储证书的路径。（默认为 “/etc/kubernetes/pki”）
      --feature-gates string                    一组描述多种特性的特性开关的键值对。 可选项有：
CoreDNS=true|false (ALPHA - 默认=false)
DynamicKubeletConfig=true|false (ALPHA - 默认=false)
HighAvailability=true|false (ALPHA - 默认=false)
SelfHosting=true|false (BETA - 默认=false)
StoreCertsInSecrets=true|false (ALPHA - 默认=false)
SupportIPVSProxyMode=true|false (ALPHA - 默认=false)
      --kubernetes-version string               为控制平面选择特定的 Kubernetes 版本（默认为 “stable-1.8”）
      --node-name string                        指定节点名称。
      --pod-network-cidr string                 为 pod 网络指定 IP 地址范围。 如果设置了该选项，控制平面会自动为每个节点分配 CIDR。
      --service-cidr string                     针对服务 VIP 使用的可选 IP 地址范围。 （默认为 “10.96.0.0/12”）
      --service-dns-domain string               针对服务使用的可选域，例如 “myorg.internal”。 （默认为 “cluster.local”）
      --token string                            用于在节点和 master 节点之间建立双向信任的 token。
      --token-ttl duration                      bootstrap token 自动删除前的持续时间。 如果设为 '0'，该 token 将永不过期（默认为 24h0m0s）
```

<!--
### Options inherited from parent commands

```
      --kubeconfig string   The KubeConfig file to use when talking to the cluster. (default "/etc/kubernetes/admin.conf")
```
-->
### 继承自父命令的选项

```
      --kubeconfig string   与集群通信时使用的 KubeConfig 文件(默认为 "/etc/kubernetes/admin.conf")
```

