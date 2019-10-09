---
title: Support de JSONPath
description: JSONPath kubectl Kubernetes
content_template: templates/concept
weight: 25
---

{{% capture overview %}}
Kubectl prend en charge les modèles JSONPath.
{{% /capture %}}

{{% capture body %}}

Un modèle JSONPath est composé d'expressions JSONPath entourées par des accolades {}.
Kubectl utilise les expressions JSONPath pour filtrer sur des champs spécifiques de l'objet JSON et formater la sortie.
En plus de la syntaxe de modèle JSONPath originale, les fonctions et syntaxes suivantes sont valides :


1. Utilisez des guillemets doubles pour marquer du texte dans les expressions JSONPath.
2. Utilisez les opérateurs `range` et `end` pour itérer sur des listes.
3. Utilisez des indices négatifs pour parcourir une liste à reculons. Les indices négatifs ne "bouclent pas" sur une liste et sont valides tant que  `-index + longeurListe >= 0`.

{{< note >}}

- L'opérateur `$` est optionnel, l'expression commençant toujours, par défaut, à la racine de l'objet.

- L'objet résultant est affiché via sa fonction String().

{{< /note >}}

Étant donné l'entrée JSON :

```json
{
  "kind": "List",
  "items":[
    {
      "kind":"None",
      "metadata":{"name":"127.0.0.1"},
      "status":{
        "capacity":{"cpu":"4"},
        "addresses":[{"type": "LegacyHostIP", "address":"127.0.0.1"}]
      }
    },
    {
      "kind":"None",
      "metadata":{"name":"127.0.0.2"},
      "status":{
        "capacity":{"cpu":"8"},
        "addresses":[
          {"type": "LegacyHostIP", "address":"127.0.0.2"},
          {"type": "another", "address":"127.0.0.3"}
        ]
      }
    }
  ],
  "users":[
    {
      "name": "myself",
      "user": {}
    },
    {
      "name": "e2e",
      "user": {"username": "admin", "password": "secret"}
    }
  ]
}
```

Fonction            | Description                | Exemple                                                         | Résultat
--------------------|----------------------------|-----------------------------------------------------------------|------------------
`text`              | le texte en clair          | `le type est {.kind}`                                           | `le type est List`
`@`                 | l'objet courant            | `{@}`                                                           | identique à l'entrée
`.` ou `[]`         | opérateur fils             | `{.kind}` ou `{['kind']}`                                       | `List`
`..`                | descente récursive         | `{..name}`                                                      | `127.0.0.1 127.0.0.2 myself e2e`
`*`                 | joker. Tous les objets     | `{.items[*].metadata.name}`                                     | `[127.0.0.1 127.0.0.2]`
`[start:end :step]` | opérateur d'indice         | `{.users[0].name}`                                              | `myself`
`[,]`               | opérateur d'union          | `{.items[*]['metadata.name', 'status.capacity']}`               | `127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]`
`?()`               | filtre                     | `{.users[?(@.name=="e2e")].user.password}`                      | `secret`
`range`, `end`      | itération de liste         | `{range .items[*]}[{.metadata.name}, {.status.capacity}] {end}` | `[127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]]`
`''`                | protège chaîne interprétée | `{range .items[*]}{.metadata.name}{'\t'}{end}`                  | `127.0.0.1    127.0.0.2`

Exemples utilisant `kubectl` et des expressions JSONPath :

```shell
kubectl get pods -o json
kubectl get pods -o=jsonpath='{@}'
kubectl get pods -o=jsonpath='{.items[0]}'
kubectl get pods -o=jsonpath='{.items[0].metadata.name}'
kubectl get pods -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.startTime}{"\n"}{end}'
```

Sous Windows, vous devez utiliser des guillemets _doubles_ autour des modèles JSONPath qui contiennent des espaces (et non des guillemets simples comme ci-dessus pour bash). Ceci entraîne que vous devez utiliser un guillemet simple ou un double guillemet échappé autour des chaînes litérales dans le modèle. Par exemple :

```cmd
C:\> kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{'\t'}{.status.startTime}{'\n'}{end}"
C:\> kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{\"\t\"}{.status.startTime}{\"\n\"}{end}"
```

{{% /capture %}}
