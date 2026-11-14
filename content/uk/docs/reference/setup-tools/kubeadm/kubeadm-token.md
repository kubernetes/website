---
title: kubeadm token
content_type: concept
weight: 70
---
<!-- overview -->

Токени bootstrap використовуються для встановлення двосторонньої довіри між вузлом, що приєднується
до кластера, та вузлом панелі управління, як описано в розділі [автентифікація за допомогою токенів bootstrap](/docs/reference/access-authn-authz/bootstrap-tokens/).

`kubeadm init` створює початковий токен з TTL 24 години. Наведені нижче команди дозволяють керувати
таким токеном, а також створювати нові токени та керувати ними.

<!-- body -->
## kubeadm token create {#cmd-token-create}
{{< include "generated/kubeadm_token/kubeadm_token_create.md" >}}

## kubeadm token delete {#cmd-token-delete}
{{< include "generated/kubeadm_token/kubeadm_token_delete.md" >}}

## kubeadm token generate {#cmd-token-generate}
{{< include "generated/kubeadm_token/kubeadm_token_generate.md" >}}

## kubeadm token list {#cmd-token-list}
{{< include "generated/kubeadm_token/kubeadm_token_list.md" >}}

## {{% heading "whatsnext" %}} {#what-s-next}

* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) для розгортання робочого вузла Kubernetes і приєднання його до кластера
