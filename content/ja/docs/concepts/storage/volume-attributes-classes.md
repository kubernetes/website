---
title: VolumeAttributesClass
content_type: concept
weight: 40
---
<!-- overview -->

{{< feature-state for_k8s_version="v1.29" state="alpha" >}}

このページでは、Kubernetesの[ストレージクラス](/ja/docs/concepts/storage/storage-classes/)、
[ボリューム](/ja/docs/concepts/storage/volumes/)および[永続ボリューム](/ja/docs/concepts/storage/persistent-volumes/)についてよく理解していることを前提としています。

<!-- body -->

VolumeAttributesClassは、管理者がストレージの変更可能な「クラス」を表現する方法を提供します。
異なるクラスは異なるサービス品質レベルに対応する場合があります。
Kubernetes自体は、これらのクラスが何を表すかかについては見解を持っていません。

これはアルファ機能であり、デフォルトで無効化されています。

アルファ機能であるうちにテストしたい場合は、kube-controller-managerおよびkube-apiserverで`VolumeAttributesClass`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効化する必要があります。
コマンドライン引数の`--feature-gates`を使用します:

```
--feature-gates="...,VolumeAttributesClass=true"
```

VolumeAttributesClassは{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}をバックエンドとするストレージでのみ使用することができ、
関連するCSIドライバーが`ModifyVolume` APIを実装している場合にのみ使用することができます

## VolumeAttributesClass API

各VolumeAttributesClassには`driverName`と`parameters`が含まれており、
クラスに属する永続ボリューム(PV)を動的にプロビジョニングまたは変更する際に利用されます。

VolumeAttributesClassのオブジェクト名は重要であり、ユーザーが特定のクラスを要求する方法です。
管理者はVolumeAttributesClassのオブジェクトを最初に作成する際に、クラス名や他のパラメータを設定します。
`PersistentVolumeClaim`内のVolumeAttributesClassのオブジェクト名は変更可能ですが、
既存のクラスのパラメータは変更できません。


```yaml
apiVersion: storage.k8s.io/v1alpha1
kind: VolumeAttributesClass
metadata:
  name: silver
driverName: pd.csi.storage.gke.io
parameters:
  provisioned-iops: "3000"
  provisioned-throughput: "50" 
```


### プロビジョナー

各VolumeAttributesClassには、PVのプロビジョニングにどのボリュームプラグインを使用するかを決定するプロビジョナが備わっています。

VolumeAttributesClassに関する機能のサポートは[kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner)に実装されています。

[kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner)に限定されることはありません。
Kubernetesによって定義された仕様にそった独立したプログラムである、外部プロビジョナを実行、指定することもできます。
外部プロビジョナの作成者は、コードの保存場所、プロビジョナの配布方法、実行方法、使用するボリュームプラグインなど、あらゆる裁量を持っています。


### リサイザー

各VolumeAttributesClassには、PVの変更にどのボリュームプラグインを使用するかを決定するリサイザが備わっています。
`driverName`フィールドの指定は必須です。

VolumeAttributesClassに関するボリューム変更機能のサポートは[kubernetes-csi/external-resizer](https://github.com/kubernetes-csi/external-resizer)に実装されています。

例えば、既存のPersistentVolumeClaimがsilverという名前のVolumeAttributesClassを使用しているとします:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pv-claim
spec:
  …
  volumeAttributesClassName: silver
  …
```

新しいgoldというVolumeAttributesClassがクラスターで使用可能です:


```yaml
apiVersion: storage.k8s.io/v1alpha1
kind: VolumeAttributesClass
metadata:
  name: gold
driverName: pd.csi.storage.gke.io
parameters:
  iops: "4000"
  throughput: "60"
```


エンドユーザーは新しいgoldというVolumeAttributesClassを使ってPVCを更新、適用できます:


```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pv-claim
spec:
  …
  volumeAttributesClassName: gold
  …
```


## パラメーター

VolumeAttributesClassにはそれらに属するボリュームを記述するパラメータがあります。
プロビジョナまたはリサイザによって、異なるパラメータを受け取る場合があります。
例えば、パラメータ`iops`の値`4000`や、パラメータ`throughput`はGCE Persistent Disk固有のものです。
パラメータを省略した場合は、デフォルト値がボリュームのプロビジョニング時に使用されます。
ユーザーがパラメータを省略して異なるPVCを適用する場合、CSIドライバーの実装に応じてデフォルトのパラメータが使用されることがあります。
詳細については、関連するCSIドライバーのドキュメントを参照してください。

VolumeAttributesClassには最大512個のパラメータを定義できます。
キーと値を含むパラメータオブジェクトの合計の長さは256KiBを超過することはできません。