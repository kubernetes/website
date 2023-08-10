---
title: Définir une commande et ses arguments pour un Container
content_type: task
weight: 10
---

<!-- overview -->

Cette page montre comment définir les commandes et arguments d'un container au sein d'un {{< glossary_tooltip term_id="pod" >}}.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## Définir une commande et ses arguments à la création d'un Pod

Lorsque vous créez un Pod, il est possible de définir une commande et des arguments 
pour les containers qui seront exécutés dans votre Pod.
Pour définir une commande, ajoutez un champ `command` dans le fichier de configuration.
Pour définir des arguments, ajoutez le champ `args` dans le fichier de configuration.
La commande et les arguments qui sont définis ne peuvent être changés après la création du Pod.

La commande et les arguments que vous définissez dans le fichier de configuration 
écraseront la commande et les arguments définis par l'image utilisée par le container.
Si vous définissez uniquement des arguments, la commande par défaut sera exécutée avec les arguments que vous avez configurés. 
{{< note >}}
Le champ `command` correspond à `entrypoint` dans certains runtimes de containers.
{{< /note >}}

Dans cet exercice, vous allez créer un Pod qui exécute un container.
Le fichier de configuration pour le Pod défini une commande ainsi que deux arguments:
{{% codenew file="pods/commands.yaml" %}}

1. Créez un Pod en utilisant le fichier YAML de configuration suivant:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/commands.yaml
   ```

1. Listez les Pods 

   ```shell
   kubectl get pods
   ```

   Le résultat montre que le container exécuté dans le Pod nommé container-demo a complété son exécution.  

1. Pour voir le résultat de la commade exécutée dans le container, on peut afficher les logs pour le Pod:

   ```shell
   kubectl logs command-demo
   ```

   Le résultat montre les valeurs des variables d'environnement HOSTNAME et KUBERNETES_PORT:

   ```
   command-demo
   tcp://10.3.240.1:443
   ```

## Utiliser des variables d'environnement dans les arguments

Dans l'exemple précédent, vous avez défini des arguments en donnant 
directement les valeurs en format chaîne de caractères.
Il est aussi possible de définir des arguments en utilisant des variables d'environnement:

```yaml
env:
- name: MESSAGE
  value: "hello world"
command: ["/bin/echo"]
args: ["$(MESSAGE)"]
```

Il est donc possible de définir un argument pour un Pod en utilisant n'importe
quelle méthode disponible pour définir des variables d'environnements, ce qui inclut les 
[ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)
et les
[Secrets](/docs/concepts/configuration/secret/).

{{< note >}}
Les variables d'environnements apparaissent ente parenthèses `"$(VAR)"`.
Cette écriture est requise pour que la variable soit correctement
développée dans les champs `command` ou `args`.
{{< /note >}}

## Exécuter une commande à l'intérieur d'un shell

Dans certains cas, certaines commandes nécéssitent d'être exécutées dans un shell. Par exemple, certaines commandes consistent en une chaîne de commandes, ou un script shell. Pour exécuter une commande dans un shell, il est possible d'envelopper la commande comme ceci:

```shell
command: ["/bin/sh"]
args: ["-c", "while true; do echo hello; sleep 10;done"]
```

## {{% heading "whatsnext" %}}


* Aller plus loin dans la [configuration des pods et des containers](/docs/tasks/).
* Apprendre à [exécuter des commandes dans un container](/docs/tasks/debug/debug-application/get-shell-running-container/).
* Voir la [documentation de référence sur les containers](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core).
