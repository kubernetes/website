---
title: "Міграція вузлів Docker Engine з dockershim на cri-dockerd"
weight: 20
content_type: task
---

{{% thirdparty-content %}}

Ця сторінка показує вам, як перевести ваші вузли з Docker Engine на використання `cri-dockerd` замість dockershim. Ви повинні дотримуватися цих кроків у таких сценаріях:

* Ви хочете перейти від dockershim і все ще використовувати Docker Engine для запуску контейнерів у Kubernetes.
* Ви хочете оновити до Kubernetes v{{< skew currentVersion >}} і ваш наявний кластер покладається на dockershim, у такому випадку вам необхідно перейти з dockershim, де `cri-dockerd` є одним з варіантів.

Щоб дізнатися більше про видалення dockershim, прочитайте [сторінку ЧаПи](/dockershim).

## Що таке cri-dockerd? {#what-is-cri-dockerd}

У Kubernetes 1.23 та раніше ви могли використовувати Docker Engine з Kubernetes, покладаючись на вбудований компонент Kubernetes, що називався _dockershim_. Компонент dockershim було вилучено у випуску Kubernetes 1.24; проте доступний сторонній замінник, `cri-dockerd`. Адаптер `cri-dockerd` дозволяє використовувати Docker Engine через {{<glossary_tooltip term_id="cri" text="інтерфейс середовища виконання контейнерів">}}.

{{<note>}}
Якщо ви вже використовуєте `cri-dockerd`, вас не торкнеться видалення dockershim. Перш ніж почати, [перевірте, чи використовує ваші вузли dockershim](/uk/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/).
{{</note>}}

Якщо ви хочете мігрувати на `cri-dockerd`, щоб продовжувати використовувати Docker Engine як своє середовище виконання контейнерів, вам слід виконати наступне для кожного вузла:

1. Встановіть `cri-dockerd`.
2. Відключіть та вимкніть вузол.
3. Налаштуйте kubelet для використання `cri-dockerd`.
4. Перезапустіть kubelet.
5. Перевірте, що вузол справний.

Спочатку протестуйте міграцію на не критичних вузлах.

Ви повинні виконати наступні кроки для кожного вузла, який ви хочете перевести на `cri-dockerd`.

## {{% heading "prerequisites" %}}

* [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install) встановлений і запущений на кожному вузлі.
* [Мережевий втулок](/uk/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).

## Відключіть та вимкніть вузол {#cordon-and-drain-the-node}

1. Відключіть вузол, щоб зупинити нові запуски капсул на ньому:

    ```shell
    kubectl cordon <NODE_NAME>
    ```

    Замініть `<NODE_NAME>` на імʼя вузла.

2. Вимкніть вузол, щоб безпечно виселити працюючі Podʼи:

    ```shell
    kubectl drain <NODE_NAME> \
        --ignore-daemonsets
    ```

## Налаштуйте kubelet для використання cri-dockerd {#configure-kubelet-to-use-cri-dockerd}

Ці кроки застосовуються до кластерів, створених за допомогою інструменту kubeadm. Якщо ви використовуєте інший інструмент, вам слід модифікувати kubelet, використовуючи інструкції з налаштування для цього інструменту.

1. Відкрийте `/var/lib/kubelet/kubeadm-flags.env` на кожному ураженому вузлі.
2. Змініть прапорець `--container-runtime-endpoint` на `unix:///var/run/cri-dockerd.sock`.
3. Змініть прапорець `--container-runtime` на `remote` (недоступно в Kubernetes v1.27 та пізніше).

Інструмент kubeadm зберігає сокет вузла як анотацію обʼєкта `Node` в панелі управління. Щоб змінити цей сокет для кожного ураженого вузла:  

1. Відредагуйте YAML-представлення обʼєкта `Node`:

    ```shell
    KUBECONFIG=/шлях/до/admin.conf kubectl edit no <NODE_NAME>
    ```

    Замініть наступне:

    * `/шлях/до/admin.conf`: шлях до файлу конфігурації kubectl, `admin.conf`.
    * `<NODE_NAME>`: імʼя вузла, яке ви хочете змінити.

1. Змініть `kubeadm.alpha.kubernetes.io/cri-socket` з `/var/run/dockershim.sock` на `unix:///var/run/cri-dockerd.sock`.
2. Збережіть зміни. Обʼєкт `Node` оновлюється при збереженні.

## Перезапустіть kubelet {#restart-the-kubelet}

```shell
systemctl restart kubelet
```

## Перевірте, що вузол справний {#verify-that-the-node-is-healthy}

Щоб перевірити, чи використовує вузол точку доступу `cri-dockerd`, слідувати інструкціям [Дізнайтеся, яке середовище виконання контейнерів використовується](/uk/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/). Прапорець `--container-runtime-endpoint` для kubelet повинен бути `unix:///var/run/cri-dockerd.sock`.

## Введення вузла в експлуатацію {#uncordon-the-node}

Введіть вузол в експлуатацію, щоб Podʼи могли запускатися на ньому:

```shell
kubectl uncordon <NODE_NAME>
```

## {{% heading "whatsnext" %}}

* Прочитайте [ЧаПи з видалення dockershim](/dockershim/).
* [Дізнайтеся, як мігрувати з Docker Engine з dockershim на containerd](/uk/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/).
