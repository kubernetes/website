---
title: Instalando a ferramenta kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 40
  title: Instalar a ferramenta de configuração kubeadm
---

<!-- overview -->

<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">Essa página mostra o processo de instalação do conjunto de ferramentas `kubeadm`. 
Para mais informações sobre como criar um cluster com o kubeadm após efetuar a instalação, veja a página [Utilizando kubeadm para criar um cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

{{< doc-versions-list "guia de instalação" >}}

## {{% heading "prerequisites" %}}

* Uma máquina com sistema operacional Linux compatível. O projeto Kubernetes provê instruções para distribuições Linux baseadas em Debian e Red Hat, bem como para distribuições sem um gerenciador de pacotes.
* 2 GB ou mais de RAM por máquina (menos que isso deixará pouca memória para as suas aplicações).
* 2 CPUs ou mais.
* Conexão de rede entre todas as máquinas no cluster. Seja essa pública ou privada.
* Nome de host único, endereço MAC e product_uuid para cada nó. Veja [aqui](#verify-mac-address) para mais detalhes.
* Certas portas estão abertas em suas máquinas. Veja [aqui](#check-required-ports) para mais detalhes.
* Configuração de swap. O comportamento padrão de um kubelet era falhar ao iniciar se a memória swap fosse detectada em um nó.
  O suporte a swap foi introduzido a partir da v1.22. E desde a v1.28, o Swap é suportado apenas para cgroup v2; o recurso NodeSwap
  do kubelet está em beta, mas desativado por padrão.
  * Você **DEVE** desabilitar o swap se o kubelet não estiver configurado corretamente para usar swap. Por exemplo, `sudo swapoff -a`
    desabilitará a troca temporariamente. Para tornar essa mudança persistente entre reinicializações, certifique-se de que o swap esteja desabilitado em
    arquivos de configuração como `/etc/fstab`, `systemd.swap`, dependendo de como foi configurado em seu sistema.

{{< note >}}
A instalação do `kubeadm` é feita via binários que usam linkagem dinâmica e assume que seu sistema alvo fornece `glibc`.
Essa é uma suposição razoável em muitas distribuições Linux (incluindo Debian, Ubuntu, Fedora, CentOS, etc.)
mas nem sempre é o caso com distribuições personalizadas e leves que não incluem `glibc` por padrão, como o Alpine Linux.
A expectativa é que a distribuição inclua `glibc` ou uma [camada de compatibilidade](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)
que forneça os símbolos esperados.
{{< /note >}}

<!-- steps -->

## Verifique se o endereço MAC e o product_uuid são únicos para cada nó {#verify-mac-address}

* Você pode obter o endereço MAC das interfaces de rede usando o comando `ip link` ou `ifconfig -a`.
* O product_uuid pode ser verificado utilizando o comando `sudo cat /sys/class/dmi/id/product_uuid`.

É provável que dispositivos físicos possuam endereços únicos. No entanto, é possível que algumas máquinas virtuais possuam endereços iguais. O Kubernetes utiliza esses valores para identificar unicamente os nós em um cluster. Se esses valores não forem únicos para cada nó, o processo de instalação pode [falhar](https://github.com/kubernetes/kubeadm/issues/31).

## Verificando os adaptadores de rede

Se você possuir mais de um adaptador de rede, e seus componentes Kubernetes não forem acessíveis através da rota padrão, recomendamos adicionar o IP das rotas para que os endereços do cluster Kubernetes passem pelo adaptador correto.

## Verifique as portas necessárias

Essas [portas necessárias](/docs/reference/networking/ports-and-protocols/)
precisam estar abertas para que os componentes do Kubernetes se comuniquem entre si.
Você pode usar ferramentas como [netcat](https://netcat.sourceforge.net) para verificar se uma porta está aberta. Por exemplo:

```shell
nc 127.0.0.1 6443 -v
```

O plugin de rede de pods que você usa também pode exigir que certas portas estejam
abertas. Como isso varia com cada plugin de rede de pods, consulte a
documentação dos plugins sobre quais portas precisam estar abertas.

## Instalando um runtime de container {#installing-runtime}

Para executar containers em Pods, o Kubernetes usa um
{{< glossary_tooltip term_id="container-runtime" text="runtime de container" >}}.

Por padrão, o Kubernetes usa a
{{< glossary_tooltip term_id="cri" text="Interface de Runtime de Container">}} (CRI)
para se comunicar com o runtime de container escolhido.

Se você não especificar um runtime, o kubeadm tentará detectar automaticamente um runtime de container instalado
varrendo uma lista de endpoints conhecidos.

Se múltiplos ou nenhum runtime de container forem detectados, o kubeadm lançará um erro
e solicitará que você especifique qual deles deseja usar.

Veja [runtimes de container](/docs/setup/production-environment/container-runtimes/)
para mais informações.

{{< note >}}
O Docker Engine não implementa a [CRI](/docs/concepts/architecture/cri/)
que é um requisito para um runtime de container trabalhar com o Kubernetes.
Por essa razão, um serviço adicional [cri-dockerd](https://mirantis.github.io/cri-dockerd/)
deve ser instalado. cri-dockerd é um projeto baseado no suporte integrado legado
do Docker Engine que foi [removido](/dockershim) do kubelet na versão 1.24.
{{< /note >}}

As tabelas abaixo incluem os endpoints conhecidos para sistemas operacionais suportados:

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

{{< table caption="Runtimes de container para Linux" >}}
| Runtime                            | Caminho para o socket de domínio Unix                   |
|------------------------------------|---------------------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock`            |
| CRI-O                              | `unix:///var/run/crio/crio.sock`                        |
| Docker Engine (usando cri-dockerd) | `unix:///var/run/cri-dockerd.sock`                      |
{{< /table >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< table caption="Runtimes de container para Windows" >}}
| Runtime                            | Caminho para o pipe nomeado do Windows                  |
|------------------------------------|---------------------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`                |
| Docker Engine (usando cri-dockerd) | `npipe:////./pipe/cri-dockerd`                          |
{{< /table >}}

{{% /tab %}}
{{< /tabs >}}


## Instalando o kubeadm, kubelet e o kubectl

Você instalará esses pacotes em todas as suas máquinas:

* `kubeadm`: o comando para iniciar o cluster.

* `kubelet`: o componente que roda em todas as máquinas do seu cluster
  e faz coisas como iniciar pods e containers.

* `kubectl`: o utilitário de linha de comando para conversar com seu cluster.

O kubeadm **não irá** instalar ou gerenciar o `kubelet` ou o `kubectl` para você, então você precisará
garantir que eles correspondam à versão do plano de controle do Kubernetes que você deseja
que o kubeadm instale para você. Se não fizer isso, há um risco de ocorrer um descompasso de versão que
pode levar a um comportamento inesperado e com erros. No entanto, _um_ descompasso de versão menor entre o
kubelet e o plano de controle é suportado, mas a versão do kubelet nunca pode exceder a versão do servidor da API. Por exemplo, o kubelet executando 1.7.0 deve ser totalmente compatível com um servidor da API 1.8.0,
mas não o contrário.

Para mais informações acerca da instalação do `kubectl`, veja [Instale e configure o kubectl](/docs/tasks/tools/).

{{< warning >}}
Essas instruções removem todos os pacotes Kubernetes de quaisquer atualizações de sistema.
Isso ocorre porque o kubeadm e o Kubernetes requerem alguns [cuidados especiais para serem atualizados](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
{{</ warning >}}

Para mais detalhes sobre compatibilidade entre as versões, veja:

* [Política de versão e descompasso de versão](/docs/setup/release/version-skew-policy/) do Kubernetes
* [Política de descompasso de versão específica do Kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{% legacy-repos-deprecation %}}

{{< note >}}
Existe um repositório de pacotes dedicado para cada versão menor do Kubernetes. Se você deseja instalar
uma versão menor diferente da v{{< skew currentVersion >}}, por favor, veja o guia de instalação para
a sua versão menor desejada.
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="Distribuições baseadas em Debian" %}}

Essas instruções são para o Kubernetes v{{< skew currentVersion >}}.

1. Atualize o índice do pacote `apt` e instale os pacotes necessários para usar o repositório `apt` do Kubernetes:

   ```shell
   sudo apt-get update
   # apt-transport-https pode ser um pacote fictício; se for, você pode pular esse pacote
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

2. Baixe a chave pública de assinatura para os repositórios de pacotes do Kubernetes.
   A mesma chave de assinatura é usada para todos os repositórios, então você pode ignorar a versão na URL:

   ```shell
   # Se o diretório `/etc/apt/keyrings` não existir, ele deve ser criado antes do comando curl, leia a nota abaixo.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

{{< note >}}
Em lançamentos anteriores ao Debian 12 e Ubuntu 22.04, o diretório `/etc/apt/keyrings` não existe por padrão, e deve ser criado antes do comando curl.
{{< /note >}}

3. Adicione o repositório `apt` apropriado do Kubernetes. Por favor, note que este repositório tem pacotes
   apenas para o Kubernetes {{< skew currentVersion >}}; para outras versões menores do Kubernetes, você precisa
   mudar a versão menor do Kubernetes na URL para corresponder à sua versão menor desejada
   (você também deve verificar se está lendo a documentação para a versão do Kubernetes
   que você planeja instalar).

   ```shell
   # Isso sobrescreve qualquer configuração existente em /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. Atualize o índice de pacotes `apt`, instale o kubelet, o kubeadm e o kubectl, e fixe suas versões:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

5. (Opcional) Habilite o serviço kubelet antes de executar kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Distribuições baseadas em Red Hat" %}}

1. Configure o SELinux em modo `permissivo`:

   Essas instruções são para o Kubernetes {{< skew currentVersion >}}.

   ```shell
   # Configure o SELinux em modo permissivo (efetivamente desabilitando-o)
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   ```

{{< caution >}}
- Configurar o SELinux em modo permissivo ao executar `setenforce 0` e `sed ...`
efetivamente o desabilita. Isso é necessário para permitir que os contêineres acessem o sistema de arquivos do hospedeiro; por exemplo, alguns plugins de rede de cluster requerem isso. Você deve
fazer isso até que o suporte ao SELinux seja melhorado no kubelet.
- Você pode manter o SELinux habilitado se souber como configurá-lo, mas pode ser necessário
configurações que não são suportadas pelo kubeadm.
{{< /caution >}}

2. Adicione o repositório `yum` do Kubernetes. O parâmetro `exclude` na
   definição do repositório garante que os pacotes relacionados ao Kubernetes não
   sejam atualizados ao executar `yum update`, já que existe um procedimento especial que
   deve ser seguido para atualizar o Kubernetes. Por favor, note que este repositório
   tem pacotes apenas para o Kubernetes {{< skew currentVersion >}}; para outras
   versões menores do Kubernetes, você precisa mudar a versão menor do Kubernetes
   na URL para corresponder à sua versão menor desejada (você também deve verificar se
   está lendo a documentação para a versão do Kubernetes que você planeja instalar).

   ```shell
   # Isso sobrescreve qualquer configuração existente em /etc/yum.repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   EOF
   ```

3. Instale kubelet, kubeadm e kubectl:

   ```shell
   sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
   ```

4. (Opcional) Habilite o serviço kubelet antes de executar kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Sem um gerenciador de pacotes" %}}
Instale os plugins CNI (utilizados por grande parte das redes de pods):

```bash
CNI_PLUGINS_VERSION="v1.3.0"
ARCH="amd64"
DEST="/opt/cni/bin"
sudo mkdir -p "$DEST"
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${ARCH}-${CNI_PLUGINS_VERSION}.tgz" | sudo tar -C "$DEST" -xz
```

Escolha o diretório para baixar os arquivos de comandos.

{{< note >}}
A variável `DOWNLOAD_DIR` deve ser definida para um diretório que permita escrita.
Se você está executando o Flatcar Container Linux, defina `DOWNLOAD_DIR="/opt/bin"`.
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

Instale o crictl (utilizado pelo kubeadm e pela Interface do Agente de execução do Kubelet (CRI))

```bash
CRICTL_VERSION="v1.28.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

Instale `kubeadm`, `kubelet` e adicione um serviço systemd `kubelet`:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet}
sudo chmod +x {kubeadm,kubelet}

RELEASE_VERSION="v0.16.2"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubelet/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service
sudo mkdir -p /usr/lib/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf
```

{{< note >}}
Por favor, consulte a nota na seção [Antes de começar](#before-you-begin) para distribuições Linux que não incluem `glibc` por padrão.
{{< /note >}}

Instale `kubectl` seguindo as instruções na [página de Instalação de Ferramentas](/docs/tasks/tools/#kubectl).

Opcionalmente, habilite o serviço kubelet antes de executar kubeadm:

```bash
sudo systemctl enable --now kubelet
```

{{< note >}}
A distribuição Flatcar Container Linux monta o diretório `/usr` como um sistema de arquivos somente leitura.
Antes de iniciar seu cluster, você precisa tomar passos adicionais para configurar um diretório gravável.
Veja o [Guia de Solução de Problemas do Kubeadm](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only)
para aprender como configurar um diretório gravável.
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}

O kubelet agora está reiniciando a cada poucos segundos, enquanto espera em um loop de falha por
kubeadm para dizer o que fazer.

## Configurando um driver cgroup

Tanto o agente de execução quanto o kubelet possuem uma propriedade chamada
["driver cgroup"](/docs/setup/production-environment/container-runtimes/), que é importante
para o gerenciamento dos cgroups em máquinas Linux.

{{< warning >}}
A compatibilidade entre os drivers cgroup e o agente de execução é necessária. Sem ela o processo do kubelet irá falhar.

Veja [configurando um driver cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) para mais detalhes.
{{< /warning >}}

## Solucionando problemas

Se você encontrar problemas com o kubeadm, por favor consulte a nossa [documentação de solução de problemas](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

## {{% heading "whatsnext" %}}

* [Utilizando o kubeadm para criar um cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
