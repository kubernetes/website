---
title: Agentes de execução do Contêiner
content_type: concept
weight: 30
---

<!-- overview -->

{{< note >}}
Dockershim foi removido do projeto Kubernetes desde a versão 1.24. Para mais detalhes leia [Dockershim Removal FAQ](/blog/2022/02/17/dockershim-faq).
{{< /note >}}

Você precisa instalar um {{< glossary_tooltip text="agente de execução do contêiner" length="all"  term_id="container-runtime" >}} em cada nó do cluster para que os pods possam ser executados. Esta página descreve as tarefas e o que está envolvido para configurar os nós. 

O Kubernetes 1.24 requer um tempo de execução que esteja em conformidade com {{< glossary_tooltip term_id="cri" length="all" text="Container Runtime Interface">}} (CRI).

Para mais informações, veja [versão de suporte CRI](#cri-versions).

Esta página fornece uma descrição de como utilizar múltiplos container runtime comuns com Kubernetes.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)

{{< note >}}
As versões do Kubernetes anteriores ao v1.24 incluem uma integração direta com o Docker Engine, utilizando um componente chamado _dockershim_. Esta integração direta especial não faz mais parte do Kubernetes (a remoção foi anunciada como parte da versão v1.20). Leia [Check whether Dockershim removal affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/) para entender como esta remoção pode afetar você. Para aprender mais sobre migração utilizando docker, acesse o [Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/).

Se você estiver utilizando uma versão do Kubernetes diferente da v{{< skew currentVersion >}}, verifique a documentação da versão que você estiver utilizando.
{{< /note >}}

<!-- body -->

## Pré-requisitos de instalação e configuração

As etapas a seguir se aplicam como configurações comuns para nós do Kubernetes no Linux.

Etapas podem ser puladas caso tenha certeza que particularidades de configuração não serão necessárias.

Para mais informações, consulte a [Network Plugin Requirements](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#network-plugin-requirements) ou a documentação específica para a execução de seu container.

## Encaminhando IPv4 e permitindo que o iptables observe o tráfego em ponte.

Verifique se o módulo `br_netfilter` está carregado executando `lsmod | grep br_netfilter` no terminal.

Para carregá-lo explicitamente, execute `sudo modprobe br_netfilter`.

A fim que o iptable de um nó Linux visualize corretamente o tráfego em ponte, verifique se `net.bridge.bridge-nf-call-iptables` possui valor 1 configurado no seu `sysctl`. Por exemplo:

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# Parâmetros sysctl exigidos pela configuração, os parâmetros persistem nas reinicializações
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# Aplicar parâmetros sysctl sem reinicializar
sudo sysctl --system
```

## Drivers cgroup
 
No sistema linux, {{< glossary_tooltip length="all" text="controle de grupos" term_id="cgroup" >}} são utilizados para restringir recursos que são alocados para os processos.
 
Quando o [systemd](https://www.freedesktop.org/wiki/Software/systemd/) é escolhido como o sistema inicial para a distribuição linux, o processo inicial gera e consome um grupo de controle raiz (`cgroup`) e acts como um gerenciador cgroup. Systemd tem uma forte integração com cgroups e aloca cgroup por systemd unidade. É possível configurar seu agente de execução do container e o kubelet para utilizar o `cgroupfs`. Usando `cgroupfs` ao lado de systemd significa que existem dois diferentes grupos de gerentes de cgroup.
 
 
Um único gerenciador de cgroup simplifica a visão de quais recursos estão sendo alocados e por padrão terão uma visão mais consistente dos recursos disponíveis e em uso. Quando houver dois gerenciadores cgroup em um sistema, o resultado serão duas visões desses recursos. Neste contexto, pessoas reportaram casos onde nós configurados para usar `cgroupfs` para o kubelet e o Docker, mas `systemd` para o resto dos processos, tornam-se instáveis em situações de pouco recurso.
 
Alterar as configurações de forma que seu container runtime e o kubelet usem `systemd` como o driver cgroup estabilizou o sistema. Para configurar isto para o Docker, defina `native.cgroupdriver=systemd`.
 
 
{{< caution >}}
Alterar os drivers cgroup de um nó que foi adicionado ao cluster é uma operação sensível. Se o kubelet criou Pods usando a semântica de um driver cgroup, alterar o tempo de execução do container para outro driver cgroup pode causar erros quando tentar recriar o sandbox do Pod  para os Pods já existentes. Reiniciar o kubelet talvez não resolva este problema.
 
Se você tiver automação que viabilize, substitua o nó por outro usando configuração atualizada ou reinstale utilizando automação.
{{< /caution >}}

## Versão 2 Cgroup {#cgroup-v2}

Cgroup v2 é a próxima versão do cgroup Linux API. Diferentemente do cgroup v1, existe uma única hierarquia em vez de uma diferente para cada controlador.

A nova versão oferece várias melhorias em relação ao cgroup v1, algumas dessas melhorias são: 

- API mais limpa e fácil de usar
- Delegação segura de sub-árvores para containers
- Novas funcionalidades como a Pressure Stall Information

Ainda que o kernel suporte uma configuração híbrida onde alguns controladores são gerenciados pelo cgroup v1 e alguns outros por cgroup v2, o Kubernetes suporta apenas cgroups de mesma versão para gerenciar todos os controladores.

Se o systemd não usa cgroup v2 por definição, você pode configurar o sistema para usá-lo. Basta adicionar `systemd.unified_cgroup_hierarchy=1` à linha de comando do kernel.

```shell
# Este exemplo é para um sistema operacional Linux que usa o gerenciador de pacotes DNF
# Seu sistema pode usar um método diferente para definir a linha de comando
# que o kernel do Linux usa.
sudo dnf install -y grubby && \
  sudo grubby \
  --update-kernel=ALL \
  --args="systemd.unified_cgroup_hierarchy=1"
```

Se você modificar a linha de comando do kernel, reinicialize o nó antes que sua alteração tenha efeito.

Não deve haver nenhuma diferença notável em relação à experiência do usuário ao mudar para o cgroup v2, a menos que os usuários estejam acessando o sistema de arquivos do cgroup diretamente, pelo nó ou por dentro dos containers.

Para usar, cgroup v2 deve ser suportado pelo agente de execução CRI.


### Migrando para o driver `systemd` em clusters gerenciados pelo kubeadm

Se você deseja migrar para o driver `systemd` do cgroup em cluster gerenciado pelo kubeadm existentes, siga [configurando um driver cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).

## Versão CRI Suportada {#cri-versions}
 
Seu agente de execução do contêiner deve suportar a última v1alpha2 da interface do agente de execução do contêiner.
 
O kubernetes {{< skew currentVersion >}} tem como padrão usar v1 da API CRI. Se um container runtime não suportar a API v1, o kubernetes voltará a usar a API v1alpha2.

## Agentes de execução do contêiner
 
{{% thirdparty-content %}}

### containerd
 
Esta seção descreve as etapas necessárias para usar containerd como agente de execução CRI.
 
Use os comandos a seguir para instalar Containerd no seu sistema:
 
Siga as instruções [getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md). Retorne para este passo uma vez que você tenha criado um arquivo de configuração válido,  `config.toml`.
 
{{< tabs name="Encontrando seu arquivo config.toml" >}}
{{% tab name="Linux" %}}
Você pode encontrar esse arquivo no caminho: `/etc/containerd/config.toml`.
{{% /tab %}}
{{< tab name="Windows" >}}
Você pode encontrar esse arquivo no caminho: `C:\Program Files\containerd\config.toml`.
{{< /tab >}}
{{< /tabs >}}
 
Por padrão, no linux o soquete CRI para containerd é `/run/containerd/containerd.sock`. No windows, o endpoint CRI padrão é `npipe://./pipe/containerd-containerd`.


#### Configurando o driver systemd cgroup

Para usar o driver systemd cgroup no /etc/containerd/config.toml com runc, defina:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

{{< note >}}
Se você instalou o contêiner por um pacote (por exemplo, RPM ou .deb), você pode perceber que o plugin de integração CRI está desabilitado por padrão.

Você precisa do suporte CRI habilitado para usar os contêiner com Kubernetes. Tenha certeza que `cri` não está incluso na lista de plugins desabilitados dentro de `/etc/containerd/config.toml;` Se você foram feitas alterações neste arquivo, também reinicie `containerd`.
{{< /note >}}

Se você aplicar estas mudanças, reinicie o containerd com o seguinte comando:

```shell
sudo systemctl restart containerd
```

Ao usar o kubeadm, configure manualmente o [cgroup driver para o kubelet](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver).

#### Substituindo a imagem do sandbox(pausa) {#override-pause-image-containerd}

Você pode sobrescrever a imagem sandbox dá suas [configurações do containerd](https://github.com/containerd/cri/blob/master/docs/config.md), utilizando a seguinte configuração:

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "k8s.gcr.io/pause:3.2"
```

Talvez você precise reiniciar o `containerd` depois de atualizar o arquivo de configuração: `systemctl restart containerd`.

### CRI-O

Esta seção contém as etapas necessárias para instalar CRI-O como um agente de execução do contêiner.

Para instalar CRI-O, siga as [Instruções de Instalação do CRI-O](https://github.com/cri-o/cri-o/blob/main/install.md#readme).

#### cgroup driver
 
CRI-O usa o driver systemd cgroup por padrão, o qual provavelmente irá funcionar bem para você. Para mudar para o driver `cgroupfs` cgroup, edite `/etc/crio/crio.conf` ou coloque uma configuração drop-in em `/etc/crio/crio.conf.d/02-cgroup-manager.conf`, por exemplo:

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

Você deve notar também as mudanças no `conmon_cgroup`, o qual deverá ser definido para ‘pod’ quando usar CRI-O com `cgroupfs`. No geral, é necessário manter a configuração do driver cgroup do kubelet (geralmente feito via kubeadm) e CRI-O sincronizado.

Para CRI-O, o soquete CRI é `/var/run/crio/crio.sock` por padrão.

#### Substituindo a imagem do sandbox(pausa){#override-pause-image-cri-o}
 
 
Em suas [configurações CRI-O](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md), você pode definir os seguintes valores:
 
```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.6"
```
 
Esta opção de configuração suporta recarregar a configuração ao vivo para aplicar esta mudança: `systemctl reload crio` ou enviando `SIGHUP` para o processo `crio`.

### Docker Engine {#docker}
 
{{< note >}}
As instruções a seguir assumem que você esteja usando o adaptador [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) integrando o Docker Engine com o Kubernetes.
{{< /note >}}
 
1. Em cada um dos nós, instale o Docker para a sua distro Linux conforme artefato [Install Docker Engine](https://docs.docker.com/engine/install/#server).
 
2. Instale [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd), seguindo as instruções nesse repositório.
 
Para `cri-dockerd`, por padrão o soquete CRI é `/run/cri-dockerd.sock`.
 
#### Substituindo a imagem do sandbox(pausa) {#override-pause-image-cri-dockerd}
 
A adaptação do `cri-dockerd` aceita argumentos por comando de linhas para especificar qual imagem do contêiner usar como contêiner de infraestrutura do Pod (“imagem em pausa”). O argumento de comando de linha para usar é `--pod-infra-container-image`.


### Agentes de execução do contêiner Mirantis {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html) (MCR) é um agente de execução Container disponível comercialmente, conhecido anteriormente como Docker Enterprise Edition.

Você pode usar o Mirantis Container Runtime com o Kubernetes com o uso do componente open source [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd), inclu[ido com o MCR.

Saiba mais sobre como instalar o Mirantis Container Runtime, visitando [MCR Deployment Guide](https://docs.mirantis.com/mcr/20.10/install.html).

Verifique a unidade systemd nomeada `cri-docker.socket` e descubra o caminho para o soquete CRI.

#### Substituindo a imagem do sandbox(pausa) {#override-pause-image-cri-dockerd-mcr}

A adaptação do `cri-dockerd` aceita argumentos por comando de linhas para especificar qual imagem do container usar como container de infraestrutura do Pod (“imagem em pausa”). O argumento de comando de linha para usar é `--pod-infra-container-image`.

## {{% heading "whatsnext" %}} 

Além do agente de execução do contêiner, seu cluster precisará de um [network plugin](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model).
