---
reviewers:
- lachie83
- khenidak
title: 验证 IPv4/IPv6 双协议栈
content_type: task
---
<!--
reviewers:
- lachie83
- khenidak
title: Validate IPv4/IPv6 dual-stack
content_type: task
-->

<!-- overview -->
<!--
This document shares how to validate IPv4/IPv6 dual-stack enabled Kubernetes clusters.
-->
这篇文章分享了如何验证 IPv4/IPv6 双协议栈的 Kubernetes 集群。

## {{% heading "prerequisites" %}}

<!--
* Kubernetes 1.16 or later
* Provider support for dual-stack networking (Cloud provider or otherwise must be able to provide Kubernetes nodes with routable IPv4/IPv6 network interfaces)
* Kubenet network plugin
* Kube-proxy running in mode IPVS
* [Dual-stack enabled](/docs/concepts/services-networking/dual-stack/) cluster
-->
* Kubernetes 1.16 或更高版本
* 提供程序对双协议栈网络的支持 (云供应商或其他方式必须能够为 Kubernetes 节点提供可路由的 IPv4/IPv6 网络接口)
* 一个能够支持双协议栈的[网络插件](/zh/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)，
  （如 kubenet 或 Calico）。 
* Kube-proxy 在 IPVS 模式下运行
* [启用双协议栈](/zh/docs/concepts/services-networking/dual-stack/) 集群

<!-- steps -->

<!--
## Validate addressing

### Validate node addressing

Each dual-stack Node should have a single IPv4 block and a single IPv6 block allocated. Validate that IPv4/IPv6 Pod address ranges are configured by running the following command. Replace the sample node name with a valid dual-stack Node from your cluster. In this example, the Node's name is `k8s-linuxpool1-34450317-0`:
-->
## 验证寻址

### 验证节点寻址

每个双协议栈节点应分配一个 IPv4 块和一个 IPv6 块。
通过运行以下命令来验证是否配置了 IPv4/IPv6 Pod 地址范围。
将示例节点名称替换为集群中的有效双协议栈节点。
在此示例中，节点的名称为 `k8s-linuxpool1-34450317-0`：

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .spec.podCIDRs}}{{printf "%s\n" .}}{{end}}'
```

```
10.244.1.0/24
a00:100::/24
```

<!--
There should be one IPv4 block and one IPv6 block allocated.
-->
应该分配一个 IPv4 块和一个 IPv6 块。

<!--
Validate that the node has an IPv4 and IPv6 interface detected (replace node name with a valid node from the cluster. In this example the node name is k8s-linuxpool1-34450317-0): 
-->
验证节点是否检测到 IPv4 和 IPv6 接口（用集群中的有效节点替换节点名称。
在此示例中，节点名称为 `k8s-linuxpool1-34450317-0`）：

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .status.addresses}}{{printf "%s: %s \n" .type .address}}{{end}}'
```
```
Hostname: k8s-linuxpool1-34450317-0
InternalIP: 10.240.0.5
InternalIP: 2001:1234:5678:9abc::5
```

<!--
### Validate Pod addressing

Validate that a Pod has an IPv4 and IPv6 address assigned. (replace the Pod name with a valid Pod in your cluster. In this example the Pod name is pod01)
-->
### 验证 Pod 寻址

验证 Pod 已分配了 IPv4 和 IPv6 地址。（用集群中的有效 Pod 替换 Pod 名称。在此示例中， Pod 名称为 pod01）

```shell
kubectl get pods pod01 -o go-template --template='{{range .status.podIPs}}{{printf "%s \n" .ip}}{{end}}'
```

```
10.244.1.4
a00:100::4
```

<!--
You can also validate Pod IPs using the Downward API via the `status.podIPs` fieldPath. The following snippet demonstrates how you can expose the Pod IPs via an environment variable called `MY_POD_IPS` within a container.
-->
您也可以通过 `status.podIPs` 使用 Downward API 验证 Pod IP。以下代码段演示了如何通过容器内称为 `MY_POD_IPS` 的环境变量公开 Pod 的 IP 地址。

```
        env:
        - name: MY_POD_IPS
          valueFrom:
            fieldRef:
              fieldPath: status.podIPs
```

<!--
The following command prints the value of the `MY_POD_IPS` environment variable from within a container. The value is a comma separated list that corresponds to the Pod's IPv4 and IPv6 addresses.
-->
使用以下命令打印出容器内部 `MY_POD_IPS` 环境变量的值。该值是一个逗号分隔的列表，与 Pod 的 IPv4 和 IPv6 地址相对应。

```shell
kubectl exec -it pod01 -- set | grep MY_POD_IPS
```

```
MY_POD_IPS=10.244.1.4,a00:100::4
```

<!--
The Pod's IP addresses will also be written to `/etc/hosts` within a container. The following command executes a cat on `/etc/hosts` on a dual stack Pod. From the output you can verify both the IPv4 and IPv6 IP address for the Pod.
-->
Pod 的 IP 地址也将被写入容器内的 `/etc/hosts` 文件中。在双栈 Pod 上执行 cat `/etc/hosts` 命令操作。从输出结果中，您可以验证 Pod 的 IPv4 和 IPv6 地址。

```shell
kubectl exec -it pod01 -- cat /etc/hosts
```

```
# Kubernetes-managed hosts file.
127.0.0.1    localhost
::1    localhost ip6-localhost ip6-loopback
fe00::0    ip6-localnet
fe00::0    ip6-mcastprefix
fe00::1    ip6-allnodes
fe00::2    ip6-allrouters
10.244.1.4    pod01
a00:100::4    pod01
```

<!--
## Validate Services

Create the following Service without the `ipFamily` field set. When this field is not set, the Service gets an IP from the first configured range via `--service-cluster-ip-range` flag on the kube-controller-manager.
-->
## 验证服务

在不设置 `ipFamily` 字段的情况下创建以下服务。
如果未设置此字段，则服务会通过 kube-controller-manager 上的 `--service-cluster-ip-range` 标志从第一个配置的范围中获取 IP。

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

<!--
By viewing the YAML for the Service you can observe that the Service has the `ipFamily` field has set to reflect the address family of the first configured range set via `--service-cluster-ip-range` flag on kube-controller-manager.
-->
通过查看该服务的 YAML ，您可以观察到该服务的 `ipFamily` 字段已设置为反映通过
kube-controller-manager 上的 `--service-cluster-ip-range` 标志设置的第一个配置范围的地址族。

```shell
kubectl get svc my-service -o yaml
```

```yaml
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: "2019-09-03T20:45:13Z"
  labels:
    app: MyApp
  name: my-service
  namespace: default
  resourceVersion: "485836"
  selfLink: /api/v1/namespaces/default/services/my-service
  uid: b6fa83ef-fe7e-47a3-96a1-ac212fa5b030
spec:
  clusterIP: 10.0.29.179
  ipFamily: IPv4
  ports:
  - port: 80
    protocol: TCP
    targetPort: 9376
  selector:
    app: MyApp
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

<!--
Create the following Service with the `ipFamily` field set to `IPv6`.
-->
在 `ipFamily` 字段设置为 `IPv6` 的情况下创建一下服务。

{{< codenew file="service/networking/dual-stack-ipv6-svc.yaml" >}}

<!--
Validate that the Service gets a cluster IP address from the IPv6 address block. You may then validate access to the service via the IP and port.
-->
验证服务是否是 IPv6 地址块获取集群 IP 地址。
然后，您可以通过 IP 和端口验证对服务的访问。
```
 kubectl get svc -l app=MyApp
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
my-service   ClusterIP   fe80:20d::d06b   <none>        80/TCP    9s
```

<!--
### Create a dual-stack load balanced Service

If the cloud provider supports the provisioning of IPv6 enabled external load balancer, create the following Service with both the `ipFamily` field set to `IPv6` and the `type` field set to `LoadBalancer`
-->
### 创建双协议栈负载均衡服务

如果云提供商支持配置启用 IPv6 的外部负载均衡器，则将 `ipFamily` 字段设置为 `IPv6` 并将 `type` 字段设置为 `LoadBalancer`的方式创建以下服务

{{< codenew file="service/networking/dual-stack-ipv6-lb-svc.yaml" >}}

<!--
Validate that the Service receives a `CLUSTER-IP` address from the IPv6 address block along with an `EXTERNAL-IP`. You may then validate access to the service via the IP and port. 
-->
验证服务是否从 IPv6 地址块中接收到 `CLUSTER-IP` 地址以及 `EXTERNAL-IP`。
然后，您可以通过 IP 和端口验证对服务的访问。
```
 kubectl get svc -l app=MyApp
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP                     PORT(S)        AGE
my-service   ClusterIP   fe80:20d::d06b   2001:db8:f100:4002::9d37:c0d7   80:31868/TCP   30s
```

