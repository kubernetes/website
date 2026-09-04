---
title: Використання CoreDNS для виявлення Service
min-kubernetes-server-version: v1.9
content_type: task
weight: 380
---

<!-- overview -->

Ця сторінка описує процес оновлення CoreDNS та як встановити CoreDNS.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Про CoreDNS {#about-coredns}

[CoreDNS](https://coredns.io) — це гнучкий, розширюваний DNS-сервер, який є типовою реалізацією DNS кластера Kubernetes. Як і Kubernetes, проєкт CoreDNS є проєктом {{< glossary_tooltip text="CNCF" term_id="cncf" >}}.

## Встановлення CoreDNS {#installing-coredns}

Для ручного розгортання дивіться документацію на [вебсайті CoreDNS](https://coredns.io/manual/installation/).

## Оновлення CoreDNS {#upgrading-coredns}

Ви можете перевірити версію CoreDNS, яку kubeadm встановлює для кожної версії Kubernetes на сторінці [Версія CoreDNS у Kubernetes](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md).

CoreDNS можна оновити вручну, якщо ви хочете тільки оновити CoreDNS або використовувати власний кастомізований образ. Є корисні [рекомендації та посібник](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md), доступні для забезпечення плавного оновлення. Переконайтеся, що поточна конфігурація CoreDNS ("Corefile") зберігається при
оновленні вашого кластера.

Якщо ви оновлюєте свій кластер за допомогою інструменту `kubeadm`, `kubeadm` може самостійно зберегти поточну конфігурацію CoreDNS.

## Налаштування CoreDNS {#tuning-coredns}

Коли використання ресурсів є проблемою, може бути корисним налаштувати конфігурацію CoreDNS. Для детальнішої інформації перевірте [документацію зі збільшення масштабу CoreDNS](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md).

## {{% heading "whatsnext" %}}

Ви можете налаштувати [CoreDNS](https://coredns.io) для підтримки багатьох сценаріїв, окрім базового розвʼязання імен Service, змінивши конфігурацію CoreDNS ("Corefile"). Для отримання додаткової інформації дивіться [документацію](https://coredns.io/plugins/kubernetes/) для втулка `kubernetes` CoreDNS, або читайте [Власні DNS записи для Kubernetes](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/) в блозі CoreDNS.
