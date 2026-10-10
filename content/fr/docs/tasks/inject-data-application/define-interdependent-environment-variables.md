---
title: Définir des variables d'environnement dépendantes
content_type: task
weight: 20
---

<!-- overview -->

Cette page montre comment définir des variables d'environnement 
interdépendantes pour un container dans un Pod Kubernetes.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}


<!-- steps -->

## Définir une variable d'environnement dépendante pour un container

Lorsque vous créez un Pod, vous pouvez configurer des variables d'environnement interdépendantes pour les containers exécutés dans un Pod.
Pour définir une variable d'environnement dépendante, vous pouvez utiliser le format $(VAR_NAME) dans le champ `value` de la spécification `env` dans le fichier de configuration.

Dans cette exercice, vous allez créer un Pod qui exécute un container. Le fichier de configuration de ce Pod définit des variables d'environnement interdépendantes avec une ré-utilisation entre les différentes variables. Voici le fichier de configuration de ce Pod:

{{% codenew file="pods/inject/dependent-envars.yaml" %}}

1. Créez un Pod en utilisant ce fichier de configuration:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/dependent-envars.yaml
   ```
   ```
   pod/dependent-envars-demo created
   ```

2. Listez le Pod:

   ```shell
   kubectl get pods dependent-envars-demo
   ```
   ```
   NAME                      READY     STATUS    RESTARTS   AGE
   dependent-envars-demo     1/1       Running   0          9s
   ```

3. Affichez les logs pour le container exécuté dans votre Pod:

   ```shell
   kubectl logs pod/dependent-envars-demo
   ```
   ```

   UNCHANGED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   SERVICE_ADDRESS=https://172.17.0.1:80
   ESCAPED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   ```

Comme montré ci-dessus, vous avez défini une dépendance correcte pour `SERVICE_ADDRESS`, une dépendance manquante pour `UNCHANGED_REFERENCE`, et avez ignoré la dépendance pour `ESCAPED_REFERENCE`.

Lorsqu'une variable d'environnement est déja définie alors 
qu'elle est référencée par une autre variable, la référence s'effectue
correctement, comme dans l'exemple de `SERVICE_ADDRESS`.

Il est important de noter que l'ordre dans la liste `env` est important. 
Une variable d'environnement ne sera pas considérée comme "définie" 
si elle est spécifiée plus bas dans la liste. C'est pourquoi
`UNCHANGED_REFERENCE` ne résout pas correctement `$(PROTOCOL)` dans l'exemple précédent.

Lorsque la variable d'environnement n'est pas définie, ou n'inclut qu'une partie des variables, la variable non définie sera traitée comme une chaine de caractères, par exemple `UNCHANGED_REFERENCE`. Notez que les variables d'environnement malformées n'empêcheront généralement pas le démarrage du conteneur.

La syntaxe `$(VAR_NAME)` peut être échappée avec un double `$`, par exemple `$$(VAR_NAME)`.
Les références échappées ne sont jamais développées, que la variable référencée
soit définie ou non. C'est le cas pour l'exemple `ESCAPED_REFERENCE` ci-dessus.

## {{% heading "whatsnext" %}}


* En savoir plus sur les [variables d'environnement](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Lire la documentation pour [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).

