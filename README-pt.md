# A documentação do Kubernetes

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Este repositório contém todos os recursos necessários para criar o [website e documentação do Kubernetes](https://kubernetes.io/). Ficamos felizes por você querer contribuir!

## Utilizando este repositório

Você pode executar o website localmente utilizando o [Hugo (versão Extended)](https://gohugo.io/), ou você pode executá-lo em um agente de execução de contêiner. É altamente recomendável utilizar um agente de execução de contêiner, pois este fornece consistência de implantação em relação ao website real.

## Pré-requisitos

Para usar este repositório, você precisa instalar:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (versão Extended)](https://gohugo.io/)
- Um container runtime, por exemplo [Docker](https://www.docker.com/).

Antes de você iniciar, instale as dependências, clone o repositório e navegue até o diretório:

```
git clone https://github.com/kubernetes/website.git
cd website
```

O website do Kubernetes utiliza o [tema Docsy Hugo](https://github.com/google/docsy#readme). Mesmo que você planeje executar o website em um contêiner, é altamente recomendado baixar os submódulos e outras dependências executando o seguinte comando:

## Windows

```powershell
# Obter dependências e outros submódulos
git submodule update --init --recursive --depth 1
```

## Linux / outros Unix

```bash
# Obter dependências e outros submódulos
make module-init
```

## Executando o website usando um container

Para executar o build do website em um contêiner, execute o comando abaixo:

```bash
# Você pode definir a variável $CONTAINER_ENGINE com o nome do agente de execução de contêiner utilizado. 
make container-serve
```

Caso ocorram erros, é provável que o contêiner que está executando o Hugo não tenha recursos suficientes. A solução é aumentar a quantidade de CPU e memória disponível para o Docker ([MacOS](https://docs.docker.com/desktop/settings/mac/) e [Windows](https://docs.docker.com/desktop/settings/windows/)).

Abra seu navegador em http://localhost:1313 para visualizar o website. Conforme você faz alterações nos arquivos fontes, o Hugo atualiza o website e força a atualização do navegador.

## Executando o website localmente utilizando o Hugo

Consulte a [documentação oficial do Hugo](https://gohugo.io/getting-started/installing/) para instruções de instalação do Hugo. Certifique-se de instalar a versão do Hugo especificada pela variável de ambiente `HUGO_VERSION` no arquivo [`netlify.toml`](netlify.toml#L9).

Para executar o build e testar o website localmente, execute:

```bash
# instalar dependências
npm ci
make serve
```

 O Hugo iniciará localmente na porta 1313. Abra o seu navegador em http://localhost:1313 para visualizar o website. Conforme você faz alterações nos arquivos fontes, o Hugo atualiza o website e força uma atualização no navegador.

## Construindo a página de referência da API

A página de referência da API localizada em `content/en/docs/reference/kubernetes-api` é construída a partir da especificação do Swagger utilizando https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs.

Siga os passos abaixo para atualizar a página de referência para uma nova versão do Kubernetes:

1. Obter o submódulo `api-ref-generator`:

```
git submodule update --init --recursive --depth 1
```

2. Atualizar a especificação do Swagger:

```bash
curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-generator/
```

3. Ajustar os arquivos `toc.yaml` e `fields.yaml` para refletir as mudanças entre as duas versões.

4. Em seguida, gerar as páginas:

```
make api-reference
```

Você pode validar o resultado localmente gerando e disponibilizando o site a partir da imagem do container:

```
make container-image
make container-serve
```

Abra o seu navegador em http://localhost:1313/docs/reference/kubernetes-api/ para visualizar a página de referência da API.

5. Quando todas as mudanças forem refletidas nos arquivos de configuração `toc.yaml` e `fields.yaml`, crie um pull request com a nova página de referência de API.

## Troubleshooting
### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

Por motivos técnicos, o Hugo é disponibilizado em dois conjuntos de binários. O website atual funciona apenas na versão **Hugo Extended**. Na [página de releases](https://github.com/gohugoio/hugo/releases) procure por arquivos com `extended` no nome. Para confirmar, execute `hugo version` e procure pela palavra `extended`.

### Troubleshooting macOS for too many open files

Se você executar o comando `make serve` no macOS e retornar o seguinte erro:

```
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

Verifique o limite atual para arquivos abertos:

`launchctl limit maxfiles`

Em seguida, execute os seguintes comandos (adaptado de https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c):

```shell
#!/bin/sh

# Esse são os links do gist original, vinculados ao meu gists agora.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

Esta solução funciona tanto para o MacOS Catalina quanto para o MacOS Mojave.

### Erro de "Out of Memory"

Se você executar o comando `make container-serve` e retornar o seguinte erro:
```
make: *** [container-serve] Error 137
```

Verifique a quantidade de memória disponível para o agente de execução de contêiner. No caso do Docker Desktop para macOS, abra o menu "Preferences..." -> "Resources..." e tente disponibilizar mais memória.

## Comunidade, discussão, contribuição e apoio

Saiba mais sobre a comunidade Kubernetes SIG Docs e reuniões na [página da comunidade](http://kubernetes.io/community/).

Você também pode entrar em contato com os mantenedores deste projeto utilizando:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
    - [Obter o convide para este slack](https://slack.k8s.io/)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## Contribuindo com a documentação

Você pode clicar no botão **Fork** na área superior direita da tela para criar uma cópia desse repositório na sua conta do GitHub. Esta cópia é chamada de *fork*. Faça as alterações desejadas no seu fork e, quando estiver pronto para enviar as alterações para nós, vá até o fork e crie um novo **pull request** para nos informar sobre isso.

Depois que seu **pull request** for criado, um revisor do Kubernetes assumirá a responsabilidade de fornecer um feedback claro e objetivo. Como proprietário do pull request, **é sua responsabilidade modificar seu pull request para atender ao feedback que foi fornecido a você pelo revisor do Kubernetes.**

Observe também que você pode acabar tendo mais de um revisor do Kubernetes para fornecer seu feedback ou você pode acabar obtendo feedback de um outro revisor do Kubernetes diferente daquele originalmente designado para lhe fornecer o feedback.

Além disso, em alguns casos, um de seus revisores pode solicitar uma revisão técnica de um [revisor técnico do Kubernetes](https://github.com/kubernetes/website/wiki/Tech-reviewers) quando necessário. Os revisores farão o melhor para fornecer feedbacks em tempo hábil, mas o tempo de resposta pode variar de acordo com as circunstâncias.

Para mais informações sobre como contribuir com a documentação do Kubernetes, consulte:

* [Contribua com a documentação do Kubernetes](https://kubernetes.io/docs/contribute/)
* [Tipos de conteúdo de página](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [Guia de Estilo da Documentação](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Localizando documentação do Kubernetes](https://kubernetes.io/docs/contribute/localization/)

### Embaixadores para novos colaboradores

Caso você precise de ajuda em algum momento ao contribuir, os [Embaixadores para novos colaboradores](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) são pontos de contato. São aprovadores do SIG Docs cujas responsabilidades incluem orientar e ajudar novos colaboradores em seus primeiros pull requests. O melhor canal para contato com embaixadores é o [Slack do Kubernetes](https://slack.k8s.io/). Atuais Embaixadores do SIG Docs:

| Nome                       | Slack                      | GitHub                     |                   
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh                | @sreeram.venkitesh                      | @sreeram-venkitesh              |

## Traduções do `README.md`

| Idioma                    | Idioma                     |
| ------------------------- | -------------------------- |
| [Alemão](README-de.md)    | [Italiano](README-it.md)   |
| [Chinês](README-zh.md)    | [Japonês](README-ja.md)    |
| [Coreano](README-ko.md)   | [Polonês](README-pl.md)    |
| [Espanhol](README-es.md)  | [Português](README-pt.md)  |
| [Francês](README-fr.md)   | [Russo](README-ru.md)      |
| [Hindi](README-hi.md)     | [Ucraniano](README-uk.md)  |
| [Indonésio](README-id.md) | [Vietnamita](README-vi.md) |

Você pode contatar os mantenedores da localização em Português no canal do Slack [#kubernetes-docs-pt](https://kubernetes.slack.com/messages/kubernetes-docs-pt).

# Código de conduta

A participação na comunidade Kubernetes é regida pelo [Código de Conduta da Kubernetes](code-of-conduct.md).

# Obrigado!

O Kubernetes prospera com a participação da comunidade e nós realmente agradecemos suas contribuições para o nosso website e nossa documentação!