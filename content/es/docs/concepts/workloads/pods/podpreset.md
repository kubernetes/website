---
reviewers:
- raelga
title: Pod Preset
content_type: concept
weight: 50
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.6" state="alpha" >}}

Esta página provee una descripción general de los PodPresets, los cuales son
los objetos que se utilizan para inyectar cierta información en los Pods en
el momento de la creación. Esta información puede incluir secretos, volúmenes,
montajes de volúmenes y variables de entorno.



<!-- body -->
## Entendiendo los Pod Presets

Un PodPreset es un recurso de la API utilizado para poder inyectar requerimientos
adicionales de tiempo de ejecución en un Pod en el momento de la creación.
Se utilizan los [selectores de etiquetas](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
para especificar los Pods a los que se aplica un PodPreset determinado.

El uso de un PodPreset permite a los autores de plantillas de Pods no tener que proporcionar
explícitamente toda la información de cada Pod. De esta manera, los autores de plantillas de
Pods que consuman un determinado servicio no tendrán que conocer todos los detalles de ese servicio.


## Habilitando un PodPreset en su clúster

Con el fin de utilizar los Pod Presets en un clúster debe asegurarse de lo siguiente:

1.  Que se ha configurado el tipo de API `settings.k8s.io/v1alpha1/podpreset`. Esto se puede hacer,
    por ejemplo, incluyendo `settings.k8s.io/v1alpha1=true` como valor de la opción `--runtime-config`
    en el servidor API. En minikube se debe añadir el flag
    `--extra-config=apiserver.runtime-config=settings.k8s.io/v1alpha1=true` cuando el clúster
    se está iniciando.
2.  Que se ha habilitado el controlador de admisión `PodPreset`. Una forma de hacer esto es incluir
    `PodPreset` como valor de la opción `--enable-admission-plugins` especificada
    para el servidor API. En minikube se debe añadir el flag

    ```shell
    --extra-config=apiserver.enable-admission-plugins=NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,NodeRestriction,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,PodPreset
    ```

    cuando el clúster se está iniciando.


## Cómo funciona

Kubernetes provee un controlador de admisión (`PodPreset`) que, cuando está habilitado,
aplica los Pod Presets a las peticiones de creación de Pods entrantes.
Cuando se realiza una solicitud de creación de Pods, el sistema hace lo siguiente:

1. Obtiene todos los `PodPresets` disponibles para usar.
2. Verifica si los selectores de etiquetas de cualquier `PodPreset` correspondan
   con las etiquetas del Pod que se está creando.
3. Intenta fusionar los diversos recursos definidos por el `PodPreset` dentro del Pod
   que se está creando.
4. Si se llegase a producir un error al intentar fusionar los recursos dentro del Pod,
   lanza un evento que documente este error, luego crea el Pod _sin_ ningún recurso que se
   inyecte desde el `PodPreset`.
5. Escribe una nota descriptiva de la especificación de Pod modificada resultante para
   indicar que ha sido modificada por un `PodPreset`. La nota descriptiva presenta la forma
   `podpreset.admission.kubernetes.io/podpreset-<pod-preset name>: "<resource version>"`.

Cada Pod puede ser correspondido por cero o más Pod Presets; y cada `PodPreset` puede ser
aplicado a cero o más Pods. Cuando se aplica un `PodPreset` a una o más Pods, Kubernetes
modifica la especificación del Pod. Para los cambios a `env`, `envFrom`, y `volumeMounts`,
Kubernetes modifica la especificación del Container para todos los Containers en el Pod;
para los cambios a `volumes`, Kubernetes modifica la especificación del Pod.

{{< note >}}
Un Pod Preset es capaz de modificar los siguientes campos en las especificaciones de un Pod
en caso de ser necesario:
- El campo `.spec.containers`.
- El campo `.spec.initContainers`
{{< /note >}}

### Deshabilitar un Pod Preset para un Pod específico

Puede haber casos en los que se desee que un Pod no se vea alterado por ninguna posible
modificación del Pod Preset. En estos casos, se puede añadir una observación en el Pod
`.spec` de la siguiente forma: `podpreset.admission.kubernetes.io/exclude: "true"`.


## {{% heading "whatsnext" %}}


Ver [Inyectando datos en un Pod usando PodPreset](/docs/tasks/inject-data-application/podpreset/)

Para más información sobre los detalles de los trasfondos, consulte la [propuesta de diseño de PodPreset](https://git.k8s.io/design-proposals-archive/service-catalog/pod-preset.md). 
