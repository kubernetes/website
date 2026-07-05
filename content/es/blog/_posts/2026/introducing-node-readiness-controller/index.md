---
layout: blog
title: "Presentamos Node Readiness Controller"
date: 2026-02-03T10:00:00+08:00
slug: introducing-node-readiness-controller
author: >
  Ajay Sundar Karuppasamy (Google)
---
<img style="float: right; display: inline-block; margin-left: 2em; max-width: 15em;" src="./node-readiness-controller-logo.svg" alt="Logotipo de Node Readiness Controller" />

En el modelo estándar de Kubernetes, que un nodo sea adecuado para ejecutar cargas de trabajo (*workloads*) depende de una única condición binaria: "Ready". Sin embargo, en los entornos modernos de Kubernetes, los nodos requieren dependencias de infraestructura complejas —tales como agentes de red, *drivers* de almacenamiento, *firmware* de GPU o verificaciones de estado (*health checks*) personalizadas— para estar completamente operativos antes de poder albergar Pods de manera confiable.

Hoy, en nombre del proyecto Kubernetes, me complace anunciar el [Node Readiness Controller](https://node-readiness-controller.sigs.k8s.io/).
Este proyecto introduce un sistema declarativo para gestionar los *taints* de los nodos, extendiendo las medidas de seguridad de disponibilidad durante el arranque del nodo, más allá de las condiciones estándar.
Al gestionar dinámicamente los *taints* en función de señales de estado personalizadas, el *controller* garantiza que las cargas de trabajo solo se programen en nodos que cumplan con todos los requisitos específicos de la infraestructura.

## ¿Por qué el Node Readiness Controller?

El estado principal "Ready" del nodo en Kubernetes a menudo resulta insuficiente para clústeres con requisitos de arranque sofisticados. Los operadores suelen tener dificultades para asegurar que ciertos DaemonSets o servicios locales estén saludables antes de que un nodo entre al grupo de programación.

El Node Readiness Controller resuelve esta brecha al permitir a los operadores definir *scheduling gates* personalizados y adaptados a grupos de *nodes* específicos. Esto permite aplicar requisitos de preparación diferenciados a lo largo de *clusters* heterogéneos; asegurando, por ejemplo, que los *nodes* equipados con GPU solo acepten *pods* una vez que se hayan verificado sus *drivers* especializados, mientras que los *nodes* de propósito general siguen una ruta estándar.

Ofrece tres ventajas principales:

- **Definiciones de Readiness personalizadas**: Define qué significa que un nodo esté *listo* (ready) para tu plataforma específica.
- **Gestión automatizada de Taints**: El *controller* aplica o elimina automáticamente los *taints* de los nodos según el estado de sus condiciones, evitando que los Pods caigan en una infraestructura que no está lista.
- **Arranque declarativo de Nodos**: Gestiona la inicialización de los nodos en múltiples pasos de forma confiable, aportando una clara observabilidad al proceso de arranque.

## Conceptos clave y características

El *controller* se basa en la API `NodeReadinessRule` (NRR), la cual permite definir *Gates* declarativos para tus nodos.

### Modos de aplicación flexibles

El *controller* admite dos modos operativos distintos:

Continuous enforcement (Aplicación continua)
: Mantiene activamente la garantía de preparación (*readiness*) a lo largo de todo el ciclo de vida del *node*. Si una dependencia crítica (como el *driver* de un dispositivo) falla más adelante, el *node* se marca inmediatamente con un *taint* para evitar un nuevo *scheduling*.

Bootstrap-only enforcement (Aplicación solo en bootstrap)
: Específico para los pasos de inicialización que ocurren una sola vez, como la descarga previa (*pre-pulling*) de imágenes pesadas o el aprovisionamiento de hardware. Una vez que se cumplen las condiciones, el *controller* marca el *bootstrap* como completado y deja de monitorear esa regla específica para dicho *node*.

### Reporte de condiciones

El *controller* reacciona a las condiciones del nodo (Node Conditions) en lugar de realizar las verificaciones de estado por sí mismo. Este diseño desacoplado le permite integrarse sin problemas con otras herramientas del ecosistema, así como con soluciones personalizadas:

- **[Node Problem Detector](https://github.com/kubernetes/node-problem-detector) (NPD)**: Utiliza tus configuraciones existentes de NPD y *scripts* personalizados para reportar el estado del nodo.
- **Readiness Condition Reporter**: Un agente ligero provisto por el proyecto que puede desplegarse para realizar comprobaciones periódicas en endpoints HTTP locales y actualizar las condiciones del nodo según corresponda.

### Seguridad operativa con Dry Run

Desplegar nuevas reglas de preparación a lo largo de una flota de nodos conlleva un riesgo inherente. Para mitigarlo, el modo *dry run* permite a los operadores simular primero el impacto en el cluster.
En este modo, el *controller* registra las acciones previstas y actualiza el estado (*status*) de la regla para mostrar los *nodes* afectados sin aplicar los *taints* reales, lo que permite una validación segura antes de su aplicación definitiva.

## Ejemplo: Bootstrapping de CNI

El siguiente NodeReadinessRule garantiza que un nodo permanezca no programable (*unschedulable*) hasta que su agente CNI sea funcional. El *controller* monitorea una condición personalizada `cniplugin.example.net/NetworkReady` y solo remueve el *taint* `readiness.k8s.io/acme.com/network-unavailable` una vez que el estado es True.

```yaml
apiVersion: readiness.node.x-k8s.io/v1alpha1
kind: NodeReadinessRule
metadata:
  name: network-readiness-rule
spec:
  conditions:
    - type: "cniplugin.example.net/NetworkReady"
      requiredStatus: "True"
  taint:
    key: "readiness.k8s.io/acme.com/network-unavailable"
    effect: "NoSchedule"
    value: "pending"
  enforcementMode: "bootstrap-only"
  nodeSelector:
    matchLabels:
      node-role.kubernetes.io/worker: ""
```
**Demostración**:

{{< youtube id="hohIIEXlNpo" title="Node Readiness Controller Demo" >}}

## Participa en la comunidad

El Node Readiness Controller apenas está comenzando, con nuestros [lanzamientos iniciales](https://github.com/kubernetes-sigs/node-readiness-controller/releases/tag/v0.1.1) ya disponibles, y estamos buscando comentarios de la comunidad para perfeccionar nuestro mapa de ruta (roadmap). Tras nuestras productivas discusiones en el Unconference de KubeCon NA 2025, estamos entusiasmados por continuar la conversación en persona.

Acompáñanos en KubeCon + CloudNativeCon Europe 2026 en nuestra sesión del maintainer track: *[Addressing Non-Deterministic Scheduling: Introducing the Node Readiness Controller](https://sched.co/2EF6E)*.

Mientras tanto, puedes contribuir o seguir nuestro progreso aquí:

- GitHub: https://sigs.k8s.io/node-readiness-controller
- Slack: Únete a la conversación en [#sig-node-readiness-controller](https://kubernetes.slack.com/messages/sig-node-readiness-controller) 
- Documentación: [Guía de inicio](https://node-readiness-controller.sigs.k8s.io/)