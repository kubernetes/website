---
title: kubeadm token
content_type: concept
weight: 70
---

<!-- overview -->

Токени запуску (Bootstrap token) використовуються для встановлення двосторонньої довіри між вузлом, який приєднується до кластера, та вузлом панелі управління, як описано в розділі [автентифікація за допомогою токенів запуску](/docs/reference/access-authn-authz/bootstrap-tokens/).

`kubeadm init` створює початковий токен з часом життя 24 години. Наступні команди дозволяють вам керувати таким токеном, а також створювати та керувати новими.

<!-- body -->

## kubeadm token create {#cmd-token-create}

{{< include "generated/kubeadm_token/kubeadm_token_create.md" >}}

## kubeadm token delete {#cmd-token-delete}

{{< include "generated/kubeadm_token/kubeadm_token_delete.md" >}}

## kubeadm token generate {#cmd-token-generate}

{{< include "generated/kubeadm_token/kubeadm_token_generate.md" >}}

## kubeadm token list {#cmd-token-list}

{{< include "generated/kubeadm_token/kubeadm_token_list.md" >}}

## {{% heading "whatsnext" %}}

* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) — для початкового запуску робочого вузла Kubernetes nf приєднання його до кластера
