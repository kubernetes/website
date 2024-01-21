---
title: Nombres
content_type: concept
weight: 20
---

<!-- overview -->

Todos los objetos de la API REST de Kubernetes se identifica de forma inequívoca mediante un Nombre y un UID.

Para aquellos atributos provistos por el usuario que no son únicos, Kubernetes provee de [etiquetas](/docs/user-guide/labels) y [anotaciones](/docs/concepts/overview/working-with-objects/annotations/).

Echa un vistazo al [documento de diseño de identificadores](https://git.k8s.io/design-proposals-archive/architecture/identifiers.md) para información precisa acerca de las reglas sintácticas de los Nombres y UIDs.




<!-- body -->

## Nombres

{{< glossary_definition term_id="name" length="all" >}}

Por regla general, los nombres de los recursos de Kubernetes no deben exceder la longitud máxima de 253 caracteres y deben incluir caracteres alfanuméricos en minúscula, `-`, y `.`; aunque algunos recursos tienen restricciones más específicas.

## UIDs

{{< glossary_definition term_id="uid" length="all" >}}


