---
title: Liveness、ReadinessおよびStartup Probe
content_type: concept
weight: 40
---

<!-- overview -->

Kubernetesは様々な種類のProbeがあります。

- [Liveness Probe](#liveness-probe)
- [Readiness Probe](#readiness-probe)
- [Startup Probe](#startup-probe)

<!-- body -->

## Liveness Probe {#liveness-probe}

コンテナの再起動を判断するためにLiveness Probeを使用します。
例えば、Liveness Probeはアプリケーションは起動しているが、処理が継続できないデッドロックを検知することができます。

コンテナがLiveness Probeを繰り返し失敗するとkubeletはコンテナを再起動します。

Liveness ProbeはReadiness Probeの成功を待ちません。Liveness Probeの実行を待つためには、`initialDelaySeconds`を定義するか、[Startup Probe](#startup-probe)を使用してください。


## Readiness Probe {#readiness-probe}

Readiness Probeはコンテナがトラフィックを受け入れる準備ができたかを決定します。ネットワーク接続の確立、ファイルの読み込み、キャッシュのウォームアップなどの時間のかかる初期タスクを実行するアプリケーションを待つ場合に有用です。

Readiness Probeが失敗状態を返す場合、KubernetesはそのPodをすべての一致するサービスエンドポイントから取り除きます。

Readiness Probeはコンテナのライフサイクル全体にわたって実行されます。


## Startup Probe {#startup-probe}

Startup Probeはコンテナ内のアプリケーションが起動されたかどうかを検証します。起動が遅いコンテナに対して起動されたかどうかチェックを取り入れるために使用され、kubeletによって起動や実行する前に終了されるのを防ぎます。

Startup Probeが設定された場合、成功するまでLiveness ProbeとReadiness Probeのチェックを無効にします。

定期的に実行されるReadiness Probeとは異なり、Startup Probeは起動時のみ実行されます。

* 詳細については[Liveness Probe、Readiness ProbeおよびStartup Probeの設定](/ja/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes)をご覧ください.