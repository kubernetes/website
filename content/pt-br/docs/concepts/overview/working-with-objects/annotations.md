---
title: Anotações
content_type: concept
weight: 60
---

<!-- overview -->
Você pode usar as anotações do Kubernetes para anexar metadados arbitrários não identificáveis a {{< glossary_tooltip text="objetos" term_id="object" >}}.
Clientes, como ferramentas e bibliotecas, podem recuperar esses metadados.

<!-- body -->
## Anexando metadados a objetos

Você pode usar tanto labels quanto anotações para anexar metadados a objetos
do Kubernetes. As labels podem ser usadas para selecionar objetos e encontrar
coleções de objetos que satisfaçam determinadas condições. Em contraste, as anotações
não são usadas para identificar e selecionar objetos. Os metadados
em uma anotação podem ser pequenos ou grandes, estruturados ou não estruturados, e podem
incluir caracteres não permitidos em labels. É possível usar labels, bem como
anotações, nos metadados do mesmo objeto.

Anotações, assim como labels, são mapas de chave/valor:

```json
"metadata": {
  "annotations": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

{{<note>}}
As chaves e os valores no mapa devem ser strings. Em outras palavras, você não pode usar
tipos numéricos, booleanos, listas ou outros tipos, tanto para as chaves quanto para os valores.
{{</note>}}

Aqui estão alguns exemplos de informações que podem ser registradas em anotações:

* Campos gerenciados por uma camada de configuração declarativa. Anexar esses campos
  como anotações os distingue dos valores padrão definidos por clientes ou
  servidores, e dos campos gerados automaticamente e dos campos definidos por
  sistemas de auto-dimensionamento (auto-sizing ou auto-scaling).

* Informações de build, release ou imagem, como carimbos de data/hora (timestamps), IDs de release, branch do git,
  números de PR, hashes de imagem e endereço do registry.

* Ponteiros para repositórios de logging, monitoramento, análise (analytics) ou auditoria.

* Informações da biblioteca cliente ou da ferramenta que podem ser usadas para fins de depuração:
  por exemplo, nome, versão e informações de build.

* Informações de procedência de usuário ou ferramenta/sistema, como URLs de objetos relacionados
  de outros componentes do ecossistema.

* Metadados de ferramentas de rollout leves: por exemplo, configuração ou checkpoints.

* Números de telefone ou pager das pessoas responsáveis, ou entradas de diretório que
  especificam onde essas informações podem ser encontradas, como o site de uma equipe.

* Diretrizes do usuário final para as implementações, a fim de modificar o comportamento ou
  habilitar funcionalidades não padrão.

Em vez de usar anotações, você poderia armazenar esse tipo de informação em um
banco de dados ou diretório externo, mas isso tornaria muito mais difícil produzir
bibliotecas e ferramentas cliente compartilhadas para implantação, gerenciamento,
introspecção e afins.

## Sintaxe e conjunto de caracteres

_Anotações_ são pares de chave/valor. As chaves de anotação válidas têm dois segmentos: um prefixo opcional e um nome, separados por uma barra (`/`). O segmento do nome é obrigatório e deve ter 63 caracteres ou menos, começando e terminando com um caractere alfanumérico (`[a-z0-9A-Z]`), com travessões (`-`), sublinhados (`_`), pontos (`.`) e alfanuméricos no meio. O prefixo é opcional. Se especificado, o prefixo deve ser um subdomínio DNS: uma série de rótulos DNS separados por pontos (`.`), com no máximo 253 caracteres no total, seguidos por uma barra (`/`).

Se o prefixo for omitido, presume-se que a chave da anotação seja privada ao usuário. Os componentes automatizados do sistema (por exemplo, `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl` ou outras automações de terceiros) que adicionam anotações a objetos do usuário final devem especificar um prefixo.

Os prefixos `kubernetes.io/` e `k8s.io/` são reservados para os componentes principais do Kubernetes.

Os valores de anotação válidos não têm restrições de conjunto de caracteres — ao contrário dos valores de label, os valores de anotação podem conter qualquer string, incluindo caracteres especiais, espaços em branco e dados estruturados como JSON ou YAML.
Se você planeja armazenar dados binários (como [CBOR](https://cbor.io/)),
o projeto Kubernetes recomenda que você os codifique em base64.
No entanto, o tamanho total de **todas** as anotações em um único objeto (chaves e valores combinados) não deve exceder 256 KiB.

Por exemplo, aqui está um manifesto de um Pod que possui a anotação `imageregistry: https://hub.docker.com/` :

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

- Aprenda mais sobre [Labels e Seletores](/docs/concepts/overview/working-with-objects/labels/).
- Encontre [Labels, Anotações e Taints conhecidos](/docs/reference/labels-annotations-taints/)
