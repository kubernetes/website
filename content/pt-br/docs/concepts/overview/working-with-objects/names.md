---
title: Nomes
content_type: concept
weight: 20
---

<!-- overview -->

Cada objeto em um cluster possui um Nome que é único para aquele tipo de recurso.
Todo objeto do Kubernetes também possui um UID que é único para todo o cluster.

Por exemplo, você pode ter apenas um Pod chamado "myapp-1234", porém você pode ter um Pod
e um Deployment ambos com o nome "myapp-1234".

Para atributos não únicos providenciados por usuário, Kubernetes providencia [labels](/docs/concepts/overview/working-with-objects/labels/) e [annotations](/docs/concepts/overview/working-with-objects/annotations/).




<!-- body -->

## Nomes


Recursos Kubernetes podem ter nomes com até 253 caracteres. Os caracteres permitidos em nomes são: dígitos (0-9), letras minúsculas (a-z), `-`, e `.`.

A seguir, um exemplo para um Pod chamado `nginx-demo`.

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


Kubernetes UIDs são identificadores únicos universais (também chamados de UUIDs).
UUIDs utilizam padrões ISO/IEC 9834-8 e ITU-T X.667.


## {{% heading "whatsnext" %}}

* Leia sobre [labels](/docs/concepts/overview/working-with-objects/labels/) em Kubernetes.
* Consulte o documento de design [Identificadores e Nomes em Kubernetes](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md).

