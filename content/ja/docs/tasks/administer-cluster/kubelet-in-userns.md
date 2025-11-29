---
title: "ユーザー名前空間内でkubeletを実行する"
linktitle: "ユーザー名前空間内でkubeletを実行する"
weight: 10
content_type: task
description: >
    Run the kubelet as a non-root user and inside a user namespace.
path: /ja/docs/tasks/administer-cluster/kubelet-in-userns/

---
# ユーザー名前空間内でkubeletを実行する

このページでは、kubeletを非rootユーザーとして、また[ユーザー名前空間](/docs/concepts/linux-namespaces/#user-namespace)内で実行する方法を示します。

## 前提条件

Kubernetesクラスターが必要であり、`kubectl`コマンドラインツールがクラスターと通信できるように設定されている必要があります。このチュートリアルは、コントロールプレーンホストとして機能していない少なくとも2つのノードを持つクラスターで実行することをお勧めします。クラスターがまだない場合は、[kind](/docs/setup/learning-environment/kind/)を使用して作成できます。

ホストオペレーティングシステムは以下をサポートしている必要があります:

* ユーザー名前空間
* cgroup v2

また、ユーザー名前空間内での実行をサポートするコンテナランタイムが必要です。[crun](https://github.com/containers/crun)はこの機能をサポートしていることが知られています。

## ユーザー名前空間内でkubeletを実行する

以下の手順で、kubeletを非rootユーザーとしてユーザー名前空間内で実行できます:

1.  ホストシステム上に非rootユーザーを作成します:

    ```shell
    useradd -M -N -r -s /usr/sbin/nologin kubelet-user
    ```

2.  サブUIDとサブGIDのマッピングを設定する

    ユーザー名前空間内でプロセスを実行するには、`kubelet-user`にサブUIDとサブGIDのマッピングを設定する必要があります。これは、ユーザーの名前空間内のIDをホストシステムのID範囲に関連付けます。

    `/etc/subuid`と`/etc/subgid`に以下のエントリを追加します。

    ```shell
    echo "kubelet-user:100000:65536" | sudo tee -a /etc/subuid
    echo "kubelet-user:100000:65536" | sudo tee -a /etc/subgid
    ```

    この設定により、`kubelet-user`はユーザー名前空間内のUID 0（root）として動作し、ホスト上のUID 100000から65536個のUID（つまり100000から165535）にマップされます。

3.  systemdユニットファイルを作成する

    次に、Kubeletサービスを実行し、厳密なセキュリティ制限を適用するためのsystemdユニットファイルを作成します。

    以下の内容を`/etc/systemd/system/kubelet-userns.service`として保存します。

    
http://googleusercontent.com/immersive_entry_chip/0


