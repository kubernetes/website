---
title: 協調的リーダー選出
content_type: concept
weight: 200
---

<!-- overview -->

{{< feature-state feature_gate_name="CoordinatedLeaderElection" >}}

Kubernetes {{< skew currentVersion >}}には、{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}コンポーネントが _協調的リーダー選出_ により、特定の戦略でリーダーを選択できるようにするベータ機能が含まれています。
これは、クラスターアップグレード中のKubernetesバージョンスキュー制約を満たすのに有用です。
現在、唯一の組み込まれたリーダー選択戦略は`OldestEmulationVersion`で、最も低いエミュレートバージョンを持つリーダーを優先し、次にバイナリバージョン、次に作成タイムスタンプの順で選択します。

## 協調的リーダー選出の有効化

{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}を起動する際に、`CoordinatedLeaderElection`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)が有効になっており、`coordination.k8s.io/v1beta1` APIグループも有効になっていることを確認してください。

これは、`--feature-gates="CoordinatedLeaderElection=true"`フラグと`--runtime-config="coordination.k8s.io/v1beta1=true"`フラグを設定することで実行できます。

## コンポーネントの設定

`CoordinatedLeaderElection`フィーチャーゲートを有効にし、_かつ_`coordination.k8s.io/v1beta1` APIグループを有効にしている場合、互換性のあるコントロールプレーンコンポーネントは、必要に応じてLeaseCandidateおよびLease APIを自動的に使用してリーダーを選出します。

Kubernetes {{< skew currentVersion >}}では、フィーチャーゲートとAPIグループが有効になっている場合、2つのコントロールプレーンコンポーネント(kube-controller-managerとkube-scheduler)が協調的リーダー選出を自動的に使用します。