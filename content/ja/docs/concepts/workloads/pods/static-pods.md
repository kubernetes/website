---
title: "Static Pod"
content_type: concept
weight: 150
---

_Static Pod_ は、{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}による監視を受けることなく、特定のノード上のkubeletデーモンによって直接管理されます。
コントロールプレーンによって管理されるPod(たとえば{{< glossary_tooltip text="Deployment" term_id="deployment" >}})とは異なり、kubeletが各Static Podを監視し、障害が発生した場合には再起動します。

Static Podは、常に特定のノード上の1つの{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}に紐付けられます。

Static Podの主な用途は、セルフホスト型のコントロールプレーンを実行することです。
言い換えると、kubeletを使用して個々の[コントロールプレーンコンポーネント](/docs/concepts/overview/components/#control-plane-components)を管理することです。
たとえば、[kubeadm](/docs/reference/setup-tools/kubeadm/)はStatic Podを使用して、コントロールプレーンのノード上で`kube-apiserver`、`kube-controller-manager`、`kube-scheduler`、`etcd`を実行します。

{{< note >}}
もしクラスターがコントロールプレーンコンポーネントをPodとして実行している場合、それらはおそらくStatic Podです。
これらのミラーPodは、`kube-system`名前空間内で`kubernetes.io/config.mirror`アノテーションによって識別できます。
{{< /note >}}

## ミラーPod {#mirror-pods}

kubeletは、各Static Podに対応する{{< glossary_tooltip text="ミラーPod" term_id="mirror-pod" >}}を、Kubernetes APIサーバー上に自動的に作成しようとします。
これにより、ノード上で実行されているPodはAPIサーバー上で参照できるようになりますが、APIサーバーから制御することはできません。
Pod名には、先頭にハイフンを付けたノードのホスト名がサフィックスとして付加されます。

kubeletは、Static Podから{{< glossary_tooltip text="ラベル" term_id="label" >}}をミラーPodへ伝播します。
これらのラベルは、{{< glossary_tooltip text="セレクター" term_id="selector" >}}を通じて通常どおり使用できます。

`kubectl`を使用してAPIサーバーからミラーPodを削除しようとしても、kubeletはStatic Podを削除 _しません_。
kubeletはミラーPodを再作成します。

## 制限事項 {#limitations}

Static Podのspecは、{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}、{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}、{{< glossary_tooltip text="Secret" term_id="secret" >}}などの他のAPIオブジェクトを参照できません。

Static Podは、[エフェメラルコンテナ](/docs/concepts/workloads/pods/ephemeral-containers/)をサポートしていません。

## Static PodとDaemonSetの比較 {#static-pods-vs-daemonsets}

<!-- Source: tasks/configure-pod-container/static-pod/ -->
クラスター化されたKubernetesを実行していて、すべてのノードでPodを実行するためにStatic Podを使用している場合は、代わりに{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}を使用するべきでしょう。

Static Podはコントロールプレーンによって管理されないため、Kubernetesの標準的な仕組みを使用してロールアウト、ロールバック、スケールを行うことはできません。
DaemonSetはこれらの機能を提供しており、ノードレベルのワークロードを実行するための推奨される方法です。

Static Podは、APIサーバーが利用可能になる前にkubeletによって起動されるため、コントロールプレーンコンポーネントのブートストラップに適しています。
DaemonSetは、稼働中のコントロールプレーンを必要とします。

## {{% heading "whatsnext" %}}

- [Static Podを作成する](/docs/tasks/configure-pod-container/static-pod/)方法について学ぶ。
- [Kubernetesのコンポーネント](/docs/concepts/overview/components/)と、コントロールプレーンがStatic Podをどのように使用するかについて学ぶ。
- Static Podの代替手段である[DaemonSet](/docs/concepts/workloads/controllers/daemonset/)について学ぶ。
