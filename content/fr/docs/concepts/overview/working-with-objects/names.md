---
title: Noms et identifiants d'objets
content_type: concept
weight: 30
---

<!-- overview -->

Chaque {{< glossary_tooltip text="objet" term_id="object" >}} dans votre cluster a un [_Nom_](#names) qui est unique pour ce type de ressource.
Chaque objet Kubernetes a également un [_UID_](#uids) qui est unique dans l'ensemble de votre cluster.

Par exemple, vous ne pouvez avoir qu'un seul Pod nommé `myapp-1234` dans le même [namespace](/fr/docs/concepts/overview/working-with-objects/namespaces/), mais vous pouvez avoir un Pod et un Déploiement qui sont chacun nommés `myapp-1234`.

Pour les attributs fournis par l'utilisateur qui ne sont pas uniques, Kubernetes fournit des [labels](/fr/docs/concepts/overview/working-with-objects/labels/) et des [annotations](/fr/docs/concepts/overview/working-with-objects/annotations/).

<!-- body -->

## Noms

{{< glossary_definition term_id="name" length="all" >}}

**Les noms doivent être uniques pour toutes les [versions d'API](/fr/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning)
de la même ressource. Les ressources API sont distinguées par leur groupe API, leur type de ressource, leur label
(pour les ressources avec label) et leur nom. En d'autres termes, la version de l'API est sans importance dans ce contexte.**

{{<note>}}
Dans les cas où les objets représentent une entité physique, comme un Noeud représentant un hôte physique, lorsque l'hôte est recréé sous le même nom sans supprimer et recréer le Noeud, Kubernetes considère le nouvel hôte comme l'ancien, ce qui peut entraîner des incohérences.
{{</note>}}

Voici quatre types de contraintes de nom couramment utilisées pour les ressources.

### Noms de sous-domaine DNS

La plupart des types de ressources nécessitent un nom qui peut être utilisé comme un sous-domaine DNS
tel que défini dans [RFC 1123](https://tools.ietf.org/html/rfc1123).
Cela signifie que le nom doit :

- ne pas contenir plus de 253 caractères
- contenir uniquement des caractères alphanumériques minuscules, '-' ou '.'
- commencer par un caractère alphanumérique
- se terminer par un caractère alphanumérique

### Noms de label RFC 1123 {#dns-label-names}

Certains types de ressources nécessitent que leurs noms suivent la norme des labels DNS
telle que définie dans [RFC 1123](https://tools.ietf.org/html/rfc1123).
Cela signifie que le nom doit :

- contenir au maximum 63 caractères
- contenir uniquement des caractères alphanumériques minuscules ou '-'
- commencer par un caractère alphanumérique
- se terminer par un caractère alphanumérique

### Noms de label RFC 1035

Certains types de ressources nécessitent que leurs noms suivent la norme des labels DNS
telle que définie dans [RFC 1035](https://tools.ietf.org/html/rfc1035).
Cela signifie que le nom doit :

- contenir au maximum 63 caractères
- contenir uniquement des caractères alphanumériques minuscules ou '-'
- commencer par un caractère alphabétique
- se terminer par un caractère alphanumérique

{{<note>}}
La seule différence entre les normes des labels RFC 1035 et RFC 1123
est que les labels RFC 1123 sont autorisées à
commencer par un chiffre, tandis que les labels RFC 1035 ne peuvent commencer
qu'avec une lettre alphabétique minuscule.
{{</note>}}

### Noms de segment de chemin

Certains types de ressources nécessitent que leurs noms puissent être encodés en toute sécurité en tant que
segment de chemin. En d'autres termes, le nom ne peut pas être "." ou ".." et le nom ne peut
pas contenir "/" ou "%".

Voici un exemple de manifeste pour un Pod nommé `nginx-demo`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

{{<note>}}
Certains types de ressources ont des restrictions supplémentaires sur leurs noms.
{{</note>}}

## UIDs

{{< glossary_definition term_id="uid" length="all" >}}

Les UIDs Kubernetes sont des identifiants universellement uniques (également connus sous le nom d'UUID).
Les UUID sont normalisés selon ISO/IEC 9834-8 et ITU-T X.667.


## {{% heading "whatsnext" %}}

* Lisez à propos des [labels](/fr/docs/concepts/overview/working-with-objects/labels/) et des [annotations](/fr/docs/concepts/overview/working-with-objects/annotations/) dans Kubernetes.
* Consultez le document de conception [Identifiers and Names in Kubernetes](https://git.k8s.io/design-proposals-archive/architecture/identifiers.md).

