---
title: Sobre o cgroup v2
content_type: concept
weight: 50
---

<!-- overview -->

No Linux, {{< glossary_tooltip text="control groups" term_id="cgroup" >}} é um recurso do kernel para restringir os recursos que são alocados para os processos.

O {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} e o agente de execução de contêineres subjacente precisam interagir com o cgroups para garantir o
[gerenciamento de recursos em Pods e contêineres](/pt-br/docs/concepts/configuration/manage-resources-containers/) que inclue solicitações e limites de cpu e memória para as cargas de trabalho em contêineres.

Existem duas versões de cgroups no Linux: cgroup v1 e cgroup v2. O cgroup v2 é a nova geração do `cgroup` API.

<!-- body -->


## O que é cgroup v2? {#cgroup-v2}
{{< feature-state for_k8s_version="v1.25" state="stable" >}}

O cgroup v2 é a próxima versão de API do `cgroup` do Linux. Ela fornece um sistema de controle unificado com  capacidades de gerenciamento de recurso aprimoradas.

O cgroup v2 oferece várias melhorias em relação ao cgroup v1, por exemplo:

- Projeto de hierarquia unificada única em API
- Delegação de subárvore mais segura para contêineres
- Recursos mais recentes como [Informação de Pressão de Parada de Execução](https://www.kernel.org/doc/html/latest/accounting/psi.html)
- Gerenciamento aprimorado de alocação e isolamento de recursos entre múltiplos recursos
- Contagem unificada para diferentes tipos de alocação de memória (memória de rede, memória de kernel, etc)
- Contagem para alterações de recursos não imediatas, como [page cache](https://www.kernel.org/doc/html/latest/admin-guide/mm/concepts.html#page-cache).

Alguns recursos Kubernetes exclusivamente utilizam cgroup v2 para gerenciamento e isolamento aprimorado de recursos. Por exemplo, o recurso 
[QoS de memória](/blog/2021/11/26/qos-memory-resources/) que depende do cgroup v2 para funcionar.


## Usando cgroup v2 {#using-cgroupv2}

A maneira recomendada para utilizar o cgroup v2 é escolher uma distribuição Linux que tenha o cgroup v2 habilitado por padrão.

Para verificar se a distribuição utilizada possui o cgroup v2, consulte a seção [Identificar a versão do cgroup em nós Linux](#check-cgroup-version).

### Requisitos

O cgroup v2 possui os seguintes requisitos:

* Distribuição do sistema operacional com cgroup v2 habilitado
* Versão do Linux Kernel 5.8 ou posterior
* Agente de execução de contêineres com suporte para cgroup v2. Por exemplo:
  * [containerd](https://containerd.io/) v1.4 ou posterior
  * [cri-o](https://cri-o.io/) v1.20 ou posterior
* O kubelet e agente de execução de contêineres configurados para usar o [driver cgroup systemd](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)

### Distribuição Linux com suporte para cgroup v2

Para uma lista de distruibuições Linux que usam cgroup v2, consulte a [documentação do cgroup v2](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md)

<!-- the list should be kept in sync with https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md -->
* Container Optimized OS (a partir da M97)
* Ubuntu (a partir da 21.10, 22.04+ recomendado)
* Debian GNU/Linux (a partir da Debian 11 bullseye)
* Fedora (a partir da 31)
* Linux Arch (a partir da April 2021)
* Distribuições RHEL e RHEL-like (a partir da 9)

Para verificar se a sua distribuição Linux suporta cgroup v2, consulte a documentação da distribuição ou siga as instruções em [Identificar a versão do cgroup em nós Linux](#check-cgroup-version).

Você pode também habilitar o cgroup v2 manualmente em sua distribuição Linux modificando os argumentos de inicialização cmdline do kernel. Se a distribuição usa GRUB, `systemd.unified_cgroup_hierarchy=1` deve ser adicionado no `GRUB_CMDLINE_LINUX` em `/etc/default/grub`, seguido por `sudo update-grub`. Entretanto, a abordagem recomendada é usar uma distribuição que já tenha o cgroup v2 habilitado por padrão.

### Migrando para cgroup v2 {#migrating-cgroupv2}

Para migrar para o cgroup v2, assegure que você atende aos [requisitos](#requirements), e então, atualize para uma versão kernel que habilita cgroup v2 por padrão.

O kubelet detecta automaticamente que o sistema operacional está executando em cgroup v2 e 
funciona adequadamente sem configuração adicional necessária.

Não deve haver nenhuma diferença perceptível na experiência do usuário quando mudar para cgroup v2, a menos que os usuários estejam acessando o cgroup filesystem diretamente no nó ou por dentro dos contêineres.

O cgroup v2 utiliza uma API diferente do cgroup v1, então aplicações que acessam diretamente o sistema de arquivos cgroup precisam ser atualizadas para a versão mais recente que suporte o cgroup v2. Por exemplo:

* Alguns agentes de monitoramento e segurança podem depender do sistema de arquivo cgroup. Atualize esses agentes para versões que suportem cgroup v2.
* Se você executa o [cAdvisor](https://github.com/google/cadvisor) como um DaemonSet indenpendente para monitoramento de pods e contêineres, atualize-o para v0.43.0 ou posterior.
* Se você usa JDK, prefira o JDK 11.0.16 e posterior ou JDK 15 e posterior, que [suporta completamente cgroup v2](https://bugs.openjdk.org/browse/JDK-8230305).

## Identificar a versão do cgroup em nós do Linux
{#check-cgroup-version}

A versão do cgroup depende da distribuição Linux que está sendo usada e a versão de cgroup padrão no OS. Para verificar que versão cgroup sua distribuição utiliza, execute o comando `stat -fc %T /sys/fs/cgroup/` no nó:

```shell
stat -fc %T /sys/fs/cgroup/
```

Para cgroup v2, a saída é `cgroup2fs`.

Para cgroup v1, a saída é `tmpfs.`

## {{% heading "whatsnext" %}}

- Saiba mais sobre [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- Saiba mais sobre [container runtime](/docs/concepts/architecture/cri)
- Saiba mais sobre [cgroup drivers](/docs/setup/production-environment/container-runtimes#cgroup-drivers)
