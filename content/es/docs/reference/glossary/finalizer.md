---
title: Finalizador
id: finalizer
full_link: /docs/concepts/overview/working-with-objects/finalizers/
short_description: >
  Un atributo de un namespace que dicta a Kubernetes a esperar hasta que condiciones
  específicas son satisfechas antes que pueda borrar un objeto marcado para eliminación.
aka: 
tags:
- fundamental
---
Los finalizadores son atributos de un namespace que instruyen a Kubernetes a
esperar a que ciertas condiciones sean satisfechas antes que pueda borrar
definitivamente un objeto que ha sido marcado para eliminarse.
Los finalizadores alertan a los {{<glossary_tooltip text="controladores" term_id="controller">}}
para borrar recursos que poseían esos objetos eliminados.

<!--more-->

Cuando instruyes a Kubernetes a borrar un objeto que tiene finalizadores
especificados, la API de Kubernetes marca ese objeto para eliminación
configurando el campo `metadata.deletionTimestamp`, y retorna un código de
estado `202` (HTTP "Aceptado"). 
El objeto a borrar permanece en un estado
de terminación mientras el plano de control, u otros componentes, ejecutan
las acciones definidas en los finalizadores.
Luego de que esas acciones son completadas, el controlador borra los 
finalizadores relevantes del objeto. Cuando el campo `metadata.finalizers`
está vacío, Kubernetes considera el proceso de eliminación completo y borra
el objeto.

Puedes utilizar finalizadores para controlar {{<glossary_tooltip text="garbage collection" term_id="garbage-collection">}}
de recursos. Por ejemplo, puedes definir un finalizador para borrar recursos
relacionados o infraestructura antes que el controlador elimine el objeto.