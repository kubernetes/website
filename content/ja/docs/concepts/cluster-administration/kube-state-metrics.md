---
title: Kubernetesオブジェクトの状態メトリクス
content_type: concept
weight: 75
description: >-
   クラスターレベルのメトリクスを生成・公開するアドオンエージェント、kube-state-metrics。
---

Kubernetes API内のKubernetesオブジェクトの状態は、メトリクスとして公開することができます。
[kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)と呼ばれるアドオンエージェントは、Kubernetes APIサーバーに接続し、クラスター内の個別オブジェクトの状態から生成されたメトリクスを含むHTTPエンドポイントを公開します。
このエージェントは、ラベルやアノテーション、起動・終了時刻、ステータス、またはオブジェクトが現在置かれているフェーズなど、オブジェクトの状態に関する様々な情報を公開します。
例えば、Pod内で実行されているコンテナは`kube_pod_container_info`メトリクスを作成します。
このメトリクスには、コンテナ名、それが属するPod名、Podが実行されている{{< glossary_tooltip text="ネームスペース" term_id="namespace" >}}、コンテナイメージ名、イメージID、コンテナspecからのイメージ名、実行中のコンテナID、およびPod IDがラベルとして含まれています。

{{% thirdparty-content single="true" %}}

kube-state-metricsのエンドポイントをスクレイプすることができる外部コンポーネント(例えば、Prometheusなど)を使用することで、以下のユースケースを実現できます。

## 例： kube-state-metricsのメトリクスを使用したクラスター状態のクエリ {#example-kube-state-metrics-query-1}

kube-state-metricsによって生成されるメトリクス系列は、クエリに使用できるため、クラスターに関する更なる洞察を得るのに役立ちます。

Prometheusまたは同じクエリ言語を使用する他のツールを使用している場合、以下のPromQLクエリは準備完了していないPodの数を返します:

```
count(kube_pod_status_ready{condition="false"}) by (namespace, pod)
```

## 例： kube-state-metricsに基づくアラート {#example-kube-state-metrics-alert-1}

kube-state-metricsから生成されるメトリクスを使用することで、クラスター内の問題に対するアラートも可能になります。

Prometheusまたは同じアラートルール言語を使用する類似のツールを使用している場合、以下のアラートは5分以上`Terminating`状態にあるPodが存在する際に発火します:

```yaml
groups:
- name: Pod state
  rules:
  - alert: PodsBlockedInTerminatingState
    expr: count(kube_pod_deletion_timestamp) by (namespace, pod) * count(kube_pod_status_reason{reason="NodeLost"} == 0) by (namespace, pod) > 0
    for: 5m
    labels:
      severity: page
    annotations:
      summary: Pod {{$labels.namespace}}/{{$labels.pod}} blocked in Terminating state.
```
