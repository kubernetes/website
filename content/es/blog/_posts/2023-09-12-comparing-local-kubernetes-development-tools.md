---
layout: blog
title: 'Comparación de Herramientas de Desarrollo Local de Kubernetes: Telepresence, Gefyra y mirrord'
date: 2023-09-12
slug: local-k8s-development-tools
---

**Author:** Eyal Bukchin (MetalBear)

El ciclo de desarrollo de Kubernetes es un panorama en evolución con una miríada de herramientas que buscan optimizar el proceso. Cada herramienta tiene su enfoque único, y la elección a menudo se reduce a los requisitos del proyecto individual, la experiencia del equipo y el flujo de trabajo preferido.

Entre las diversas soluciones, ha surgido una categoría que hemos denominado "Herramientas de Desarrollo Local K8S", que busca mejorar la experiencia de desarrollo en Kubernetes conectando componentes que se ejecutan localmente con el clúster de Kubernetes. Esto facilita la prueba rápida de nuevo código en condiciones de nube, eludiendo el ciclo tradicional de Dockerización, CI (Integración Continua) y despliegue.

En esta publicación, comparamos tres soluciones en esta categoría: Telepresence, Gefyra y nuestro propio contendiente, mirrord.

## Telepresence
La solución más antigua y consolidada en la categoría, [Telepresence](https://www.telepresence.io/) utiliza una VPN (o más específicamente, un dispositivo tun) para conectar la máquina del usuario (o un contenedor ejecutado localmente) y la red del clúster. Luego soporta la intercepción del tráfico entrante a un servicio específico en el clúster, y su redirección a un puerto local. El tráfico que se redirige también puede ser filtrado para evitar interrumpir completamente el servicio remoto. También ofrece características complementarias para soportar el acceso a archivos (montando localmente un volumen montado en un pod) e importar variables de entorno.
Telepresence requiere la instalación de un demonio local en la máquina del usuario (que requiere privilegios de root) y un componente Traffic Manager en el clúster. Además, ejecuta un Agente como un sidecar en el pod para interceptar el tráfico deseado.

## Gefyra
[Gefyra](https://gefyra.dev/), similar a Telepresence, utiliza una VPN para conectarse al clúster. Sin embargo, solo soporta conectar contenedores Docker que se ejecutan localmente al clúster. Este enfoque mejora la portabilidad entre diferentes sistemas operativos y configuraciones locales. Sin embargo, la desventaja es que no soporta código no contenerizado ejecutado de forma nativa.

Gefyra se centra principalmente en el tráfico de red, dejando sin soporte el acceso a archivos y las variables de entorno. A diferencia de Telepresence, no modifica las cargas de trabajo en el clúster, asegurando un proceso de limpieza directo si las cosas no salen bien.

## mirrord
La herramienta más nueva de las tres, [mirrord](https://mirrord.dev/), adopta un enfoque diferente al inyectarse en el binario local (utilizando LD_PRELOAD en Linux o DYLD_INSERT_LIBRARIES en macOS) y sobrescribir las llamadas a funciones libc, las cuales posteriormente redirige a un agente temporal que ejecuta en el clúster. Por ejemplo, cuando el proceso local intenta leer un archivo, mirrord intercepta esa llamada y la envía al agente, que luego lee el archivo desde el pod remoto. Este método permite que mirrord cubra todas las entradas y salidas al proceso, abarcando el acceso a la red, el acceso a archivos y las variables de entorno de manera uniforme.

Al trabajar a nivel de proceso, mirrord soporta la ejecución de múltiples procesos locales simultáneamente, cada uno en el contexto de su respectivo pod en el clúster, sin requerir que estén contenerizados y sin necesidad de permisos root en la máquina del usuario.

## Summary

<table>
<caption>Comparativa de Telepresence, Gefyra y mirrord</caption>
<thead>
<tr>
<td class="empty"></td>
<th>Telepresence</th>
<th>Gefyra</th>
<th>mirrord</th>
</tr>
</thead>
<tbody>
<tr>
<th scope="row">Ámbito de conexión al clúster</th>
<td>Máquina entera o contenedor</td>
<td>Contenedor</td>
<td>Proceso</td>
</tr>
<tr>
<th scope="row">Soporte de sistema operativo para desarrolladores</th>
<td>Linux, macOS, Windows</td>
<td>Linux, macOS, Windows</td>
<td>Linux, macOS, Windows (WSL)</td>
</tr>
<tr>
<th scope="row">Características del tráfico entrante</th>
<td>Intercepción</td>
<td>Intercepción</td>
<td>Intercepción o duplicación</td>
</tr>
<tr>
<th scope="row">Acceso a archivos</th>
<td>Soportado</td>
<td>No soportado</td>
<td>Soportado</td>
</tr>
<tr>
<th scope="row">Variables de entorno</th>
<td>Soportado</td>
<td>No soportado</td>
<td>Soportado</td>
</tr>
<tr>
<th scope="row">Requiere root local</th>
<td>Sí</td>
<td>No</td>
<td>No</td>
</tr>
<tr>
<th scope="row">Cómo usar</th>
<td><ul><li>CLI</li><li>Extensión de Docker Desktop</li></ul></td>
<td><ul><li>CLI</li><li>Extensión de Docker Desktop</li></ul></td>
<td><ul><li>CLI</li><li>Extensión de Visual Studio Code</li><li>Plugin de IntelliJ</li></ul></td>
</tr>
</tbody>
</table>



## Conclusion
Telepresence, Gefyra y mirrord ofrecen enfoques únicos para optimizar el ciclo de desarrollo de Kubernetes, cada uno con sus fortalezas y debilidades. Telepresence es rico en características pero viene con complejidades, mirrord ofrece una experiencia fluida y soporta diversas funcionalidades, mientras que Gefyra apunta a la simplicidad y robustez.

Tu elección entre ellos debe depender de los requisitos específicos de tu proyecto, la familiaridad de tu equipo con las herramientas y el flujo de trabajo de desarrollo deseado. Independientemente de la herramienta que elijas, creemos que el enfoque de desarrollo local de Kubernetes puede proporcionar una solución fácil, efectiva y económica a los cuellos de botella del ciclo de desarrollo de Kubernetes, y se volverá aún más prevalente a medida que estas herramientas continúen innovando y evolucionando.