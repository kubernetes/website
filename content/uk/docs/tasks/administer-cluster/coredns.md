---
title: Використання CoreDNS для виявлення Service
min-kubernetes-server-version: v1.9
content_type: task
weight: 380
---

<!-- overview -->

Ця сторінка описує процес оновлення CoreDNS та як встановити CoreDNS.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Про CoreDNS {#about-coredns}

[CoreDNS](https://coredns.io) — це гнучкий, розширюваний DNS-сервер, який є стандартною реалізацією DNS кластера Kubernetes. Як і Kubernetes, проєкт CoreDNS розміщено в {{< glossary_tooltip text="CNCF" term_id="cncf" >}}.

## Встановлення CoreDNS {#installing-coredns}

Для ручного розгортання дивіться документацію на [вебсайті CoreDNS](https://coredns.io/manual/installation/).

## Оновлення CoreDNS {#upgrading-coredns}

Ви можете перевірити версію CoreDNS, яку kubeadm встановлює для кожної версії Kubernetes на сторінці [Версія CoreDNS у Kubernetes](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md).

CoreDNS можна оновити вручну, якщо ви хочете оновити лише CoreDNS або використати власний образ. Для плавного оновлення доступні корисні [рекомендації та покрокова інструкція](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md). Переконайтеся, що під час оновлення кластера наявна конфігурація CoreDNS ("Corefile") зберігається.

Якщо ви оновлюєте свій кластер за допомогою інструменту `kubeadm`, `kubeadm` може самостійно зберегти поточну конфігурацію CoreDNS.

## Налаштування CoreDNS {#tuning-coredns}

Коли використання ресурсів має значення, може бути корисно налаштувати конфігурацію CoreDNS. Докладніше дивіться [документацію з масштабування CoreDNS](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md).

## {{% heading "whatsnext" %}} {#what-s-next}

Ви можете налаштувати [CoreDNS](https://coredns.io) для підтримки багатьох сценаріїв, окрім базового розвʼязання імен Service, змінивши конфігурацію CoreDNS ("Corefile"). Докладніше дивіться [документацію](https://coredns.io/plugins/kubernetes/) втулка CoreDNS `kubernetes` або прочитайте [Custom DNS Entries for Kubernetes](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/) у блозі CoreDNS.
