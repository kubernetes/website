---
title: Оновлення вузлів Linux
content_type: task
weight: 40
---

<!-- overview -->

Ця сторінка пояснює, як оновити вузли робочих навантажень Linux, створені за допомогою kubeadm.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs-node-upgrade.md" >}} {{< version-check >}}

* Ознайомтеся з [процесом оновлення решти вузлів панелі управління за допомогою kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). Вам потрібно буде спочатку оновити вузли панелі управління перед оновленням вузлів робочих навантажень Linux.

<!-- steps -->

## Зміна репозиторію пакунків {#changing-the-package-repository}

Якщо ви використовуєте репозиторії пакунків (`pkgs.k8s.io`), вам потрібно увімкнути репозиторій пакунків для потрібного мінорного релізу Kubernetes. Це пояснено в документі [Зміна репозиторію пакунків Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).

{{% legacy-repos-deprecation %}}

## Оновлення робочих вузлів {#upgrading-worker-nodes}

### Оновлення kubeadm та kubectl {#upgrade-kubeadm-and-kubectl}

Оновіть kubeadm та kubectl:

{{< note >}}
kubectl має бути в межах однієї мінорної версії від kube-apiserver згідно з [політикою розбіжності версій](/releases/version-skew-policy/#kubectl). Якщо ви оновлюєте панель управління через кілька мінорних версій перед оновленням вузлів робочих навантажень, локальний kubectl на вузлі може вийти за межі дозволеної розбіжності. Оновлення kubectl разом з kubeadm тут гарантує, що він залишається в межах підтримуваного діапазону версій протягом усього процесу оновлення вузла.
{{< /note >}}

{{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
{{% tab name="Ubuntu, Debian або HypriotOS" %}}

```shell
# замініть x у {{< skew currentVersion >}}.x-* на останню версію патча
sudo apt-mark unhold kubeadm kubectl && \
sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
sudo apt-mark hold kubeadm kubectl
```

{{% /tab %}}
{{% tab name="CentOS, RHEL або Fedora" %}}

Для систем з DNF4 (Fedora < 41, RHEL/CentOS < 10):

```shell
# замініть x у {{< skew currentVersion >}}.x-* на останню версію патча
sudo dnf install -y kubeadm-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
```

Для систем з DNF5:

```shell
# замініть x у {{< skew currentVersion >}}.x-* на останню версію патча
sudo dnf install -y kubeadm-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
```

{{% /tab %}}
{{< /tabs >}}

### Виклик "kubeadm upgrade" {#call-kubeadm-upgrade}

Для робочих вузлів це оновлює локальну конфігурацію kubelet:

```shell
sudo kubeadm upgrade node
```

### Виведіть вузол з експлуатації {#drain-the-node}

Підготуйте вузол до обслуговування, позначивши його як недоступний для планування та виселивши завдання:

```shell
# виконайте цю команду на вузлі панелі управління
# замініть <node-to-drain> імʼям вузла, який ви виводите з експлуатації
kubectl drain <node-to-drain> --ignore-daemonsets
```

### Оновлення kubelet {#upgrade-kubelet}

1. Оновіть kubelet:

   {{< tabs name="k8s_kubelet_and_kubectl" >}}
   {{% tab name="Ubuntu, Debian або HypriotOS" %}}

   ```shell
   # замініть x у {{< skew currentVersion >}}.x-* на останню версію патча
   sudo apt-mark unhold kubelet && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet
   ```

   {{% /tab %}}
   {{% tab name="CentOS, RHEL або Fedora" %}}

   Для систем з DNF4 (Fedora < 41, RHEL/CentOS < 10):

   ```shell
   # замініть x у {{< skew currentVersion >}}.x-* на останню версію патча
   sudo dnf install -y kubelet-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```

   Для систем з DNF5:

   ```shell
   # замініть x у {{< skew currentVersion >}}.x-* на останню версію патча
   sudo dnf install -y kubelet-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

1. Перезавантажте kubelet:

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

### Відновіть роботу вузла {#uncordon-the-node}

Поверніть вузол в роботу, позначивши його як придатний для планування:

```shell
# виконайте цю команду на вузлі панелі управління
# замініть <node-to-uncordon> імʼям вашого вузла
kubectl uncordon <node-to-uncordon>
```

## {{% heading "whatsnext" %}} {#whats-next}

* Подивіться, як [оновити вузли Windows](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).
