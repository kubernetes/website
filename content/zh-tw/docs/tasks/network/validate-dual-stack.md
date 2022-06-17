---
title: 驗證 IPv4/IPv6 雙協議棧
min-kubernetes-server-version: v1.23
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
本文分享瞭如何驗證 IPv4/IPv6 雙協議棧的 Kubernetes 叢集。

## {{% heading "prerequisites" %}}

<!--
* Provider support for dual-stack networking (Cloud provider or otherwise must be able to provide Kubernetes nodes with routable IPv4/IPv6 network interfaces)
* A [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) that supports dual-stack networking.
* [Dual-stack enabled](/docs/concepts/services-networking/dual-stack/) cluster
-->
* 提供程式對雙協議棧網路的支援 (雲供應商或其他方式必須能夠為 Kubernetes 節點
  提供可路由的 IPv4/IPv6 網路介面)
* 一個能夠支援[雙協議棧](/zh-cn/docs/concepts/services-networking/dual-stack/)的
  [網路外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)。
  
* [啟用雙協議棧](/zh-cn/docs/concepts/services-networking/dual-stack/) 叢集

{{< version-check >}}

<!--
While you can validate with an earlier version, the feature is only GA and officially supported since v1.23.
-->
{{< note >}}
雖然你可以使用較早的版本進行驗證，但該功能是從 v1.23 版本進入 GA 狀態並正式支援的。
{{< /note >}}

<!-- steps -->

<!--
## Validate addressing

### Validate node addressing

Each dual-stack Node should have a single IPv4 block and a single IPv6 block allocated. Validate that IPv4/IPv6 Pod address ranges are configured by running the following command. Replace the sample node name with a valid dual-stack Node from your cluster. In this example, the Node's name is `k8s-linuxpool1-34450317-0`:
-->
## 驗證定址

### 驗證節點定址

每個雙協議棧節點應分配一個 IPv4 塊和一個 IPv6 塊。
透過執行以下命令來驗證是否配置了 IPv4/IPv6 Pod 地址範圍。
將示例節點名稱替換為叢集中的有效雙協議棧節點。
在此示例中，節點的名稱為 `k8s-linuxpool1-34450317-0`：

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
應該分配一個 IPv4 塊和一個 IPv6 塊。

<!--
Validate that the node has an IPv4 and IPv6 interface detected. Replace node name with a valid node from the cluster. In this example the node name is `k8s-linuxpool1-34450317-0`: 
-->
驗證節點是否檢測到 IPv4 和 IPv6 介面。用叢集中的有效節點替換節點名稱。
在此示例中，節點名稱為 `k8s-linuxpool1-34450317-0`：

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

Validate that a Pod has an IPv4 and IPv6 address assigned. Replace the Pod name with a valid Pod in your cluster. In this example the Pod name is `pod01`.
-->
### 驗證 Pod 定址

驗證 Pod 已分配了 IPv4 和 IPv6 地址。用叢集中的有效 Pod 替換 Pod 名稱。
在此示例中，Pod 名稱為 `pod01`：

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
你也可以透過 `status.podIPs` 使用 Downward API 驗證 Pod IP。
以下程式碼段演示瞭如何透過容器內稱為 `MY_POD_IPS` 的環境變數公開 Pod 的 IP 地址。

```yaml
env:
- name: MY_POD_IPS
  valueFrom:
    fieldRef:
      fieldPath: status.podIPs
```

<!--
The following command prints the value of the `MY_POD_IPS` environment variable from within a container. The value is a comma separated list that corresponds to the Pod's IPv4 and IPv6 addresses.
-->
使用以下命令打印出容器內部 `MY_POD_IPS` 環境變數的值。
該值是一個逗號分隔的列表，與 Pod 的 IPv4 和 IPv6 地址相對應。

```shell
kubectl exec -it pod01 -- set | grep MY_POD_IPS
```

```
MY_POD_IPS=10.244.1.4,a00:100::4
```

<!--
The Pod's IP addresses will also be written to `/etc/hosts` within a container. The following command executes a cat on `/etc/hosts` on a dual stack Pod. From the output you can verify both the IPv4 and IPv6 IP address for the Pod.
-->
Pod 的 IP 地址也將被寫入容器內的 `/etc/hosts` 檔案中。
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
a00:100::4    pod01
```

<!--
## Validate Services

Create the following Service that does not explicitly define `.spec.ipFamilyPolicy`. Kubernetes will assign a cluster IP for the Service from the first configured `service-cluster-ip-range` and set the `.spec.ipFamilyPolicy` to `SingleStack`.
-->
## 驗證服務

建立以下未顯式定義 `.spec.ipFamilyPolicy` 的 Service。
Kubernetes 將從首個配置的 `service-cluster-ip-range` 給 Service 分配叢集 IP，
並將 `.spec.ipFamilyPolicy` 設定為 `SingleStack`。

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

<!-- 
Use `kubectl` to view the YAML for the Service.
-->
使用 `kubectl` 檢視 Service 的 YAML 定義。

```shell
kubectl get svc my-service -o yaml
```

<!--
The Service has `.spec.ipFamilyPolicy` set to `SingleStack` and `.spec.clusterIP` set to an IPv4 address from the first configured range set via `--service-cluster-ip-range` flag on kube-controller-manager.
-->
該 Service 透過在 kube-controller-manager 的 `--service-cluster-ip-range` 
標誌設定的第一個配置範圍，將 `.spec.ipFamilyPolicy` 設定為 `SingleStack`，
將 `.spec.clusterIP` 設定為 IPv4 地址。

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
    app: MyApp
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

<!--
Create the following Service that explicitly defines `IPv6` as the first array element in `.spec.ipFamilies`. Kubernetes will assign a cluster IP for the Service from the IPv6 range configured `service-cluster-ip-range` and set the `.spec.ipFamilyPolicy` to `SingleStack`.
-->
建立以下顯示定義 `.spec.ipFamilies` 陣列中的第一個元素為 IPv6 的 Service。
Kubernetes 將 `service-cluster-ip-range` 配置的 IPv6 地址範圍給 Service 分配叢集 IP，
並將 `.spec.ipFamilyPolicy` 設定為 `SingleStack`。

{{< codenew file="service/networking/dual-stack-ipfamilies-ipv6.yaml" >}}

<!-- 
Use `kubectl` to view the YAML for the Service.
-->
使用 `kubectl` 檢視 Service 的 YAML 定義。

```shell
kubectl get svc my-service -o yaml
```

<!-- 
The Service has `.spec.ipFamilyPolicy` set to `SingleStack` and `.spec.clusterIP` set to an IPv6 address from the IPv6 range set via `--service-cluster-ip-range` flag on kube-controller-manager.
-->
該 Service 透過在 kube-controller-manager 的 `--service-cluster-ip-range` 
標誌設定的 IPv6 地址範圍，將 `.spec.ipFamilyPolicy` 設定為 `SingleStack`，
將 `.spec.clusterIP` 設定為 IPv6 地址。

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: MyApp
  name: my-service
spec:
  clusterIP: fd00::5118
  clusterIPs:
  - fd00::5118
  ipFamilies:
  - IPv6
  ipFamilyPolicy: SingleStack
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: MyApp
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

<!--
Create the following Service that explicitly defines `PreferDualStack` in `.spec.ipFamilyPolicy`. Kubernetes will assign both IPv4 and IPv6 addresses (as this cluster has dual-stack enabled) and select the `.spec.ClusterIP` from the list of `.spec.ClusterIPs` based on the address family of the first element in the `.spec.ipFamilies` array.
-->
建立以下顯式定義 `.spec.ipFamilyPolicy` 為 `PreferDualStack` 的 Service。
Kubernetes 將分配 IPv4 和 IPv6 地址（因為該叢集啟用了雙棧），
並根據 `.spec.ipFamilies` 陣列中第一個元素的地址族，
從 `.spec.ClusterIPs` 列表中選擇 `.spec.ClusterIP`。

{{< codenew file="service/networking/dual-stack-preferred-svc.yaml" >}}

{{< note >}}
<!--
The `kubectl get svc` command will only show the primary IP in the `CLUSTER-IP` field.
-->
`kubectl get svc` 命令將僅在 `CLUSTER-IP` 欄位中顯示主 IP。

```shell
kubectl get svc -l app=MyApp

NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
my-service   ClusterIP   fe80:20d::d06b   <none>        80/TCP    9s
```
{{< /note >}}

<!-- 
Validate that the Service gets cluster IPs from the IPv4 and IPv6 address blocks using `kubectl describe`. You may then validate access to the service via the IPs and ports.
-->
使用 `kubectl describe` 驗證服務是否從 IPv4 和 IPv6 地址塊中獲取了叢集 IP。
然後你就可以透過 IP 和埠，驗證對服務的訪問。

```shell
kubectl describe svc -l app=MyApp
```

```
Name:              my-service
Namespace:         default
Labels:            app=MyApp
Annotations:       <none>
Selector:          app=MyApp
Type:              ClusterIP
IP Family Policy:  PreferDualStack
IP Families:       IPv4,IPv6
IP:                10.0.216.242
IPs:               10.0.216.242,fd00::af55
Port:              <unset>  80/TCP
TargetPort:        9376/TCP
Endpoints:         <none>
Session Affinity:  None
Events:            <none>
```

<!--
### Create a dual-stack load balanced Service

If the cloud provider supports the provisioning of IPv6 enabled external load balancers, create the following Service with `PreferDualStack` in `.spec.ipFamilyPolicy`. `IPv6` as the first element of the `.spec.ipFamilies` array and the `type` field set to `LoadBalancer`.
-->
### 建立雙協議棧負載均衡服務

如果雲提供商支援配置啟用 IPv6 的外部負載均衡器，則建立如下 Service 時將
`.spec.ipFamilyPolicy` 設定為 `PreferDualStack`, 並將 `spec.ipFamilies` 欄位
的第一個元素設定為 `IPv6`，將 `type` 欄位設定為 `LoadBalancer`：

{{< codenew file="service/networking/dual-stack-prefer-ipv6-lb-svc.yaml" >}}

<!--
Check the Service:
-->
檢查服務：

```shell
kubectl get svc -l app=MyApp
```

<!--
Validate that the Service receives a `CLUSTER-IP` address from the IPv6 address block along with an `EXTERNAL-IP`. You may then validate access to the service via the IP and port. 
-->
驗證服務是否從 IPv6 地址塊中接收到 `CLUSTER-IP` 地址以及 `EXTERNAL-IP`。
然後，你可以透過 IP 和埠驗證對服務的訪問。

```
NAME         TYPE           CLUSTER-IP   EXTERNAL-IP        PORT(S)        AGE
my-service   LoadBalancer   fd00::7ebc   2603:1030:805::5   80:30790/TCP   35s
```

