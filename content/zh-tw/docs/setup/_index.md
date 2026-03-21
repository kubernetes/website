---
reviewers:
- brendandburns
- erictune
- mikedanese
title: Getting started
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: Learning environment
  - anchor: "#production-environment"
    title: Production environment
---

<!-- overview -->

本節列出設定與執行 Kubernetes 的不同方式。
安裝 Kubernetes 時，請根據以下條件選擇安裝類型：維護難易度、安全性、
控制程度、可用資源，以及操作與管理 Cluster 所需的專業能力。

您可以[下載 Kubernetes](/releases/download/) 來部署 Kubernetes Cluster，
可部署在本機、雲端，或您自己的資料中心。

多個 [Kubernetes 元件](/docs/concepts/overview/components/)（例如 {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} 或 {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}）
也可以在 Cluster 內以[容器映像](/releases/download/#container-images)部署。

**建議**在可行的情況下以容器映像方式執行 Kubernetes 元件，
並讓 Kubernetes 來管理這些元件。
負責執行容器的元件（特別是 kubelet）不屬於此類別。

如果您不想自行管理 Kubernetes Cluster，可以選擇受管服務，包含
[認證平台](/docs/setup/production-environment/turnkey-solutions/)。
此外，在各種雲端與裸機環境中，也有其他標準化與客製化解決方案可供選擇。

<!-- body -->

## Learning environment

如果您正在學習 Kubernetes，請使用 Kubernetes 社群支援的工具，
或使用生態系中的工具在本機上建立 Kubernetes Cluster。
請參閱[學習環境](/docs/setup/learning-environment/)

## Production environment

在評估
[正式環境](/docs/setup/production-environment/)的解決方案時，請考量您希望自行管理 Kubernetes Cluster
（或其 _抽象層_）的哪些面向，以及您偏好交由供應商處理的部分。

對於自行管理的 Cluster，官方支援的 Kubernetes 部署工具是
[kubeadm](/docs/setup/production-environment/tools/kubeadm/)。

## {{% heading "whatsnext" %}}

- [Download Kubernetes](/releases/download/)
- 下載並[安裝工具](/docs/tasks/tools/)（包含 `kubectl`）
- 為您的新 Cluster 選擇[容器執行階段](/docs/setup/production-environment/container-runtimes/)
- 了解 Cluster 設定的[最佳實踐](/docs/setup/best-practices/)

Kubernetes 的設計是讓其 {{< glossary_tooltip term_id="control-plane" text="control plane" >}}
在 Linux 上執行。在您的 Cluster 中，您可以在 Linux 或其他作業系統（包含
Windows）上執行應用程式。

- 了解如何[使用 Windows Node 設定 Cluster](/docs/concepts/windows/)
