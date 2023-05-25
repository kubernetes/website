---
title: Nomes de objetos e IDs
content_type: concept
weight: 20
---

<!-- overview -->

Cada objeto em seu cluster possui um [_Nome_](#names) que é único para aquele
tipo de recurso.
Todo objeto do Kubernetes também possui um [_UID_](#uids) que é único para todo
o cluster.

Por exemplo, você pode ter apenas um Pod chamado `myapp-1234` dentro de um
[namespace](/pt-br/docs/concepts/overview/working-with-objects/namespaces/), porém
você pode ter um Pod e um Deployment ambos com o nome `myapp-1234`.

Para atributos não-únicos definidos pelo usuário, o Kubernetes fornece
[labels](/docs/concepts/overview/working-with-objects/labels/) e
[annotations](/docs/concepts/overview/working-with-objects/annotations/).


<!-- body -->

## Nomes {#names}

{{< glossary_definition term_id="name" length="all" >}}

{{< note >}}
Em casos em que objetos representam uma entidade física, como no caso de um Nó
representando um host físico, caso o host seja recriado com o mesmo nome mas o
objeto Nó não seja recriado, o Kubernetes trata o novo host como o host antigo,
o que pode causar inconsistências.
{{< /note >}}

Abaixo estão descritos quatro tipos de restrições de nomes comumente utilizadas
para recursos.

### Nomes de subdomínio DNS {#dns-subdomain-names}

A maior parte dos recursos do Kubernetes requerem um nome que possa ser
utilizado como um nome de subdomínio DNS, conforme definido na
[RFC 1123](https://tools.ietf.org/html/rfc1123).
Isso significa que o nome deve:

- conter no máximo 253 caracteres
- conter somente caracteres alfanuméricos em caixa baixa, traço ('-') ou ponto
  ('.').
- iniciar com um caractere alfanumérico
- terminar com um caractere alfanumérico

### Nomes de rótulos da RFC 1123 {#dns-label-names}

Alguns tipos de recurso requerem que seus nomes sigam o padrão de rótulos DNS
definido na [RFC 1123](https://tools.ietf.org/html/rfc1123).
Isso significa que o nome deve:

- conter no máximo 63 caracteres
- conter somente caracteres alfanuméricos em caixa baixa ou traço ('-')
- iniciar com um caractere alfanumérico
- terminar com um caractere alfanumérico

### Nomes de rótulo da RFC 1035

Alguns tipos de recurso requerem que seus nomes sigam o padrão de rótulos DNS
definido na [RFC 1035](https://tools.ietf.org/html/rfc1035).
Isso significa que o nome deve:

- conter no máximo 63 caracteres
- conter somente caracteres alfanuméricos em caixa baixa ou traço ('-')
- iniciar com um caractere alfanumérico
- terminar com um caractere alfanumérico

### Nomes de segmentos de caminhos

Alguns tipos de recurso requerem que seus nomes possam ser seguramente
codificados como um segmento de caminho, ou seja, o nome não pode ser "." ou
".." e não pode conter "/" ou "%".

Exemplo de um manifesto para um Pod chamado `nginx-demo`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
spec:
  containers:
  - name: nginx
    image: nginx:1.7.9
    ports:
    - containerPort: 80
```

{{< note >}}
Alguns tipos de recursos possuem restrições adicionais em seus nomes.
{{< /note >}}

## UIDs

{{< glossary_definition term_id="uid" length="all" >}}

UIDs no Kubernetes são identificadores únicos universais (também conhecidos como
UUIDs).
UUIDs seguem os padrões ISO/IEC 9834-8 e ITU-T X.667.


## {{% heading "whatsnext" %}}

* Leia sobre [labels](/docs/concepts/overview/working-with-objects/labels/) no Kubernetes.
* Consulte o documento de design [Identifiers and Names in Kubernetes](https://git.k8s.io/design-proposals-archive/architecture/identifiers.md).

