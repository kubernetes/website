---
title: Pod Hostname
content_type: concept
weight: 85
---

<!-- overview -->

このページでは、Podのhostnameを設定する方法、その設定後に起こり得る副作用、そして基盤となる仕組みについて説明します。

<!-- body -->

## Podのデフォルトのhostname
Podが作成されると、(Pod内部から観測される)そのhostnameは、Podのmetadata.nameの値から導き出されます。
hostnameと、それに対応する完全修飾ドメイン名(FQDN)の両方が(Podの視点からは)metadata.nameの値に設定されます。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-1
spec:
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```

このmanifestで作成されたPodは、hostnameと完全修飾ドメイン名(FQDN)が`busybox-1`に設定されます。

## Podのhostnameとsubdomainフィールド
Podのspecには、オプションの`hostname`フィールドがあります。
この値が設定されると、Podの`metadata.name`よりも優先され、(Pod内部から観測される)hostnameとして使われます。
例えば、spec.hostnameが`my-host`に設定されているPodは、hostnameが`my-host`です。

また、Podのspecにはオプションの`subdomain`フィールドもあり、Podが自分のNamespace内のサブドメインに属していることを示します。
もしPodの`spec.hostname`が"foo"、spec.subdomainが"bar"に設定され、さらにNamespaceが`my-namespace`の場合、hostnameは`foo`で、完全修飾ドメイン名(FQDN)は(Podの内部から観測される)`foo.bar.my-namespace.svc.cluster-domain.example`です。

hostnameとsubdomainの両方が設定されていると、クラスターのDNSサーバーはこれらのフィールドに基づいてA/AAAAレコードを作成します。
[Podのhostnameとsubdomainフィールド](/ja/docs/concepts/services-networking/dns-pod-service/#podのhostnameとsubdomainフィールド)を参照してください。

## PodのsetHostnameAsFQDNフィールド

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

Podが完全修飾ドメイン名(FQDN)を持つように設定されている場合、そのhostnameは短いhostnameです。
例えば、Podの完全修飾ドメイン名が`busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`の場合、デフォルトではそのPod内で`hostname`コマンドを実行すると`busybox-1`が返り、`hostname --fqdn`コマンドを実行するとFQDNが返ります。

`setHostnameAsFQDN: true`とsubdomainフィールドがPodのspecに設定されている場合、kubeletはそのPodのNamespaceに対してFQDNをhostnameとして書き込みます。
この場合、`hostname`と`hostname --fqdn`の両方がPodのFQDNを返します。

PodのFQDNは前述と同じ方法で構築されます。
つまり、Podの`spec.hostname`(設定されている場合)または`metadata.name`フィールド、`spec.subdomain`、`namespace`名、そしてクラスタードメインサフィックスで構成されます。

{{< note >}}
Linuxでは、kernelのhostnameフィールド(`struct utsname`の`nodename`フィールド)は64文字に制限されています。

Podがこの機能を有効にし、そのFQDNが64文字を超える場合、起動に失敗します。
そのPodは`Pending`ステータスのままになり(`kubectl`からは`ContainerCreating`と表示)、"Failed to construct FQDN from Pod hostname and cluster domain"などのエラーイベントが生成されます。

つまり、このフィールドを使う場合、Podの`metadata.name`(または`spec.hostname`)と`spec.subdomain`フィールドを組み合わせた長さが64文字を超えないようにする必要があります。
{{< /note >}}

## PodのhostnameOverride
{{< feature-state feature_gate_name="HostnameOverride" >}}

Podのspecで`hostnameOverride`に値を設定すると、kubeletは無条件にその値をPodのhostnameとFQDN両方に設定します。

`hostnameOverride`フィールドには64文字の長さ制限があり、[RFC 1123](https://datatracker.ietf.org/doc/html/rfc1123)で定義されているDNSのサブドメイン名の基準に従う必要があります。

例:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-2-busybox-example-domain
spec:
  hostnameOverride: busybox-2.busybox.example.domain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```
{{< note >}}
これはPod内のhostnameにのみ影響し、クラスターのDNSサーバーにおけるPodのAレコードやAAAAレコードには影響しません。
{{< /note >}}

`hostnameOverride`が`hostname`や`subdomain`フィールドと同時に設定されている場合:
* Pod内のhostnameは`hostnameOverride`の値に上書きされます。

* クラスターのDNSサーバーにおけるPodのA/AAAAレコードは、`hostname`と`subdomain`フィールドに基づいて引き続き生成されます。

Note: `hostnameOverride`が設定されている場合、`hostNetwork`と`setHostnameAsFQDN`フィールドを同時に設定することはできません。
APIサーバーは、この組み合わせで作成要求が行われた場合、明示的に拒否します。

`hostnameOverride`が他のフィールド(hostname、subdomain、setHostnameAsFQDN、hostNetwork)と組み合わされた時の動作の詳細については、[KEP-4762の設計詳細](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/4762-allow-arbitrary-fqdn-as-pod-hostname/README.md#design-details)の表を参照してください。