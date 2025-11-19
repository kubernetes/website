---
title: 驗證 IPv4/IPv6 雙協議棧
min-kubernetes-server-version: v1.23
content_type: task
---
<!--
reviewers:
- lachie83
- khenidak
- bridgetkromhout
min-kubernetes-server-version: v1.23
title: Validate IPv4/IPv6 dual-stack
content_type: task
-->

<!-- overview -->
<!--
This document shares how to validate IPv4/IPv6 dual-stack enabled Kubernetes clusters.
-->
本文分享瞭如何驗證 IPv4/IPv6 雙協議棧的 Kubernetes 集羣。

## {{% heading "prerequisites" %}}

<!--
* Provider support for dual-stack networking (Cloud provider or otherwise must be able to
  provide Kubernetes nodes with routable IPv4/IPv6 network interfaces)
* A [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  that supports dual-stack networking.
* [Dual-stack enabled](/docs/concepts/services-networking/dual-stack/) cluster
-->
* 驅動程序對雙協議棧網絡的支持 (雲驅動或其他方式必須能夠爲 Kubernetes 節點提供可路由的 IPv4/IPv6 網絡接口)
* 一個能夠支持[雙協議棧](/zh-cn/docs/concepts/services-networking/dual-stack/)網絡的
  [網絡插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)。
* [啓用雙協議棧](/zh-cn/docs/concepts/services-networking/dual-stack/)集羣

{{< version-check >}}

{{< note >}}
<!--
While you can validate with an earlier version, the feature is only GA and officially supported since v1.23.
-->
雖然你可以使用較早的版本進行驗證，但該功能是從 v1.23 版本進入 GA 狀態並正式支持的。
{{< /note >}}

<!-- steps -->

<!--
## Validate addressing

### Validate node addressing

Each dual-stack Node should have a single IPv4 block and a single IPv6 block allocated.
Validate that IPv4/IPv6 Pod address ranges are configured by running the following command.
Replace the sample node name with a valid dual-stack Node from your cluster. In this example,
the Node's name is `k8s-linuxpool1-34450317-0`:
-->
## 驗證尋址   {#validate-addressing}

### 驗證節點尋址   {#validate-node-addressing}

每個雙協議棧節點應分配一個 IPv4 塊和一個 IPv6 塊。
通過運行以下命令來驗證是否配置了 IPv4/IPv6 Pod 地址範圍。
將示例節點名稱替換爲集羣中的有效雙協議棧節點。
在此示例中，節點的名稱爲 `k8s-linuxpool1-34450317-0`：

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .spec.podCIDRs}}{{printf "%s\n" .}}{{end}}'
```

```
10.244.1.0/24
2001:db8::/64
```

<!--
There should be one IPv4 block and one IPv6 block allocated.
-->
應該分配一個 IPv4 塊和一個 IPv6 塊。

<!--
Validate that the node has an IPv4 and IPv6 interface detected.
Replace node name with a valid node from the cluster.
In this example the node name is `k8s-linuxpool1-34450317-0`:
-->
驗證節點是否檢測到 IPv4 和 IPv6 接口。用集羣中的有效節點替換節點名稱。
在此示例中，節點名稱爲 `k8s-linuxpool1-34450317-0`：

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .status.addresses}}{{printf "%s: %s\n" .type .address}}{{end}}'
```

```
Hostname: k8s-linuxpool1-34450317-0
InternalIP: 10.0.0.5
InternalIP: 2001:db8:10::5
```

<!--
### Validate Pod addressing

Validate that a Pod has an IPv4 and IPv6 address assigned. Replace the Pod name with
a valid Pod in your cluster. In this example the Pod name is `pod01`:
-->
### 驗證 Pod 尋址   {#validate-pod-addressing}

驗證 Pod 已分配了 IPv4 和 IPv6 地址。用集羣中的有效 Pod 替換 Pod 名稱。
在此示例中，Pod 名稱爲 `pod01`：

```shell
kubectl get pods pod01 -o go-template --template='{{range .status.podIPs}}{{printf "%s\n" .ip}}{{end}}'
```

```
10.244.1.4
2001:db8::4
```

<!--
You can also validate Pod IPs using the Downward API via the `status.podIPs` fieldPath.
The following snippet demonstrates how you can expose the Pod IPs via an environment variable
called `MY_POD_IPS` within a container.
-->
你也可以通過 `status.podIPs` 使用 Downward API 驗證 Pod IP。
以下代碼段演示瞭如何通過容器內稱爲 `MY_POD_IPS` 的環境變量公開 Pod 的 IP 地址。

```yaml
env:
- name: MY_POD_IPS
  valueFrom:
    fieldRef:
      fieldPath: status.podIPs
```

<!--
The following command prints the value of the `MY_POD_IPS` environment variable from
within a container. The value is a comma separated list that corresponds to the
Pod's IPv4 and IPv6 addresses.
-->
使用以下命令打印出容器內部 `MY_POD_IPS` 環境變量的值。
該值是一個逗號分隔的列表，與 Pod 的 IPv4 和 IPv6 地址相對應。

```shell
kubectl exec -it pod01 -- set | grep MY_POD_IPS
```

```
MY_POD_IPS=10.244.1.4,2001:db8::4
```

<!--
The Pod's IP addresses will also be written to `/etc/hosts` within a container.
The following command executes a cat on `/etc/hosts` on a dual stack Pod.
From the output you can verify both the IPv4 and IPv6 IP address for the Pod.
-->
Pod 的 IP 地址也將被寫入容器內的 `/etc/hosts` 文件中。
在雙棧 Pod 上執行 cat `/etc/hosts` 命令操作。
從輸出結果中，你可以驗證 Pod 的 IPv4 和 IPv6 地址。

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
2001:db8::4    pod01
```

<!--
## Validate Services

Create the following Service that does not explicitly define `.spec.ipFamilyPolicy`.
Kubernetes will assign a cluster IP for the Service from the first configured
`service-cluster-ip-range` and set the `.spec.ipFamilyPolicy` to `SingleStack`.
-->
## 驗證服務   {#validate-services}

創建以下未顯式定義 `.spec.ipFamilyPolicy` 的 Service。
Kubernetes 將從首個配置的 `service-cluster-ip-range` 給 Service 分配集羣 IP，
並將 `.spec.ipFamilyPolicy` 設置爲 `SingleStack`。

{{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

<!-- 
Use `kubectl` to view the YAML for the Service.
-->
使用 `kubectl` 查看 Service 的 YAML 定義。

```shell
kubectl get svc my-service -o yaml
```

<!--
The Service has `.spec.ipFamilyPolicy` set to `SingleStack` and `.spec.clusterIP` set
to an IPv4 address from the first configured range set via `--service-cluster-ip-range`
flag on kube-controller-manager.
-->
該 Service 通過在 kube-controller-manager 的 `--service-cluster-ip-range`
標誌設置的第一個配置範圍，將 `.spec.ipFamilyPolicy` 設置爲 `SingleStack`，
將 `.spec.clusterIP` 設置爲 IPv4 地址。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: default
spec:
  clusterIP: 10.0.217.164
  clusterIPs:
  - 10.0.217.164
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - port: 80
    protocol: TCP
    targetPort: 9376
  selector:
    app.kubernetes.io/name: MyApp
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

<!--
Create the following Service that explicitly defines `IPv6` as the first array element in
`.spec.ipFamilies`. Kubernetes will assign a cluster IP for the Service from the IPv6 range
configured `service-cluster-ip-range` and set the `.spec.ipFamilyPolicy` to `SingleStack`.
-->
創建以下顯式定義 `.spec.ipFamilies` 數組中的第一個元素爲 IPv6 的 Service。
Kubernetes 將 `service-cluster-ip-range` 配置的 IPv6 地址範圍給 Service 分配集羣 IP，
並將 `.spec.ipFamilyPolicy` 設置爲 `SingleStack`。

{{% code_sample file="service/networking/dual-stack-ipfamilies-ipv6.yaml" %}}

<!-- 
Use `kubectl` to view the YAML for the Service.
-->
使用 `kubectl` 查看 Service 的 YAML 定義。

```shell
kubectl get svc my-service -o yaml
```

<!-- 
The Service has `.spec.ipFamilyPolicy` set to `SingleStack` and `.spec.clusterIP` set to
an IPv6 address from the IPv6 range set via `--service-cluster-ip-range` flag on kube-controller-manager.
-->
該 Service 通過在 kube-controller-manager 的 `--service-cluster-ip-range`
標誌設置的 IPv6 地址範圍，將 `.spec.ipFamilyPolicy` 設置爲 `SingleStack`，
將 `.spec.clusterIP` 設置爲 IPv6 地址。

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: MyApp
  name: my-service
spec:
  clusterIP: 2001:db8:fd00::5118
  clusterIPs:
  - 2001:db8:fd00::5118
  ipFamilies:
  - IPv6
  ipFamilyPolicy: SingleStack
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app.kubernetes.io/name: MyApp
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

<!--
Create the following Service that explicitly defines `PreferDualStack` in `.spec.ipFamilyPolicy`.
Kubernetes will assign both IPv4 and IPv6 addresses (as this cluster has dual-stack enabled) and
select the `.spec.ClusterIP` from the list of `.spec.ClusterIPs` based on the address family of
the first element in the `.spec.ipFamilies` array.
-->
創建以下顯式定義 `.spec.ipFamilyPolicy` 爲 `PreferDualStack` 的 Service。
Kubernetes 將分配 IPv4 和 IPv6 地址（因爲該集羣啓用了雙棧），
並根據 `.spec.ipFamilies` 數組中第一個元素的地址族，
從 `.spec.ClusterIPs` 列表中選擇 `.spec.ClusterIP`。

{{% code_sample file="service/networking/dual-stack-preferred-svc.yaml" %}}

{{< note >}}
<!--
The `kubectl get svc` command will only show the primary IP in the `CLUSTER-IP` field.
-->
`kubectl get svc` 命令將僅在 `CLUSTER-IP` 字段中顯示主 IP。

```shell
kubectl get svc -l app.kubernetes.io/name=MyApp
```

```
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-service   ClusterIP   10.0.216.242   <none>        80/TCP    5s
```
{{< /note >}}

<!-- 
Validate that the Service gets cluster IPs from the IPv4 and IPv6 address blocks using
`kubectl describe`. You may then validate access to the service via the IPs and ports.
-->
使用 `kubectl describe` 驗證服務是否從 IPv4 和 IPv6 地址塊中獲取了集羣 IP。
然後你就可以通過 IP 和端口，驗證對服務的訪問。

```shell
kubectl describe svc -l app.kubernetes.io/name=MyApp
```

```
Name:              my-service
Namespace:         default
Labels:            app.kubernetes.io/name=MyApp
Annotations:       <none>
Selector:          app.kubernetes.io/name=MyApp
Type:              ClusterIP
IP Family Policy:  PreferDualStack
IP Families:       IPv4,IPv6
IP:                10.0.216.242
IPs:               10.0.216.242,2001:db8:fd00::af55
Port:              <unset>  80/TCP
TargetPort:        9376/TCP
Endpoints:         <none>
Session Affinity:  None
Events:            <none>
```

<!--
### Create a dual-stack load balanced Service

If the cloud provider supports the provisioning of IPv6 enabled external load balancers,
create the following Service with `PreferDualStack` in `.spec.ipFamilyPolicy`, `IPv6` as
the first element of the `.spec.ipFamilies` array and the `type` field set to `LoadBalancer`.
-->
### 創建雙協議棧負載均衡服務   {#create-a-dualstack-load-balanced-service}

如果雲提供商支持配置啓用 IPv6 的外部負載均衡器，則創建如下 Service 時將
`.spec.ipFamilyPolicy` 設置爲 `PreferDualStack`, 並將 `spec.ipFamilies` 字段
的第一個元素設置爲 `IPv6`，將 `type` 字段設置爲 `LoadBalancer`：

{{% code_sample file="service/networking/dual-stack-prefer-ipv6-lb-svc.yaml" %}}

<!--
Check the Service:
-->
檢查服務：

```shell
kubectl get svc -l app.kubernetes.io/name=MyApp
```

<!--
Validate that the Service receives a `CLUSTER-IP` address from the IPv6 address block
along with an `EXTERNAL-IP`. You may then validate access to the service via the IP and port.
-->
驗證服務是否從 IPv6 地址塊中接收到 `CLUSTER-IP` 地址以及 `EXTERNAL-IP`。
然後，你可以通過 IP 和端口驗證對服務的訪問。

```
NAME         TYPE           CLUSTER-IP            EXTERNAL-IP        PORT(S)        AGE
my-service   LoadBalancer   2001:db8:fd00::7ebc   2603:1030:805::5   80:30790/TCP   35s
```
