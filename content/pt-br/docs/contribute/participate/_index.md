---
title: Participando do SIG Docs
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
---

<!-- overview -->

O SIG Docs é um dos
[grupos de interesse especiais](https://github.com/kubernetes/community/blob/master/sig-list.md)
dentro do projeto Kubernetes, com foco em escrever, atualizar e manter
a documentação do Kubernetes como um todo. Consulte o
[SIG Docs no repositório de comunidade do GitHub](https://github.com/kubernetes/community/tree/master/sig-docs)
para obter mais informações sobre o SIG.

O SIG Docs recebe contribuições de conteúdo e revisões de todos os colaboradores.
Qualquer pessoa pode abrir um pull request (PR), e qualquer pessoa é bem-vinda para
registrar issues sobre conteúdo ou comentar em pull requests em andamento.

Você também pode se tornar um [membro](/docs/contribute/participate/roles-and-responsibilities/#members),
[revisor](/docs/contribute/participate/roles-and-responsibilities/#reviewers) ou
[aprovador](/docs/contribute/participate/roles-and-responsibilities/#approvers).
Essas funções exigem maior acesso e implicam certas responsabilidades para
aprovar e confirmar alterações. Consulte
[community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md)
para obter mais informações sobre como funciona a participação na comunidade Kubernetes.

O restante deste documento descreve algumas formas específicas pelas quais essas
funções operam no SIG Docs, que é responsável por manter um dos aspectos mais
públicos do Kubernetes — o site e a documentação do Kubernetes.

<!-- body -->

## Presidente do SIG Docs

Cada SIG, incluindo o SIG Docs, seleciona um ou mais membros para atuar como
presidentes. Eles são pontos de contato entre o SIG Docs e outras partes da
organização Kubernetes. Eles exigem amplo conhecimento da estrutura do projeto
Kubernetes como um todo e de como o SIG Docs funciona dentro dele. Consulte
[Liderança](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)
para obter a lista atual de presidentes.

## Equipes e automação do SIG Docs

A automação no SIG Docs depende de dois mecanismos diferentes:
equipes do GitHub e arquivos OWNERS.

### Equipes do GitHub

Existem duas categorias de
[equipes](https://github.com/orgs/kubernetes/teams?query=sig-docs) do SIG Docs no GitHub:

- `@sig-docs-{language}-owners` são aprovadores e líderes
- `@sig-docs-{language}-reviews` são revisores

Cada uma pode ser mencionada com seu `@nome` em comentários do GitHub para se comunicar
com todos no grupo.

Às vezes, o Prow e as equipes do GitHub se sobrepõem sem correspondência exata. Para
atribuição de issues, pull requests e suporte a aprovações de PR, a automação usa
informações dos arquivos `OWNERS`.

### Arquivos OWNERS e front-matter

O projeto Kubernetes usa uma ferramenta de automação chamada prow para automação
relacionada a issues e pull requests do GitHub. O
[repositório do site do Kubernetes](https://github.com/kubernetes/website) utiliza
dois [plugins do prow](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins):

- blunderbuss
- approve

Esses dois plugins utilizam os arquivos
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) e
[OWNERS\_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
no nível raiz do repositório `kubernetes/website` no GitHub para controlar
como o prow funciona dentro do repositório.

Um arquivo OWNERS contém uma lista de pessoas que são revisores e aprovadores do
SIG Docs. Arquivos OWNERS também podem existir em subdiretórios e podem sobrescrever
quem pode atuar como revisor ou aprovador de arquivos naquele subdiretório e seus
descendentes. Para mais informações sobre arquivos OWNERS em geral, consulte
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md).

Além disso, um arquivo Markdown individual pode listar revisores e aprovadores em seu
front-matter, seja por meio de nomes de usuário individuais do GitHub ou grupos do GitHub.

A combinação de arquivos OWNERS e front-matter em arquivos Markdown determina
as sugestões que os autores de PR recebem dos sistemas automatizados sobre a quem
solicitar revisão técnica e editorial de seu PR.

## Como funciona o merge

Quando um pull request é incorporado ao branch usado para publicar conteúdo, esse
conteúdo é publicado em <https://kubernetes.io>. Para garantir a qualidade do conteúdo
publicado, limitamos o merge de pull requests aos aprovadores do SIG Docs.
Veja como funciona:

- Quando um pull request possui os labels `lgtm` e `approve`, não tem labels `hold`
  e todos os testes estão passando, o pull request é incorporado automaticamente.
- Membros da organização Kubernetes e aprovadores do SIG Docs podem adicionar comentários
  para impedir o merge automático de um determinado pull request (adicionando um comentário
  `/hold` ou retendo um comentário `/lgtm`).
- Qualquer membro do Kubernetes pode adicionar o label `lgtm` adicionando um comentário `/lgtm`.
- Somente aprovadores do SIG Docs podem incorporar um pull request
  adicionando um comentário `/approve`. Alguns aprovadores também desempenham funções
  adicionais específicas, como
  [PR Wrangler](/docs/contribute/participate/pr-wranglers/) ou
  [presidente do SIG Docs](#sig-docs-chairperson).

## {{% heading "whatsnext" %}}

Para mais informações sobre como contribuir com a documentação do Kubernetes, consulte:

- [Contribuindo com novo conteúdo](/docs/contribute/new-content/)
- [Revisando conteúdo](/docs/contribute/review/reviewing-prs/)
- [Guia de estilo da documentação](/docs/contribute/style/)
