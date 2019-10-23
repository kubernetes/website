---
title: Minikubeを使用してローカル環境でKubernetesを動かす
content_template: templates/concept
---

{{% capture overview %}}

Minikubeはローカル環境でKubernetesを簡単に実行するためのツールです。Kubernetesを試したり日々の開発への使用を検討するユーザー向けに、PC上のVM内でシングルノードのKubernetesクラスタを実行することができます。

{{% /capture %}}

{{% capture body %}}

## Minikubeの機能

* MinikubeのサポートするKubernetesの機能:
  * DNS
  * NodePorts
  * ConfigMapsとSecrets
  * ダッシュボード
  * コンテナランタイム: Docker, [rkt](https://github.com/rkt/rkt), [CRI-O](https://github.com/kubernetes-incubator/cri-o), [containerd](https://github.com/containerd/containerd)
  * CNI (Container Network Interface) の有効化
  * Ingress

## インストール

[Minikubeのインストール](/docs/tasks/tools/install-minikube/) を参照

## クイックスタート

これはMinikubeの使い方の簡単なデモです。
もしVMドライバを変更したい場合は、適切な `--vm-driver=xxx` フラグを `minikube start` に設定してください。Minikubeは以下のドライバをサポートしています。

* virtualbox
* vmwarefusion
* kvm2 ([driver installation](https://git.k8s.io/minikube/docs/drivers.md#kvm2-driver))
* kvm ([driver installation](https://git.k8s.io/minikube/docs/drivers.md#kvm-driver))
* hyperkit ([driver installation](https://git.k8s.io/minikube/docs/drivers.md#hyperkit-driver))
* xhyve ([driver installation](https://git.k8s.io/minikube/docs/drivers.md#xhyve-driver)) (非推奨)
* hyperv ([driver installation](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#hyperv-driver))
注意: 以下のIPは動的であり、変更される可能性があります。IPは `minikube ip` で取得することができます。
* none (VMではなくホスト上でKubernetesコンポーネントを起動する。このドライバを使用するにはDocker ([docker install](https://docs.docker.com/install/linux/docker-ce/ubuntu/)) とLinux環境を必要とします)

```shell
minikube start
```
```
Starting local Kubernetes cluster...
Running pre-create checks...
Creating machine...
Starting local Kubernetes cluster...
```
```shell
kubectl run hello-minikube --image=k8s.gcr.io/echoserver:1.10 --port=8080
```
```
deployment.apps/hello-minikube created
```

```shell
kubectl expose deployment hello-minikube --type=NodePort
```
```
service/hello-minikube exposed
```
```
# We have now launched an echoserver pod but we have to wait until the pod is up before curling/accessing it
# via the exposed service.
# To check whether the pod is up and running we can use the following:
kubectl get pod
```
```
NAME                              READY     STATUS              RESTARTS   AGE
hello-minikube-3383150820-vctvh   0/1       ContainerCreating   0          3s
```
```shell
# We can see that the pod is still being created from the ContainerCreating status
kubectl get pod
```
```
NAME                              READY     STATUS    RESTARTS   AGE
hello-minikube-3383150820-vctvh   1/1       Running   0          13s
```
```shell
# We can see that the pod is now Running and we will now be able to curl it:
curl $(minikube service hello-minikube --url)
```
```

Hostname: hello-minikube-7c77b68cff-8wdzq

Pod Information:
	-no pod information available-

Server values:
	server_version=nginx: 1.13.3 - lua: 10008

Request Information:
	client_address=172.17.0.1
	method=GET
	real path=/
	query=
	request_version=1.1
	request_scheme=http
	request_uri=http://192.168.99.100:8080/

Request Headers:
	accept=*/*
	host=192.168.99.100:30674
	user-agent=curl/7.47.0

Request Body:
	-no body in request-
```

```shell
kubectl delete services hello-minikube
```
```
service "hello-minikube" deleted
```

```shell
kubectl delete deployment hello-minikube
```
```
deployment.extensions "hello-minikube" deleted
```

```shell
minikube stop
```
```
Stopping local Kubernetes cluster...
Stopping "minikube"...
```

### コンテナランタイムの代替

#### containerd

[containerd](https://github.com/containerd/containerd) をコンテナランタイムとして使用するには以下を実行してください:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=containerd \
    --bootstrapper=kubeadm
```

もしくは拡張バージョンを使用することもできます:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=unix:///run/containerd/containerd.sock \
    --extra-config=kubelet.image-service-endpoint=unix:///run/containerd/containerd.sock \
    --bootstrapper=kubeadm
```

#### CRI-O

[CRI-O](https://github.com/kubernetes-incubator/cri-o) をコンテナランタイムとして使用するには以下を実行してください:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=cri-o \
    --bootstrapper=kubeadm
```

もしくは拡張バージョンを使用することもできます:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=/var/run/crio.sock \
    --extra-config=kubelet.image-service-endpoint=/var/run/crio.sock \
    --bootstrapper=kubeadm
```

#### rktコンテナエンジン

[rkt](https://github.com/rkt/rkt) をコンテナランタイムとして使用するには以下を実行してください:

```shell
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=rkt
```

これはrktとDockerの両方を含んだ代替のMinikubeのISOイメージを使用し、CNIネットワークを有効にします。

### ドライバープラグイン

サポートされているドライバとプラグインのインストールの詳細については [DRIVERS](https://git.k8s.io/minikube/docs/drivers.md) を参照してください。

### Dockerデーモンの再利用によるローカルイメージの使用

Kubernetesの単一のVMを使用する場合、Minikube組み込みのDockerデーモンの再利用がおすすめです。ホストマシン上にDockerレジストリを構築してイメージをプッシュする必要がなく、ローカルでの実験を加速させるMinikubeと同じDockerデーモンの中に構築することができます。ただDockerイメージに'latest'以外のタグを付け、そのタグを使用してイメージをプルしてください。イメージのバージョンを指定しなければ、`Always` のプルイメージポリシーにより `:latest` と仮定され、もしデフォルトのDockerレジストリ(通常はDockerHub)にどのバージョンのDockerイメージもまだ存在しない場合には、`ErrImagePull` になる恐れがあります。

Mac/LinuxのホストでDockerデーモンを操作できるようにするには、shell内で `docker-env command` を使います:

```shell
eval $(minikube docker-env)
```

これにより、MinikubeのVM内のDockerデーモンと通信しているホストのMac/LinuxマシンのコマンドラインでDockerを使用できるようになっているはずです。

```shell
docker ps
```

CentOS 7では、Dockerが以下のエラーを出力することがあります:

```shell
Could not read CA certificate "/etc/docker/ca.pem": open /etc/docker/ca.pem: no such file or directory
```

修正方法としては、/etc/sysconfig/docker を更新してMinikube環境の変更が確実に反映されるようにすることです:

```shell
< DOCKER_CERT_PATH=/etc/docker
---
> if [ -z "${DOCKER_CERT_PATH}" ]; then
>   DOCKER_CERT_PATH=/etc/docker
> fi
```

imagePullPolicy:Alwaysをオフにすることを忘れないでください: さもなければKubernetesはローカルに構築したイメージを使用しません。

## クラスターの管理

### クラスターの起動

`minikube start` コマンドはクラスターを起動することができます。
このコマンドはシングルノードのKubernetesクラスターを実行する仮想マシンを作成・設定します。
また、このクラスターと通信する [kubectl](/docs/user-guide/kubectl-overview/) のインストールも設定します。

もしWebプロキシーを通している場合、そのプロキシー情報を `minikube start` コマンドに渡す必要があります:

```shell
https_proxy=<my proxy> minikube start --docker-env http_proxy=<my proxy> --docker-env https_proxy=<my proxy> --docker-env no_proxy=192.168.99.0/24
```

残念なことに、ただ環境変数を設定するだけではうまく動作しません。

Minikubeは "minikube" コンテキストも作成し、そのコンテキストをデフォルト設定としてkubectlに設定します。
あとでコンテキストを切り戻すには、このコマンドを実行してください: `kubectl config use-context minikube`

#### Kubernetesバージョンの指定

`minikube start` コマンドに `--kubernetes-version` 文字列を追加することで、
MinikubeにKubernetesの特定のバージョンを指定することができます。
例えば、`v1.7.3` のバージョンを実行するには以下を実行します:

```
minikube start --kubernetes-version v1.7.3
```

### Kubernetesの設定

Minikubeにはユーザーが任意の値でKubenetesコンポーネントを設定することを可能にする "configurator" 機能があります。
この機能を使うには、`minikube start` コマンドに `--extra-config` フラグを使うことができます。

このフラグは繰り返されるので、複数のオプションを設定するためにいくつかの異なる値を使って何度も渡すことができます。

このフラグは `component.key=value` 形式の文字列を取ります。`component` は下記のリストの文字列の1つです。
`key`は設定構造体上の値で、 `value` は設定する値です。

各コンポーネントのKubernetes `componentconfigs` のドキュメントを調べることで有効なキーを見つけることができます。
サポートされている各設定のドキュメントは次のとおりです:

* [kubelet](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/config#KubeletConfiguration)
* [apiserver](https://godoc.org/k8s.io/kubernetes/cmd/kube-apiserver/app/options#ServerRunOptions)
* [proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)
* [controller-manager](https://godoc.org/k8s.io/kubernetes/pkg/controller/apis/config#KubeControllerManagerConfiguration)
* [etcd](https://godoc.org/github.com/coreos/etcd/etcdserver#ServerConfig)
* [scheduler](https://godoc.org/k8s.io/kubernetes/pkg/scheduler/apis/config#KubeSchedulerConfiguration)

#### 例

Kubeletの `MaxPods` 設定を5に変更するには、このフラグを渡します: `--extra-config=kubelet.MaxPods=5`

この機能はネストした構造体もサポートします。スケジューラーの `LeaderElection.LeaderElect` を `true` に設定するには、このフラグを渡します: `--extra-config=scheduler.LeaderElection.LeaderElect=true`

`apiserver` の `AuthorizationMode` を `RABC` に設定するには、このフラグを使います: `--extra-config=apiserver.authorization-mode=RBAC`.

### クラスターの停止
`minikube stop` コマンドを使ってクラスターを停止することができます。
このコマンドはMinikube仮想マシンをシャットダウンしますが、すべてのクラスターの状態とデータを保存します。
クラスターを再起動すると、以前の状態に復元されます。

### クラスターの削除
`minikube delete` コマンドを使ってクラスターを削除することができます。
このコマンドはMinikube仮想マシンをシャットダウンして削除します。データや状態は保存されません。

## クラスターに触れてみよう

### Kubectl

`minikube start` コマンドは "minikube" という[kubectl context](/docs/reference/generated/kubectl/kubectl-commands#-em-set-context-em-)を作成します。
このコンテキストはMinikubeクラスターと通信するための設定が含まれています。

Minikubeはこのコンテキストを自動的にデフォルトに設定しますが、将来的に設定を切り戻す場合には次のコマンドを実行してください:

`kubectl config use-context minikube`,

もしくは各コマンドにコンテキストを次のように渡します: `kubectl get pods --context=minikube`

### ダッシュボード

[Kubernetes Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/)にアクセスするには、Minikubeを起動してアドレスを取得した後、シェルでこのコマンドを実行してください:

```shell
minikube dashboard
```

### サービス

ノードポート経由で公開されているサービスにアクセスするには、Minikubeを起動してアドレスを取得した後、シェルでこのコマンドを実行してください:

```shell
minikube service [-n NAMESPACE] [--url] NAME
```

## ネットワーク

MinikubeのVMは `minikube ip`コマンドで取得できるホストオンリーIPアドレスを介してホストシステムに公開されます。
NodePort上では、 `NodePort` タイプのどのサービスもそのIPアドレスを介してアクセスできます。

サービスのNodePortを決定するには、`kubectl` コマンドを次のように使用します:

`kubectl get service $SERVICE --output='jsonpath="{.spec.ports[0].nodePort}"'`

## 永続ボリューム
Minikubeは `hostPath` タイプの[PersistentVolumes](/docs/concepts/storage/persistent-volumes/)をサポートします。
このPersistentVolumesはMinikubeのVM内のディレクトリーにマッピングされます。

MinikubeのVMはtmpfsで起動するため、ほとんどのディレクトリーは再起動しても持続しません (`minikube stop`)。
しかし、Minikubeは以下のホストディレクトリーに保存されているファイルを保持するように設定されています:

* `/data`
* `/var/lib/minikube`
* `/var/lib/docker`

以下は `/data` ディレクトリのデータを永続化するPersistentVolumeの設定例です:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0001
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 5Gi
  hostPath:
    path: /data/pv0001/
```

## ホストフォルダーのマウント
一部のドライバーはVM内にホストフォルダーをマウントするため、VMとホストの間でファイルを簡単に共有できます。これらは現時点では設定可能ではなく、使用しているドライバーとOSによって異なります。

{{< note >}}
ホストフォルダーの共有はKVMドライバーにはまだ実装されていません。
{{< /note >}}

| Driver | OS | HostFolder | VM |
| --- | --- | --- | --- |
| VirtualBox | Linux | /home | /hosthome |
| VirtualBox | macOS | /Users | /Users |
| VirtualBox | Windows | C://Users | /c/Users |
| VMware Fusion | macOS | /Users | /Users |
| Xhyve | macOS | /Users | /Users |

## プライベートコンテナレジストリ

プライベートコンテナレジストリにアクセスするには、[このページ](/docs/concepts/containers/images/)の手順に従ってください。

`ImagePullSecrets` を使用することをおすすめしますが、MinikubeのVM内でアクセス設定したい場合には、`/home/docker` ディレクトリに `.dockercfg` を置くか、または `/home/docker/.docker` ディレクトリに `config.json` を置いてください。

## アドオン

カスタムアドオンを正しく起動または再起動させるには、
Minikubeで起動したいアドオンを `~/.minikube/addons` ディレクトリに置きます。
このフォルダ内のアドオンはMinikubeのVMに移動され、Minikubeが起動または再起動されるたびにアドオンが起動されます。

## HTTPプロキシ経由のMinikube利用

MinikubeはKubernetesとDockerデーモンを含む仮想マシンを作成します。
KubernetesがDockerを使用してコンテナをスケジュールしようとする際、Dockerデーモンはコンテナをプルするために外部ネットワークを必要とする場合があります。

HTTPプロキシーを通している場合には、プロキシー設定をDockerに提供する必要があります。
これを行うには、`minikube start` に必要な環境変数をフラグとして渡します。

例:

```shell
minikube start --docker-env http_proxy=http://$YOURPROXY:PORT \
               --docker-env https_proxy=https://$YOURPROXY:PORT
```

仮想マシンのアドレスが192.168.99.100の場合、プロキシーの設定により `kubectl` が直接アクセスできない可能性があります。
このIPアドレスのプロキシー設定を迂回するには、以下のようにno_proxy設定を変更する必要があります。

```shell
export no_proxy=$no_proxy,$(minikube ip)
```

## 既知の問題
* クラウドプロバイダーを必要とする機能はMinikubeでは動作しません
  * ロードバランサー
* 複数ノードを必要とする機能
  * 高度なスケジューリングポリシー

## 設計

MinikubeはVMのプロビジョニングに[libmachine](https://github.com/docker/machine/tree/master/libmachine)を使用し、[kubeadm](https://github.com/kubernetes/kubeadm)をKubernetesクラスターのプロビジョニングに使用します。

Minikubeの詳細については、[proposal](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/local-cluster-ux.md)を参照してください。

## 追加リンク集

* **目標と非目標**: Minikubeプロジェクトの目標と非目標については、[ロードマップ](https://git.k8s.io/minikube/docs/contributors/roadmap.md)を参照してください。
* **開発ガイド**: プルリクエストを送る方法の概要については、[CONTRIBUTING.md](https://git.k8s.io/minikube/CONTRIBUTING.md)を参照してください。
* **Minikubeのビルド**: Minikubeをソースからビルド/テストする方法については、[ビルドガイド](https://git.k8s.io/minikube/docs/contributors/build_guide.md)を参照してください。
* **新しい依存性の追加**: Minikubeに新しい依存性を追加する方法については、[依存性追加ガイド](https://git.k8s.io/minikube/docs/contributors/adding_a_dependency.md)を参照してください。
* **新しいアドオンの追加**: Minikubeに新しいアドオンを追加する方法については、[アドオン追加ガイド](https://git.k8s.io/minikube/docs/contributors/adding_an_addon.md)を参照してください。
* **MicroK8s**: 仮想マシンを実行したくないLinuxユーザーは代わりに[MicroK8s](https://microk8s.io/)を検討してみてください。

## コミュニティ

コントリビューションや質問、コメントは歓迎・奨励されています! Minikubeの開発者は[Slack](https://kubernetes.slack.com)の#minikubeチャンネルにいます(Slackへの招待状は[こちら](http://slack.kubernetes.io/))。[kubernetes-dev Google Groupsメーリングリスト](https://groups.google.com/forum/#!forum/kubernetes-dev)もあります。メーリングリストに投稿する際は件名の最初に "minikube: " をつけてください。

{{% /capture %}}
