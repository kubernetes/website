---
title: Оновлення вузлів Windows
min-kubernetes-server-version: 1.17
content_type: task
weight: 41
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Ця сторінка пояснює, як оновити вузол Windows, створений за допомогою kubeadm.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs-node-upgrade.md" >}} {{< version-check >}}

* Ознайомтеся з [процесом оновлення інших вузлів вашого кластера kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). Вам слід оновити вузли панелі управління перед оновленням вузлів Windows.

<!-- steps -->

## Оновлення робочих вузлів {#upgrading-worker-nodes}

### Оновлення kubeadm {#upgrade-kubeadm}

1. З вузла Windows оновіть kubeadm:

    ```powershell
    # замініть {{< skew currentPatchVersion >}} на вашу бажану версію
    curl.exe -Lo <path-to-kubeadm.exe>  "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubeadm.exe"
    ```

### Виведіть вузол з експлуатації {#drain-the-node}

1. З машини з доступом до API Kubernetes підготуйте вузол до обслуговування, позначивши його як недоступний для планування та виселивши завдання:

    ```shell
    # замініть <node-to-drain> імʼям вашого вузла, який ви виводите з експлуатації
    kubectl drain <node-to-drain> --ignore-daemonsets
    ```

    Ви повинні побачити подібний вивід:

    ```none
    node/ip-172-31-85-18 cordoned
    node/ip-172-31-85-18 drained
    ```

### Оновлення конфігурації kubelet {#upgrade-the-kubelet-configuration}

1. З вузла Windows викличте наступну команду, щоб синхронізувати нову конфігурацію kubelet:

    ```powershell
    kubeadm upgrade node
    ```

### Оновлення kubelet та kube-proxy {#upgrade-kubelet-and-kube-proxy}

1. З вузла Windows оновіть та перезапустіть kubelet:

    ```powershell
    stop-service kubelet
    curl.exe -Lo <path-to-kubelet.exe> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubelet.exe"
    restart-service kubelet
    ```

2. З вузла Windows оновіть та перезапустіть kube-proxy.

    ```powershell
    stop-service kube-proxy
    curl.exe -Lo <path-to-kube-proxy.exe> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kube-proxy.exe"
    restart-service kube-proxy
    ```

{{< note >}}
Якщо ви запускаєте kube-proxy в контейнері HostProcess всередині Podʼа, а не як службу Windows, ви можете оновити kube-proxy, застосувавши нову версію ваших маніфестів kube-proxy.
{{< /note >}}

### Відновіть роботу вузла {#uncordon-the-node}

1. З машини з доступом до API Kubernetes, поверніть вузол в роботу, позначивши його як придатний для планування:

    ```shell
    # замініть <node-to-drain> імʼям вашого вузла
    kubectl uncordon <node-to-drain>
    ```

## {{% heading "whatsnext" %}}

* Подивіться, як [оновити вузли Linux](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/).
