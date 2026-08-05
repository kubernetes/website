---
title: Guia de Estilo da Documentação
linktitle: Guia de estilo
content_type: concept
weight: 40
---

<!-- overview -->
Esta página fornece orientações de estilo para escrita da documentação do
Kubernetes. Estas são orientações, não regras. Utilize seu melhor julgamento
e sinta-se livre para propor alterações neste documento através de um pull request.

Para informações adicionais sobre como criar novo conteúdo para a documentação
do Kubernetes, leia o
[Guia de Conteúdo da Documentação](/pt-br/docs/contribute/style/content-guide/).

Mudanças no guia de estilo são feitas pelo SIG Docs como um grupo. Para propor
uma alteração ou adição, inclua o tópico na [agenda](https://bit.ly/sig-docs-agenda)
de uma das reuniões futuras do SIG Docs, e participe da reunião para fazer parte
da discussão.

<!-- body -->

{{< note >}}
A documentação do Kubernetes utiliza o
[processador de markdown Goldmark](https://github.com/yuin/goldmark) com alguns
ajustes, bem como alguns [shortcodes do Hugo](/docs/contribute/style/hugo-shortcodes/)
para suportar entradas de glossário, tabulações e representação do estado das
funcionalidades.
{{< /note >}}

## Língua

A documentação do Kubernetes foi traduzida para diversas línguas (veja
[READMEs das Localizações](https://github.com/kubernetes/website/blob/main/README.md#localization-readmemds)).

A forma para localização de documentação em uma língua diferente está descrita em
[localizando a documentação do Kubernetes](/docs/contribute/localization/).

## Padrões de formatação da documentação

### Utilize _upper camel case_ para objetos da API {#use-upper-camel-case-for-api-objects}

Quando você se referir especificamente a interações com um objeto da API, utilize
[_UpperCamelCase_](https://pt.wikipedia.org/wiki/CamelCase), também conhecido como
_Pascal case_. Você poderá encontrar formatação de maiúsculas e minúsculas
diferente, como por exemplo "configMap", na [referência da API](/docs/reference/kubernetes-api/).
Ao escrever documentação geral, prefira a utilização de _upper camel case_,
chamando o objeto de "ConfigMap".

Quando você estiver discutindo um objeto da API, utilize a
[formatação de maiúsculas e minúsculas no estilo de sentença](https://learn.microsoft.com/pt-br/style-guide/text-formatting/using-type/use-sentence-style-capitalization).

Os exemplos a seguir focam no estilo de formatação de maiúsculas e minúsculas.
Para mais informações sobre como formatar nomes de objetos da API, revise a
orientação relacionada no [manual de estilo de código](#code-style-inline-code).

{{< table caption = "Faça e não faça - Utilizando _Pascal case_ para objetos da API" >}}
Faça                                                                              | Não faça
:-------------------------------------------------------------------------------- | :-------
O recurso HorizontalPodAutoscaler é responsável por ...                           | O Horizontal pod autoscaler é responsável por ...
Um objeto PodList é uma lista de Pods.                                            | Um objeto Pod List é uma lista de Pods.
O objeto Volume contém um campo `hostPath`.                                       | O objeto volume contém um campo hostPath.
Cada objeto ConfigMap é parte de um namespace.                                    | Cada objeto configMap é parte de um namespace.
Para o gerenciamento de dados confidenciais, considere utilizar a API de Secrets. | Para o gerenciamento de dados confidenciais, considere utilizar a API de segredos.
{{< /table >}}

### Utilize _chevrons_ para espaços reservados

Utilize _chevrons_ (&lt; e &gt;) para espaços reservados. Comunique ao leitor o
que o espaço reservado significa. Por exemplo:

```shell
kubectl describe pod <nome-do-pod> -n <namespace>
```

Se o nome do namespace do Pod for `default`, você pode omitir o paramêtro '-n'.

### Grife elementos de interface de usuário

{{< table caption = "Faça e não faça - grife elementos da interface do usuário" >}}
Faça                 | Não faça
:------------------- | :-------
Clique em **Fork**.  | Clique em "Fork".
Selecione **Other**. | Selecione "Other".
{{< /table >}}

### Utilize itálico para definir ou introduzir novos termos

{{< table caption = "Faça e não faça - Utilize itálico para novos termos" >}}
Faça | Não faça
:-- | :-----
Um _cluster_ é um conjunto de nós ... | Um "cluster" é um conjunto de nós ...
Estes componentes formam a _camada de gerenciamento_. | Estes componentes formam a **camada de gerenciamento**.
{{< /table >}}

### Utilize estilo de código para nomes de arquivos, diretórios e caminhos

{{< table caption = "Faça e não faça - Utilize estilo de código para nomes de arquivos, diretórios e caminhos" >}}
Faça | Não faça
:--| :-----
Abra o arquivo `envars.yaml`. | Abra o arquivo envars.yaml.
Navegue até o diretório `/docs/tutorials`. | Navegue até o diretório /docs/tutorials.
Abra o arquivo `/_data/concepts.yaml`. | Abra o arquivo /\_data/concepts.yaml.
{{< /table >}}

### Utilize o padrão internacional para pontuação dentro de aspas

{{< table caption = "Faça e não faça - Utilize o padrão internacional para pontuação dentro de aspas" >}}
Faça | Não faça
:--| :-----
eventos são registrados com um "estágio associado". | eventos são registrados com um "estágio associado."
A cópia é chamada de "fork". | A cópia é chamada de "fork."
{{< /table >}}

## Formatação de código embutido

### Utilize estilo de código para código embutido, comandos e objetos da API {#code-style-inline-code}

Para código embutido em um documento HTML, utilize a _tag_ `<code>`. Em um documento
Markdown, utilize os símbolos de crase (`` ` ``).

{{< table caption = "Faça e não faça - Utilize estilo de código para código embutido, comandos e objetos da API" >}}
Faça | Não faça
:--| :-----
O comando `kubectl run` cria um `Pod`. | O comando "kubectl run" cria um pod.
O kubelet em cada nó obtém um `Lease` ... | O kubelet em cada nó obtem um _lease_...
Um `PersistentVolume` representa armazenamento durável ... | Um _PersistentVolume_ representa armazenamento durável ...
Para gerenciamento declarativo, utilize `kubectl apply`. | Para gerenciamento declarativo, utilize "kubectl apply".
Circunde exemplos de código com três símbolos de crase. (` ``` `) | Circunde exemplos de código com quaisquer outras sintaxes.
Utilize um único símbolo de crase para circundar código embutido. Por exemplo, `var example = true`. | Utilize dois asteriscos (`**`) ou um subtraço (`_`) para circundar código embutido. Por exemplo, **var example = true**.
Utilize três símbolos de crase antes e depois de um bloco de código de múltiplas linhas para blocos de código cercados. | Utilize blocos de código de múltiplas linhas para criar diagramas, fluxogramas, ou outras ilustrações.
Utilize nomes de variáveis significativos que possuem um contexto. | Utilize nomes de variáveis como 'foo', 'bar' e 'baz' que não são significativos e não possuem contexto.
Remova espaços em branco em final de linha no código. | Adicione espaços em branco no código, onde estes são importantes, pois os leitores de tela lerão os espaços em branco também.
{{< /table >}}

{{< note >}}
Este website suporta destaque de sintaxe para exemplos de código, mas a especificação
de uma linguagem é opcional. Destaque de sintaxe nos blocos de código devem estar
de acordo com as [orientações de contraste.](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.0&showtechniques=141%2C143#contrast-minimum)
{{< /note >}}

### Utilize estilo de código para nomes de campos de objetos e namespaces

{{< table caption = "Faça e não faça - Utilize estilo de código para nomes de campos de objetos" >}}
Faça | Não faça
:--| :-----
Especifique o valor do campo `replicas` no arquivo de configuração. | Especifique o valor do campo "replicas" no arquivo de configuração.
O valor do campo `exec` é um objeto do tipo ExecAction. | O valor do campo "exec" é um objeto do tipo ExecAction.
Execute o processo como um DaemonSet no namespace `kube-system`. | Execute o processo como um DaemonSet no namespace kube-system.
{{< /table >}}

### Utilize estilo de código para ferramentas de linha de comando e nomes de componentes do Kubernetes

{{< table caption = "Faça e não faça - Utilize estilo de código para ferramentas de linha de comando e componentes do Kubernetes" >}}
Faça | Não faça
:--| :-----
O kubelet preserva a estabilidade do nó. | O `kubelet` preserva a estabilidade do nó.
O `kubectl` gerencia a busca e a autenticação com o servidor da API. | O kubectl gerencia a busca e a autenticação com o servidor da API.
Execute o processo com o certificado, `kube-apiserver --client-ca-file=FILENAME`. | Execute o processo com o certificado, kube-apiserver --client-ca-file=FILENAME.
{{< /table >}}

### Iniciando sentenças com o nome de uma ferramenta de linha de comando ou de um componente

{{< table caption = "Faça e não faça - Iniciando sentenças com o nome de uma ferramenta de linha de comando ou de um componente" >}}
Faça | Não faça
:--| :-----
A ferramenta `kubeadm` inicializa e provisiona máquinas em um cluster. | `kubeadm` inicializa e provisiona ferramentas em um cluster.
O kube-scheduler é o escalonador padrão para o Kubernetes. | kube-scheduler é o escalonador padrão para o Kubernetes.
{{< /table >}}

### Utilize uma descrição geral no lugar de um nome de componente

{{< table caption = "Faça e não faça - Utilize uma descrição geral no lugar de um nome de componente" >}}
Faça | Não faça
:--| :-----
O servidor da API do Kubernetes oferece uma especificação OpenAPI. | O apiserver oferece uma especificação OpenAPI.
APIs agregadas são servidores de API subordinados. | APIs agregadas são APIServers subordinados.
{{< /table >}}

### Utilize estilo normal para valores de campos do tipo texto ou inteiro

Para valores de campos do tipo texto ou inteiro, utilize o estilo normal sem aspas.

{{< table caption = "Faça e não faça - Utilize o estilo normal para valores de campo do tipo texto ou inteiro" >}}
Faça | Não faça
:--| :-----
Especifique o valor Always para o campo `imagePullPolicy`. | Especifique o valor "Always" para o campo `imagePullPolicy`.
Especifique o valor nginx:1.16 para o campo `image`. | Especifique o valor `nginx:1.16` para o campo `image`.
Especifique o valor 2 para o campo `replicas`. | Especifique o valor `2` para o campo `replicas`.
{{< /table >}}

## Referindo-se a recursos da API do Kubernetes

Esta seção discorre sobre como referenciar recursos da API na documentação.

### Clarificação sobre "recurso"

O Kubernetes utiliza a palavra "recurso" para se referir a recursos da API, como
`pod`, `deployment`, e demais objetos. Também utilizamos "recurso" para falar de
requisições e limites de recursos de CPU e memória. Sempre se refira a recursos
da API como "recursos da API" para evitar confusão com recursos de CPU e memória.

### Quando utilizar a terminologia da API do Kubernetes

As diferentes terminologias da API do Kubernetes são:

- Tipo de recurso: o nome utilizado na URL da API (como `pods`, `namespaces`)
- Recurso: uma instância única de um tipo de recurso (como `pod`, `secret`)
- Objeto: um recurso que serve como um "registro de intenção". Um objeto é um
  estado desejado para uma parte específica do seu cluster, que a camada de
  gerenciamento do Kubernetes tenta manter.

Sempre utilize "recurso" ou "objeto" ao se referir a um recurso da API em
documentação. Por exemplo, utilize "um objeto Secret" ao invés de apenas
"um Secret".

### Nomes de recursos da API

Sempre formate nomes de recursos da API utilizando
[_UpperCamelCase_](https://en.wikipedia.org/wiki/Camel_case), também conhecido
como _PascalCase_, e formatação de código.

Para código embutido em um documento HTML, utilize a tag `<code>`. Em um documento
Markdown, utilize o sinal de crase (`` ` ``).

Não separe um nome de objeto da API em palavras individuais. Por exemplo, escreva
`PodTemplateList` no lugar de Pod Template List.

Para mais informações sobre o _PascalCase_ e formatação de código, por favor
revise as orientações relacionadas nas seções
[Utilize _UpperCamelCase_ para objetos da API](#use-upper-camel-case-for-api-objects)
e [Utilize estilo de código para código embutido, comandos e objetos da API](#code-style-inline-code).

Para mais informações sobre as terminologias da API do Kubernetes, por favor
revise a orientação relacionada sobre [terminologia da API do Kubernetes](/docs/reference/using-api/api-concepts/#standard-api-terminology).

## Formatação de fragmentos de código

### Não inclua o prompt de comando

{{< table caption = "Faça e não faça - Não inclua o prompt de comando" >}}
Faça | Não faça
:--| :-----
kubectl get pods | $ kubectl get pods
{{< /table >}}

### Separe os comandos de seus resultados

Verifique que o Pod está rodando no seu nó escolhido:

```shell
kubectl get pods --output=wide
```

A saída é semelhante a:

```console
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```

### Exemplos de versionamento do Kubernetes

Exemplos de código e de configuração que incluem informação da versão devem ser
consistentes com o texto que os acompanha.

Se a informação é específica para uma versão, a versão do Kubernetes deve ser
definida na seção `prerequisites` dos modelos de página de
[tarefa](/docs/contribute/style/page-content-types/#task) ou de
[tutorial](/docs/contribute/style/page-content-types/#tutorial).
Assim que a página for salva, a seção `prerequisitos` é exibida com o título
**Antes de você começar**.

Para especificar uma versão do Kubernetes para uma página de tarefa ou de
tutorial, inclua a chave `min-kubernetes-server-version` na seção de
_front matter_.

Se o exemplo de YAML for um arquivo avulso, procure e revise os tópicos que
o incluem como uma referência. Verifique que quaisquer tópicos que estejam
utilizando o YAML avulso têm a informação de versão apropriada definida. Se um
arquivo avulso YAML não for referenciado em nenhum tópico, considere apagá-lo
ao invés de atualizá-lo.

Por exemplo, se você estiver escrevendo um tutorial que é relevante para a
versão 1.8 do Kubernetes, o _front matter_ do seu arquivo Markdown deve ser
semelhante ao demonstrado abaixo:

```yaml
---
title: <seu título de tutorial aqui>
min-kubernetes-server-version: v1.8
---
```

Nos exemplos de código e configuração, não inclua comentários sobre versões
alternativas. Tenha o cuidado de não incluir afirmações incorretas em comentários
nos seus exemplos, como por exemplo:

```yaml
apiVersion: v1 # versões mais antigas usam...
kind: Pod
...
```

## Kubernetes.io word list

Uma lista de termos específicos do Kubernetes para serem utilizados de forma
consistente em todo o website.

{{< table caption = "Lista de palavras do Kubernetes.io" >}}
Term | Usage
:--- | :----
Kubernetes | Kubernetes deve sempre ser escrito com K maiúsculo.
Docker | Docker deve sempre ser escrito com D maiúsculo.
SIG Docs | Escreva SIG Docs ao invés de SIG-DOCS ou outras variantes.
On-premises | Escreva On-premises ou On-prem ao invés de On-premise ou outras variantes.
{{< /table >}}

## Shortcodes

Os [_shortcodes_](https://gohugo.io/content-management/shortcodes) do Hugo
auxiliam na criação de diferentes níveis de atrativos retóricos. Nossa
documentação suporta três diferentes _shortcodes_ nessa categoria: **Nota**
`{{</* note */>}}`, **Cuidado** `{{</* caution */>}}`, e **Aviso**
`{{</* warning */>}}`.

1. Circunde o texto com uma abertura e um fechamento de _shortcode_.
2. Utilize a sintaxe abaixo para aplicar um estilo:
    ```none
    {{</* note */>}}
    Não há necessidade de incluir um prefixo; o _shortcode_ fornece um automaticamente (Nota:, Cuidado:, etc.).
    {{</* /note */>}}
    ```

    A saída é semelhante a:

    {{< note >}}
    O prefixo é gerado automaticamente com a seleção do tipo da tag.
    {{< /note >}}

### Nota

Utilize `{{</* note */>}}` para destacar uma dica ou uma informação que pode ser
útil para o leitor.

Por exemplo:

```
{{</* note */>}}
Você _ainda_ pode utilizar Markdown dentro destas seções de destaque.
{{</* /note */>}}
```

The output is:

{{< note >}}
Você _ainda_ pode utilizar Markdown dentro destas seções de destaque.
{{< /note >}}

Você pode utilizar o _shortcode_ `{{</* note */>}}` em uma lista:

```
1. Utilize o _shortcode_ `note` em uma lista

1. Um segundo item em uma lista com um shortcode note embutido

    {{</* note */>}}
    _Shortcodes_ Aviso, Cuidado e Nota, embutidos em listas, devem ser indentados
    com quatro espaços. Veja mais em [Problemas comuns com _shortcodes_](#common-shortcode-issues).
    {{</* /note */>}}

1. Um terceiro item em uma lista

1. Um quarto item em uma lista
```

A saída é:

1. Utilize o _shortcode_ `note` em uma lista

1. Um segundo item em uma lista com um shortcode note embutido

    {{< note >}}
    _Shortcodes_ Aviso, Cuidado e Nota, quando embutidos em listas, devem ser
    indentados com quatro espaços. Veja mais em
    [Problemas comuns com _shortcodes_](#common-shortcode-issues).
    {{< /note >}}

1. Um terceiro item em uma lista

1. Um quarto item em uma lista

### Cuidado

Utilize `{{</* caution */>}}` para chamar a atenção a informações importantes
que podem evitar problemas.

Por exemplo:

```
{{</* caution */>}}
O estilo de chamada se aplica somente à linha diretamente acima da tag.
{{</* /caution */>}}
```

A saída é:

{{< caution >}}
O estilo de chamada se aplica somente à linha diretamente acima da tag.
{{< /caution >}}

### Aviso

Utilize `{{</* warning */>}}` para indicar perigo ou uma orientação que é crucial
e deve ser seguida.

Por exemplo:

```
{{</* warning */>}}
Cuidado.
{{</* /warning */>}}
```

A saída é:

{{< warning >}}
Cuidado.
{{< /warning >}}

## Problemas comuns com _shortcodes_ {#common-shortcode-issues}

### Listas ordenadas

_Shortcodes_ interrompem listas numeradas a não ser que estejam indentados com
quatro espaços antes da nota e da tag.

Por exemplo:

```
1. Preaqueça o forno a 350°F.

1. Prepare a massa e a coloque na assadeira.
   `{{</* note */>}}Unte a assadeira para melhores resultados.{{</* /note */>}}`

1. Asse por 20-25 minutos, ou até que ao testar com um palito este saia limpo.
```

A saída é:

1. Preaqueça o forno a 350°F.

1. Prepare a massa e a coloque na assadeira.
    {{< note >}}Unte a assadeira para melhores resultados.{{< /note >}}

1. Asse por 20-25 minutos, ou até que ao testar com um palito este saia limpo.

### Cláusulas `include`

_Shortcodes_ dentro de cláusulas `include` fazem com que o build falhe. Você
deve colocá-los no documento superior, antes e depois da cláusula `include`.
Por exemplo:

```
{{</* note */>}}
{{</* include "task-tutorial-prereqs.md" */>}}
{{</* /note */>}}
```

## Elementos Markdown

### Quebras de linha

Utilize uma única linha em branco para dividir conteúdo a nível de bloco como por
exemplo cabeçalhos, listas, imagens, blocos de código, entre outros. A exceção
são cabeçalhos de segundo nível, onde duas linhas em branco devem ser utilizadas.
Cabeçalhos de segundo nível seguem o primeiro nível (ou o título) sem nenhum
texto ou parágrafo precedente. Um espaçamento de duas linhas em branco auxilia
a melhor visualização geral da estrutura do conteúdo em um editor de texto.

### Cabeçalhos e títulos {#headings}

Pessoas que acessam esta documentação podem estar fazendo uso de um leitor de
tela ou outro tipo de tecnologia auxiliar.
[Leitores de tela](https://pt.wikipedia.org/wiki/Leitor_de_tela) são dispositivos
de saída linear que falam de um item por vez em uma página. Se uma grande
quantidade de conteúdo existe em uma página, você pode utilizar cabeçalhos para
dar à página uma estrutura interna. Uma boa estrutura de página auxilia todos os
leitores a navegar facilmente ou filtrar tópicos de interesse.

{{< table caption = "Faça e não faça - Cabeçalhos" >}}
Faça | Não faça
:--| :-----
Atualize o título no _front matter_ da página ou postagem de blog. | Utilize cabeçalho de primeiro nível, pois o Hugo automaticamente converte o título do _front matter_ para um cabeçalho de primeiro nível.
Utilize cabeçalhos ordenados para fornecer um resumo de alto nível do seu conteúdo. | Utilize cabeçalhos de nível 4 a 6, a menos que seja absolutamente necessário. Se o seu conteúdo é detalhado a este nível, pode ser que ele precise ser dividido em artigos separados.
Utilize o sinal numérico ou cerquilha (`#`) para conteúdo que não seja postagem de blog. | Utilize traços ou sinais de igual (`---` ou `===`) para designar cabeçalhos de primeiro nível.
Utilize formatação de maiúsculas e minúsculas de sentença para cabeçalhos no corpo da página. Por exemplo, **Estenda o kubectl com plugins** | Utilize formatação de maiúsculas e minúsculas de título para cabeçalhos no corpo da página. Por exemplo, **Estenda o Kubectl com Plugins**
Utilize formatação de maiúsculas e minúsculas de título para o título da página no _front matter_. Por exemplo, `title: Riscos do Contorno do Servidor da API do Kubernetes` | Utilize formatação de maiúsculas e minúsculas de sentença para títulos de página no _front matter_. Por exemplo, não utilize `title: Riscos do contorno do servidor da API do Kubernetes`
{{< /table >}}

### Parágrafos

{{< table caption = "Faça e não faça - Parágrafos" >}}
Faça | Não faça
:--| :-----
Tente manter os parágrafos abaixo de 6 sentenças. | Indente o primeiro parágrafo com caracteres de espaço. Por exemplo, ⋅⋅⋅Três espaços antes de um parágrafo o indenta.
Utilize três hífens (`---`) para criar uma régua horizontal. Utilize réguas horizontais para quebras no conteúdo do parágrafo. Por exemplo, uma mudança de cena em uma história, ou uma mudança de tópico dentro de uma seção. | Utilize réguas horizontais para decoração.
{{< /table >}}

### Links

{{< table caption = "Faça e não faça - Links" >}}
Faça | Não faça
:--| :-----
Crie hiperlinks que forneçam o contexto para o conteúdo para o qual eles apontam. Por exemplo: certas portas estão abertas em suas máquinas. Veja <a href="#check-required-ports">Verifique portas necessárias</a> para mais detalhes. | Utilize termos ambíguos, como "clique aqui". Por exemplo: certas portas estão abertas em suas máquinas. Veja <a href="#check-required-ports">aqui</a> para mais detalhes.   
Crie hiperlinks no estilo de Markdown: `[texto do link](URL)`. Por exemplo: `[_Shortcodes_ do Hugo](/docs/contribute/style/hugo-shortcodes/#table-captions)`, cuja saída é [_Shortcodes_ do Hugo](/docs/contribute/style/hugo-shortcodes/#table-captions). | Crie links no estilo de HTML: `<a href="/media/examples/link-element-example.css" target="_blank">Visite nosso tutorial!</a>`, ou crie links que abrem em novas abas ou janelas. Por exemplo: `[website de exemplo](https://example.com){target="_blank"}`
{{< /table >}}

### Listas

Agrupe em listas itens relacionados que devem aparecer em uma ordem específica,
ou para indicar uma correlação entre vários itens. Quando um leitor de tela
encontra uma lista, independentemente de ser uma lista ordenada ou não-ordenada,
o leitor de tela anunciará ao usuário que há um grupo de itens em lista. O
usuário pode então utilizar as teclas de seta para navegar para cima e para baixo
entre os vários itens da lista. Links para navegação no website também podem ser
marcados como itens de lista, pois nada mais são do que um grupo de links
relacionados.

- Finalize cada item em uma lista com um ponto final se um ou mais itens na lista
  forem sentenças completas. Para consistência, normalmente todos os itens da
  lista devem ser sentenças completas, ou nenhum dos itens deve ser.

    {{< note >}}
    Listas ordenadas que são parte de uma sentença introdutória incompleta podem
    ser mantidos em letras minúsculas e pontuados como se cada item fosse uma
    parte da sentença introdutória.
    {{< /note >}}

- Utilize o número um (`1.`) para listas ordenadas.

- Utilize (`+`), (`*`) ou (`-`) para listas não-ordenadas.

- Deixe uma linha em branco após cada lista.

- Indente listas aninhadas com quatro espaços (por exemplo, ⋅⋅⋅⋅).

- Itens de lista podem consistir de múltiplos parágrafos. Cada parágrafo
  subsequente em uma lista deve estar indentado em quatro espaços ou um caractere
  de tabulação.

### Tabelas

O propósito semântico de uma tabela de dados é apresentar dados tabulados.
Usuários que não fazem uso de leitores de tela podem inspecionar a tabela de forma
visual rapidamente, mas um leitor de tela irá ler o conteúdo linha a linha.
Uma legenda de tabela é utilizada para criar um título descritivo para uma tabela
de dados. Tecnologias auxiliares utilizam o elemento HTML `caption` para
identificar o conteúdo da tabela para o usuário dentro da estrutura da página.

- Adicione legendas às suas tabelas utilizando os [_shortcodes_ do Hugo](/docs/contribute/style/hugo-shortcodes/#table-captions) para tabelas.

## Melhores práticas de conteúdo

Esta seção contém melhores práticas sugeridas para conteúdo claro, conciso e
consistente.

### Utilize o tempo presente

{{< table caption = "Faça e não faça - Utilize o tempo presente" >}}
Faça | Não faça
:--| :-----
Este comando inicializa um proxy. | Este comando irá iniciar um proxy.
{{< /table >}}

Exceção: utilize o tempo futuro ou pretérito quando necessário para comunicar o
significado correto.

### Utilize voz ativa

{{< table caption = "Faça e não faça - Utilize voz ativa" >}}
Faça | Não faça
:--| :-----
Você pode explorar a API utilizando um navegador. | A API pode ser explorada utilizando um navegador.
O arquivo YAML especifica o número de réplicas. | O número de réplicas é especificado no arquivo YAML.
{{< /table >}}

Exceção: utilize a voz passiva se a voz ativa resultar em uma construção estranha.

### Utilize linguagem simples e direta

Utilize linguagem simples e direta. Evite utilizar frases ou expressões
desnecessárias, como "por favor".

{{< table caption = "Faça e não faça - Utilize linguagem simples e direta" >}}
Faça | Não faça
:--| :-----
Para criar um ReplicaSet, ... | A fim de criar um ReplicaSet, ...
Veja o arquivo de configuração. | Por favor, veja o arquivo de configuração.
Veja os Pods. | Com este próximo comando veremos os Pods.
{{< /table >}}

### Dirija-se ao leitor utilizando "você"

{{< table caption = "Faça e não faça - Dirigindo-se ao leitor" >}}
Faça | Não faça
:--| :-----
Você pode criar um Deployment através ... | Criaremos um Deployment através ...
Na saída acima, você pode ver ... | Na saída acima, vimos que ...
{{< /table >}}

### Evite frases em Latim

Prefira termos em inglês no lugar de abreviações em Latim.

{{< table caption = "Faça e não faça - Evite frases em Latim" >}}
Faça | Não faça
:--| :-----
For example, ... | e.g., ...
That is, ...| i.e., ...
{{< /table >}}

Exceção: utilize "etc." para et cetera.

## Padrões a evitar

### Evite utilizar "nós"

O uso de "nós" em uma sentença pode ser confuso, pois o leitor pode não saber
se é parte do "nós" que você está descrevendo.

{{< table caption = "Faça e não faça - Padrões a evitar" >}}
Faça | Não faça
:--| :-----
A versão 1.4 inclui ... | Na versão 1.4, adicionamos ...
O Kubernetes fornece uma nova funcionalidade para ... | Nós fornecemos uma nova funcionalidade para ...
Esta página ensina sobre como você pode utilizar Pods. | Nesta página, iremos aprender sobre Pods.
{{< /table >}}

### Evite jargões e expressões idiomáticas

Alguns leitores falam inglês como segunda língua. Evite jargões e expressões
idiomáticas para auxiliar na compreensão.

{{< table caption = "Faça e não faça - Evite jargões e expressões idiomáticas" >}}
Faça | Não faça
:--| :-----
Internally, ... | Under the hood, ...
Create a new cluster. | Turn up a new cluster.
{{< /table >}}

### Evite afirmações sobre o futuro

Evite fazer promessas ou dar dicas sobre o futuro. Se você precisa falar sobre
uma funcionalidade em estado alfa, coloque o texto sob um cabeçalho que
classifique a informação em estado alfa.

Uma exceção a esta regra é a documentação sobre descontinuações que serão
convertidas em remoções em uma versão futura. Um exemplo deste tipo de documentação
é o [Guia de migração de APIs descontinuadas](/docs/reference/using-api/deprecation-guide/).

### Evite afirmações que ficarão desatualizadas em breve

Evite palavras como "atualmente" e "novo". Uma funcionalidade que é nova hoje
pode não ser mais considerada nova em alguns meses.

{{< table caption = "Faça e não faça - Evite afirmações que ficarão desatualizadas em breve" >}}
Faça | Não faça
:--| :-----
Na versão 1.4, ... | Na versão atual, ...
A funcionalidade de Federação fornece ... | A nova funcionalidade de Federação fornece ...
{{< /table >}}

### Evite palavras que assumem um nível específico de conhecimento

Evite palavras como "apenas", "simplesmente", "fácil", "facilmente" ou "simples".
Estas palavras não agregam valor.

{{< table caption = "Faça e não faça - Evite palavras insensitivas" >}}
Faça | Não faça
:--| :-----
Inclua um comando em ... | Inclua apenas um comando em ...
Execute o contêiner ... | Simplesmente execute o contêiner ...
Você pode remover ... | Você pode facilmente remover ...
Estes passos ... | Estes passos simples ...
{{< /table >}}

## {{% heading "whatsnext" %}}

* Aprenda sobre como [escrever um novo tópico](/docs/contribute/style/write-new-topic/).
* Aprenda sobre como [utilizar modelos de páginas](/docs/contribute/style/page-content-types/).
* Aprenda sobre como [criar um _pull request_](/docs/contribute/new-content/open-a-pr/).
