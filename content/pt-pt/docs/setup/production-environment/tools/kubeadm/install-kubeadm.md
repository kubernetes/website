---
title: Instalar o kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 40
  title: Instalar a ferramenta de configuração kubeadm
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
Esta página mostra como instalar a caixa de ferramentas `kubeadm`.
Para informações sobre como criar um cluster com kubeadm após ter realizado este processo de instalação,
veja a página [Criar um cluster com kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

{{< doc-versions-list "guia de instalação" >}}

## {{% heading "prerequisites" %}}

* Um host Linux compatível. O projeto Kubernetes fornece instruções genéricas para distribuições Linux
  baseadas em Debian e Red Hat, e aquelas distribuições sem um gestor de pacotes.
* 2 GB ou mais de RAM por máquina (qualquer valor inferior deixará pouco espaço para as suas aplicações).
* 2 CPUs ou mais.
* Conectividade de rede completa entre todas as máquinas no cluster (rede pública ou privada é aceitável).
* Nome de host único, endereço MAC e product_uuid para cada nó. Veja [aqui](#verify-mac-address) para mais detalhes.
* Certas portas estão abertas nas suas máquinas. Veja [aqui](#check-required-ports) para mais detalhes.
* Configuração de swap. O comportamento padrão de um kubelet era falhar ao iniciar se a memória swap fosse detetada num nó.
  O swap é suportado desde a v1.22. E desde a v1.28, Swap é suportado apenas para cgroup v2; a funcionalidade NodeSwap
  do kubelet é beta mas desativada por padrão.
  * **DEVE** desativar o swap se o kubelet não estiver devidamente configurado para usar swap. Por exemplo, `sudo swapoff -a`
    desativará a troca temporariamente. Para tornar esta alteração persistente entre reinícios, assegure-se de que o swap está desativado em
    ficheiros de configuração como `/etc/fstab`, `systemd.swap`, dependendo de como foi configurado no seu sistema.

{{< note >}}
A instalação do `kubeadm` é feita através de binários que usam ligação dinâmica e assume que o seu sistema alvo fornece `glibc`.
Esta é uma suposição razoável em muitas distribuições Linux (incluindo Debian, Ubuntu, Fedora, CentOS, etc.)
mas nem sempre é o caso com distribuições personalizadas e leves que não incluem `glibc` por padrão, como o Alpine Linux.
A expectativa é que a distribuição inclua `glibc` ou uma [camada de compatibilidade](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)
que forneça os símbolos esperados.
{{< /note >}}

<!-- steps -->

## Verificar se o endereço MAC e product_uuid são únicos para cada nó {#verify-mac-address}

* Pode obter o endereço MAC das interfaces de rede usando o comando `ip link` ou `ifconfig -a`
* O product_uuid pode ser verificado usando o comando `sudo cat /sys/class/dmi/id/product_uuid`

É muito provável que dispositivos de hardware tenham endereços únicos, embora algumas máquinas virtuais possam ter
valores idênticos. O Kubernetes usa esses valores para identificar de forma única os nós no cluster.
Se estes valores não forem únicos para cada nó, o processo de instalação
pode [falhar](https://github.com/kubernetes/kubeadm/issues/31).

## Verificar adaptadores de rede

Se tiver mais de um adaptador de rede, e os seus componentes Kubernetes não forem acessíveis na rota padrão,
recomendamos que adicione rota(s) IP para que os endereços do cluster Kubernetes passem pelo adaptador apropriado.

## Verificar portas necessárias

Estas [portas necessárias](/docs/reference/networking/ports-and-protocols/)
precisam de estar abertas para que os componentes Kubernetes possam comunicar entre si.
Pode usar ferramentas como [netcat](https://netcat.sourceforge.net) para verificar se uma porta está aberta. Por exemplo:

```shell
nc 127.0.0.1 6443 -v
```

O plugin de rede para pods que usar pode também requerer que certas portas estejam
abertas. Como isto difere com cada plugin de rede para pods, consulte a
documentação para os plugins sobre quais portas precisam de estar abertas.

## Instalar um runtime de contentores {#installing-runtime}

Para executar contentores em Pods, o Kubernetes usa um
{{< glossary_tooltip term_id="container-runtime" text="runtime de contentores" >}}.

Por padrão, o Kubernetes usa o
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)
para interagir com o seu runtime de contentores escolhido.

Se não especificar um runtime, o kubeadm tenta automaticamente detetar um runtime de contentores instalado
ao examinar uma lista de endpoints conhecidos.

Se detetar múltiplos ou nenhum runtime de contentores, o kubeadm lançará um erro
e solicitará que especifique qual deseja usar.

Veja [runtimes de contentores](/docs/setup/production-environment/container-runtimes/)
para mais informações.

{{< note >}}
O Docker Engine não implementa o [CRI](/docs/concepts/architecture/cri/)
que é um requisito para um runtime de contentores funcionar com o Kubernetes.
Por essa razão, um serviço adicional [cri-dockerd](https://mirantis.github.io/cri-dockerd/)
tem de ser instalado. O cri-dockerd é um projeto baseado no suporte integrado
do Docker Engine legado que foi [removido](/dockershim) do kubelet na versão 1.24.
{{< /note >}}

As tabelas abaixo incluem os endpoints conhecidos para sistemas operativos suportados:

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

{{< table caption="Runtimes de contentores para Linux" >}}
| Runtime                            | Caminho para o socket de domínio Unix                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine (usando cri-dockerd)  | `unix:///var/run/cri-dockerd.sock`           |
{{< /table >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< table caption="Runtimes de contentores para Windows" >}}
| Runtime                            | Caminho para o pipe nomeado do Windows                  |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine (usando cri-dockerd)  | `npipe:////./pipe/cri-dockerd`               |
{{< /table >}}

{{% /tab %}}
{{< /tabs >}}

## Instalar o kubeadm, kubelet e kubectl

Vai instalar estes pacotes em todas as suas máquinas:

* `kubeadm`: o comando para iniciar o cluster.

* `kubelet`: o componente que é executado em todas as máquinas do seu cluster
  e faz coisas como iniciar pods e contentores.

* `kubectl`: a ferramenta de linha de comando para comunicar com o seu cluster.

O kubeadm **não** instalará ou gerirá o `kubelet` ou `kubectl` por si, por isso terá
de assegurar que estes correspondem à versão do plano de controlo Kubernetes que deseja
que o kubeadm instale para si. Se não o fizer, existe o risco de ocorrer uma discrepância de versões que
pode levar a comportamentos inesperados e com erros. No entanto, é suportada uma discrepância de _uma_ versão menor entre o
kubelet e o plano de controlo, mas a versão do kubelet nunca pode exceder a versão do servidor da API. Por exemplo, o kubelet executando 1.7.0 deve ser totalmente compatível com um servidor da API 1.8.0,
mas não o contrário.

Para informações sobre a instalação do `kubectl`, veja [Instalar e configurar o kubectl](/docs/tasks/tools/).

{{< warning >}}
Estas instruções excluem todos os pacotes Kubernetes de quaisquer atualizações do sistema.
Isto é porque o kubeadm e o Kubernetes requerem
[atenção especial para atualizar](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
{{</ warning >}}

Para mais informações sobre discrepâncias de versões, veja:

* Política de versões e discrepâncias de versões do Kubernetes [version and version-skew policy](/docs/setup/release/version-skew-policy/)
* Política específica de discrepâncias de versões do kubeadm [version skew policy](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{% legacy-repos-deprecation %}}

{{< note >}}
Existe um repositório de pacotes dedicado para cada versão menor do Kubernetes. Se deseja instalar
uma versão menor diferente de v{{< skew currentVersion >}}, por favor veja o guia de instalação para
a sua versão menor desejada.
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="Distribuições baseadas em Debian" %}}

Estas instruções são para o Kubernetes v{{< skew currentVersion >}}.

1. Atualize o índice de pacotes `apt` e instale pacotes necessários para usar o repositório `apt` do Kubernetes:

   ```shell
   sudo apt-get update
   # apt-transport-https pode ser um pacote falso; se for, pode ignorar esse pacote
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

2. Descarregue a chave pública de assinatura para os repositórios de pacotes do Kubernetes.
   A mesma chave de assinatura é usada para todos os repositórios, por isso pode ignorar a versão no URL:

   ```shell
   # Se o diretório `/etc/apt/keyrings` não existir, deve ser criado antes do comando curl, leia a nota abaixo.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

{{< note >}}
Nas versões anteriores ao Debian 12 e Ubuntu 22.04, o diretório `/etc/apt/keyrings` não existe por padrão, e deve ser criado antes do comando curl.
{{< /note >}}

3. Adicione o repositório `apt` do Kubernetes apropriado. Por favor note que este repositório tem pacotes
   apenas para o Kubernetes {{< skew currentVersion >}}; para outras versões menores do Kubernetes, necessita de
   alterar a versão menor do Kubernetes no URL para corresponder à sua versão menor desejada
   (deve também verificar que está a ler a documentação para a versão do Kubernetes
   que pretende instalar).

   ```shell
   # Isto sobrescreve qualquer configuração existente em /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. Atualize o índice de pacotes `apt`, instale o kubelet, kubeadm e kubectl, e fixe a sua versão:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

5. (Opcional) Ative o serviço kubelet antes de executar o kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Distribuições baseadas em Red Hat" %}}

1. Defina o SELinux para o modo `permissive`:

   Estas instruções são para o Kubernetes {{< skew currentVersion >}}.

   ```shell
   # Define o SELinux em modo permissive (efetivamente desativando-o)
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   ```

{{< caution >}}
- Definir o SELinux em modo permissive, executando `setenforce 0` e `sed ...`
efetivamente desativa-o. Isto é necessário para permitir que os contentores acedam ao sistema de ficheiros do host;
por exemplo, alguns plugins de rede do cluster requerem isto. Tem de
fazer isto até que o suporte do SELinux seja melhorado no kubelet.
- Pode deixar o SELinux ativado se souber como configurá-lo, mas pode requerer
definições que não são suportadas pelo kubeadm.
{{< /caution >}}

2. Adicione o repositório `yum` do Kubernetes. O parâmetro `exclude` na
   definição do repositório assegura que os pacotes relacionados com o Kubernetes são
   não atualizados ao executar `yum update`, pois existe um procedimento especial que
   deve ser seguido para atualizar o Kubernetes. Por favor note que este repositório
   tem pacotes apenas para o Kubernetes {{< skew currentVersion >}}; para outras
   versões menores do Kubernetes, necessita de alterar a versão menor do Kubernetes
   no URL para corresponder à sua versão menor desejada (deve também verificar que
   está a ler a documentação para a versão do Kubernetes que
   pretende instalar).

   ```shell
   # Isto sobrescreve qualquer configuração existente em /etc/yum.repos.d/kubernetes.repo
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

3. Instale o kubelet, kubeadm e kubectl:

   ```shell
   sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
   ```

4. (Opcional) Ative o serviço kubelet antes de executar o kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Sem um gestor de pacotes" %}}
Instale os plugins CNI (necessários para a maioria das redes de pods):

```bash
CNI_PLUGINS_VERSION="v1.3.0"
ARCH="amd64"
DEST="/opt/cni/bin"
sudo mkdir -p "$DEST"
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${ARCH}-${CNI_PLUGINS_VERSION}.tgz" | sudo tar -C "$DEST" -xz
```

Defina o diretório para descarregar ficheiros de comando:

{{< note >}}
A variável `DOWNLOAD_DIR` deve ser definida para um diretório com permissões de escrita.
Se estiver a executar o Flatcar Container Linux, defina `DOWNLOAD_DIR="/opt/bin"`.
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

Instale o crictl (necessário para o kubeadm / Kubelet Container Runtime Interface (CRI)):

```bash
CRICTL_VERSION="v1.28.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

Instale o `kubeadm`, `kubelet` e adicione um serviço systemd `kubelet`:

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
Por favor, refira-se à nota na secção [Antes de começar](#before-you-begin) para distribuições Linux
que não incluem `glibc` por padrão.
{{< /note >}}

Instale o `kubectl` seguindo as instruções na página [Instalar Ferramentas](/docs/tasks/tools/#kubectl).

Opcionalmente, ative o serviço kubelet antes de executar o kubeadm:

```bash
sudo systemctl enable --now kubelet
```

{{< note >}}
A distribuição Flatcar Container Linux monta o diretório `/usr` como um sistema de ficheiros somente de leitura.
Antes de iniciar o seu cluster, precisa de tomar passos adicionais para configurar um diretório com permissão de escrita.
Veja o [guia de resolução de problemas do Kubeadm](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only)
para aprender como configurar um diretório com permissão de escrita.
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}

O kubelet está agora a reiniciar a cada poucos segundos, enquanto espera em um ciclo contínuo de falhas pelo
kubeadm para lhe dizer o que fazer.

## Configurar um driver de cgroup

Tanto o runtime de contentores quanto o kubelet têm uma propriedade chamada
["driver de cgroup"](/docs/setup/production-environment/container-runtimes/#cgroup-drivers), que é importante
para a gestão de cgroups em máquinas Linux.

{{< warning >}}
É necessário que os drivers de cgroup do runtime de contentores e do kubelet correspondam, caso contrário, o processo kubelet falhará.

Veja [Configurar um driver de cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) para mais detalhes.
{{< /warning >}}

## Resolução de Problemas

Se estiver a encontrar dificuldades com o kubeadm, por favor consulte os nossos
[documentos de resolução de problemas](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

## {{% heading "whatsnext" %}}

* [Usar o kubeadm para Criar um Cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
