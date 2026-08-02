---
reviewers:
- jingxu97
- mauriciopoppe
- jayunit100
- jsturtevant
- marosset
- aravindhp
title: Windows Storage
content_type: concept
weight: 110
---

<!-- overview -->

このページでは、Windowsオペレーティングシステム特有のストレージの概要について説明します。

<!-- body -->

## 永続ストレージ {#storage}

Windowsでは、レイヤードファイルシステムドライバーを使用してコンテナレイヤーをマウントし、NTFSをベースにしたファイルシステムのコピーを作成します。コンテナ内のすべてのファイルパスは、そのコンテナのコンテキスト内でのみ解決されます。

* Dockerでは、ボリュームマウントの対象はコンテナ内のディレクトリのみであり、個々のファイルを指定することはできません。この制限はcontainerdには適用されません。
* ボリュームマウントでは、ファイルまたはディレクトリをホストファイルシステムへ投影（プロジェクション）することはできません。
* Windowsレジストリおよび SAMデータベースへの書き込みアクセスが常に要求されるため、読み取り専用のファイルシステムはサポートされていません。ただし、読み取り専用のボリュームはサポートされています。
* ボリュームのユーザーマスクやアクセス権限は利用できません。SAMはホストとコンテナの間で共有されないため、それらを対応付ける（マッピングする）ことができません。すべてのアクセス権限は、コンテナ内のコンテキストで解決されます。

その結果、Windowsノードでは、以下のストレージ機能はサポートされません。

* ボリュームのsubPathマウント: Windowsコンテナでは、ボリューム全体のみがマウント可能
* SecretのsubPathボリュームマウント
* ホストマウントのプロジェクション
* 読み取り専用の root ファイルシステム (読み取り専用のボリュームでは引き続き`readOnly`をサポート)
* ブロックデバイスのマッピング
* メモリをストレージ媒体として使用すること (例: `emptyDir.medium`に`Memory`を指定)
* uid/gidやLinuxのユーザー単位のファイルシステム権限などのファイルシステム機能
* [DefaultModeによるSecretのアクセス権限](/docs/tasks/inject-data-application/distribute-credentials-secure/#set-posix-permissions-for-secret-keys) の設定 (UID/GIDに依存するため)
* NFSベースのストレージおよびボリュームのサポート
* マウント済みボリュームの拡張 (resizefs)

Kubernetes {{< glossary_tooltip text="volumes" term_id="volume" >}} は、データの永続化や Pod のボリューム共有を必要とする複雑なアプリケーションを、Kubernetes 上へデプロイできます。
特定のストレージバックエンドやプロトコルに関連付けられた永続ボリュームの管理には、ボリュームのプロビジョニング・プロビジョニング解除・サイズ変更、Kubernetes ノードへのアタッチ・デアタッチ、およびデータを永続化する必要がある Pod 内の各コンテナへのボリュームマウント・アンマウントといった操作が含まれます。

ボリューム管理コンポーネントは、Kubernetesボリューム[プラグイン](/docs/concepts/storage/volumes/#volume-types)として提供されています。
Windowsでは、概ね以下のKubernetesボリュームプラグインがサポートされています。

* [`FlexVolume プラグイン`](/docs/concepts/storage/volumes/#flexvolume)
  * FlexVolumeはKubernetes 1.23 で非推奨となっています。
* [`CSI プラグイン`](/docs/concepts/storage/volumes/#csi)

##### In-tree ボリュームプラグイン

以下のIn-treeプラグインは、Windowsノード上で永続ストレージをサポートしています。

* [`azureFile`](/docs/concepts/storage/volumes/#azurefile)
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume)
