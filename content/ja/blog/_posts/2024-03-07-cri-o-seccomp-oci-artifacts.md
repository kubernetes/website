---
layout: blog
title: "CRI-O: OCIレジストリからのseccompプロファイルの適用"
date: 2024-03-07
slug: cri-o-seccomp-oci-artifacts
author: >
  Sascha Grunert
translator: >
  Taisuke Okamoto (IDCフロンティア),
  atoato88 (NEC),
  [Junya Okabe](https://github.com/Okabe-Junya) (筑波大学)
---

seccompはセキュアなコンピューティングモードを意味し、Linuxカーネルのバージョン2.6.12以降の機能として提供されました。
これは、プロセスの特権をサンドボックス化し、ユーザースペースからカーネルへの呼び出しを制限するために使用できます。
Kubernetesでは、ノードに読み込まれたseccompプロファイルをPodやコンテナに自動的に適用することができます。

しかし、Kubernetesでseccompプロファイルを配布することは大きな課題です。
なぜなら、JSONファイルがワークロードが実行可能なすべてのノードで利用可能でなければならないからです。
[Security Profiles Operator](https://sigs.k8s.io/security-profiles-operator)などのプロジェクトは、クラスター内でデーモンとして実行することでこの問題を解決しています。
この設定から、[コンテナランタイム](/docs/setup/production-environment/container-runtimes)がこの配布プロセスの一部を担当できるかどうかが興味深い点です。

通常、ランタイムはローカルパスからプロファイルを適用します。たとえば：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
    - name: container
      image: nginx:1.25.3
      securityContext:
        seccompProfile:
          type: Localhost
          localhostProfile: nginx-1.25.3.json
```

プロファイル`nginx-1.25.3.json`はkubeletのルートディレクトリ内に`seccomp`ディレクトリを追加して利用可能でなければなりません。
これは、ディスク上のプロファイルのデフォルトの場所が`/var/lib/kubelet/seccomp/nginx-1.25.3.json`になることを指しています。
プロファイルが利用できない場合、ランタイムは次のようにコンテナの作成に失敗します。

```shell
kubectl get pods
```

```console
NAME   READY   STATUS                 RESTARTS   AGE
pod    0/1     CreateContainerError   0          38s
```

```shell
kubectl describe pod/pod | tail
```

```console
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason     Age                 From               Message
  ----     ------     ----                ----               -------
  Normal   Scheduled  117s                default-scheduler  Successfully assigned default/pod to 127.0.0.1
  Normal   Pulling    117s                kubelet            Pulling image "nginx:1.25.3"
  Normal   Pulled     111s                kubelet            Successfully pulled image "nginx:1.25.3" in 5.948s (5.948s including waiting)
  Warning  Failed     7s (x10 over 111s)  kubelet            Error: setup seccomp: unable to load local profile "/var/lib/kubelet/seccomp/nginx-1.25.3.json": open /var/lib/kubelet/seccomp/nginx-1.25.3.json: no such file or directory
  Normal   Pulled     7s (x9 over 111s)   kubelet            Container image "nginx:1.25.3" already present on machine
```

`Localhost`プロファイルを手動で配布する必要があるという大きな障害は、多くのエンドユーザーが`RuntimeDefault`に戻るか、さらには`Unconfined`(seccompが無効になっている)でワークロードを実行することになる可能性が高いということです。

## CRI-Oが救世主

Kubernetesのコンテナランタイム[CRI-O](https://github.com/cri-o/cri-o)は、カスタムアノテーションを使用してさまざまな機能を提供しています。
v1.30のリリースでは、アノテーションの新しい集合である`seccomp-profile.kubernetes.cri-o.io/POD`と`seccomp-profile.kubernetes.cri-o.io/<CONTAINER>`のサポートが[追加](https://github.com/cri-o/cri-o/pull/7719)されました。
これらのアノテーションを使用すると、以下を指定することができます：

- 特定のコンテナ用のseccompプロファイルは、次のように使用されます:`seccomp-profile.kubernetes.cri-o.io/<CONTAINER>` (例:`seccomp-profile.kubernetes.cri-o.io/webserver: 'registry.example/example/webserver:v1'`)
- Pod内のすべてのコンテナに対するseccompプロファイルは、コンテナ名の接尾辞を使用せず、予約された名前`POD`を使用して次のように使用されます:`seccomp-profile.kubernetes.cri-o.io/POD`
- イメージ全体のseccompプロファイルは、イメージ自体がアノテーション`seccomp-profile.kubernetes.cri-o.io/POD`または`seccomp-profile.kubernetes.cri-o.io/<CONTAINER>`を含んでいる場合に使用されます

CRI-Oは、ランタイムがそれを許可するように構成されている場合、および`Unconfined`として実行されるワークロードに対してのみ、そのアノテーションを尊重します。
それ以外のすべてのワークロードは、引き続き`securityContext`からの値を優先して使用します。

アノテーション単体では、プロファイルの配布にはあまり役立ちませんが、それらの参照方法が役立ちます！
たとえば、OCIアーティファクトを使用して、通常のコンテナイメージのようにseccompプロファイルを指定できるようになりました。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
  annotations:
    seccomp-profile.kubernetes.cri-o.io/POD: quay.io/crio/seccomp:v2
spec: …
```

イメージ`quay.io/crio/seccomp:v2`には、実際のプロファイル内容を含む`seccomp.json`ファイルが含まれています。
[ORAS](https://oras.land)や[Skopeo](https://github.com/containers/skopeo)などのツールを使用して、イメージの内容を検査できます。

```shell
oras pull quay.io/crio/seccomp:v2
```

```console
Downloading 92d8ebfa89aa seccomp.json
Downloaded  92d8ebfa89aa seccomp.json
Pulled [registry] quay.io/crio/seccomp:v2
Digest: sha256:f0205dac8a24394d9ddf4e48c7ac201ca7dcfea4c554f7ca27777a7f8c43ec1b
```

```shell
jq . seccomp.json | head
```

```yaml
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "defaultErrnoRet": 38,
  "defaultErrno": "ENOSYS",
  "archMap": [
    {
      "architecture": "SCMP_ARCH_X86_64",
      "subArchitectures": [
        "SCMP_ARCH_X86",
        "SCMP_ARCH_X32"
```

```shell
# イメージのプレーンマニフェストを調べる
skopeo inspect --raw docker://quay.io/crio/seccomp:v2 | jq .
```

```yaml
{
  "schemaVersion": 2,
  "mediaType": "application/vnd.oci.image.manifest.v1+json",
  "config":
    {
      "mediaType": "application/vnd.cncf.seccomp-profile.config.v1+json",
      "digest": "sha256:ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356",
      "size": 3,
    },
  "layers":
    [
      {
        "mediaType": "application/vnd.oci.image.layer.v1.tar",
        "digest": "sha256:92d8ebfa89aa6dd752c6443c27e412df1b568d62b4af129494d7364802b2d476",
        "size": 18853,
        "annotations": { "org.opencontainers.image.title": "seccomp.json" },
      },
    ],
  "annotations": { "org.opencontainers.image.created": "2024-02-26T09:03:30Z" },
}
```

イメージマニフェストには、特定の必要な構成メディアタイプ(`application/vnd.cncf.seccomp-profile.config.v1+json`)への参照と、`seccomp.json`ファイルを指す単一のレイヤー(`application/vnd.oci.image.layer.v1.tar`)が含まれています。
それでは、この新機能を試してみましょう！

### 特定のコンテナやPod全体に対してアノテーションを使用する

CRI-Oは、アノテーションを利用する前に適切に構成する必要があります。
これを行うには、ランタイムの `allowed_annotations`配列にアノテーションを追加します。
これは、次のようなドロップイン構成`/etc/crio/crio.conf.d/10-crun.conf`を使用して行うことができます：

```toml
[crio.runtime]
default_runtime = "crun"

[crio.runtime.runtimes.crun]
allowed_annotations = [
    "seccomp-profile.kubernetes.cri-o.io",
]
```

それでは、CRI-Oを最新の`main`コミットから実行します。
これは、ソースからビルドするか、[静的バイナリバンドル](https://github.com/cri-o/packaging?tab=readme-ov-file#using-the-static-binary-bundles-directly)を使用するか、[プレリリースパッケージ](https://github.com/cri-o/packaging?tab=readme-ov-file#usage)を使用することで行うことができます。

これを実証するために、[`local-up-cluster.sh`](https://github.com/cri-o/cri-o?tab=readme-ov-file#running-kubernetes-with-cri-o)を使って単一ノードのKubernetesクラスターをセットアップし、コマンドラインから`crio`バイナリを実行しました。
クラスターが起動して実行されているので、seccomp `Unconfined`として実行されているアノテーションのないPodを試してみましょう:

```shell
cat pod.yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
    - name: container
      image: nginx:1.25.3
      securityContext:
        seccompProfile:
          type: Unconfined
```

```shell
kubectl apply -f pod.yaml
```

ワークロードが起動して実行中です:

```shell
kubectl get pods
```

```console
NAME   READY   STATUS    RESTARTS   AGE
pod    1/1     Running   0          15s
```

[`crictl`](https://sigs.k8s.io/cri-tools)を使用してコンテナを検査しても、seccompプロファイルが適用されていないことがわかります:

```shell
export CONTAINER_ID=$(sudo crictl ps --name container -q)
sudo crictl inspect $CONTAINER_ID | jq .info.runtimeSpec.linux.seccomp
```

```console
null
```

では、Podを変更して、コンテナにプロファイル`quay.io/crio/seccomp:v2`を適用します:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
  annotations:
    seccomp-profile.kubernetes.cri-o.io/container: quay.io/crio/seccomp:v2
spec:
  containers:
    - name: container
      image: nginx:1.25.3
```

新しいseccompプロファイルを適用するには、Podを削除して再作成する必要があります。
再作成のみが新しいseccompプロファイルを適用するためです:

```shell
kubectl delete pod/pod
```

```console
pod "pod" deleted
```

```shell
kubectl apply -f pod.yaml
```

```console
pod/pod created
```

CRI-Oのログには、ランタイムがアーティファクトを取得したことが示されます:

```console
WARN[…] Allowed annotations are specified for workload [seccomp-profile.kubernetes.cri-o.io]
INFO[…] Found container specific seccomp profile annotation: seccomp-profile.kubernetes.cri-o.io/container=quay.io/crio/seccomp:v2  id=26ddcbe6-6efe-414a-88fd-b1ca91979e93 name=/runtime.v1.RuntimeService/CreateContainer
INFO[…] Pulling OCI artifact from ref: quay.io/crio/seccomp:v2  id=26ddcbe6-6efe-414a-88fd-b1ca91979e93 name=/runtime.v1.RuntimeService/CreateContainer
INFO[…] Retrieved OCI artifact seccomp profile of len: 18853  id=26ddcbe6-6efe-414a-88fd-b1ca91979e93 name=/runtime.v1.RuntimeService/CreateContainer
```

>And the container is finally using the profile:

そして、コンテナは最終的にプロファイルを使用しています:

```shell
export CONTAINER_ID=$(sudo crictl ps --name container -q)
sudo crictl inspect $CONTAINER_ID | jq .info.runtimeSpec.linux.seccomp | head
```

```yaml
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "defaultErrnoRet": 38,
  "architectures": [
    "SCMP_ARCH_X86_64",
    "SCMP_ARCH_X86",
    "SCMP_ARCH_X32"
  ],
  "syscalls": [
    {
```

ユーザーが接尾辞`/container`を予約名`/POD`に置き換えると、Pod内のすべてのコンテナに対して同じことが機能します。
たとえば:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
  annotations:
    seccomp-profile.kubernetes.cri-o.io/POD: quay.io/crio/seccomp:v2
spec:
  containers:
    - name: container
      image: nginx:1.25.3
```

### コンテナイメージにアノテーションを使用する

特定のワークロードにOCIアーティファクトとしてseccompプロファイルを指定する機能は素晴らしいですが、ほとんどのユーザーはseccompプロファイルを公開されたコンテナイメージに関連付けたいと考えています。
これは、コンテナイメージ自体に適用されるメタデータであるコンテナイメージアノテーションを使用して行うことができます。
たとえば、[Podman](https://podman.io)を使用して、イメージのビルド中に直接イメージアノテーションを追加することができます:

```shell
podman build \
    --annotation seccomp-profile.kubernetes.cri-o.io=quay.io/crio/seccomp:v2 \
    -t quay.io/crio/nginx-seccomp:v2 .
```

プッシュされたイメージには、そのアノテーションが含まれます:

```shell
skopeo inspect --raw docker://quay.io/crio/nginx-seccomp:v2 |
    jq '.annotations."seccomp-profile.kubernetes.cri-o.io"'
```

```console
"quay.io/crio/seccomp:v2"
```

そのイメージを使用して、CRI-OのテストPod定義に組み込む場合：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
  # Podのアノテーションが設定されていません
spec:
  containers:
    - name: container
      image: quay.io/crio/nginx-seccomp:v2
```

その後、CRI-Oのログには、イメージのアノテーションが評価され、プロファイルが適用されたことが示されます:

```shell
kubectl delete pod/pod
```

```console
pod "pod" deleted
```

```shell
kubectl apply -f pod.yaml
```

```console
pod/pod created
```

```console
INFO[…] Found image specific seccomp profile annotation: seccomp-profile.kubernetes.cri-o.io=quay.io/crio/seccomp:v2  id=c1f22c59-e30e-4046-931d-a0c0fdc2c8b7 name=/runtime.v1.RuntimeService/CreateContainer
INFO[…] Pulling OCI artifact from ref: quay.io/crio/seccomp:v2  id=c1f22c59-e30e-4046-931d-a0c0fdc2c8b7 name=/runtime.v1.RuntimeService/CreateContainer
INFO[…] Retrieved OCI artifact seccomp profile of len: 18853  id=c1f22c59-e30e-4046-931d-a0c0fdc2c8b7 name=/runtime.v1.RuntimeService/CreateContainer
INFO[…] Created container 116a316cd9a11fe861dd04c43b94f45046d1ff37e2ed05a4e4194fcaab29ee63: default/pod/container  id=c1f22c59-e30e-4046-931d-a0c0fdc2c8b7 name=/runtime.v1.RuntimeService/CreateContainer
```

```shell
export CONTAINER_ID=$(sudo crictl ps --name container -q)
sudo crictl inspect $CONTAINER_ID | jq .info.runtimeSpec.linux.seccomp | head
```

```yaml
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "defaultErrnoRet": 38,
  "architectures": [
    "SCMP_ARCH_X86_64",
    "SCMP_ARCH_X86",
    "SCMP_ARCH_X32"
  ],
  "syscalls": [
    {
```

コンテナイメージの場合、アノテーション`seccomp-profile.kubernetes.cri-o.io`は`seccomp-profile.kubernetes.cri-o.io/POD`と同様に扱われ、Pod全体に適用されます。
さらに、この機能は、イメージにコンテナ固有のアノテーションを使用する場合にも機能します。
たとえば、コンテナの名前が`container1`の場合：

```shell
skopeo inspect --raw docker://quay.io/crio/nginx-seccomp:v2-container |
    jq '.annotations."seccomp-profile.kubernetes.cri-o.io/container1"'
```

```console
"quay.io/crio/seccomp:v2"
```

この機能の素晴らしい点は、ユーザーが特定のコンテナイメージ用のseccompプロファイルを作成し、同じレジストリ内に並べて保存できることです。
イメージをプロファイルにリンクすることで、アプリケーション全体のライフサイクルを通じてそれらを維持する柔軟性が提供されます。

### ORASを使用してプロファイルをプッシュする

OCIオブジェクトを作成してseccompプロファイルを含めるには、ORASを使用する場合、もう少し作業が必要です。
将来的には、Podmanなどのツールが全体のプロセスをより簡略化することを期待しています。
現時点では、コンテナレジストリが[OCI互換](https://oras.land/docs/compatible_oci_registries/#registries-supporting-oci-artifacts)である必要があります。
これは[Quay.io](https://quay.io)の場合も同様です。
CRI-Oは、seccompプロファイルオブジェクトがコンテナイメージメディアタイプ(`application/vnd.cncf.seccomp-profile.config.v1+json`)を持っていることを期待していますが、ORASはデフォルトで`application/vnd.oci.empty.v1+json`を使用します。
これを実現するために、次のコマンドを実行できます：

```shell
echo "{}" > config.json
oras push \
    --config config.json:application/vnd.cncf.seccomp-profile.config.v1+json \
     quay.io/crio/seccomp:v2 seccomp.json
```

結果として得られるイメージには、CRI-Oが期待する`mediaType`が含まれています。
ORASは単一のレイヤー`seccomp.json` をレジストリにプッシュします。
プロファイルの名前はあまり重要ではありません。
CRI-Oは最初のレイヤーを選択し、それがseccompプロファイルとして機能するかどうかを確認します。

## 将来の作業

CRI-OはOCIアーティファクトを通常のファイルと同様に内部で管理しています。
これにより、それらを移動したり、使用されなくなった場合に削除したり、seccompプロファイル以外のデータを利用したりする利点が得られます。
これにより、OCIアーティファクトをベースにしたCRI-Oの将来の拡張が可能になります。
また、OCIアーティファクトの中に複数のレイヤーを持つことを考える上で、seccompプロファイルの積層も可能になります。
v1.30.xリリースでは`Unconfined`ワークロードのみがサポートされているという制限は、将来CRI-Oが解決したい課題です。
セキュリティを損なうことなく、全体的なユーザーエクスペリエンスを簡素化することが、コンテナワークロードにおけるseccompの成功の鍵となるようです。

CRI-Oのメンテナーは、新機能に関するフィードバックや提案を歓迎します！
このブログ投稿を読んでいただき、ぜひKubernetesの[Slackチャンネル#crio](https://kubernetes.slack.com/messages/CAZH62UR1)を通じてメンテナーに連絡したり、[GitHubリポジトリ](https://github.com/cri-o/cri-o)でIssueを作成したりしてください。
