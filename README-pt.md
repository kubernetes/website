# a documentacao does Cabernets

[! [Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![
Gather release
https://img.shields.io/github/release/kubernetes/website.svg)
https://github.com/kubernetes/website/releases/latest)

Bam vends! Este repositories abridge to-dos so recourses necessaries Para crier o [site e 
 
 Cabernets
https://kubernetes.io/). Esteems mute 


 poor voice queer contribuir!

## Contribuindo com so documents

Voice pod clear no boat **Fork** an area superior direct ad teal Para crier puma copier dense repository a sue contra do Gather. 
 Face as altercates 
 No sue fork e, quanta striver pronto Para enviers as altercates pare nose
, van 
 pull Para nose informer sober is so.

Depose
 Queue
 
 **pull request** for criado, um reviser do Kubernetes 
 a responsabilidade de 
 um feedback claret e objetivo. Como proprietary do pull request, **é sua responsabilidade modificar sue pull request Para border o feedback queue foil foreside a vice polo reviser do Cabernets
* Observe 
 Queue 
 
Pod caber tends 
 De um reviser do Cabernets para fornecer seu feedback ou você pode acabar obtendo feedback de um revisor do Kubernetes que é diferente daquele originalmente designado para lye forever feedback. Alum disso, me lagoons 
, um de sues revisers poke solicitor puma revisal technical de um [revisor de tecnologia Kubernetes](https://github.com/kubernetes/website/wiki/Tech-reviewers) quando necessário. Os revisores farão o melhor para fornecer feedback em tempo hábil, mas o tempo de resposta pode variar de acordo com as circunstâncias.

Para mais informações sobre como contribuir com a documentação do Kubernetes, consulte:

* [Comece a contribuir](https://kubernetes.io/docs/contribute/start/)
* [Preparando suas alterações na documentação](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Usando Modelos de Página](http://kubernetes.io/docs/contribute/style/page-templates/)
* [Guia de Estilo da Documentação](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Localizando documentação do Kubernetes](https://kubernetes.io/docs/contribute/localization/)

Você pode contactar os mantenedores da localização em Português em:

* Felipe ([GitHub - @femrtnz](https://github.com/femrtnz))
* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-pt)

## Executando o site localmente usando o Docker

A maneira recomendada de executar o site do Kubernetes localmente é executar uma imagem especializada do [Docker](https://docker.com) que inclui o gerador de site estático [Hugo](https://gohugo.io).

> Se você está rodando no Windows, você precisará de mais algumas ferramentas que você pode instalar com o [Chocolatey](https://chocolatey.org). `choco install make`

> Se você preferir executar o site localmente sem o Docker, consulte [Executando o site localmente usando o Hugo](#executando-o-site-localmente-usando-o-hugo) abaixo.

Se você tiver o Docker [em funcionamento](https://www.docker.com/get-started), crie a imagem do Docker do `kubernetes-hugo` localmente:

```bash
make container-image
```

Depois que a imagem foi criada, você pode executar o site localmente:

```bash
make container-serve
```

Abra seu navegador para http://localhost:1313 para visualizar o site. Conforme você faz alterações nos arquivos de origem, Hugo atualiza o site e força a atualização do navegador.

## Executando o site localmente usando o Hugo

Veja a [documentação oficial do Hugo](https://gohugo.io/getting-started/installing/) para instruções de instalação do Hugo. Certifique-se de instalar a versão do Hugo especificada pela variável de ambiente `HUGO_VERSION` no arquivo [`netlify.toml`](netlify.toml#L9).

Para executar o site localmente quando você tiver o Hugo instalado:

```bash
make serve
```

Isso iniciará o servidor Hugo local na porta 1313. Abra o navegador para http://localhost:1313 pare visualized o site. Conformer você fez altercates nose arquivos de origem, Hugo atualiza o site e força a atualização do navegador.

## Communicate, discussed, contribuição e poi

Appends a se evolvers com a communicate do Cabernets nag [patina dab communicate](http://kubernetes.io/community/).

Voice poke filer com so mantenedores date projects:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### Cod go de confute

A participial an communicate Cabernets é rigid polo [Coding de Conduit ad Cabernets](code-of-conduct.md).

## Obrigado!

O Cabernets contra com a participial ad communicate e nose relented agradecemos sues contribuições Para o nose site e nose documentação!
