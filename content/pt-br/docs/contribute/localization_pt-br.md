---
title: Contribuir com a documentação do Kubernetes em Português Brasileiro
content_type: concept
---

Olá!

Esta página contém informações sobre o processo de localização em português (Brasil), desde o processo de contribuição até um dicionário de termos com as respectivas traduções.

## Antes de você começar

### Familiarize-se com o processo de contribuição do Projeto Kubernetes no GitHub

* Leia o [guia da pessoa contribuidora do Kubernetes](https://www.kubernetes.dev/docs/).
* Leia os guias [de conteúdo](https://kubernetes.io/pt-br/docs/contribute/style/content-guide/)
  e [de estilo](https://kubernetes.io/pt-br/docs/contribute/style/style-guide/) do website do Kubernetes.
* Familiarize-se com o [código de conduta](https://kubernetes.io/community/code-of-conduct/) do Projeto Kubernetes.
* (Opcional) Abra um Pull Request de teste no repositório [contributor-playground](https://github.com/kubernetes-sigs/contributor-playground).

### Prepare seu ambiente de desenvolvimento

* Instale as [ferramentas necessárias](https://github.com/kubernetes/website/blob/main/content/pt-br/README.md#pr%C3%A9-requisitos).
* Crie um fork do repositório [kubernetes/website](https://github.com/kubernetes/website) na sua conta do GitHub
  ([instruções](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)).
* Clone o fork do repositório em sua máquina local ([instruções](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository#cloning-a-repository)).
* (Opcional, recomendado) Verifique que você consegue rodar a visualização prévia
  do website em sua máquina local seguindo as [instruções do repositório](https://github.com/kubernetes/website/blob/main/content/pt-br/README.md#executando-o-website-usando-um-container).

## Passo a passo para contribuição

1. Escolha uma página que deseja localizar.
2. Verifique se já existe uma issue no repositório ([kubernetes/website]) aberta para a página que escolheu.
    * Caso não exista, crie uma nova issue com título no formato `[pt-br] Localize <caminho>`.
      Cole o link da issue no canal [`#kubernetes-docs-pt`] do Slack do Kubernetes
      para que um dos mantenedores possa fazer a triagem e adicionar os labels corretos.
3. Crie uma branch no seu fork e faça a localização da página.
4. Execute o check de links quebrados (os detalhes de como executar estão nessa página).
5. Abra o Pull Request. Caso ainda não tenha assinado o [CLA](https://github.com/kubernetes/community/blob/master/CLA.md), haverá instruções no Pull Request.
6. Verifique se as checagens no Pull Requests não estão quebradas e se foi gerado um preview da sua localização.
   {{< note >}}
   A geração da pré-visualização da página é uma verificação **obrigatória** do
   Pull Request. Pull Requests que não passarem nesta verificação não podem
   ser mesclados.
   {{< /note >}}
7. Por fim, recomendamos que envie o pull request no canal do slack do time [`#kubernetes-docs-pt`].

## Checagem de links quebrados
Para garantir que os links referenciados na página que localizou não estão quebrados, você pode executar um script de checagem de links quebrados.   
Dentro do seu fork local do repositório, executar:

```bash
scripts/linkchecker.py -f content/pt-br/<caminho-da-pagina>
```
onde `content/pt-br/<caminho-da-pagina>` é o caminho da página que está sendo localizada.


## Dicionário de termos com tradução

Este dicionário de termos contém traduções que foram previamente utilizadas em
páginas localizadas. Caso não se encaixe no contexto por algum motivo, sugerimos
trazer para discussão no canal [`#kubernetes-docs-pt`] do Slack antes do Pull Request
ser aberto.

{{< note >}}
Ao adicionar novos termos neste dicionário, mantenha a ordem alfabética e formatação
da tabela.
{{< /note >}}

| Inglês                                       | Português                                   | Comentários                                                                                                                                                                                        |
|----------------------------------------------|---------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| addon                                        | complemento                                 |                                                                                                                                                                                                    |
| API call                                     | chamada para a API                          |                                                                                                                                                                                                    |
| API server                                   | servidor de API                             |                                                                                                                                                                                                    |
| backward compatibility                       | retrocompatibilidade                        |                                                                                                                                                                                                    |
| bare-metal server/baremetal server/baremetal | servidor dedicado                           | Conforme descrito na Wikipedia em Português: https://pt.wikipedia.org/wiki/Bare-metal_server                                                                                                       |
| boostrap                                     | autoinicialização                           |                                                                                                                                                                                                    |
| builtin/built-in                             | embutido                                    |                                                                                                                                                                                                    |
| claim(s)                                     | requisição(ões)                             |                                                                                                                                                                                                    |
| container image                              | imagem do contêiner                         |                                                                                                                                                                                                    |
| control plane                                | camada de gerenciamento                     |
| dashboard                                    | painel                                      |                                                                                                                                                                                                    |
| data plane                                   | camada de dados                             |                                                                                                                                                                                                    |
| data store                                   | sistema de armazenamento de dados           |                                                                                                                                                                                                    |
| deploy                                       | instalar, implantar                         |                                                                                                                                                                                                    |
| deployment                                   | instalação, implantação                     | Utilizar o mais adequado de acordo com o contexto. Não traduzir quando for uma referência à API do Kubernetes chamada Deployment.                                                                  |
| deprecated                                   | descontinuado                               |                                                                                                                                                                                                    |
| deprecation                                  | descontinuidade                             |                                                                                                                                                                                                    |
| edge computing/edge-based workloads          | computação de borda                         | Conforme utilizado em documentação de provedores de nuvem.                                                                                                                                         |
| feature                                      | funcionalidade                              |                                                                                                                                                                                                    |
| job                                          | tarefa                                      |                                                                                                                                                                                                    |
| killed                                       | encerrado, finalizado                       | Utilizar o mais adequado para o contexto.                                                                                                                                                          |
| liveness                                     | operacionalidade                            |                                                                                                                                                                                                    |
| liveness probe                               | verificação de operacionalidade             |                                                                                                                                                                                                    |
| manifest                                     | manifesto                                   |                                                                                                                                                                                                    |
| mutate                                       | mutar                                       |                                                                                                                                                                                                    |
| mutating                                     | mutante                                     |                                                                                                                                                                                                    |
| node(s)                                      | nó(s)                                       | Não traduzir quando se tratar de referência à API do Kubernetes chamada Node.                                                                                                                      |
| out-of-band                                  | fluxo de dados independente                 | Verificar se encaixa no contexto.                                                                                                                                                                  |
| parent domain                                | domínio principal                           |                                                                                                                                                                                                    |
| parse                                        | interpretar                                 |                                                                                                                                                                                                    |
| principal                                    | perfil                                      | No sentido de autorização e autenticação. Para outros sentidos pode ser necessária uma tradução distinta.                                                                                          |
| provision                                    | provisionar                                 |                                                                                                                                                                                                    |
| readiness                                    | prontidão                                   |                                                                                                                                                                                                    |
| readiness probe                              | verificação de prontidão                    |                                                                                                                                                                                                    |
| resource                                     | recurso                                     |                                                                                                                                                                                                    |
| rolling update                               | atualização gradual/atualização constante   | Escolher conforme o contexto.                                                                                                                                                                      |
| root domain                                  | domínio raiz                                |                                                                                                                                                                                                    |
| route reflector                              | refletor de rota                            |                                                                                                                                                                                                    |
| runtime                                      | agente de execução                          |                                                                                                                                                                                                    |
| scale/scaling                                | escalonamento                               |                                                                                                                                                                                                    |
| schedule                                     | cronograma, agendamento, alocação           | Varia com o contexto. Para termos relacionados à distribuição de Pods entre nós, utilizar alocação. Se tratando de tarefas agendadas, utilizar cronograma ou agendamento de acordo com o contexto. |
| selector                                     | seletor                                     |                                                                                                                                                                                                    |
| storage                                      | armazenamento                               |                                                                                                                                                                                                    |
| tradeoff                                     | contrapartida                               |                                                                                                                                                                                                    |
| worker node                                  | nó de processamento/nó de carga de trabalho | Utilizar o termo que fizer mais sentido para o contexto.                                                                                                                                           |
| workload                                     | carga de trabalho                           |                                                                                                                                                                                                    |
| workflow                                     | fluxo de execução                           |                                                                                                                                                                                                    |


## Dicionário de termos não traduzidos

Via de regra, nomes de APIs do Kubernetes permanecem no original utilizando
camel case conforme o nome da API. Alguns exemplos (lista não-exaustiva):
* ClusterRole
* ConfigMap
* Deployment
* Pod
* Service

A tabela abaixo contém termos que não foram previamente traduzidos em localizações
já concluídas.

| Inglês             | Comentários                                              |
|--------------------|----------------------------------------------------------|
| addon manager      | Componente do Kubernetes.                                |
| auto-scaling       |                                                          |
| bind               |                                                          |
| CLI                |                                                          |
| cloud native       |                                                          |
| cluster            |                                                          |
| controller manager | Componente do Kubernetes.                                |
| custom recycler    |                                                          |
| daemon             |                                                          |
| DNS                |                                                          |
| endpoint           | Termo comum para indicar um endereço de recurso em APIs. |
| escape hatch       |                                                          |
| feature gate       | Terminologia específica do Kubernetes.                   |
| framework          |                                                          |
| hook               |                                                          |
| label              |                                                          |
| overlay network    |                                                          |
| proxy              |                                                          |
| RBAC               |                                                          |
| release            |                                                          |
| service mesh       |                                                          |
| tag                |                                                          |
| taint              |                                                          |
| token              |                                                          |
| tutorial           |                                                          |

## Perguntas frequentes

### Qual título devo usar quando abrir o Pull Request?
Recomendamos usar o formato `[pt-br] Update/Add <caminho do arquivo>`.

### Posso abrir um Pull Request traduzindo mais de uma página de documentação?
Sempre dê preferência por abrir um Pull Request por página, dessa forma facilita a revisão e o acompanhamento do trabalho.

### Tenho dúvidas nos termos, preciso abrir o Pull Request e esperar alguém revisar?
Não, pode mandar a dúvida no canal do slack ([`#kubernetes-docs-pt`]) que vamos ajudar com a dúvida.

### Abri um Pull Request mas ainda não teve revisão, o que fazer?
É importante lembrar que as pessoas revisoras são voluntárias, então em alguns casos pode demorar um pouco. O que recomendamos nesses casos é enviar uma mensagem no canal do slack com o link do Pull Request, assim podemos verificar o que pode ter acontecido.

Ficou alguma dúvida que não foi respondida nessa página?   
Fale com a gente canal no slack do Kubernetes [`#kubernetes-docs-pt`].

[`#kubernetes-docs-pt`]: https://kubernetes.slack.com/messages/kubernetes-docs-pt
[kubernetes/website]: https://github.com/kubernetes/website
