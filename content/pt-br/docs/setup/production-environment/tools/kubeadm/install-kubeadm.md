---
title: Instalando a ferramenta kubeadm
content_type: task
weight: 10
---

<!-- overview -->

<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">Essa página mostra o processo de instalação do conjunto de ferramentas `kubeadm`. 
Para mais informações sobre como criar um cluster com o kubeadm após efetuar a instalação, veja a página [Utilizando kubeadm para criar um cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).


## {{% heading "prerequisites" %}}

* Uma máquina com sistema operacional Linux compatível. O projeto Kubernetes provê instruções para distribuições Linux baseadas em Debian e Red Hat, bem como para distribuições sem um gerenciador de pacotes.
* 2 GB ou mais de RAM por máquina (menos que isso deixará pouca memória para as suas aplicações).
* 2 CPUs ou mais.
* Conexão de rede entre todas as máquinas no cluster. Seja essa pública ou privada.
* Nome da máquina na rede, endereço MAC e producy_uuid únicos para cada nó. Mais detalhes podem ser lidos [aqui](#veficiar-endereco-mac).
* Portas específicas abertas nas suas máquinas. Você poderá ler quais são [aqui](#verificar-portas-necessarias).
* Swap desabilitado. Você *precisa* desabilitar a funcionalidade de swap para que o kubelet funcione de forma correta.

<!-- steps -->

## Verificando se o endereço MAC e o product_uiid são únicos para cada nó {#veficiar-endereco-mac}

* Você pode verificar o endereço MAC da interface de rede utilizando o comando `ip link` ou o comando `ipconfig -a`.
* O product_uuid pode ser verificado utilizando o comando `sudo cat /sys/class/dmi/id/product_uuid`.

É provável que dispositivos físicos possuam endereços únicos. No entanto, é possível que algumas máquinas virtuais possuam endereços iguais. O Kubernetes utiliza esses valores para identificar unicamente os nós em um cluster. Se esses valores não forem únicos para cada nó, o processo de instalação pode [falhar](https://github.com/kubernetes/kubeadm/issues/31).

## Verificando os adaptadores de rede

Se você possuir mais de um adaptador de rede, e seus componentes Kubernetes não forem acessíveis através da rota padrão, recomendamos adicionar o IP das rotas para que os endereços do cluster Kubernetes passem pelo adaptador correto.

## Fazendo com que o iptables enxergue o tráfego agregado

Assegure-se de que o módulo `br_netfilter` está carregado. Isso pode ser feito executando o comando `lsmod | grep br_netfilter`. Para carrega-lo explicitamente execute `sudo modprobe br_netfilter`.

Como um requisito para que seus nós Linux enxerguem corretamente o tráfego agregado de rede, você deve garantir que a configuração `net.bridge.bridge-nf-call-iptables` do seu `sysctl` está configurada com valor 1. Como no exemplo abaixo:

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system
```

Para mais detalhes veja a página [Requisitos do plugin de rede](/pt-br/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#network-plugin-requirements).

## Verificando as portas necessárias

As portas listadas [aqui](https://kubernetes.io/docs/reference/ports-and-protocols/) precisam estar abertas para que os componentes do Kubernetes se comuniquem uns com os outros.

O plugin de rede dos pods que você utiliza também pode requer que algumas portas estejam abertas. Dito que essas portas podem diferir dependendo do plugin, por favor leia a documentação dos plugins sobre quais portas serão necessárias abrir.

## Instalando o agente de execução de contêineres {#instalando-agente-de-execucao}

Para executar os contêineres nos Pods, o Kubernetes utiliza um 
{{< glossary_tooltip term_id="container-runtime" text="agente de execução" >}}.

{{< tabs name="container_runtime" >}}
{{% tab name="Nós Linux" %}}

Por padrão, o Kubernetes utiliza a {{< glossary_tooltip term_id="cri" text="interface do agente de execução">}} (CRI) para interagir com o seu agente de execução de contêiner escolhido.

Se você não especificar nenhum agente de execução, o kubeadm irá tentar identifica-lo automaticamente através de uma lista dos sockets Unix mais utilizados. A tabela a seguir lista os agentes de execução e os caminhos dos sockets a eles associados.

{{< table caption = "Agentes de execução e seus caminhos de socket" >}}
| Agente de execução    | Caminho do socket Unix        |
|------------|-----------------------------------|
| Docker     | `/var/run/dockershim.sock`        |
| containerd | `/run/containerd/containerd.sock` |
| CRI-O      | `/var/run/crio/crio.sock`         |
{{< /table >}}

<br />
Se tanto o Docker quanto o containerd forem detectados no sistema, o Docker terá precedência. Isso acontece porque o Docker, desde a versão 18.09, já incluí o containerd e ambos são detectaveis mesmo que você só tenha instalado o Docker. Se outros dois ou mais agentes de execução forem detectados, o kubeadm é encerrado com um erro.

O kubelet se integra com o Docker através da implementação CRI `dockershim` já inclusa.

Veja a página dos [agentes de execução](/docs/setup/production-environment/container-runtimes/)
para mais detalhes.
{{% /tab %}}
{{% tab name="Outros sistemas operacionais" %}}
Por padrão, o kubeadm utiliza o {{< glossary_tooltip term_id="docker" >}} como agente de execução.
O kubelet se integra com o Docker através da implementação CRI `dockershim` já inclusa.

Veja a página dos [agentes de execução](/docs/setup/production-environment/container-runtimes/)
para mais detalhes.
{{% /tab %}}
{{< /tabs >}}


## Instalando o kubeadm, kubelet e o kubectl

Você instalará esses pacotes em todas as suas máquinas:

* `kubeadm`: o comando para criar o cluster.

* `kubelet`: o componente que executa em todas as máquinas no seu cluster e cuida de tarefas como a inicialização de pods e contêineres. 

* `kubectl`: a ferramenta de linha de comando para interação com o cluster.

O kubeadm **não irá** instalar ou gerenciar o `kubelet` ou o `kubectl` para você, então você
precisará garantir que as versões deles são as mesmas da versão da camada de gerenciamento do Kubernetes 
que você quer que o kubeadm instale. Caso isso não seja feito, surge o risco de que uma diferença nas versões 
leve a bugs e comportamentos inesperados. Dito isso, _uma_ diferença de menor grandeza nas versões entre o kubelet e a 
camada de gerenciamento é suportada, mas a versão do kubelet nunca poderá ser superior à versão do servidor da API.
Por exemplo, um kubelet com a versão 1.7.0 será totalmente compatível com a versão 1.8.0 do servidor da API, mas o contrário não será verdadeiro.

Para mais informações acerca da instalação do `kubectl`, veja [Instale e configure o kubectl](/docs/tasks/tools/).

{{< warning >}}
Essas instruções removem todos os pacotes Kubernetes de quaisquer atualizações de sistema.
Isso ocorre porque o kubeadm e o Kubernetes requerem alguns [cuidados especiais para serem atualizados](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
{{</ warning >}}

Para mais detalhes sobre compatibilidade entre as versões, veja:

* [Políticas de versão e compatibilidade entre versões](/docs/setup/release/version-skew-policy/) do Kubernetes.
* [Compatibilidade entre versões](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy) do Kubeadm.

{{< tabs name="k8s_install" >}}
{{% tab name="Distribuições Debian" %}}

1. Atualize o índice de pacotes `apt` e instale os pacotes necessários para utilizar o repositório `apt` do Kubernetes:

   ```shell
   sudo apt-get update
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

2. Faça o download da chave de assinatura pública da Google Cloud:

   ```shell
   sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
   ```

3. Adicione o repositório `apt` do Kubernetes:

   ```shell
   echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. Atualize o índice de pacotes `apt`, instale o kubelet, o kubeadm e o kubectl, e fixe suas versões:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

{{% /tab %}}
{{% tab name="Distribuições Red Hat" %}}
```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kubelet kubeadm kubectl
EOF

# Set SELinux in permissive mode (effectively disabling it)
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

sudo systemctl enable --now kubelet
```

  **Avisos:**

  - Colocar o SELinux em modo permissivo ao executar `setenforce 0` e `sed ...` efetivamente o desabilita.
  Isso é necessário para permitir que os contêineres acessem o sistema de arquivos do hospedeiro, que é utilizado pelas redes dos pods por exemplo.
  Você precisará disso até que o suporte ao SELinux seja melhorado no kubelet.

  - Você pode deixar o SELinux habilitado se você souber como configura-lo, mas isso pode exegir configurações que não são suportadas pelo kubeadm.

{{% /tab %}}
{{% tab name="Sem um gerenciador de pacotes" %}}
Instale os plugins CNI (utilizados por grande parte das redes de pods):

```bash
CNI_VERSION="v0.8.2"
ARCH="amd64"
sudo mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-linux-${ARCH}-${CNI_VERSION}.tgz" | sudo tar -C /opt/cni/bin -xz
```

Escolha o diretório para baixar os arquivos de comandos.

{{< note >}}
A variável `DOWNLOAD_DIR` precisa estar configurada para um diretório que permita escrita.
Se você estiver utilizando o Flatcar Container Linux, configure a váriavel de ambiente `DOWNLOAD_DIR=/opt/bin`.
{{< /note >}}

```bash
DOWNLOAD_DIR=/usr/local/bin
sudo mkdir -p $DOWNLOAD_DIR
```

Instale o crictl (utilizado pelo kubeadm e pela Interface do Agente de execução do Kubelet (CRI))

```bash
CRICTL_VERSION="v1.22.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

Instale o `kubeadm`, o `kubelet`, e o `kubectl` e adicione o serviço systemd `kubelet`:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet,kubectl}
sudo chmod +x {kubeadm,kubelet,kubectl}

RELEASE_VERSION="v0.4.0"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubelet/lib/systemd/system/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /etc/systemd/system/kubelet.service
sudo mkdir -p /etc/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

Habilite e inicie o `kubelet`:

```bash
systemctl enable --now kubelet
```

{{< note >}}
A distribuição Flatcar Container Linux instala o diretório `/usr` como um sistema de arquivos apenas para leitura.
Antes de inicializar o seu cluster, você precisa de alguns passos adicionais para configurar um diretório com escrita.
Veja o [Guia de solução de problemas do Kubeadm](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only/) para aprender como configurar um diretório com escrita.
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}

O kubelet agora ficará reiniciando de alguns em alguns segundos, enquanto espera por instruções vindas do kubeadm. 

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
