---
title:  Organizando o acesso ao cluster usando arquivos kubeconfig
content_type: concept
weight: 60
---

<!-- overview -->

Utilize arquivos kubeconfig para organizar informações sobre clusters, usuários, namespaces e mecanismos de autenticação. A ferramenta de linha de comando `kubectl` faz uso dos arquivos kubeconfig para encontrar as informações necessárias para escolher e se comunicar com o serviço de API de um cluster.


{{< note >}}
Um arquivo que é utilizado para configurar o acesso aos clusters é chamado de *kubeconfig*. Esta á uma forma genérica de referenciamento para um arquivo de configuração desta natureza. Isso não significa que existe um arquivo com o nome `kubeconfig`.
{{< /note >}}

Por padrão, o `kubectl` procura por um arquivo de nome `config` no diretório `$HOME/.kube`

Você pode especificar outros arquivos kubeconfig através da variável de ambiente `KUBECONFIG` ou adicionando a opção [`--kubeconfig`](/docs/reference/generated/kubectl/kubectl/).

Para maiores detalhes na criação e especificação de um kubeconfig, veja o passo a passo em [Configurar Acesso para Múltiplos Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters).


<!-- body -->

## Suportando múltiplos clusters, usuários e mecanismos de autenticação

Imagine que você possua inúmeros clusters, e seus usuários e componentes se autenticam de várias formas. Por exemplo:

- Um kubelet ativo pode se autenticar utilizando certificados
- Um usuário pode se autenticar através de tokens
- Administradores podem possuir conjuntos de certificados os quais provém acesso aos usuários de forma individual.

Através de arquivos kubeconfig, você pode organizar os seus clusters, usuários, e namespaces. Você também pode definir contextos para uma fácil troca entre clusters e namespaces.


## Contexto

Um elemento de *contexto* em um kubeconfig é utilizado para agrupar parâmetros de acesso em um nome conveniente. Cada contexto possui três parâmetros: cluster, namespace, e usuário.

Por padrão, a ferramenta de linha de comando `kubectl` utiliza os parâmetros do _contexto atual_ para se comunicar com o cluster.

Para escolher o contexto atual:

```shell
kubectl config use-context
```

## A variável de ambiente KUBECONFIG 

A variável de ambiente `KUBECONFIG` possui uma lista dos arquivos kubeconfig. Para Linux e Mac, esta lista é delimitada por vírgula. No Windows, a lista é delimitada por ponto e vírgula. A variável de ambiente `KUBECONFIG` não é um requisito obrigatório - caso ela não exista o `kubectl` utilizará o arquivo kubeconfig padrão localizado no caminho `$HOME/.kube/config`.

Se a variável de ambiente `KUBECONFIG` existir, o `kubectl` utilizará uma configuração que é o resultado da combinação dos arquivos listados na variável de ambiente `KUBECONFIG`.

## Combinando arquivos kubeconfig

Para inspecionar a sua configuração atual, execute o seguinte comando:

```shell
kubectl config view
```

Como descrito anteriormente, a saída poderá ser resultado de um único arquivo kubeconfig, ou poderá ser o resultado da junção de vários arquivos kubeconfig. 

Aqui estão as regras que o `kubectl` utiliza quando realiza a combinação de arquivos kubeconfig:

1. Se o argumento `--kubeconfig` está definido, apenas o arquivo especificado será utilizado. Apenas uma instância desta flag é permitida.

   Caso contrário, se a variável de ambiente `KUBECONFIG` estiver definida, esta deverá ser utilizada como uma lista de arquivos a serem combinados, seguindo o fluxo a seguir:

    * Ignorar arquivos vazios.
    * Produzir erros para aquivos cujo conteúdo não for possível desserializar. 
    * O primeiro arquivo que definir um valor ou mapear uma chave determinada, será o escolhido.
    * Nunca modificar um valor ou mapear uma chave.
	   Exemplo: Preservar o contexto do primeiro arquivo que definir `current-context`.
		 Exemplo: Se dois arquivos especificarem um `red-user`, use apenas os valores do primeiro `red-user`. Mesmo se um segundo arquivo possuir entradas não conflitantes sobre a mesma entrada `red-user`, estas deverão ser descartadas.

   Para um exemplo de definição da variável de ambiente `KUBECONFIG` veja [Definido a variável de ambiente KUBECONFIG](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable).

   Caso contrário, utilize o arquivo kubeconfig padrão encontrado no diretório `$HOME/.kube/config`, sem qualquer tipo de combinação.

1. Determine o contexto a ser utilizado baseado no primeiro padrão encontrado, nesta ordem: 

    1. Usar o conteúdo da flag `--context` caso ela existir.
    1. Usar o `current-context` a partir da combinação dos arquivos kubeconfig.


   Um contexto vazio é permitido neste momento.


1. Determinar o cluster e o usuário. Neste ponto, poderá ou não existir um contexto.
   Determinar o cluster e o usuário no primeiro padrão encontrado de acordo com a ordem à seguir. Este procedimento deverá executado duas vezes: uma para definir o usuário a outra para definir o cluster.

	1. Utilizar a flag caso ela existir: `--user` ou `--cluster`.
	1. Se o contexto não estiver vazio, utilizar o cluster ou usuário deste contexto.

   O usuário e o cluster poderão estar vazios neste ponto.

1. Determinar as informações do cluster atual a serem utilizadas. Neste ponto, poderá ou não existir informações de um cluster.

   Construir cada peça de informação do cluster baseado nas opções à seguir; a primeira ocorrência encontrada será a opção vencedora: 

    1. Usar as flags de linha de comando caso existirem: `--server`, `--certificate-authority`, `--insecure-skip-tls-verify`.
    1. Se algum atributo do cluster existir a partir da combinação de kubeconfigs, estes deverão ser utilizados.
    1. Se não existir informação de localização do servidor falhar. 

1. Determinar a informação atual de usuário a ser utilizada. Construir a informação de usuário utilizando as mesmas regras utilizadas para o caso de informações de cluster, exceto para a regra de técnica de autenticação que deverá ser única por usuário:
   
	1. Usar as flags, caso existirem: `--client-certificate`, `--client-key`, `--username`, `--password`, `--token`.
	1. Usar os campos `user` resultado da combinação de arquivos kubeconfig.
	1. Se existirem duas técnicas conflitantes, falhar.

1. Para qualquer informação que ainda estiver ausente, utilizar os valores padrão e potencialmente solicitar informações de autenticação a partir do prompt de comando.


## Referências de arquivos

Arquivos e caminhos referenciados em um arquivo kubeconfig são relativos à localização do arquivo kubeconfig.

Referências de arquivos na linha de comando são relativas ao diretório de trabalho vigente.

No arquivo `$HOME/.kube/config`, caminhos relativos são armazenados de forma relativa, e caminhos absolutos são armazenados de forma absoluta.

## {{% heading "whatsnext" %}}


* [Configurar Accesso para Multiplos Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [`kubectl config`](/docs/reference/generated/kubectl/kubectl-commands#config)




