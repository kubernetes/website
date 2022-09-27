---
layout: blog
title: "Kubectl Translation Support"
date: 2022-09-27
slug: kubectl-translation-support
---

**Author:** Brian Pursley

Kubectl has had the ability to translate its output to a variety of languages since 2016, but the translations are incomplete, resulting in output that is a mix of a user's configured language and kubectl's default language, which is English.

To illustrate the problem take a look at the examples below, which shows the top-level `kubectl help` output using each of kubectl's supported locales:

<details><summary>default</summary>

```
kubectl controls the Kubernetes cluster manager.

 Find more information at: https://kubernetes.io/docs/reference/kubectl/

Basic Commands (Beginner):
  create          Create a resource from a file or from stdin
  expose          Take a replication controller, service, deployment or pod and expose it as a new Kubernetes service
  run             Run a particular image on the cluster
  set             Set specific features on objects

Basic Commands (Intermediate):
  explain         Get documentation for a resource
  get             Display one or many resources
  edit            Edit a resource on the server
  delete          Delete resources by file names, stdin, resources and names, or by resources and label selector

Deploy Commands:
  rollout         Manage the rollout of a resource
  scale           Set a new size for a deployment, replica set, or replication controller
  autoscale       Auto-scale a deployment, replica set, stateful set, or replication controller

Cluster Management Commands:
  certificate     Modify certificate resources.
  cluster-info    Display cluster information
  top             Display resource (CPU/memory) usage
  cordon          Mark node as unschedulable
  uncordon        Mark node as schedulable
  drain           Drain node in preparation for maintenance
  taint           Update the taints on one or more nodes

Troubleshooting and Debugging Commands:
  describe        Show details of a specific resource or group of resources
  logs            Print the logs for a container in a pod
  attach          Attach to a running container
  exec            Execute a command in a container
  port-forward    Forward one or more local ports to a pod
  proxy           Run a proxy to the Kubernetes API server
  cp              Copy files and directories to and from containers
  auth            Inspect authorization
  debug           Create debugging sessions for troubleshooting workloads and nodes

Advanced Commands:
  diff            Diff the live version against a would-be applied version
  apply           Apply a configuration to a resource by file name or stdin
  patch           Update fields of a resource
  replace         Replace a resource by file name or stdin
  wait            Experimental: Wait for a specific condition on one or many resources
  kustomize       Build a kustomization target from a directory or URL.

Settings Commands:
  label           Update the labels on a resource
  annotate        Update the annotations on a resource
  completion      Output shell completion code for the specified shell (bash, zsh, fish, or powershell)

Other Commands:
  alpha           Commands for features in alpha
  api-resources   Print the supported API resources on the server
  api-versions    Print the supported API versions on the server, in the form of "group/version"
  config          Modify kubeconfig files
  plugin          Provides utilities for interacting with plugins
  version         Print the client and server version information

Usage:
  kubectl [flags] [options]

Use "kubectl <command> --help" for more information about a given command.
Use "kubectl options" for a list of global command-line options (applies to all commands).
```
</details>

<details><summary>de_DE</summary>

```
kubectl controls the Kubernetes cluster manager.

 Find more information at: https://kubernetes.io/docs/reference/kubectl/

Basic Commands (Beginner):
  create          Create a resource from a file or from stdin
  expose          Take a replication controller, service, deployment or pod and expose it as a new Kubernetes service
  run             Starte ein bestimmtes Image auf dem Cluster
  set             Setze bestimmte Features auf Objekten

Basic Commands (Intermediate):
  explain         Get documentation for a resource
  get             Zeige eine oder mehrere Resourcen
  edit            Bearbeite eine Resource auf dem Server
  delete          Delete resources by file names, stdin, resources and names, or by resources and label selector

Deploy Commands:
  rollout         Manage the rollout of a resource
  scale           Set a new size for a deployment, replica set, or replication controller
  autoscale       Auto-scale a deployment, replica set, stateful set, or replication controller

Cluster Management Commands:
  certificate     Verändere Certificate-Resources
  cluster-info    Display cluster information
  top             Display resource (CPU/memory) usage
  cordon          Markiere Knoten als unschedulable
  uncordon        Markiere Knoten als schedulable
  drain           Leere Knoten, um eine Wartung vorzubereiten
  taint           Aktualisiere die Taints auf einem oder mehreren Knoten

Troubleshooting and Debugging Commands:
  describe        Zeige Details zu einer bestimmten Resource oder Gruppe von Resourcen
  logs            Schreibt die Logs für einen Container in einem Pod
  attach          Weise einem laufenden Container zu
  exec            Führe einen Befehl im Container aus
  port-forward    Leite einen oder mehrere lokale Ports an einen Pod weiter
  proxy           Starte einen Proxy zum Kubernetes-API-Server
  cp              Copy files and directories to and from containers
  auth            Inspect authorization
  debug           Create debugging sessions for troubleshooting workloads and nodes

Advanced Commands:
  diff            Diff the live version against a would-be applied version
  apply           Apply a configuration to a resource by file name or stdin
  patch           Update fields of a resource
  replace         Replace a resource by file name or stdin
  wait            Experimental: Wait for a specific condition on one or many resources
  kustomize       Build a kustomization target from a directory or URL.

Settings Commands:
  label           Aktualisiere die Labels auf einer Resource
  annotate        Aktualisiere die Annotationen auf einer Resource
  completion      Output shell completion code for the specified shell (bash, zsh, fish, or powershell)

Other Commands:
  alpha           Commands for features in alpha
  api-resources   Print the supported API resources on the server
  api-versions    Print the supported API versions on the server, in the form of "group/version"
  config          Verändere kubeconfig Dateien
  plugin          Provides utilities for interacting with plugins
  version         Schreibt die Client- und Server-Versionsinformation

Usage:
  kubectl [flags] [options]

Use "kubectl <command> --help" for more information about a given command.
Use "kubectl options" for a list of global command-line options (applies to all commands).
```
</details>

<details><summary>fr_FR</summary>

```
kubectl controls the Kubernetes cluster manager.

 Find more information at: https://kubernetes.io/docs/reference/kubectl/

Basic Commands (Beginner):
  create          Create a resource from a file or from stdin
  expose          Take a replication controller, service, deployment or pod and expose it as a new Kubernetes service
  run             Run a particular image on the cluster
  set             Set specific features on objects

Basic Commands (Intermediate):
  explain         Get documentation for a resource
  get             Display one or many resources
  edit            Edit a resource on the server
  delete          Delete resources by file names, stdin, resources and names, or by resources and label selector

Deploy Commands:
  rollout         Manage the rollout of a resource
  scale           Set a new size for a deployment, replica set, or replication controller
  autoscale       Auto-scale a deployment, replica set, stateful set, or replication controller

Cluster Management Commands:
  certificate     Modify certificate resources.
  cluster-info    Display cluster information
  top             Display resource (CPU/memory) usage
  cordon          Mark node as unschedulable
  uncordon        Mark node as schedulable
  drain           Drain node in preparation for maintenance
  taint           Update the taints on one or more nodes

Troubleshooting and Debugging Commands:
  describe        Show details of a specific resource or group of resources
  logs            Print the logs for a container in a pod
  attach          Attach to a running container
  exec            Execute a command in a container
  port-forward    Forward one or more local ports to a pod
  proxy           Run a proxy to the Kubernetes API server
  cp              Copy files and directories to and from containers
  auth            Inspect authorization
  debug           Create debugging sessions for troubleshooting workloads and nodes

Advanced Commands:
  diff            Diff the live version against a would-be applied version
  apply           Apply a configuration to a resource by file name or stdin
  patch           Update fields of a resource
  replace         Replace a resource by file name or stdin
  wait            Experimental: Wait for a specific condition on one or many resources
  kustomize       Build a kustomization target from a directory or URL.

Settings Commands:
  label           Update the labels on a resource
  annotate        Mettre à jour les annotations d'une ressource
  completion      Output shell completion code for the specified shell (bash, zsh, fish, or powershell)

Other Commands:
  alpha           Commands for features in alpha
  api-resources   Print the supported API resources on the server
  api-versions    Print the supported API versions on the server, in the form of "group/version"
  config          Modifier des fichiers kubeconfig
  plugin          Provides utilities for interacting with plugins
  version         Print the client and server version information

Usage:
  kubectl [flags] [options]

Use "kubectl <command> --help" for more information about a given command.
Use "kubectl options" for a list of global command-line options (applies to all commands).
```
</details>

<details><summary>it_IT</summary>

```
kubectl controls the Kubernetes cluster manager.

 Find more information at: https://kubernetes.io/docs/reference/kubectl/

Basic Commands (Beginner):
  create          Create a resource from a file or from stdin
  expose          Take a replication controller, service, deployment or pod and expose it as a new Kubernetes service
  run             Esegui una particolare immagine nel cluster
  set             Imposta caratteristiche specifiche sugli oggetti

Basic Commands (Intermediate):
  explain         Get documentation for a resource
  get             Visualizza una o più risorse
  edit            Modificare una risorsa sul server
  delete          Delete resources by file names, stdin, resources and names, or by resources and label selector

Deploy Commands:
  rollout         Manage the rollout of a resource
  scale           Set a new size for a deployment, replica set, or replication controller
  autoscale       Auto-scale a deployment, replica set, stateful set, or replication controller

Cluster Management Commands:
  certificate     Modificare le risorse del certificato.
  cluster-info    Display cluster information
  top             Display resource (CPU/memory) usage
  cordon          Contrassegnare il nodo come non programmabile
  uncordon        Contrassegnare il nodo come programmabile
  drain           Drain node in preparazione alla manutenzione
  taint           Aggiorna i taints su uno o più nodi

Troubleshooting and Debugging Commands:
  describe        Mostra i dettagli di una specifica risorsa o un gruppo di risorse
  logs            Stampa i log per container in un pod
  attach          Collega a un container in esecuzione
  exec            Esegui un comando in un contenitore
  port-forward    Inoltra una o più porte locali a un pod
  proxy           Eseguire un proxy al server Kubernetes API
  cp              Copy files and directories to and from containers
  auth            Inspect authorization
  debug           Create debugging sessions for troubleshooting workloads and nodes

Advanced Commands:
  diff            Diff the live version against a would-be applied version
  apply           Apply a configuration to a resource by file name or stdin
  patch           Update fields of a resource
  replace         Replace a resource by file name or stdin
  wait            Experimental: Wait for a specific condition on one or many resources
  kustomize       Build a kustomization target from a directory or URL.

Settings Commands:
  label           Aggiorna label di una risorsa
  annotate        Aggiorna annotazioni di risorsa
  completion      Output shell completion code for the specified shell (bash, zsh, fish, or powershell)

Other Commands:
  alpha           Commands for features in alpha
  api-resources   Print the supported API resources on the server
  api-versions    Print the supported API versions on the server, in the form of "group/version"
  config          Modifica i file kubeconfig
  plugin          Provides utilities for interacting with plugins
  version         Stampa per client e server le informazioni sulla versione

Usage:
  kubectl [flags] [options]

Use "kubectl <command> --help" for more information about a given command.
Use "kubectl options" for a list of global command-line options (applies to all commands).
```
</details>

<details><summary>ja_JP</summary>

```
kubectl controls the Kubernetes cluster manager.

 Find more information at: https://kubernetes.io/docs/reference/kubectl/

Basic Commands (Beginner):
  create          Create a resource from a file or from stdin
  expose          Take a replication controller, service, deployment or pod and expose it as a new Kubernetes service
  run             Run a particular image on the cluster
  set             Set specific features on objects

Basic Commands (Intermediate):
  explain         Get documentation for a resource
  get             1つまたは複数のリソースを表示する
  edit            Edit a resource on the server
  delete          Delete resources by file names, stdin, resources and names, or by resources and label selector

Deploy Commands:
  rollout         Manage the rollout of a resource
  scale           Set a new size for a deployment, replica set, or replication controller
  autoscale       Auto-scale a deployment, replica set, stateful set, or replication controller

Cluster Management Commands:
  certificate     Modify certificate resources.
  cluster-info    Display cluster information
  top             Display resource (CPU/memory) usage
  cordon          Mark node as unschedulable
  uncordon        Mark node as schedulable
  drain           Drain node in preparation for maintenance
  taint           Update the taints on one or more nodes

Troubleshooting and Debugging Commands:
  describe        Show details of a specific resource or group of resources
  logs            Print the logs for a container in a pod
  attach          Attach to a running container
  exec            Execute a command in a container
  port-forward    Forward one or more local ports to a pod
  proxy           Run a proxy to the Kubernetes API server
  cp              Copy files and directories to and from containers
  auth            Inspect authorization
  debug           Create debugging sessions for troubleshooting workloads and nodes

Advanced Commands:
  diff            Diff the live version against a would-be applied version
  apply           Apply a configuration to a resource by file name or stdin
  patch           Update fields of a resource
  replace         Replace a resource by file name or stdin
  wait            Experimental: Wait for a specific condition on one or many resources
  kustomize       Build a kustomization target from a directory or URL.

Settings Commands:
  label           リソースのラベルを更新する
  annotate        リソースのアノテーションを更新する
  completion      Output shell completion code for the specified shell (bash, zsh, fish, or powershell)

Other Commands:
  alpha           Commands for features in alpha
  api-resources   Print the supported API resources on the server
  api-versions    Print the supported API versions on the server, in the form of "group/version"
  config          kubeconfigを変更する
  plugin          Provides utilities for interacting with plugins
  version         Print the client and server version information

Usage:
  kubectl [flags] [options]

Use "kubectl <command> --help" for more information about a given command.
Use "kubectl options" for a list of global command-line options (applies to all commands).
```
</details>

<details><summary>ko_KR</summary>

```
kubectl controls the Kubernetes cluster manager.

 Find more information at: https://kubernetes.io/docs/reference/kubectl/

Basic Commands (Beginner):
  create          Create a resource from a file or from stdin
  expose          Take a replication controller, service, deployment or pod and expose it as a new Kubernetes service
  run             Run a particular image on the cluster
  set             Set specific features on objects

Basic Commands (Intermediate):
  explain         Get documentation for a resource
  get             Display one or many resources
  edit            Edit a resource on the server
  delete          Delete resources by file names, stdin, resources and names, or by resources and label selector

Deploy Commands:
  rollout         Manage the rollout of a resource
  scale           Set a new size for a deployment, replica set, or replication controller
  autoscale       Auto-scale a deployment, replica set, stateful set, or replication controller

Cluster Management Commands:
  certificate     Modify certificate resources.
  cluster-info    Display cluster information
  top             Display resource (CPU/memory) usage
  cordon          Mark node as unschedulable
  uncordon        Mark node as schedulable
  drain           Drain node in preparation for maintenance
  taint           Update the taints on one or more nodes

Troubleshooting and Debugging Commands:
  describe        Show details of a specific resource or group of resources
  logs            Print the logs for a container in a pod
  attach          Attach to a running container
  exec            Execute a command in a container
  port-forward    Forward one or more local ports to a pod
  proxy           Run a proxy to the Kubernetes API server
  cp              Copy files and directories to and from containers
  auth            Inspect authorization
  debug           Create debugging sessions for troubleshooting workloads and nodes

Advanced Commands:
  diff            Diff the live version against a would-be applied version
  apply           Apply a configuration to a resource by file name or stdin
  patch           Update fields of a resource
  replace         Replace a resource by file name or stdin
  wait            Experimental: Wait for a specific condition on one or many resources
  kustomize       Build a kustomization target from a directory or URL.

Settings Commands:
  label           Update the labels on a resource
  annotate        자원에 대한 주석을 업데이트합니다
  completion      Output shell completion code for the specified shell (bash, zsh, fish, or powershell)

Other Commands:
  alpha           Commands for features in alpha
  api-resources   Print the supported API resources on the server
  api-versions    Print the supported API versions on the server, in the form of "group/version"
  config          kubeconfig 파일을 수정합니다
  plugin          Provides utilities for interacting with plugins
  version         Print the client and server version information

Usage:
  kubectl [flags] [options]

Use "kubectl <command> --help" for more information about a given command.
Use "kubectl options" for a list of global command-line options (applies to all commands).
```
</details>

<details><summary>pt_BR</summary>

```
kubectl controls the Kubernetes cluster manager.

 Find more information at: https://kubernetes.io/docs/reference/kubectl/

Basic Commands (Beginner):
  create          Create a resource from a file or from stdin
  expose          Take a replication controller, service, deployment or pod and expose it as a new Kubernetes service
  run             Executa uma imagem específica no cluster
  set             Define funcionalidades específicas em objetos

Basic Commands (Intermediate):
  explain         Get documentation for a resource
  get             Mostra um ou mais recursos
  edit            Edita um recurso no servidor
  delete          Delete resources by file names, stdin, resources and names, or by resources and label selector

Deploy Commands:
  rollout         Manage the rollout of a resource
  scale           Set a new size for a deployment, replica set, or replication controller
  autoscale       Auto-scale a deployment, replica set, stateful set, or replication controller

Cluster Management Commands:
  certificate     Edita o certificado dos recursos.
  cluster-info    Display cluster information
  top             Display resource (CPU/memory) usage
  cordon          Marca o node como não agendável
  uncordon        Marca o node como agendável
  drain           Drenar o node para preparação de manutenção
  taint           Atualizar o taints de um ou mais nodes

Troubleshooting and Debugging Commands:
  describe        Mostra os detalhes de um recurso específico ou de um grupo de recursos
  logs            Mostra os logs de um container em um pod
  attach          Se conecta a um container em execução
  exec            Executa um comando em um container
  port-forward    Encaminhar uma ou mais portas locais para um pod
  proxy           Executa um proxy para o servidor de API do Kubernetes
  cp              Copy files and directories to and from containers
  auth            Inspect authorization
  debug           Create debugging sessions for troubleshooting workloads and nodes

Advanced Commands:
  diff            Diff the live version against a would-be applied version
  apply           Apply a configuration to a resource by file name or stdin
  patch           Update fields of a resource
  replace         Replace a resource by file name or stdin
  wait            Experimental: Wait for a specific condition on one or many resources
  kustomize       Build a kustomization target from a directory or URL.

Settings Commands:
  label           Atualizar os labels de um recurso
  annotate        Atualizar as anotações de um recurso
  completion      Output shell completion code for the specified shell (bash, zsh, fish, or powershell)

Other Commands:
  alpha           Commands for features in alpha
  api-resources   Print the supported API resources on the server
  api-versions    Print the supported API versions on the server, in the form of "group/version"
  config          Edita o arquivo kubeconfig
  plugin          Provides utilities for interacting with plugins
  version         Mostra a informação de versão do cliente e do servidor

Usage:
  kubectl [flags] [options]

Use "kubectl <command> --help" for more information about a given command.
Use "kubectl options" for a list of global command-line options (applies to all commands).
```
</details>

<details><summary>zh_CN</summary>

```
kubectl controls the Kubernetes cluster manager.

 Find more information at: https://kubernetes.io/docs/reference/kubectl/

Basic Commands (Beginner):
  create          Create a resource from a file or from stdin
  expose          Take a replication controller, service, deployment or pod and expose it as a new Kubernetes service
  run             在集群上运行特定镜像
  set             为对象设置指定特性

Basic Commands (Intermediate):
  explain         Get documentation for a resource
  get             显示一个或多个资源
  edit            编辑服务器上的资源
  delete          Delete resources by file names, stdin, resources and names, or by resources and label selector

Deploy Commands:
  rollout         Manage the rollout of a resource
  scale           Set a new size for a deployment, replica set, or replication controller
  autoscale       Auto-scale a deployment, replica set, stateful set, or replication controller

Cluster Management Commands:
  certificate     修改证书资源。
  cluster-info    Display cluster information
  top             Display resource (CPU/memory) usage
  cordon          标记节点为不可调度
  uncordon        标记节点为可调度
  drain           清空节点以准备维护
  taint           更新一个或者多个节点上的污点

Troubleshooting and Debugging Commands:
  describe        显示特定资源或资源组的详细信息
  logs            打印 Pod 中容器的日志
  attach          挂接到一个运行中的容器
  exec            在某个容器中执行一个命令
  port-forward    将一个或多个本地端口转发到某个 Pod
  proxy           运行一个指向 Kubernetes API 服务器的代理
  cp              Copy files and directories to and from containers
  auth            Inspect authorization
  debug           Create debugging sessions for troubleshooting workloads and nodes

Advanced Commands:
  diff            Diff the live version against a would-be applied version
  apply           Apply a configuration to a resource by file name or stdin
  patch           Update fields of a resource
  replace         Replace a resource by file name or stdin
  wait            Experimental: Wait for a specific condition on one or many resources
  kustomize       Build a kustomization target from a directory or URL.

Settings Commands:
  label           更新某资源上的标签
  annotate        更新一个资源的注解
  completion      Output shell completion code for the specified shell (bash, zsh, fish, or powershell)

Other Commands:
  alpha           Commands for features in alpha
  api-resources   Print the supported API resources on the server
  api-versions    Print the supported API versions on the server, in the form of "group/version"
  config          修改 kubeconfig 文件
  plugin          Provides utilities for interacting with plugins
  version         输出客户端和服务端的版本信息

Usage:
  kubectl [flags] [options]

Use "kubectl <command> --help" for more information about a given command.
Use "kubectl options" for a list of global command-line options (applies to all commands).
```
</details>

<details><summary>zh_TW</summary>

```
kubectl controls the Kubernetes cluster manager.

 Find more information at: https://kubernetes.io/docs/reference/kubectl/

Basic Commands (Beginner):
  create          Create a resource from a file or from stdin
  expose          Take a replication controller, service, deployment or pod and expose it as a new Kubernetes service
  run             Run a particular image on the cluster
  set             Set specific features on objects

Basic Commands (Intermediate):
  explain         Get documentation for a resource
  get             Display one or many resources
  edit            Edit a resource on the server
  delete          Delete resources by file names, stdin, resources and names, or by resources and label selector

Deploy Commands:
  rollout         Manage the rollout of a resource
  scale           Set a new size for a deployment, replica set, or replication controller
  autoscale       Auto-scale a deployment, replica set, stateful set, or replication controller

Cluster Management Commands:
  certificate     Modify certificate resources.
  cluster-info    Display cluster information
  top             Display resource (CPU/memory) usage
  cordon          Mark node as unschedulable
  uncordon        Mark node as schedulable
  drain           Drain node in preparation for maintenance
  taint           Update the taints on one or more nodes

Troubleshooting and Debugging Commands:
  describe        Show details of a specific resource or group of resources
  logs            Print the logs for a container in a pod
  attach          Attach to a running container
  exec            Execute a command in a container
  port-forward    Forward one or more local ports to a pod
  proxy           Run a proxy to the Kubernetes API server
  cp              Copy files and directories to and from containers
  auth            Inspect authorization
  debug           Create debugging sessions for troubleshooting workloads and nodes

Advanced Commands:
  diff            Diff the live version against a would-be applied version
  apply           Apply a configuration to a resource by file name or stdin
  patch           Update fields of a resource
  replace         Replace a resource by file name or stdin
  wait            Experimental: Wait for a specific condition on one or many resources
  kustomize       Build a kustomization target from a directory or URL.

Settings Commands:
  label           Update the labels on a resource
  annotate        更新一個資源的注解(annotations)
  completion      Output shell completion code for the specified shell (bash, zsh, fish, or powershell)

Other Commands:
  alpha           Commands for features in alpha
  api-resources   Print the supported API resources on the server
  api-versions    Print the supported API versions on the server, in the form of "group/version"
  config          修改 kubeconfig 檔案
  plugin          Provides utilities for interacting with plugins
  version         Print the client and server version information

Usage:
  kubectl [flags] [options]

Use "kubectl <command> --help" for more information about a given command.
Use "kubectl options" for a list of global command-line options (applies to all commands).
```
</details>

<br/>

Choosing one of these as an example, if you set Japanese as your language (using the `ja_JP` locale), you'll find that less than 10% of the `kubectl help` output is translated. So while the capability exists within kubectl, it is not being used to its fullest potential.

## Background

To better understand why kubectl doesn't provide more complete translations, let's first take a look at how kubectl performs translations.

### How does kubectl determine your language?

Kubectl determines which translation should be performed by [reading the `LC_ALL`, `LC_MESSAGES`, and `LANG` environment variables](https://github.com/kubernetes/kubernetes/blob/feca7983b77be3d7d578f3d5b64cbb1be6f327af/staging/src/k8s.io/kubectl/pkg/util/i18n/i18n.go#L56-L64). If a value is set in one of those variables, it [strips off the codeset suffix to get only the locale](https://github.com/kubernetes/kubernetes/blob/feca7983b77be3d7d578f3d5b64cbb1be6f327af/staging/src/k8s.io/kubectl/pkg/util/i18n/i18n.go#L70-L75) containing the language/country combination. For example, `de_DE.UTF-8` would become `de_DE`. Kubectl uses locale as the key to determine which translation should be used.

### Where are kubectl translations located?

For each supported locale, [kubectl has an LC_MESSAGES directory](https://github.com/kubernetes/kubernetes/tree/1c4387c78f0d48398efb0dcc3268fa156cdd8ffd/staging/src/k8s.io/kubectl/pkg/util/i18n/translations/kubectl) that has a `k8s.po` with the translations for that locale. This file is a [GNU gettext PO file](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html), which has msgid/msgstr pairs mapping the original text to its translation. The `k8s.po` file is human-readable, but is used to generate a corresponding machine-optimized `k8s.mo` file. The translations directory structure is embedded within the kubectl executable, so that it can be used at runtime to look up translations.

### How does kubectl use those translations?

Kubectl defines an [`i18n.T()`](https://github.com/kubernetes/kubernetes/blob/feca7983b77be3d7d578f3d5b64cbb1be6f327af/staging/src/k8s.io/kubectl/pkg/util/i18n/i18n.go#L137-L143) function that reads the `k8s.mo` file from the directory matching the user's locale and then uses the [`gettext-go`](https://github.com/chai2010/gettext-go) library to replace the default text with the translated text. If no translated text can be found, the default text is used.

## Why are kubectl translations incomplete?

There are many reasons for why kubectl's translations are incomplete. Here are some of them:

### Missing translated text

An obvious reason is that not all available text has been translated for all supported locales.

### Translation "decay"

When a contributor makes a change to text in kubectl's code, the translations in the `k8s.po` files will no longer match, resulting in `i18n.T()` returning the default text. The cause could be as simple as someone adding a new example to a command's help output, yet this will trigger the need for that text to be re-translated for all locales.

An ongoing effort is needed to keep translations up to date as text is changed, so the output does not slowly revert to a mix of translated and untranslated text.

### Incomplete wrapping of text in kubectl's code

Kubectl wraps text using `i18n.T()` in many places, but there are still many more where it is needed.

Some are obvious, such as the help text for a command line flag, but others are less obvious, such as error, validation, and informational messages which are written from various places throughout kubectl's code.

### Translation-unaware external dependencies

Some of kubectl's output can be more difficult to translate, because it does not originate as static text within kubectl's code, but from an external dependency or custom data, such as: 

* Messages coming from the API server (OpenAPI descriptions, Table printer output, warnings, errors, etc).
* Status and other content contained within CRDs.
* Messages printed by Kustomize, which is integrated into kubectl as a library.
* Third-party kubectl plugins, which are invoked through kubectl.

## What's next?

It is clear that kubectl's translations are incomplete, and that there is work needed to create and maintain translations for all the locales supported by kubectl.

In order to help shape the efforts of SIG-CLI in this area, we want to hear from the community:

* For users whose native language is not English, how important is it to have translations in kubectl?
  * Is it still helpful if the translations are incomplete? 
  * Are the current incomplete translations that kubectl has good enough, or is it better to not have translations at all, than to have a mix of two languages in the same output?
  * What should be kubectl's goal as it pertains to translation completeness? Is there a percentage that identifies a sufficient level of translation?
  * Should translations be completely removed from kubectl, if kubectl can't provide a good enough level of translation? Who might be negatively affected by that?
* Does kubectl support the right set of locales? 
  * If not, which should be removed or added?
  * What should be the criteria to decide if a translation should be supported? 
  * Does it make sense to provide translations at the locale level, or should they be at the language level? For example, kubectl currently supports `pt_BR`, but not `pt_PT`, resulting in Brazil getting Portuguese translations, but not Portugal. Should there just be a `pt` translation that is used for both? 
