---
title: "Segurança"
weight: 85
description: >
  Conceitos para manter suas cargas de trabalho cloud native seguras.
simple_list: true
---

Essa seção da documentação do Kubernetes busca ensinar a executar cargas de trabalho
mais seguras e aspectos essenciais para a manutenção de um cluster Kubernetes seguro.

O Kubernetes é baseado em uma arquitetura cloud native e segue as boas práticas de segurança da informação 
para ambientes cloud native recomendadas pela {{< glossary_tooltip text="CNCF" term_id="cncf" >}}.

Leia [Segurança Cloud Native e Kubernetes](/docs/concepts/security/cloud-native-security/) 
para entender o contexto mais amplo sobre como proteger seu cluster e as aplicações que você está executando nele.

## Mecanismos de segurança do Kubernetes {#security-mechanisms}

O Kubernetes inclui várias APIs e controles de segurança, além de mecanismos 
para definir [políticas](#policies) que podem fazer parte da sua estratégia de gestão da segurança da informação.

### Proteção da camada de gerenciamento

Um mecanismo de segurança fundamental para qualquer cluster Kubernetes é [controlar o acesso à API do Kubernetes](/docs/concepts/security/controlling-access).

O Kubernetes espera que você configure e utilize TLS para fornecer [criptografia de dados em trânsito](/docs/tasks/tls/managing-tls-in-a-cluster/) dentro do control plane e entre o control plane e seus clientes.
Você também pode habilitar a [criptografia em repouso](/docs/tasks/administer-cluster/encrypt-data/) para os dados armazenados no plano de controle do Kubernetes; isso é diferente de usar criptografia em repouso para os dados das suas próprias cargas de trabalho, o que também pode ser uma boa prática.

### Secrets

A API [Secret](/docs/concepts/configuration/secret/) fornece proteção básica para valores de configuração que exigem confidencialidade.

### Proteção de cargas de trabalho

Aplique os [padrões de segurança de Pods](/docs/concepts/security/pod-security-standards/) para garantir que os Pods e seus contêineres sejam isolados de forma adequada. Você também pode usar [RuntimeClasses](/docs/concepts/containers/runtime-class) para definir isolamento personalizado, se necessário.

As [políticas de rede](/docs/concepts/services-networking/network-policies/) permitem controlar o tráfego de rede entre Pods ou entre Pods e a rede externa ao seu cluster.

Você pode implantar controles de segurança do ecossistema mais amplo para implementar controles preventivos ou de detecção em torno dos Pods, de seus contêineres e das imagens que eles executam.


### Admission control {#admission-control}

Os [admission controllers](/docs/reference/access-authn-authz/admission-controllers/) são plugins que interceptam requisições para a API do Kubernetes e podem validá-las ou modificá-las com base em campos específicos da requisição. Projetar esses controladores com cuidado ajuda a evitar interrupções não intencionais à medida que as APIs do Kubernetes mudam entre atualizações de versão. Para considerações de design, consulte [Boas práticas para admission webhooks](/docs/concepts/cluster-administration/admission-webhooks-good-practices/).

### Auditoria

O [log de auditoria](/docs/tasks/debug/debug-cluster/audit/) do Kubernetes fornece um conjunto cronológico de registros relevantes para segurança, documentando a sequência de ações em um cluster. O cluster audita as atividades geradas por usuários, por aplicações que usam a API do Kubernetes e pelo próprio control plane.


## Segurança do provedor de nuvem

{{% thirdparty-content vendor="true" %}}

Se você estiver executando um cluster Kubernetes em seu próprio hardware ou em um provedor de nuvem diferente, consulte sua documentação para conhecer as melhores práticas de segurança.
Aqui estão links para a documentação de segurança de alguns provedores de nuvem populares:

{{< table caption="Cloud provider security" >}}

Provedor de IaaS        | Link |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security |
Google Cloud Platform | https://cloud.google.com/security |
Huawei Cloud | https://www.huaweicloud.com/intl/en-us/securecenter/overallsafety |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
Oracle Cloud Infrastructure | https://www.oracle.com/security |
Tencent Cloud | https://www.tencentcloud.com/solutions/data-security-and-information-protection |
VMware vSphere | https://www.vmware.com/solutions/security/hardening-guides |

{{< /table >}}

## Políticas {#policies}

Você pode definir políticas de segurança usando mecanismos nativos do Kubernetes, como [NetworkPolicy](/docs/concepts/services-networking/network-policies/) (controle declarativo sobre filtragem de pacotes de rede) ou [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) (restrições declarativas sobre quais alterações alguém pode fazer usando a API do Kubernetes).

No entanto, você também pode contar com implementações de políticas do ecossistema mais amplo em torno do Kubernetes. O Kubernetes fornece mecanismos de extensão que permitem a esses projetos do ecossistema implementar seus próprios controles de política para revisão de código-fonte, aprovação de imagens de contêiner, controles de acesso à API, redes e muito mais.

Para mais informações sobre mecanismos de políticas e Kubernetes, consulte [Políticas](/docs/concepts/policy/).


## {{% heading "whatsnext" %}}

Saiba mais sobre tópicos relacionados à segurança no Kubernetes:

* [Protegendo seu cluster](/docs/tasks/administer-cluster/securing-a-cluster/)
* [Vulnerabilidades conhecidas](/docs/reference/issues-security/official-cve-feed/) no Kubernetes (e links para mais informações)
* [Criptografia de dados em trânsito](/docs/tasks/tls/managing-tls-in-a-cluster/) para a camada de gerenciamento
* [Criptografia de dados em repouso](/docs/tasks/administer-cluster/encrypt-data/)
* [Controlando o acesso à API do Kubernetes](/docs/concepts/security/controlling-access)
* [Políticas de rede](/docs/concepts/services-networking/network-policies/) para Pods
* [Secrets no Kubernetes](/docs/concepts/configuration/secret/)
* [Padrões de segurança de Pods](/docs/concepts/security/pod-security-standards/)
* [RuntimeClasses](/docs/concepts/containers/runtime-class)


Entenda o contexto: 

<!-- if changing this, also edit the front matter of content/en/docs/concepts/security/cloud-native-security.md to match; check the no_list setting -->
* [Segurança Cloud Native e Kubernetes](/docs/concepts/security/cloud-native-security/)

Obtenha a certificação:

* [Certified Kubernetes Security Specialist](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/) — certificação e curso oficial de treinamento.

Leia mais nesta seção:

