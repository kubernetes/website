---
title: Використання CoreDNS для виявлення Service
min-kubernetes-server-version: v1.9
content_type: task
weight: 380
---

<!-- overview -->

Ця сторінка описує процес оновлення CoreDNS та як встановити CoreDNS замість kube-dns.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Про CoreDNS {#about-coredns}

[CoreDNS](https://coredns.io) — це гнучкий, розширюваний DNS-сервер, який може обслуговувати DNS кластера Kubernetes. Як і Kubernetes, проєкт CoreDNS є проєктом {{< glossary_tooltip text="CNCF" term_id="cncf" >}}.

Ви можете використовувати CoreDNS замість kube-dns у своєму кластері, замінивши kube-dns у наявному розгортанні, або використовуючи інструменти, такі як kubeadm, які встановлюють і оновлюють кластер за вас.

## Встановлення CoreDNS {#installing-coredns}

Для ручного розгортання або заміни kube-dns, дивіться документацію на [вебсайті CoreDNS](https://coredns.io/manual/installation/).

## Міграція на CoreDNS {#migrating-to-coredns}

### Оновлення наявного кластера за допомогою kubeadm {#upgrading-an-existing-cluster-with-kubeadm}

У версії Kubernetes 1.21, kubeadm припинив підтримку `kube-dns` як застосунку DNS. Для `kubeadm` v{{< skew currentVersion >}}, єдиний підтримуваний DNS застосунок кластера —
це CoreDNS.

Ви можете перейти на CoreDNS, використовуючи `kubeadm` для оновлення кластера, який використовує `kube-dns`. У цьому випадку, `kubeadm` генерує конфігурацію CoreDNS ("Corefile") на основі ConfigMap `kube-dns`, зберігаючи конфігурації для stub доменів та сервера імен вище в ієрархії.

## Оновлення CoreDNS {#upgrading-coredns}

Ви можете перевірити версію CoreDNS, яку kubeadm встановлює для кожної версії Kubernetes на сторінці [Версія CoreDNS у Kubernetes](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md).

CoreDNS можна оновити вручну, якщо ви хочете тільки оновити CoreDNS або використовувати власний кастомізований образ. Є корисні [рекомендації та посібник](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md), доступні для забезпечення плавного оновлення. Переконайтеся, що поточна конфігурація CoreDNS ("Corefile") зберігається при
оновленні вашого кластера.

Якщо ви оновлюєте свій кластер за допомогою інструменту `kubeadm`, `kubeadm` може самостійно зберегти поточну конфігурацію CoreDNS.

## Налаштування CoreDNS {#tuning-coredns}

Коли використання ресурсів є проблемою, може бути корисним налаштувати конфігурацію CoreDNS. Для детальнішої інформації перевірте [документацію зі збільшення масштабу CoreDNS](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md).

## {{% heading "whatsnext" %}}

Ви можете налаштувати [CoreDNS](https://coredns.io) для підтримки багатьох інших сценаріїв, ніж kube-dns, змінивши конфігурацію CoreDNS ("Corefile"). Для отримання додаткової інформації дивіться [документацію](https://coredns.io/plugins/kubernetes/) для втулка `kubernetes` CoreDNS, або читайте [Власні DNS записи для Kubernetes](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/) в блозі CoreDNS.
