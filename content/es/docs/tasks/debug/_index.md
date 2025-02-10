---
title: "Monitoreo, Logging y Depuración"
description: Configurar el monitoreo y el logging para solucionar problemas de un clúster o depurar una aplicación en contenedores.
weight: 40
#reviewers:
content_type: concept
no_list: true
card:
  name: tasks
  weight: 999
  title: Obteniendo Ayuda
---

<!-- overview -->

A veces las cosas salen mal. Esta guía tiene como objetivo solucionarlas. Tiene
dos secciones:

* [Depuración de tu aplicación](/docs/tasks/debug/debug-application/) - Útil
para usuarios que están implementando código en Kubernetes y se preguntan por qué no funciona.
* [Depuración de tu clúster](/docs/tasks/debug/debug-cluster/) - Útil
para administradores de clústeres y personas cuyo clúster de Kubernetes no funciona correctamente.

También debe comprobar los problemas conocidos del [release](https://github.com/kubernetes/kubernetes/releases)
usado.

<!-- body -->

## Obteniendo Ayuda

Si ninguna de las guías anteriores resuelve su problema, existen varias formas de obtener ayuda de la comunidad de Kubernetes.

### Preguntas

La documentación de este sitio ha sido estructurada para brindar respuestas a una amplia gama de preguntas. [Conceptos](/es/docs/concepts/) explican la arquitectura de Kubernetes
y cómo funciona cada componente, mientras [Configuración](/es/docs/setup/) proporciona
instrucciones prácticas para empezar. [Tareas](/es/docs/tasks/) muestran cómo
realizar tareas de uso común, y [Tutoriales](/es/docs/tutorials/) son recorridos más completos de escenarios de desarrollo reales, específicos de la industria o de extremo a extremo. La sección de [Referencia](/es/docs/reference/) proporciona
documentación detallada sobre el [Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
y las interfaces de línea de comandos (CLIs), tal como [`kubectl`](/es/docs/reference/kubectl/).

## ¡Ayuda! ¡Mi pregunta no está tratada! ¡Necesito ayuda ahora!

### Stack Exchange, Stack Overflow o Server Fault {#stack-exchange}

Si tienes preguntas relacionadas con *desarrollo de software* para tu aplicación en contenedores,
puedes preguntar en [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes).

Si tienes preguntas sobre Kubernetes relacionadas con *administración de clústeres* o *configuración*,
puedes preguntar en [Server Fault](https://serverfault.com/questions/tagged/kubernetes).

También hay varios sitios de Stack Exchange que podrían ser el lugar adecuado para hacer preguntas sobre Kubernetes en áreas como
[DevOps](https://devops.stackexchange.com/questions/tagged/kubernetes), 
[Ingeniería de Software](https://softwareengineering.stackexchange.com/questions/tagged/kubernetes),
o [InfoSec](https://security.stackexchange.com/questions/tagged/kubernetes).

Es posible que otra persona de la comunidad ya haya hecho una pregunta similar o
pueda ayudar con su problema.

El equipo de Kubernetes también monitoreará
[publicaciones etiquetadas con Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes).
Si no hay ninguna pregunta existente que te ayude, **asegúrate de que tu pregunta
sea [sobre el tema en Stack Overflow](https://stackoverflow.com/help/on-topic),
[Server Fault](https://serverfault.com/help/on-topic), o el Stack Exchange 
correcto en el que estás preguntando**, y lee las instrucciones sobre 
[Cómo hacer una nueva pregunta](https://stackoverflow.com/help/how-to-ask),
antes de preguntar una nueva!

### Slack

Muchas personas de la comunidad de Kubernetes se reúnen en Kubernetes Slack en el canal `#kubernetes-users`.
Slack requiere registro; puedes [solicitar una invitación](https://slack.kubernetes.io), el registro está abierto a todos. No dudes en participar y hacer todas y cada una de las preguntas.
Una vez registrado, ingresa a la [Organización de Kubernetes en Slack](https://kubernetes.slack.com)
a través de tu navegador web o mediante la aplicación dedicada de Slack.

Una vez que estés registrado, explora la creciente lista de canales para diversos temas de
interés. Por ejemplo, las personas nuevas en Kubernetes también pueden querer unirse al canal
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice). Como otro ejemplo, los desarrolladores deberían unirse al canal
[`#kubernetes-contributors`](https://kubernetes.slack.com/messages/kubernetes-contributors).

También hay muchos canales en idiomas locales o específicos de cada país. Siéntete libre de unirte a
estos canales para obtener soporte e información localizados:

{{< table caption="País / Idioma en el canal de Slack" >}}
Región | Canal(es)
:---------|:------------
China | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users), [`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
Finlandia | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
Francia | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users), [`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
Alemania | [`#de-users`](https://kubernetes.slack.com/messages/de-users), [`#de-events`](https://kubernetes.slack.com/messages/de-events)
India | [`#in-users`](https://kubernetes.slack.com/messages/in-users), [`#in-events`](https://kubernetes.slack.com/messages/in-events)
Italia | [`#it-users`](https://kubernetes.slack.com/messages/it-users), [`#it-events`](https://kubernetes.slack.com/messages/it-events)
Japon | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users), [`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
Corea | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
Países Bajos | [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
Noruega | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
Polonia | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
Rusia | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
Países Hispanos | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
Suecia | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
Turquia | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users), [`#tr-events`](https://kubernetes.slack.com/messages/tr-events)
{{< /table >}}

### Foro

Te invitamos a unirte al Foro oficial de Kubernetes: [discuss.kubernetes.io](https://discuss.kubernetes.io).

### Bugs y solicitudes de funcionalidades

Si tienes lo que parece ser un error (bug) o deseas realizar una solicitud de funcionalidades,
por favor utiliza el [sistema de seguimiento de asuntos en el GitHub](https://github.com/kubernetes/kubernetes/issues).

Antes de presentar un problema, busca problemas existentes para ver si tu problema ya está cubierto.

Si presenta un error, incluya información detallada sobre cómo reproducir el
problema, como por ejemplo:

* Versión de Kubernetes: `kubectl version`
* Proveedor de nube, distribución del sistema operativo, configuración de red y versión del contenedor runtime
* Pasos para reproducir el problema

