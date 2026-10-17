---
title: Contribuir con contenido nuevo
content_type: concept
main_menu: true
weight: 25
simple_list: true # for whatsnext section
---



<!-- overview -->

Esta sección contiene información que debes conocer antes de contribuir con
contenido nuevo.

También hay páginas dedicadas sobre el envío de [estudios de caso](/es/docs/contribute/new-content/case-studies)
y [artículos de blog](/es/docs/contribute/blog/).

<!-- body -->

## Flujo de trabajo para contenido nuevo

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->
{{< mermaid >}}
flowchart LR 
    subgraph second[Antes de comenzar]
    direction TB
    S[ ] -.-
    A[Firmar el CLA de CNCF] --> B[Elegir rama de Git]
    B --> C[Un idioma por PR]
    C --> F[Consultar herramientas<br>para contribuidores]
    end
    subgraph first[Conceptos básicos de contribución]
    direction TB
       T[ ] -.-
       D[Escribir docs en markdown<br>y compilar sitio con Hugo] --- E[fuente en GitHub]
       E --- G[La carpeta '/content/../docs' contiene docs<br>para múltiples idiomas]
       G --- H[Revisar tipos de contenido<br>y shortcodes de Hugo]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}

***Figura - Preparación para contribuir con contenido nuevo***

La figura anterior ilustra la información que debes conocer
antes de enviar contenido nuevo. Los detalles se describen a continuación.



<!-- body -->

## Conceptos básicos de contribución

- Escribe la documentación de Kubernetes en Markdown y compila el sitio de Kubernetes
  utilizando [Hugo](https://gohugo.io/).
- La documentación de Kubernetes utiliza [CommonMark](https://commonmark.org/) como su variante de Markdown.
- El código fuente está en [GitHub](https://github.com/kubernetes/website). Puedes encontrar la
  documentación de Kubernetes en `/content/en/docs/`. Parte de la documentación de referencia
  se genera automáticamente a partir de scripts en el directorio `update-imported-docs/`.
- Los [Tipos de contenido de página](/es/docs/contribute/style/page-content-types/) describen la
  presentación del contenido de la documentación en Hugo.
- Puedes utilizar los [shortcodes de Docsy](https://www.docsy.dev/docs/adding-content/shortcodes/) o los [shortcodes personalizados de Hugo](/es/docs/contribute/style/hugo-shortcodes/) para contribuir a la documentación de Kubernetes.
- Además de los shortcodes estándar de Hugo, utilizamos una serie de
  [shortcodes personalizados de Hugo](/es/docs/contribute/style/hugo-shortcodes/) en nuestra
  documentación para controlar la presentación del contenido.
- El código fuente de la documentación está disponible en varios idiomas en `/content/`. Cada
  idioma tiene su propia carpeta con un código de dos letras determinado por el
  [estándar ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php). Por ejemplo, el código fuente de la documentación en inglés se almacena en `/content/en/docs/`.
- Para obtener más información sobre cómo contribuir a la documentación en varios idiomas
  o iniciar una nueva traducción,
  consulta [localización](/es/docs/contribute/localization).

## Antes de comenzar

### Firmar el CLA de CNCF

Todos los colaboradores de Kubernetes **deben** leer
la [Guía del colaborador](https://github.com/kubernetes/community/blob/main/contributors/guide/README.md)
y [firmar el Acuerdo de Licencia de Colaborador (CLA)](https://github.com/kubernetes/community/blob/main/CLA.md).

Las solicitudes de extracción (pull requests) de colaboradores que no hayan firmado el CLA no superarán las
pruebas automatizadas. El nombre y correo electrónico proporcionados deben coincidir con los configurados en
tu `git config`, y tu nombre y correo en Git deben coincidir con los utilizados para el
CLA de CNCF.

### Elegir qué rama de Git utilizar

Al abrir una solicitud de extracción, debes saber con anticipación en qué rama basar
tu trabajo.

Escenario | Rama
:---------|:------------
Contenido existente o nuevo en inglés para la versión actual | `main`
Contenido para un lanzamiento de cambio de característica | La rama correspondiente a la versión mayor y menor en la que se encuentra el cambio de característica, siguiendo el patrón `dev-<version>`. Por ejemplo, si una característica cambia en la versión `v{{< skew nextMinorVersion >}}`, añade los cambios de documentación a la rama `dev-{{< skew nextMinorVersion >}}`.
Contenido en otros idiomas (localizaciones) | Utiliza la convención de la localización. Consulta la [Estrategia de ramificación de localización](/es/docs/contribute/localization/#branch-strategy) para obtener más información.

Si aún no estás seguro de qué rama elegir, pregunta en `#sig-docs` en Slack.

{{< note >}} Si ya enviaste tu solicitud de extracción y te das cuenta de que la
rama base era incorrecta, tú (y solo tú, el autor) puedes cambiarla. {{<
/note >}}

### Idiomas por PR

Limita las solicitudes de extracción a un solo idioma por PR. Si necesitas realizar un
cambio idéntico en el mismo ejemplo de código en varios idiomas, abre un PR independiente para
cada idioma.

## Herramientas para contribuidores

El directorio de [herramientas para colaboradores de documentación](https://github.com/kubernetes/website/tree/main/content/en/docs/doc-contributor-tools)
en el repositorio `kubernetes/website` contiene herramientas para facilitar tu proceso de contribución.

## {{% heading "whatsnext" %}}

<!-- relies on simple_list: true in front matter for remaining links -->
* Lee sobre el envío de [artículos de blog](/es/docs/contribute/blog/article-submission/).
