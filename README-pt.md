# A documentação do Kubernetes

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Bem vindos! Este repositório abriga todos os recursos necessários para criar o [site e documentação do Kubernetes](https://kubernetes.io/). Estamos muito satisfeitos por você querer contribuir!

## Contribuindo com os documentos

Você pode clicar no botão **Fork** na área superior direita da tela para criar uma cópia desse repositório na sua conta do GitHub. Esta cópia é chamada de *fork*. Faça as alterações desejadas no seu fork e, quando estiver pronto para enviar as alterações para nós, vá até o fork e crie uma nova solicitação de pull para nos informar sobre isso.

Depois que seu **pull request** for criada, um revisor do Kubernetes assumirá a responsabilidade de fornecer um feedback claro e objetivo. Como proprietário do pull request, **é sua responsabilidade modificar seu pull request para abordar o feedback que foi fornecido a você pelo revisor do Kubernetes.** Observe também que você pode acabar tendo mais de um revisor do Kubernetes para fornecer seu feedback ou você pode acabar obtendo feedback de um revisor do Kubernetes que é diferente daquele originalmente designado para lhe fornecer feedback. Além disso, em alguns casos, um de seus revisores pode solicitar uma revisão técnica de um [revisor de tecnologia Kubernetes](https://github.com/kubernetes/website/wiki/Tech-reviewers) quando necessário. Os revisores farão o melhor para fornecer feedback em tempo hábil, mas o tempo de resposta pode variar de acordo com as circunstâncias.

Para mais informações sobre como contribuir com a documentação do Kubernetes, consulte:

* [Comece a contribuir](https://kubernetes.io/docs/contribute/start/)
* [Preparando suas alterações na documentação](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Usando Modelos de Página](http://kubernetes.io/docs/contribute/style/page-templates/)
* [Guia de Estilo da Documentação](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Localizando documentação do Kubernetes](https://kubernetes.io/docs/contribute/localization/)

## Documentação do Kubernetes Localizando o `README.md`

### coreano

Veja a tradução de `README.md` e mais orientações sobre detalhes para contribuidores coreanos na página [README coreano](README-ko.md).

Você pode alcançar os mantenedores da localização coreana em:

* June Yi ([GitHub - @gochist](https://github.com/gochist))
* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-ko)

## Executando o site localmente usando o Docker

A maneira recomendada de executar o site do Kubernetes localmente é executar uma imagem especializada do [Docker](https://docker.com) que inclui o gerador de site estático [Hugo](https://gohugo.io).

> Se você está rodando no Windows, você precisará de mais algumas ferramentas que você pode instalar com o [Chocolatey](https://chocolatey.org). `choco install make`

> Se você preferir executar o site localmente sem o Docker, consulte [Executando o site localmente usando o Hugo](#executando-o-site-localmente-usando-o-hugo) abaixo.

Se você tiver o Docker [em funcionamento](https://www.docker.com/get-started), crie a imagem do Docker do `kubernetes-hugo` localmente:

```bash
make docker-image
```

Depois que a imagem foi criada, você pode executar o site localmente:

```bash
make docker-serve
```

Abra seu navegador para http://localhost:1313 para visualizar o site. Conforme você faz alterações nos arquivos de origem, Hugo atualiza o site e força a atualização do navegador.

## Executando o site localmente usando o Hugo

Veja a [documentação oficial do Hugo](https://gohugo.io/getting-started/installing/) para instruções de instalação do Hugo. Certifique-se de instalar a versão do Hugo especificada pela variável de ambiente `HUGO_VERSION` no arquivo [`netlify.toml`](netlify.toml#L9).

Para executar o site localmente quando você tiver o Hugo instalado:

```bash
make serve
```

Isso iniciará o servidor Hugo local na porta 1313. Abra o navegador para http://localhost:1313 para visualizar o site. Conforme você faz alterações nos arquivos de origem, Hugo atualiza o site e força a atualização do navegador.

## Comunidade, discussão, contribuição e apoio

Aprenda a se envolver com a comunidade do Kubernetes na [página da comunidade](http://kubernetes.io/community/).

Você pode alcançar os mantenedores deste projeto em:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### Código de conduta

A participação na comunidade Kubernetes é regida pelo [Código de Conduta da Kubernetes](code-of-conduct.md).

## Obrigado!

A Kubernetes prospera com a participação da comunidade e nós realmente apreciamos suas contribuições para o nosso site e nossa documentação!
