---
layout: blog
title: "Atualizado: Perguntas frequentes (FAQ) sobre a remoção do Dockershim"
date: 2022-02-17
slug: dockershim-faq
---

**Esta é uma atualização do artigo original [FAQ sobre a depreciação do Dockershim](/blog/2020/12/02/dockershim-faq/),
publicado no final de 2020.**

Este documento aborda algumas perguntas frequentes sobre a
descontinuação e remoção do _dockershim_, que foi
[anunciado](/blog/2020/12/08/kubernetes-1-20-release-announcement/)
como parte do lançamento do Kubernetes v1.20. Para obter mais detalhes sobre
o que isso significa, confira a postagem do blog
[Não entre em pânico: Kubernetes e Docker](/pt-br/blog/2020/12/02/dont-panic-kubernetes-and-docker/).

Além disso, você pode ler [verifique se a remoção do dockershim afeta você](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
para determinar qual impacto a remoção do _dockershim_ teria para você
ou para sua organização.

Como o lançamento do Kubernetes 1.24 se tornou iminente, estamos trabalhando bastante para tentar fazer uma transição suave.

- Escrevemos uma postagem no blog detalhando nosso [compromisso e os próximos passos](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/).
- Acreditamos que não há grandes obstáculos para a migração para [outros agentes de execução de contêiner](/docs/setup/production-environment/container-runtimes/#container-runtimes).
- Há também um guia [Migrando do dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/) disponível.
- Também criamos uma página para listar
  [artigos sobre a remoção do dockershim e sobre o uso de agentes de execução compatíveis com CRI](/docs/reference/node/topics-on-dockershim-and-cri-compatible-runtimes/). Essa lista inclui alguns dos documentos já mencionados e também 
  abrange fontes externas selecionadas (incluindo guias de fornecedores).

### Por que o _dockershim_ está sendo removido do Kubernetes?

As primeiras versões do Kubernetes funcionavam apenas com um ambiente de execução de contêiner específico:
Docker Engine. Mais tarde, o Kubernetes adicionou suporte para trabalhar com outros agentes de execução de contêiner.
O padrão CRI (_Container Runtime Interface_ ou Interface de Agente de Execução de Containers) foi [criado](/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) para
habilitar a interoperabilidade entre orquestradores (como Kubernetes) e diferentes agentes
de execução de contêiner.
O Docker Engine não implementa essa interface (CRI), então o projeto Kubernetes criou um
código especial para ajudar na transição, e tornou esse código _dockershim_ parte do projeto 
Kubernetes.

O código _dockershim_ sempre foi destinado a ser uma solução temporária (daí o nome: _shim_).
Você pode ler mais sobre a discussão e o planejamento da comunidade na
[Proposta de remoção do Dockershim para aprimoramento do Kubernetes][drkep].
Na verdade, manter o _dockershim_ se tornou um fardo pesado para os mantenedores do Kubernetes.

Além disso, recursos que são amplamente incompatíveis com o _dockershim_, como
_cgroups v2_ e _namespaces_ de usuário estão sendo implementados nos agentes de execução de CRI
mais recentes. A remoção do suporte para o _dockershim_ permitirá um maior
desenvolvimento nessas áreas.

[drkep]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2221-remove-dockershim

### Ainda posso usar o Docker Engine no Kubernetes 1.23?

Sim, a única coisa que mudou na versão 1.20 é a presença de um aviso no log de inicialização
do [kubelet] se estiver usando o Docker Engine como agente de execução de contêiner.
Você verá este aviso em todas as versões até 1.23. A remoção do _dockershim_ ocorre no Kubernetes 1.24.

[kubelet]: /docs/reference/command-line-tools-reference/kubelet/

### Quando o _dockershim_ será removido?

Dado o impacto dessa mudança, estamos definindo um cronograma de depreciação mais longo.
A remoção do _dockershim_ está agendada para o Kubernetes v1.24, consulte a
[Proposta de remoção do Dockershim para aprimoramento do Kubernetes][drkep].
O projeto Kubernetes trabalhará em estreita colaboração com fornecedores e outros ecossistemas para garantir
uma transição suave e avaliará os acontecimentos à medida que a situação for evoluindo.

### Ainda posso usar o Docker Engine como meu agente de execução do contêiner?

Primeiro, se você usa o Docker em seu próprio PC para desenvolver ou testar contêineres: nada muda.
Você ainda pode usar o Docker localmente, independentemente dos agentes de execução de contêiner que
você usa em seus Clusters Kubernetes. Os contêineres tornam esse tipo de interoperabilidade possível.

Mirantis e Docker [comprometeram-se][mirantis] a manter um adaptador substituto para o
Docker Engine, e a manter este adaptador mesmo após o _dockershim_ ser removido
do Kubernetes. O adaptador substituto é chamado [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd).

[mirantis]: https://www.mirantis.com/blog/mirantis-to-take-over-support-of-kubernetes-dockershim-2/

### Minhas imagens de contêiner existentes ainda funcionarão?

Sim, as imagens produzidas a partir do `docker build` funcionarão com todas as implementações do CRI.
Todas as suas imagens existentes ainda funcionarão exatamente da mesma forma.

#### E as imagens privadas?

Sim. Todos os agentes de execução de CRI são compatíveis com as mesmas configurações de segredos usadas no
Kubernetes, seja por meio do PodSpec ou ServiceAccount.

### Docker e contêineres são a mesma coisa?

Docker popularizou o padrão de contêineres Linux e tem sido fundamental no 
desenvolvimento desta tecnologia. No entanto, os contêineres já existiam
no Linux há muito tempo. O ecossistema de contêineres cresceu para ser muito
mais abrangente do que apenas Docker. Padrões como o OCI e o CRI ajudaram muitas
ferramentas a crescer e prosperar no nosso ecossistema, alguns substituindo
aspectos do Docker, enquanto outros aprimoram funcionalidades já existentes.

### Existem exemplos de pessoas que usam outros agentes de execução de contêineres em produção hoje?

Todos os artefatos produzidos pelo projeto Kubernetes (binários Kubernetes) são validados
a cada lançamento de versão.

Além disso, o projeto [kind] vem usando containerd há algum tempo e tem
visto uma melhoria na estabilidade para seu caso de uso. Kind e containerd são executados
várias vezes todos os dias para validar quaisquer alterações na base de código do Kubernetes.
Outros projetos relacionados seguem um padrão semelhante, demonstrando a estabilidade e
usabilidade de outros agentes de execução de contêiner. Como exemplo, o OpenShift 4.x utiliza
o agente de execução [CRI-O] em produção desde junho de 2019.

Para outros exemplos e referências, dê uma olhada em projetos adeptos do containerd e
CRI-O, dois agentes de execução de contêineres sob o controle da _Cloud Native Computing Foundation_
([CNCF]).

- [containerd](https://github.com/containerd/containerd/blob/master/ADOPTERS.md)
- [CRI-O](https://github.com/cri-o/cri-o/blob/master/ADOPTERS.md)

[CRI-O]: https://cri-o.io/
[kind]: https://kind.sigs.k8s.io/
[CNCF]: https://cncf.io

### As pessoas continuam referenciando OCI, o que é isso?

OCI significa _[Open Container Initiative]_ (ou Iniciativa Open Source de Contêineres), que padronizou muitas das
interfaces entre ferramentas e tecnologias de contêiner. Eles mantêm uma
especificação padrão para imagens de contêiner (OCI image-spec) e para 
contêineres em execução (OCI runtime-spec). Eles também mantêm uma implementação real
da especificação do agente de execução na forma de [runc], que é o agente de execução padrão 
para ambos [containerd] e [CRI-O]. O CRI baseia-se nessas especificações de baixo nível para
fornecer um padrão de ponta a ponta para gerenciar contêineres.

[Open Container Initiative]: https://opencontainers.org/about/overview/
[runc]: https://github.com/opencontainers/runc
[containerd]: https://containerd.io/

### Qual implementação de CRI devo usar?

Essa é uma pergunta complexa e depende de muitos fatores. Se você estiver
trabalhando com Docker, mudar para containerd deve ser uma troca relativamente fácil e
terá um desempenho estritamente melhor e menos sobrecarga. No entanto, nós encorajamos você a
explorar todas as opções do [cenário CNCF], pois outro agente de execução de contêiner
pode funcionar ainda melhor para o seu ambiente.

[cenário CNCF]: https://landscape.cncf.io/?group=projects-and-products&view-mode=card#runtime--container-runtime

### O que devo ficar atento ao mudar a minha implementação de CRI utilizada?

Embora o código de conteinerização base seja o mesmo entre o Docker e a maioria dos
CRIs (incluindo containerd), existem algumas poucas diferenças. Alguns
pontos a se considerar ao migrar são:

- Configuração de _log_
- Limitações de recursos de agentes de execução
- Scripts de provisionamento que chamam o docker ou usam o docker por meio de seu soquete de controle
- Plugins kubectl que exigem CLI do docker ou o soquete de controle
- Ferramentas do projeto Kubernetes que requerem acesso direto ao Docker Engine
  (por exemplo: a ferramenta depreciada `kube-imagepuller`)
- Configuração de funcionalidades como `registry-mirrors` e _registries_ inseguros
- Outros scripts de suporte ou _daemons_ que esperam que o Docker Engine esteja disponível e seja executado
  fora do Kubernetes (por exemplo, agentes de monitoramento ou segurança)
- GPUs ou hardware especial e como eles se integram ao seu agente de execução e ao Kubernetes

Se você usa solicitações ou limites de recursos do Kubernetes ou usa DaemonSets para coleta de logs
em arquivos, eles continuarão a funcionar da mesma forma. Mas se você personalizou
sua configuração `dockerd`, você precisará adaptá-la para seu novo agente de execução de
contêiner assim que possível.

Outro aspecto a ser observado é que ferramentas para manutenção do sistema ou execuções dentro de um
contêiner no momento da criação de imagens podem não funcionar mais. Para o primeiro, a ferramenta 
[`crictl`][cr] pode ser utilizada como um substituto natural (veja 
[migrando do docker cli para o crictl](https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/#mapping-from-docker-cli-to-crictl))
e para o último, você pode usar novas opções de construções de contêiner, como [img], [buildah],
[kaniko], ou [buildkit-cli-for-kubectl] que não requerem Docker.

[cr]: https://github.com/kubernetes-sigs/cri-tools
[img]: https://github.com/genuinetools/img
[buildah]: https://github.com/containers/buildah
[kaniko]: https://github.com/GoogleContainerTools/kaniko
[buildkit-cli-for-kubectl]: https://github.com/vmware-tanzu/buildkit-cli-for-kubectl

Para containerd, você pode começar com sua [documentação] para ver quais opções de configuração
estão disponíveis à medida que você vá realizando a migração.

[documentação]: https://github.com/containerd/cri/blob/master/docs/registry.md

Para obter instruções sobre como usar containerd e CRI-O com Kubernetes, consulte o
documentação do Kubernetes em [Agentes de execução de contêineres]

[Agentes de execução de contêineres]: /docs/setup/production-environment/container-runtimes/

### E se eu tiver mais perguntas?

Se você usa uma distribuição do Kubernetes com suporte do fornecedor, pode perguntar a eles sobre
planos de atualização para seus produtos. Para perguntas de usuário final, poste-as
no nosso fórum da comunidade de usuários: https://discuss.kubernetes.io/.

Você também pode conferir a excelente postagem do blog
[Espere, o Docker está depreciado no Kubernetes agora?][dep], uma discussão técnica mais aprofundada
sobre as mudanças.

[dep]: https://dev.to/inductor/wait-docker-is-deprecated-in-kubernetes-now-what-do-i-do-e4m

### Posso ganhar um abraço?

Sim, ainda estamos dando abraços se solicitado. 🤗🤗🤗
