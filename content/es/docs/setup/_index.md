---
no_issue: true
title: Setup
main_menu: true
weight: 30
content_template: templates/concept
---

{{% capture overview %}}

En esta sección encontrarás toda la información necesaria para poder identificar
**la solución que mejor se adapta a tus necesidades**.

Decidir dónde ejecutar Kubernetes depende principalmente de los recursos que
tengas disponibles, de las características del clúster y de cuánta flexibilidad
necesites.

Puedes ejecutar Kubernetes casi en cualquier lugar, desde su ordenador portátil
a máquinas virtuales en la nube o en un rack de servidores físicos on-premises.

Puedes configurar un clúster totalmente gestionado ejecutando un solo comando,
desplegar una solución parcialmente automatizada que te ofrezca un poco más de
control o directamente crear tu propio clúster de forma completamente manual
personalizando y controlando cada componente.

{{% /capture %}}

{{% capture body %}}

## Soluciones para la máquina en local

Una solución para la máquina en local es la forma más sencilla de empezar a
utilizar Kubernetes. Puedes crear y probar clústeres de Kubernetes sin tener
que preocuparte por consumir recursos en el cloud ni disponer de conectividad.

Deberías elegir una solución de este tipo si buscas:

* Probar o empezar a aprender sobre Kubernetes.
* Desarrollar y testear clústeres localmente.

## Soluciones gestionadas

Una solución gestionada es la forma más conveniente de crear y gestionar un
clúster de Kubernetes. El proveedor gestiona y opera los clústeres completamente
por lo que tú no has de preocuparte de nada.

Deberías elegir una solución de este tipo si:

* Quieres una solución totalmente gestionada.
* Quieres centrarte en desarrollar tus aplicaciones o servicios.
* No tienes un equipo dedicado de operaciones pero quieres alta disponibilidad.
* No tienes recursos para alojar y monitorizar sus clústeres.

## Soluciones sobre IaaS en la nube

Un solución sobre IaaS en la nube permite crear clústeres Kubernetes con solo
unos pocos comandos, se encuentran en desarrollo activo, tienen el apoyo de la
comunidad y algunas de ellas forman parte del proyecto Kubernetes.
Se pueden desplegar en la infaestructura como servicio (IaaS) proporcionada por
los proveedores en la nube y ofrecen más flexibilidad que las soluciones
gestionadas, pero requieren más conocimientos para ponerlos en marcha y más
esfuerzo para operarlos.

Deberías elegir una solución de este tipo si:

* Necesitas más control que el permitido en las soluciones gestionadas.
* Quieres responsabilizarte de la operativa de los clústeres.

## Soluciones sobre virtualización On-Premises

Una solución sobre virtualización sobre on-premises permite crear clústeres y
operarlos de forma segura en tú nube privada con solo unos pocos comandos.

Deberías elegir una solución de este tipo si:

* Quieres desplegar clústeres en su nube privada dentro de tú red.
* Tienes un equipo de operaciones para desplegar y operar el clúster.
* Tienes los recursos necesarios para ejecutar y monitorizar el clúster.

## Soluciones personalizadas

Una solución personalizadas proporciona total libertad sobre los clústeres
pero requiere más conocimiento y experiencia. 

{{% /capture %}}
