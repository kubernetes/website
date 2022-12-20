---
title: kubeadm config
content_type: conceito
weight: 50
---

<!-- overview -->
Durante o `kubeadm init`, o kubeadm carrega o objeto `ClusterConfiguration` para o seu cluster em um ConfigMap chamado `kubeadm-config` no namespace do `kube-system`. Essa configuração é então lida durante `kubeadm join`, `kubeadm reset` e `kubeadm upgrade`.

Você pode usar o `kubeadm config print` para exibir a configuração estática padrão que o kubeadm usa para o `kubeadm init` e `kubeadm join`.

{{< note >}}
A saída do comando deve servir de exemplo. Você deve editar manualmente a saída deste comando para adaptar à sua configuração. Remova os campos sobre os quais você não tem certeza e o kubeadm tentará usá-los como padrão, examinando o host durante a execução.
{{< /note >}}

Para obter mais informações sobre `init` e `join`, navegue até [Usando o kubeadm init com um arquivo de configuração](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file) ou [Usando o kubeadm join com um arquivo de configuração](/docs/reference/setup-tools/kubeadm/kubeadm-join/#config-file).

Para obter mais informações sobre como usar a API de configuração do kubeadm, navegue até [Personalizando componentes com a API do kubeadm.](/docs/setup/production-environment/tools/kubeadm/control-plane-flags).

Você pode usar o `kubeadm config migrate` para converter seus arquivos de configuração antigos que contêm uma versão obsoleta da API para uma versão mais recente e suportada da API.

`kubeadm config images list` e `kubeadm config images pull` podem ser usadas para listar e baixar as imagens que o kubeadm precisa.


<!-- body -->
## kubeadm config print {#cmd-config-print}

{{< include "generated/kubeadm_config_print.md" >}}

## kubeadm config print init-defaults {#cmd-config-print-init-defaults}

{{< include "generated/kubeadm_config_print_init-defaults.md" >}}

## kubeadm config print join-defaults {#cmd-config-print-join-defaults}

{{< include "generated/kubeadm_config_print_join-defaults.md" >}}

## kubeadm config migrate {#cmd-config-migrate}

{{< include "generated/kubeadm_config_migrate.md" >}}

## kubeadm config images list {#cmd-config-images-list}

{{< include "generated/kubeadm_config_images_list.md" >}}

## kubeadm config images pull {#cmd-config-images-pull}

{{< include "generated/kubeadm_config_images_pull.md" >}}

## {{% heading "whatsnext" %}}

* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade) para atualizar um cluster Kubernetes para uma versão mais recente
