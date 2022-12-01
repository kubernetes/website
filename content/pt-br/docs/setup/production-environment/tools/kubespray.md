---
title: Instalando Kubernetes com Kubespray
content_type: concept
weight: 30
---

<!-- overview -->

Este início rápido ajuda a instalar um cluster Kubernetes hospedado no GCE, Azure, OpenStack, AWS, vSphere, Equinix Metal (anteriormente Packet), Oracle Cloud Infrastructure (Experimental) ou Baremetal com [Kubespray](https://github.com/kubernetes-sigs/kubespray).

Kubespray é uma composição de playbooks [Ansible](https://docs.ansible.com/), [inventário](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible.md#inventory), ferramentas de provisionamento e conhecimento de domínio para tarefas genéricas de gerenciamento de configuração de clusters OS/Kubernetes. 

Kubespray fornece:
* Cluster altamente disponível.
* Combinável (Escolha do plugin de rede, por exemplo).
* Suporta as distribuições Linux mais populares:
  - Flatcar Container Linux da Kinvolk
  - Debian Bullseye, Buster, Jessie, Stretch
  - Ubuntu 16.04, 18.04, 20.04, 22.04
  - CentOS/RHEL 7, 8, 9
  - Fedora 35, 36
  - Fedora CoreOS
  - openSUSE Leap 15.x/Tumbleweed
  - Oracle Linux 7, 8, 9
  - Alma Linux 8, 9
  - Rocky Linux 8, 9
  - Kylin Linux Advanced Server V10
  - Amazon Linux 2
* Testes de integração contínua.

Para escolher a ferramenta que melhor se adapta ao seu caso, leia [esta comparação](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/comparisons.md) com
[kubeadm](/docs/reference/setup-tools/kubeadm/) e [kops](/docs/setup/production-environment/tools/kops/).

<!-- body -->

## Criando um cluster

### (1/5) Atenda aos requisitos básicos

Provisione servidores com os seguintes [requisitos](https://github.com/kubernetes-sigs/kubespray#requirements):

* **A versão mínima exigida do Kubernetes é v1.22**
* **Ansible v2.11+, Jinja 2.11+ and python-netaddr estão instalados na máquina que executará os comandos do Ansible**
* Os servidores de destino devem ter acesso à Internet para extrair imagens do docker. Caso contrário, é necessária configuração adicional. Consulte ([Offline Environment](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/offline-environment.md))
* Os servidores de destino são configurados para permitir o **encaminhamento IPv4**.
* Se estiver usando IPv6 para pods e serviços, os servidores de destino serão configurados para permitir o **encaminhamento de IPv6**.
* Os **firewalls não são gerenciados**, você precisará implementar suas próprias regras da maneira que costumava fazer. Para evitar qualquer problema durante a instalação, você deve desabilitar seu firewall.
* Se o kubespray for executado a partir de uma conta de usuário não raiz, o método correto de escalonamento de privilégios deve ser configurado nos servidores de destino. Neste caso, o `ansible_become` flag ou os parâmetros de comando `--become` ou `-b` devem ser especificados.

Kubespray fornece as seguintes utilidades para ajudar a provisionar seu ambiente:

* Scripts do [Terraform](https://www.terraform.io/) para os seguintes provedores de nuvem:
  * [AWS](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/aws)
  * [OpenStack](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/openstack)
  * [Equinix Metal](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/metal)

### (2/5) Componha um arquivo de inventário

Depois de provisionar seus servidores, crie um [arquivo de inventário para o Ansible](https://docs.ansible.com/ansible/latest/network/getting_started/first_inventory.html). Você pode fazer isso manualmente ou por meio de um script de inventário dinâmico. Para mais informações, consulte "[Criando seu próprio inventário](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#building-your-own-inventory)".

### (3/5) Planeje o deployment do seu cluster

O Kubespray oferece a habilidade de customizar vários aspectos do deployment:

* Escolha do modo de criação: kubeadm ou non-kubeadm
* Plugins CNI (rede)
* Configuração de DNS
* Escolha da camada de gerenciamento: nativo/binário ou conteinerizado
* Versões de componentes
* Refletores de rota Calico
* Opções de agente de execução do contêiner
  * {{< glossary_tooltip term_id="docker" >}}
  * {{< glossary_tooltip term_id="containerd" >}}
  * {{< glossary_tooltip term_id="cri-o" >}}
* Métodos de geração de certificados

As customizações do Kubespray podem ser feitas em um [arquivo de variáveis](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html). Se você estiver começando com o Kubespray, considere usar os padrões do Kubespray para implantar seu cluster e explorar o Kubernetes.

### (4/5) Deploy um Cluster

Em seguida, instale seu cluster:

Instalação do cluster usando [ansible-playbook](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#starting-custom-deployment).

```shell
ansible-playbook -i your/inventory/inventory.ini cluster.yml -b -v \
  --private-key=~/.ssh/private_key
```

Grandes instalações (mais de 100 nós) podem exigir [ajustes específicos](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/large-deployments.md) para obter melhores resultados.

### (5/5) Verifique a instalação

O Kubespray fornece uma maneira de verificar a conectividade entre pods e a resolução de DNS com o [Netchecker](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/netcheck.md). O Netchecker garante que os pods de agentes do netchecker possam resolver solicitações de DNS e pingar cada um dentro do namespace padrão. Esses pods imitam um comportamento semelhante ao restante das cargas de trabalho e servem como indicadores de integridade do cluster.

## Operações do Cluster

O Kubespray fornece playbooks adicionais para gerenciar seu cluster: _dimensionar_ e _atualizar_.

### Dimensione seu cluster

Você pode adicionar nós de processamento de seu cluster executando o playbook de escalonamento. Para obter mais informações, consulte "[Adicionando nós](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#adding-nodes)".
Você pode remover nós de processamento de seu cluster executando o playbook remove-nó. Para obter mais informações, consulte "[Remove nodes](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#remove-nodes)".

### Atualize seu cluster

Você pode atualizar seu cluster executando o playbook de atualização do cluster. Para obter mais informações, consulte "[Atualizações](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/upgrades.md)".

## Limpeza

Você pode redefinir seus nós e eliminar todos os componentes instalados com o Kubespray por meio do playbook de [redefinição](https://github.com/kubernetes-sigs/kubespray/blob/master/reset.yml).

{{< caution >}}
Ao executar o playbook de redefinição, certifique-se de não atingir acidentalmente seu cluster de produção!
{{< /caution >}}

## Feedback

* Canal Slack: [#kubespray](https://kubernetes.slack.com/messages/kubespray/) (Obtenha seu convite [aqui](https://slack.k8s.io/)).
* [GitHub Issues](https://github.com/kubernetes-sigs/kubespray/issues).

## {{% heading "whatsnext" %}}

* Confira o trabalho planejado no [roteiro](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/roadmap.md) do Kubespray.
* Saiba mais sobre o [Kubespray](https://github.com/kubernetes-sigs/kubespray).
