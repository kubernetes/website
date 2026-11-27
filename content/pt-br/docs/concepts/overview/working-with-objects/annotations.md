---
title: Anotações
content_type: concept
weight: 60
---

<!-- overview -->
Você pode usar as anotações do Kubernetes para anexar metadados arbitrários a
{{< glossary_tooltip text="objetos" term_id="object" >}}, sem a finalidade de
identificá-los.
Clientes, como ferramentas e bibliotecas, podem recuperar esses metadados.

<!-- body -->
## Anexando metadados a objetos {#attaching-metadata-to-objects}

Você pode usar tanto rótulos (labels) quanto anotações para anexar metadados a objetos
do Kubernetes. Os rótulos podem ser usados para selecionar objetos e para
encontrar coleções de objetos que satisfaçam determinadas condições. Por outro
lado, as anotações não são usadas para identificar e selecionar objetos. Os
metadados de uma anotação podem ser pequenos ou grandes, estruturados ou não
estruturados, e podem incluir caracteres que não são permitidos em rótulos. É
possível usar rótulos e anotações nos metadados de um mesmo objeto.

As anotações, assim como os rótulos, são mapas de chave/valor:

```json
"metadata": {
  "annotations": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

{{<note>}}
As chaves e os valores do mapa devem ser strings. Em outras palavras, você não
pode usar tipos numéricos, booleanos, listas ou outros tipos nem para as chaves
nem para os valores.
{{</note>}}

Aqui estão alguns exemplos de informações que podem ser registradas em anotações:

* Campos gerenciados por uma camada de configuração declarativa. Anexar esses
  campos como anotações os diferencia dos valores padrão definidos por clientes
  ou servidores, e também dos campos gerados automaticamente e dos campos
  definidos por sistemas de dimensionamento automático ou de escalonamento
  automático.

* Informações de build, versão ou imagem, como registros de data e hora, IDs
  da versão, branch do git, números de PR, hashes de imagem e endereço do
  registro.

* Ponteiros para repositórios de logs, monitoramento, análise ou auditoria.

* Informações da biblioteca cliente ou da ferramenta que podem ser usadas para
  fins de depuração: por exemplo, nome, versão e informações de build.

* Informações de procedência do usuário ou da ferramenta/sistema, como URLs de
  objetos relacionados de outros componentes do ecossistema.

* Metadados de ferramentas leves de implantação gradual: por exemplo,
  configurações ou pontos de controle.

* Números de telefone ou de pager das pessoas responsáveis, ou entradas de
  diretório que indiquem onde essa informação pode ser encontrada, como o site
  de uma equipe.

* Diretivas do usuário final para as implementações, com o objetivo de
  modificar comportamentos ou ativar funcionalidades não padronizadas.

Em vez de usar anotações, você poderia armazenar esse tipo de informação em um
banco de dados ou diretório externo, mas isso tornaria muito mais difícil
produzir bibliotecas cliente e ferramentas compartilhadas para implantação,
gerenciamento, introspecção e afins.

## Sintaxe e conjunto de caracteres {#syntax-and-character-set}

Anotações são pares de chave/valor. Chaves de anotação válidas têm dois segmentos: um prefixo opcional e um nome, separados por uma barra (`/`). O segmento de nome é obrigatório e deve ter no máximo 63 caracteres, começando e terminando com um caractere alfanumérico (`[a-z0-9A-Z]`), podendo conter hifens (`-`), sublinhados (`_`), pontos (`.`) e caracteres alfanuméricos entre eles. O prefixo é opcional. Se especificado, o prefixo deve ser um subdomínio DNS: uma série de rótulos DNS separados por pontos (`.`), com no máximo 253 caracteres no total, seguida de uma barra (`/`).

Se o prefixo for omitido, presume-se que a chave da anotação é privada para o usuário. Componentes automatizados do sistema (por exemplo, `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl` ou outras automações de terceiros) que adicionam anotações a objetos do usuário final devem especificar um prefixo.

Os prefixos `kubernetes.io/` e `k8s.io/` são reservados para os componentes principais do Kubernetes.

Valores de anotação válidos não têm restrições de conjunto de caracteres — diferentemente dos valores de rótulos, os valores de anotações podem conter qualquer string, incluindo caracteres especiais, espaços em branco e dados estruturados, como JSON ou YAML.
Se você planeja armazenar dados binários (como [CBOR](https://cbor.io/)),
o projeto Kubernetes recomenda que você os codifique em base64.
No entanto, o tamanho total de **todas** as anotações de um único objeto (chaves e valores somados) não deve ultrapassar 256 KiB.

Por exemplo, aqui está um manifesto de um Pod que tem a anotação `imageregistry: https://hub.docker.com/`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: annotations-demo
  annotations:
    imageregistry: "https://hub.docker.com/"
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

## {{% heading "whatsnext" %}}

- Saiba mais sobre [Rótulos e Seletores](/docs/concepts/overview/working-with-objects/labels/).
- Consulte [Rótulos, Anotações e Taints conhecidos](/docs/reference/labels-annotations-taints/).
