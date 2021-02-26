---
title: Visão Geral da Segurança Cloud Native
content_type: concept
weight: 10
---

<!-- overview -->

Esta visão geral define um modelo para pensar sobre a segurança em Kubernetes no contexto da Segurança em Cloud Native.

{{< warning >}}
Este modelo de segurança no contêiner fornece sugestões, não prova políticas de segurança da informação.
{{< /warning >}}

<!-- body -->

## Os 4C da Segurança Cloud Native

Você pode pensar na segurança em camadas. Os 4C da segurança Cloud Native são a Cloud,
Clusters, Contêineres e Código.

{{< note >}}
Esta abordagem em camadas aumenta a [defesa em profundidade](https://en.wikipedia.org/wiki/Defense_in_depth_(computing))
para segurança, que é amplamente considerada como uma boa prática de segurança para software de sistemas.
{{< /note >}}

{{< figure src="/images/docs/4c.png" title="Os 4C da Segurança Cloud Native" >}}

Cada camada do modelo de segurança Cloud Native é construída sobre a próxima camada mais externa.
A camada de código se beneficia de uma base forte (Cloud, Cluster, Contêiner) de camadas seguras.
Você não pode proteger contra padrões ruins de segurança nas camadas de base através de
segurança no nível do Código.

## Cloud

De muitas maneiras, a Cloud (ou servidores co-localizados, ou o datacenter corporativo) é a
[base de computação confiável](https://en.wikipedia.org/wiki/Trusted_computing_base)
de um cluster Kubernetes. Se a camada de Cloud é vulnerável (ou
configurado de alguma maneira vulnerável), então não há garantia de que os componentes construídos
em cima desta base estejam seguros. Cada provedor de Cloud faz recomendações de segurança
para executar as cargas de trabalho com segurança nos ambientes.

### Segurança no provedor da Cloud

Se você estiver executando um cluster Kubernetes em seu próprio hardware ou em um provedor de nuvem diferente,
consulte sua documentação para melhores práticas de segurança.
Aqui estão os links para as documentações de segurança dos provedores mais populares de nuvem:

{{< table caption="Cloud provider security" >}}

Provedor IaaS        | Link |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security/ |
Google Cloud Platform | https://cloud.google.com/security/ |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
VMWare VSphere | https://www.vmware.com/security/hardening-guides.html |

{{< /table >}}

### Segurança de Infraestrutura {#infrastructure-security}

Sugestões para proteger sua infraestrutura em um cluster Kubernetes:

{{< table caption="Infrastructure security" >}}

Área de Interesse para Infraestrutura Kubernetes | Recomendação |
--------------------------------------------- | -------------- |
Acesso de rede ao servidor API (Control plane) | Todo o acesso ao control plane do Kubernetes publicamente na Internet não é permitido e é controlado por listas de controle de acesso à rede restritas ao conjunto de endereços IP necessários para administrar o cluster.|
Acesso de rede aos Nós (nodes) | Os nós devem ser configurados para _só_ aceitar conexões (por meio de listas de controle de acesso à rede) do control plane nas portas especificadas e aceitar conexões para serviços no Kubernetes do tipo NodePort e LoadBalancer. Se possível, esses nós não devem ser expostos inteiramente na Internet pública.
Acesso do Kubernetes à API do provedor de Cloud | Cada provedor de nuvem precisa conceder um conjunto diferente de permissões para o control plane e nós do Kubernetes. É melhor fornecer ao cluster permissão de acesso ao provedor de nuvem que segue o [princípio do menor privilégio](https://en.wikipedia.org/wiki/Principle_of_least_privilege) para os recursos que ele precisa administrar. A [documentação do Kops](https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md#iam-roles) fornece informações sobre as políticas e roles do IAM.
Acesso ao etcd | O acesso ao etcd (o armazenamento de dados do Kubernetes) deve ser limitado apenas ao control plane. Dependendo de sua configuração, você deve tentar usar etcd sobre TLS. Mais informações podem ser encontradas na [documentação do etcd](https://github.com/etcd-io/etcd/tree/master/Documentation).
Encriptação etcd | Sempre que possível, é uma boa prática encriptar todas as unidades em repouso, mas como o etcd mantém o estado de todo o cluster (incluindo os Secrets), seu disco deve ser criptografado em repouso.

{{< /table >}}

## Cluster

Existem duas áreas de preocupação para proteger o Kubernetes:

* Protegendo os componentes do cluster que são configuráveis.
* Protegendo as aplicações que correm no cluster.

### Componentes do Cluster {#cluster-components}

Se você deseja proteger seu cluster de acesso acidental ou malicioso e adotar
boas práticas de informação, leia e siga os conselhos sobre
[protegendo seu cluster](/docs/tasks/administer-cluster/securing-a-cluster/).

### Componentes no cluster (sua aplicação) {#cluster-applications}

Dependendo da superfície de ataque de sua aplicação, você pode querer se concentrar em
aspectos específicos de segurança. Por exemplo: se você estiver executando um serviço (Serviço A) que é crítico
numa cadeia de outros recursos e outra carga de trabalho separada (Serviço B) que é
vulnerável a um ataque de exaustão de recursos e, por consequencia, o risco de comprometer o Serviço A
é alto se você não limitar os recursos do Serviço B. A tabela a seguir lista
áreas de atenção na segurança e recomendações para proteger cargas de trabalho em execução no Kubernetes:

Área de interesse para a segurança do Workload | Recomendação |
------------------------------ | --------------------- |
Autorização RBAC (acesso à API Kubernetes) | https://kubernetes.io/docs/reference/access-authn-authz/rbac/
Autenticação | https://kubernetes.io/docs/concepts/security/controlling-access/
Gerenciamento de segredos na aplicação (e encriptando-os no etcd em repouso) | https://kubernetes.io/docs/concepts/configuration/secret/ <br> https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/
Políticas de segurança do Pod | https://kubernetes.io/docs/concepts/policy/pod-security-policy/
Qualidade de serviço (e gerenciamento de recursos de cluster) | https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/
Políticas de Network | https://kubernetes.io/docs/concepts/services-networking/network-policies/
TLS para Kubernetes Ingress | https://kubernetes.io/docs/concepts/services-networking/ingress/#tls

## Container

Container security is outside the scope of this guide. Here are general recommendations and
links to explore this topic:

Area of Concern for Containers | Recommendation |
------------------------------ | -------------- |
Container Vulnerability Scanning and OS Dependency Security | As part of an image build step, you should scan your containers for known vulnerabilities.
Image Signing and Enforcement | Sign container images to maintain a system of trust for the content of your containers.
Disallow privileged users | When constructing containers, consult your documentation for how to create users inside of the containers that have the least level of operating system privilege necessary in order to carry out the goal of the container.
Use container runtime with stronger isolation | Select [container runtime classes](/docs/concepts/containers/runtime-class/) that provider stronger isolation

## Código

O código da aplicação é uma das principais superfícies de ataque sobre a qual você tem maior controle.
Embora a proteção do código do aplicativo esteja fora do tópico de segurança do Kubernetes, aqui
são recomendações para proteger o código do aplicativo:

### Segurança de código

{{< table caption="Code security" >}}

Área de Atenção para o Código | Recomendação |
-------------------------| -------------- |
Acesso só através de TLS | Se seu código precisar se comunicar por TCP, execute um handshake TLS com o cliente antecipadamente. Com exceção de alguns casos, encripte tudo em trânsito. Indo um passo adiante, é uma boa ideia encriptar o tráfego de rede entre os serviços. Isso pode ser feito por meio de um processo conhecido como mutual ou [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication), que realiza uma verificação bilateral da comunicação mediante os certificados nos serviços. |
Limitando intervalos de porta de comunicação | Essa recomendação pode ser um pouco autoexplicativa, mas, sempre que possível, você só deve expor as portas em seu serviço que são absolutamente essenciais para a comunicação ou coleta de métricas. |
Segurança na Dependência de Terceiros | É uma boa prática verificar regularmente as bibliotecas de terceiros de sua aplicação em busca de vulnerabilidades de segurança. Cada linguagem de programação possui uma ferramenta para realizar essa verificação automaticamente. |
Análise de Código Estático | A maioria das linguagens fornece uma maneira para analisar um extrato do código referente a quaisquer práticas de codificação potencialmente inseguras. Sempre que possível, você deve automatizar verificações usando ferramentas que podem verificar as bases de código em busca de erros de segurança comuns. Algumas das ferramentas podem ser encontradas em [OWASP Source Code Analysis Tools](https://owasp.org/www-community/Source_Code_Analysis_Tools). |
Ataques de sondagem dinâmica | Existem algumas ferramentas automatizadas que você pode executar contra seu serviço para tentar alguns dos ataques mais conhecidos. Isso inclui injeção de SQL, CSRF e XSS. Uma das ferramentas de análise dinâmica mais populares é o [OWASP Zed Attack proxy](https://owasp.org/www-project-zap/). |

{{< /table >}}

## {{% heading "whatsnext" %}} 

Saiba mais sobre os tópicos de segurança do Kubernetes:

* [Padrões de segurança do Pod](/docs/concepts/security/pod-security-standards/)
* [Network policies para Pods](/docs/concepts/services-networking/network-policies/)
* [Controle de acesso à API Kubernetes](/docs/concepts/security/controlling-access)
* [Protegendo seu cluster](/docs/tasks/administer-cluster/securing-a-cluster/)
* [Data encryption in transit](/docs/tasks/tls/managing-tls-in-a-cluster/) for the control plane
* [Data encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
* [Secrets no Kubernetes](/docs/concepts/configuration/secret/)
* [Runtime class](/docs/concepts/containers/runtime-class)