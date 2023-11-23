---
title: HostAliasesを使用してPodの/etc/hostsにエントリーを追加する
content_type: task
weight: 60
min-kubernetes-server-version: 1.7
---


<!-- overview -->

Podの`/etc/hosts`ファイルにエントリーを追加すると、DNSやその他の選択肢を利用できない場合に、Podレベルでホスト名の名前解決を上書きできるようになります。このようなカスタムエントリーは、PodSpecのHostAliasesフィールドに追加できます。

HostAliasesを使用せずにファイルを修正することはおすすめできません。このファイルはkubeletが管理しており、Podの作成や再起動時に上書きされる可能性があるためです。


<!-- steps -->

## デフォルトのhostsファイルの内容

Nginx Podを実行すると、Pod IPが割り当てられます。

```shell
kubectl run nginx --image nginx
```

```
pod/nginx created
```

Pod IPを確認します。

```shell
kubectl get pods --output=wide
```

```
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```

hostsファイルの内容は次のようになります。

```shell
kubectl exec nginx -- cat /etc/hosts
```

```
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.4	nginx
```

デフォルトでは、`hosts`ファイルには、`localhost`やPod自身のホスト名などのIPv4とIPv6のボイラープレートだけが含まれています。

## 追加エントリーをhostAliasesに追加する

デフォルトのボイラープレートに加えて、`hosts`ファイルに追加エントリーを追加できます。たとえば、`foo.local`と`bar.local`を`127.0.0.1`に、`foo.remote`と`bar.remote`を`10.1.2.3`にそれぞれ解決するためには、PodのHostAliasesを`.spec.hostAliases`以下に設定します。

{{% codenew file="service/networking/hostaliases-pod.yaml" %}}

この設定を使用したPodを開始するには、次のコマンドを実行します。

```shell
kubectl apply -f https://k8s.io/examples/service/networking/hostaliases-pod.yaml
```

```
pod/hostaliases-pod created
```

Podの詳細情報を表示して、IPv4アドレスと状態を確認します。

```shell
kubectl get pod --output=wide
```

```
NAME                           READY     STATUS      RESTARTS   AGE       IP              NODE
hostaliases-pod                0/1       Completed   0          6s        10.200.0.5      worker0
```

`hosts`ファイルの内容は次のようになります。

```shell
kubectl logs hostaliases-pod
```

```
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.5	hostaliases-pod

# Entries added by HostAliases.
127.0.0.1	foo.local	bar.local
10.1.2.3	foo.remote	bar.remote
```

ファイルの最後に追加エントリーが指定されています。

## kubeletがhostsファイルを管理するのはなぜですか？ {#why-does-kubelet-manage-the-hosts-file}

kubeletがPodの各コンテナの`hosts`ファイルを[管理する](https://github.com/kubernetes/kubernetes/issues/14633)のは、コンテナ起動後にDockerがファイルを[編集する](https://github.com/moby/moby/issues/17190)のを防ぐためです。

{{< caution >}}
コンテナ内部でhostsファイルを手動で変更するのは控えてください。

hostsファイルを手動で変更すると、コンテナが終了したときに変更が失われてしまいます。
{{< /caution >}}
