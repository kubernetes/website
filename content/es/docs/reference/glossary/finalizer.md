---
title: Finalizador
id: finalizer
date: 2021-07-07
full_link: /docs/concepts/overview/working-with-objects/finalizers/
short_description: >
  Un atributo de un namespace que dicta a Kubernetes a esperar hasta que condiciones
  especificas son satisfechas antes que pueda borrar un objeto marcado para eliminacion.
aka: 
tags:
- fundamental
---
Los finalizadores son atributos de un namespace que instruyen a Kubernetes a
esperar a que ciertas condiciones sean satisfechas antes que pueda borrar
definitivamente un objeto que ha sido marcado para eliminarse.
Los finalizadores alertan a los {{<glossary_tooltip text="controladores" term_id="controller">}}
para borrar recursos que poseian esos objetos eliminados.

<!--more-->

Cuando instruyes a Kubernetes a borrar un objeto que tiene finalizadores
especificados, la API de Kubernetes marca ese objeto para eliminacion
configurando el campo `metadata.deletionTimestamp`, y retorna un codigo de
estado `202` (HTTP "Aceptado"). 
El objeto a borrar permanece en un estado
de terminacion mientras el plano de contol, u otros componentes, ejecutan
las acciones definidas en los finalizadores.
Luego de que esas acciones son completadas, el controlador borra los 
finalizadores relevantes del objeto. Cuando el campo `metadata.finalizers`
esta vacio, Kubernetes considera el proceso de eliminacion completo y borra
el objeto.

Puedes utilizar finalizadores para controlar {{<glossary_tooltip text="garbage collection" term_id="garbage-collection">}}
de recursos. Por ejemplo, puedes definir un finalizador para borrar recursos
relacionados o infraestructura antes que el controlador elimine el objeto.