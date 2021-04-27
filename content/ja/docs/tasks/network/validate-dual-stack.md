---
min-kubernetes-server-version: v1.20
title: IPv4/IPv6デュアルスタックの検証
content_type: task
---

<!-- overview -->
このドキュメントでは、IPv4/IPv6デュアルスタックが有効化されたKubernetesクラスターを検証する方法について共有します。


## {{% heading "prerequisites" %}}


* プロバイダーがデュアルスタックのネットワークをサポートしていること (クラウドプロバイダーか、ルーティングできるIPv4/IPv6ネットワークインターフェイスを持つKubernetesノードが提供できること)
* (KubenetやCalicoなど)デュアルスタックをサポートする[ネットワークプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
* [デュアルスタックを有効化](/ja/docs/concepts/services-networking/dual-stack/)したクラスター

{{< version-check >}}



<!-- steps -->

## アドレスの検証

### ノードアドレスの検証

各デュアルスタックのノードは、1つのIPv4ブロックと1つのIPv6ブロックを割り当てる必要があります。IPv4/IPv6のPodアドレスの範囲が設定されていることを検証するには、次のコマンドを実行します。例の中のノード名は、自分のクラスターの有効なデュアルスタックのノードの名前に置換してください。この例では、ノードの名前は`k8s-linuxpool1-34450317-0`になっています。

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .spec.podCIDRs}}{{printf "%s\n" .}}{{end}}'
```
```
10.244.1.0/24
a00:100::/24
```

IPv4ブロックとIPv6ブロックがそれぞれ1つずつ割り当てられているはずです。

ノードが検出されたIPv4とIPv6のインターフェイスを持っていることを検証します。ノード名は自分のクラスター内の有効なノード名に置換してください。この例では、ノード名は`k8s-linuxpool1-34450317-0`になっています。

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .status.addresses}}{{printf "%s: %s\n" .type .address}}{{end}}'
```
```
Hostname: k8s-linuxpool1-34450317-0
InternalIP: 10.240.0.5
InternalIP: 2001:1234:5678:9abc::5
```

### Podアドレスの検証

PodにIPv4とIPv6のアドレスが割り当てられていることを検証します。Podの名前は自分のクラスター内の有効なPodの名前と置換してください。この例では、Podの名前は`pod01`になっています。

```shell
kubectl get pods pod01 -o go-template --template='{{range .status.podIPs}}{{printf "%s\n" .ip}}{{end}}'
```
```
10.244.1.4
a00:100::4
```

Downward APIを使用して、`status.podIPs`のfieldPath経由でPod IPを検証することもできます。次のスニペットは、Pod IPを`MY_POD_IPS`という名前の環境変数経由でコンテナ内に公開する方法を示しています。

```
        env:
        - name: MY_POD_IPS
          valueFrom:
            fieldRef:
              fieldPath: status.podIPs
```

次のコマンドを実行すると、`MY_POD_IPS`環境変数の値をコンテナ内から表示できます。値はカンマ区切りのリストであり、PodのIPv4とIPv6のアドレスに対応しています。

```shell
kubectl exec -it pod01 -- set | grep MY_POD_IPS
```
```
MY_POD_IPS=10.244.1.4,a00:100::4
```

PodのIPアドレスは、コンテナ内の`/etc/hosts`にも書き込まれます。次のコマンドは、デュアルスタックのPod上で`/etc/hosts`に対してcatコマンドを実行します。出力を見ると、Pod用のIPv4およびIPv6のIPアドレスの両方が確認できます。

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

## Serviceの検証

`.spec.isFamilyPolicy`を明示的に定義していない、以下のようなServiceを作成してみます。Kubernetesは最初に設定した`service-cluster-ip-range`の範囲からServiceにcluster IPを割り当てて、`.spec.ipFamilyPolicy`を`SingleStack`に設定します。

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

`kubectl`を使ってServiceのYAMLを表示します。

```shell
kubectl get svc my-service -o yaml
```

Serviceの`.spec.ipFamilyPolicy`は`SingleStack`に設定され、`.spec.clusterIP`にはkube-controller-manager上の`--service-cluster-ip-range`フラグで最初に設定した範囲から1つのIPv4アドレスが設定されているのがわかります。

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

`.spec.ipFamilies`内の配列の1番目の要素に`IPv6`を明示的に指定した、次のようなServiceを作成してみます。Kubernetesは`service-cluster-ip-range`で設定したIPv6の範囲からcluster IPを割り当てて、`.spec.ipFamilyPolicy`を`SingleStack`に設定します。

{{< codenew file="service/networking/dual-stack-ipfamilies-ipv6.yaml" >}}

`kubectl`を使ってServiceのYAMLを表示します。

```shell
kubectl get svc my-service -o yaml
```

Serviceの`.spec.ipFamilyPolicy`は`SingleStack`に設定され、`.spec.clusterIP`には、kube-controller-manager上の`--service-cluster-ip-range`フラグで指定された最初の設定範囲から1つのIPv6アドレスが設定されているのがわかります。

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

`.spec.ipFamiliePolicy`に`PreferDualStack`を明示的に指定した、次のようなServiceを作成してみます。Kubernetesは(クラスターでデュアルスタックを有効化しているため)IPv4およびIPv6のアドレスの両方を割り当て、`.spec.ClusterIPs`のリストから、`.spec.ipFamilies`配列の最初の要素のアドレスファミリーに基づいた`.spec.ClusterIP`を設定します。

{{< codenew file="service/networking/dual-stack-preferred-svc.yaml" >}}

{{< note >}}
`kubectl get svc`コマンドは、`CLUSTER-IP`フィールドにプライマリーのIPだけしか表示しません。

```shell
kubectl get svc -l app=MyApp

NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-service   ClusterIP   10.0.216.242   <none>        80/TCP    5s
```
{{< /note >}}

`kubectl describe`を使用して、ServiceがIPv4およびIPv6アドレスのブロックからcluster IPを割り当てられていることを検証します。その後、ServiceにIPアドレスとポートを使用してアクセスできることを検証することもできます。

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

### デュアルスタックのLoadBalancer Serviceを作成する

クラウドプロバイダーがIPv6を有効化した外部ロードバランサーのプロビジョニングをサポートする場合、`.spec.ipFamilyPolicy`に`PreferDualStack`を指定し、`.spec.ipFamilies`の最初の要素を`IPv6`にして、`type`フィールドに`LoadBalancer`を指定したServiceを作成できます。

{{< codenew file="service/networking/dual-stack-prefer-ipv6-lb-svc.yaml" >}}

Serviceを確認します。

```shell
kubectl get svc -l app=MyApp
```

ServiceがIPv6アドレスブロックから`CLUSTER-IP`のアドレスと`EXTERNAL-IP`を割り当てられていることを検証します。その後、IPとポートを用いたServiceへのアクセスを検証することもできます。

```shell
NAME         TYPE           CLUSTER-IP   EXTERNAL-IP        PORT(S)        AGE
my-service   LoadBalancer   fd00::7ebc   2603:1030:805::5   80:30790/TCP   35s
```
