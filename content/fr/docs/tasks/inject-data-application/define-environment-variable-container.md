---
title: Définir des variables d'environnement pour un Container 
content_type: task
weight: 20
---

<!-- overview -->

Cette page montre comment définir des variables d'environnement pour un 
container au sein d'un Pod Kubernetes.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Définir une variable d'environnement pour un container

Lorsque vous créez un Pod, vous pouvez définir des variables d'environnement
pour les containers qui seront exécutés au sein du Pod.
Pour les définir, utilisez le champ `env` ou `envFrom`
dans le fichier de configuration.

Dans cet exercice, vous allez créer un Pod qui exécute un container. Le fichier de configuration pour ce Pod contient une variable d'environnement s'appelant `DEMO_GREETING` et sa valeur est `"Hello from the environment"`. Voici le fichier de configuration du Pod:

{{% codenew file="pods/inject/envars.yaml" %}}

1. Créez un Pod à partir de ce fichier:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
   ```

1. Listez les Pods:

   ```shell
   kubectl get pods -l purpose=demonstrate-envars
   ```

   Le résultat sera similaire à celui-ci:

   ```
   NAME            READY     STATUS    RESTARTS   AGE
   envar-demo      1/1       Running   0          9s
   ```

1. Listez les variables d'environnement au sein du container:

   ```shell
   kubectl exec envar-demo -- printenv
   ```

   Le résultat sera similaire à celui-ci:

   ```
   NODE_VERSION=4.4.2
   EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
   HOSTNAME=envar-demo
   ...
   DEMO_GREETING=Hello from the environment
   DEMO_FAREWELL=Such a sweet sorrow
   ```

{{< note >}}
Les variables d'environnement définies dans les champs `env` ou `envFrom`
écraseront les variables définies dans l'image utilisée par le container.
{{< /note >}}

{{< note >}}
Une variable d'environnement peut faire référence à une autre variable,
cependant l'ordre de déclaration est important. Une variable faisant référence
à une autre doit être déclarée après la variable référencée.
De plus, il est recommandé d'éviter les références circulaires.
{{< /note >}}

## Utilisez des variables d'environnement dans la configuration

Les variables d'environnement que vous définissez dans la configuration d'un Pod peuvent être utilisées à d'autres endroits de la configuration, comme par exemple dans les commandes et arguments pour les containers.
Dans l'exemple ci-dessous, les variables d'environnement `GREETING`, `HONORIFIC`, et
`NAME`  ont des valeurs respectives de `Warm greetings to`, `The Most
Honorable`, et `Kubernetes`. Ces variables sont ensuites utilisées comme arguments
pour le container `env-print-demo`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: print-greeting
spec:
  containers:
  - name: env-print-demo
    image: bash
    env:
    - name: GREETING
      value: "Warm greetings to"
    - name: HONORIFIC
      value: "The Most Honorable"
    - name: NAME
      value: "Kubernetes"
    command: ["echo"]
    args: ["$(GREETING) $(HONORIFIC) $(NAME)"]
```

Une fois le Pod créé, la commande `echo Warm greetings to The Most Honorable Kubernetes` sera exécutée dans le container.

## {{% heading "whatsnext" %}}

* En savoir plus sur les [variables d'environnement](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Apprendre à [utiliser des secrets comme variables d'environnement](/docs/concepts/configuration/secret/#using-secrets-as-environment-variables).
* Voir la documentation de référence pour [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).

