---
title: Зміна репозиторія пакунків Kubernetes
content_type: task
вага: 150
---

<!-- overview -->

Ця сторінка пояснює, як увімкнути репозиторій пакунків для бажаного мінорного випуску Kubernetes під час оновлення кластера. Це потрібно лише для користувачів репозиторіїв пакунків, що підтримуються спільнотою та розміщені на `pkgs.k8s.io`. На відміну від застарілих репозиторіїв пакунків, репозиторії пакунків, що підтримуються спільнотою, структуровані таким чином, що для кожної мінорної версії Kubernetes є окремий репозиторій пакунків.

{{< note >}}
Цей посібник охоплює лише частину процесу оновлення Kubernetes. Для отримання додаткової інформації про оновлення кластерів Kubernetes див. [посібник з оновлення](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
{{</ note >}}

{{< note >}}
Цей крок потрібно виконати лише під час оновлення кластера до іншого **мінорного** випуску. Якщо ви оновлюєтеся до іншого патч-релізу в межах тієї самої мінорної версії (наприклад, з v{{< skew currentVersion >}}.5 до v{{< skew currentVersion >}}.7), вам не потрібно дотримуватися цього посібника. Однак, якщо ви все ще використовуєте застарілі репозиторії пакунків, вам потрібно перейти на нові репозиторії пакунків, які підтримуються спільнотою, перед оновленням (див. наступний розділ для отримання деталей про те, як це зробити).
{{</ note >}}

## {{% heading "prerequisites" %}}

У цьому документі припускається, що ви вже використовуєте репозиторії пакунків, які підтримуються спільнотою (`pkgs.k8s.io`). Якщо це не так, наполегливо рекомендується перейти на репозиторії пакунків, які підтримуються спільнотою, як описано в [офіційному оголошенні](/blog/2023/08/15/pkgs-k8s-io-introduction/).

{{% legacy-repos-deprecation %}}

### Перевірка використання репозиторіїв пакунків Kubernetes {#verifying-if-the-kubernetes-package-repositories-are-used}

Якщо ви не впевнені, чи ви використовуєте репозиторії пакунків, які підтримуються спільнотою, чи застарілі репозиторії пакунків, виконайте наступні кроки для перевірки:

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian або HypriotOS" %}}

Виведіть вміст файлу, який визначає `apt`-репозиторій Kubernetes:

```shell
# У вашій системі цей файл конфігурації може мати іншу назву
pager /etc/apt/sources.list.d/kubernetes.list
```

Якщо ви бачите рядок, схожий на:

```none
deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor "-1" "." >}}/deb/ /
```

**Ви використовуєте репозиторії пакунків Kubernetes, і цей посібник стосується вас.** Інакше наполегливо рекомендується перейти на репозиторії пакунків Kubernetes, які підтримуються спільнотою, як описано в [офіційному оголошенні](/blog/2023/08/15/pkgs-k8s-io-introduction/).

{{% /tab %}}
{{% tab name="CentOS, RHEL або Fedora" %}}

Виведіть вміст файлу, який визначає `yum`-репозиторій Kubernetes:

```shell
# У вашій системі цей файл конфігурації може мати іншу назву
cat /etc/yum.repos.d/kubernetes.repo
```

Якщо ви бачите `baseurl`, схожий на `baseurl` в наведеному нижче виводі:

```none
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor "-1" "." >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor "-1" "." >}}/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl
```

**Ви використовуєте репозиторії пакунків Kubernetes, і цей посібник стосується вас.**
Інакше наполегливо рекомендується перейти на репозиторії пакунків Kubernetes, які підтримуються спільнотою, як описано в [офіційному оголошенні](/blog/2023/08/15/pkgs-k8s-io-introduction/).

{{% /tab %}}

{{% tab name="openSUSE або SLES" %}}

Виведіть вміст файлу, який визначає `zypper`-репозиторій Kubernetes:

```shell
# У вашій системі цей файл конфігурації може мати іншу назву
cat /etc/zypp/repos.d/kubernetes.repo
```

Якщо ви бачите `baseurl`, схожий на `baseurl` в наведеному нижче виводі:

```none
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor "-1" "." >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor "-1" "." >}}/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl
```

**Ви використовуєте репозиторії пакунків Kubernetes, і цей посібник стосується вас.**
Інакше наполегливо рекомендується перейти на репозиторії пакунків Kubernetes, які підтримуються спільнотою, як описано в [офіційному оголошенні](/blog/2023/08/15/pkgs-k8s-io-introduction/).

{{% /tab %}}
{{< /tabs >}}

{{< note >}}
URL, використаний для репозиторіїв пакунків Kubernetes, не обмежується `pkgs.k8s.io`, він також може бути одним із наступних:

- `pkgs.k8s.io`
- `pkgs.kubernetes.io`
- `packages.kubernetes.io`
{{</ note >}}

<!-- steps -->

## Перехід на інший репозиторій пакунків Kubernetes {#switching-to-another-kubernetes-package-repository}

Цей крок слід виконати при оновленні з одного мінорного випуску Kubernetes на інший для отримання доступу до пакунків бажаної мінорної версії Kubernetes.

{{< tabs name="k8s_upgrade_versions" >}}
{{% tab name="Ubuntu, Debian або HypriotOS" %}}

1. Відкрийте файл, який визначає `apt`-репозиторій Kubernetes за допомогою текстового редактора на ваш вибір:

   ```shell
   nano /etc/apt/sources.list.d/kubernetes.list
   ```

   Ви повинні побачити один рядок з URL, що містить вашу поточну мінорну версію Kubernetes. Наприклад, якщо ви використовуєте v{{< skew currentVersionAddMinor "-1" "." >}}, ви повинні побачити це:

   ```none
   deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor "-1" "." >}}/deb/ /
   ```

1. Змініть версію в URL на **наступний доступний мінорний випуск**, наприклад:

   ```none
   deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /
   ```

1. Збережіть файл і вийдіть з текстового редактора. Продовжуйте дотримуватися відповідних інструкцій щодо оновлення.

{{% /tab %}}
{{% tab name="CentOS, RHEL або Fedora" %}}

1. Відкрийте файл, який визначає `yum`-репозиторій Kubernetes за допомогою текстового редактора на ваш вибір:

   ```shell
   nano /etc/yum.repos.d/kubernetes.repo
   ```

   Ви повинні побачити файл з двома URL, що містять вашу поточну мінорну версію Kubernetes. Наприклад, якщо ви використовуєте v{{< skew currentVersionAddMinor "-1" "." >}}, ви повинні побачити це:

   ```none
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor "-1" "." >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor "-1" "." >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   ```

1. Змініть версію в цих URL на **наступний доступний мінорний випуск**, наприклад:

   ```none
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   ```

1. Збережіть файл і вийдіть з текстового редактора. Продовжуйте дотримуватися відповідних інструкцій щодо оновлення.

{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

- Подивіться, як [оновити вузли Linux](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/).
- Подивіться, як [оновити вузли Windows](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).
