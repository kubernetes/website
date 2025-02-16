---
title: "Windows w Kubernetesie"
simple_list: true
weight: 200 # late in list
description: >-
  Kubernetes obsługuje węzły działające na systemie Microsoft Windows.
---

Kubernetes obsługuje {{< glossary_tooltip text="węzły" term_id="node" >}}
robocze działające zarówno na systemie Linux, jak i Microsoft Windows.

{{% thirdparty-content single="true" %}}

CNCF i jej macierzysta organizacja Linux Foundation przyjmują neutralne podejście do
kompatybilności w kontekście dostawców. Możliwe jest dołączenie swojego
[serwera Windows](https://www.microsoft.com/en-us/windows-server) jako węzeł roboczy do klastra Kubernetes.

Możesz [zainstalować i skonfigurować kubectl na Windows](/docs/tasks/tools/install-kubectl-windows/)
niezależnie od tego, jakiego systemu operacyjnego używasz w ramach swojego klastra.

Jeśli używasz węzłów Windows, możesz przeczytać:

* [Sieci w Windows](/docs/concepts/services-networking/windows-networking/)
* [Windows storage w Kubernetesie](/docs/concepts/storage/windows-storage/)
* [Zarządzanie zasobami dla węzłów Windows](/docs/concepts/configuration/windows-resource-management/)
* [Konfiguracja RunAsUserName dla Podów Windows i kontenerów](/docs/tasks/configure-pod-container/configure-runasusername/)
* [Utwórz Windows HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod/)
* [Konfigurowanie grupowych zarządzanych kont Usług dla Podów i kontenerów Windows](/docs/tasks/configure-pod-container/configure-gmsa/)
* [Bezpieczeństwo dla węzłów Windows](/docs/concepts/security/windows-security/)
* [Wskazówki dotyczące debugowania w systemie Windows](/docs/tasks/debug/debug-cluster/windows/)
* [Przewodnik dotyczący harmonogramowania kontenerów Windows w Kubernetesie](/docs/concepts/windows/user-guide)

lub, aby uzyskać przegląd, przeczytaj:
