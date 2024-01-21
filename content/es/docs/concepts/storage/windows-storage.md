---
reviewers:
  - ramrodo
  - krol3
  - electrocucaracha
title: Almacenamiento en Windows
content_type: concept
weight: 110
---

<!-- overview -->

Esta página proporciona una descripción general del almacenamiento específico para el sistema operativo Windows.

<!-- body -->

## Almacenamiento persistente {#storage}

Windows tiene un controlador de sistema de archivos en capas para montar las capas del contenedor y crear un sistema de archivos de copia basado en NTFS. Todas las rutas de archivos en el contenedor se resuelven únicamente dentro del contexto de ese contenedor.

- Con Docker, los montajes de volumen solo pueden apuntar a un directorio en el contenedor y no a un archivo individual. Esta limitación no se aplica a containerd.

- Los montajes de volumen no pueden proyectar archivos o directorios de vuelta al sistema de archivos del host.

- No se admiten sistemas de archivos de solo lectura debido a que siempre se requiere acceso de escritura para el registro de Windows y la base de datos SAM. Sin embargo, se admiten volúmenes de solo lectura.

- Las máscaras y permisos de usuario en los volúmenes no están disponibles. Debido a que la base de datos SAM no se comparte entre el host y el contenedor, no hay un mapeo entre ellos. Todos los permisos se resuelven dentro del contexto del contenedor.

Como resultado, las siguientes funcionalidades de almacenamiento no son compatibles en nodos de Windows:

- Montajes de subruta de volumen: solo es posible montar el volumen completo en un contenedor de Windows
- Montaje de subruta de volumen para secretos
- Proyección de montaje en el host
- Sistema de archivos raíz de solo lectura (los volúmenes mapeados todavía admiten `readOnly`)
- Mapeo de dispositivos de bloque
- Memoria como medio de almacenamiento (por ejemplo, `emptyDir.medium` configurado como `Memory`)
- Características del sistema de archivos como uid/gid; permisos de sistema de archivos de Linux por usuario
- Configuración de [permisos de secretos con DefaultMode](/docs/tasks/inject-data-application/distribute-credentials-secure/#set-posix-permissions-for-secret-keys) (debido a la dependencia de UID/GID)
- Soporte de almacenamiento/volumen basado en NFS
- Ampliación del volumen montado (resizefs)

Los {{< glossary_tooltip text="volúmenes" term_id="volume" >}} de Kubernetes habilitan la implementación de aplicaciones complejas, con requisitos de persistencia de datos y uso compartido de volúmenes de Pod, en Kubernetes.
La gestión de volúmenes persistentes asociados a un backend o protocolo de almacenamiento específico incluye acciones como la provisión/desprovisión/redimensión de volúmenes, la conexión/desconexión de un volumen de/para un nodo de Kubernetes, y el montaje/desmontaje de un volumen de/para contenedores individuales en un Pod que necesita persistir datos.

Los componentes de gestión de volúmenes se envían como [plugin](/docs/concepts/storage/volumes/#volume-types) de volumen de Kubernetes.
Las siguiente variedad de clases de plugins de volumen de Kubernetes son compatibles en Windows:

- [`FlexVolume plugins`](/docs/concepts/storage/volumes/#flexvolume)

  - Ten en cuenta que los FlexVolumes han sido descontinuados a partir de la versión 1.23.

- [`CSI Plugins`](/docs/concepts/storage/volumes/#csi)

##### Plugins de volumen incorporados

Los siguientes plugins incorporados admiten almacenamiento persistente en nodos de Windows:

- [`azureFile`](/docs/concepts/storage/volumes/#azurefile)
- [`gcePersistentDisk`](/docs/concepts/storage/volumes/#gcepersistentdisk)
- [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume)
