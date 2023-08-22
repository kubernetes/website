---
layout: blog
title: "Kubernetes 1.28: Mejora en el manejo de fallos para Trabajos"
date: 2023-08-21
slug: kubernetes-1-28-jobapi-update
---

**Authors:** Kevin Hannon (G-Research), Michał Woźniak (Google)

Este blog discute dos nuevas características en Kubernetes 1.28 para mejorar Trabajos para usuarios de procesos por lotes: [Política de reemplazo de Pod](/docs/concepts/workloads/controllers/job/#pod-replacement-policy) y [Límite de reintento por índice](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index).

Estas características continúan el esfuerzo iniciado por [la Política de fallo de Pod](/docs/concepts/workloads/controllers/job/#pod-failure-policy) para mejorar el manejo de fallos de Pod en un Trabajo.

## Política de reemplazo de Pod {#pod-replacement-policy}

Por defecto, cuando un pod entra en un estado de terminación (p.ej. debido a la apropiación anticipada o desalojo), Kubernetes crea inmediatamente un Pod de reemplazo. Por lo tanto, ambos Pods están en ejecución al mismo tiempo. En términos de la API, un pod se considera en terminación cuando tiene un `deletionTimestamp` y su fase es `Pending` o `Running`.

El escenario en el que dos Pods están en ejecución al mismo tiempo es problemático para algunos marcos de trabajo populares de aprendizaje automático, como TensorFlow y [JAX](https://jax.readthedocs.io/en/latest/), los cuales requieren que solo haya un Pod en ejecución al mismo tiempo, para un índice dado.
TensorFlow muestra el siguiente error si dos pods están en ejecución para un índice dado.

```
 /job:worker/task:4: Duplicate task registration with task_name=/job:worker/replica:0/task:4
```

Vea más detalles en el ([problema](https://github.com/kubernetes/kubernetes/issues/115844)).

Crear el Pod de reemplazo antes de que el anterior termine completamente también puede causar problemas en clústeres con recursos escasos o con presupuestos ajustados, tales como:
* los recursos del clúster pueden ser difíciles de obtener para Pods pendientes de ser programados, ya que Kubernetes podría tardar mucho tiempo en encontrar nodos disponibles hasta que los Pods existentes estén completamente terminados.
* si el autoescalador del clúster está habilitado, los Pods de reemplazo podrían producir escaladas no deseadas.

### ¿Cómo puede utilizarlo? {#pod-replacement-policy-how-to-use}

Esta es una característica alfa, la cual puede habilitar activando [el interruptor de funcionalidad](/docs/reference/command-line-tools-reference/feature-gates/) `JobPodReplacementPolicy`` en su clúster.

Una vez que la funcionalidad esté habilitada en su clúster, puede usarla creando un nuevo Trabajo que especifique un campo podReplacementPolicy como se muestra aquí:

```yaml
kind: Job
metadata:
  name: new
  ...
spec:
  podReplacementPolicy: Failed
  ...
```

En ese Trabajo, los Pods solo serían reemplazados una vez que hayan alcanzado la fase Failed, y no cuando están terminando.

Adicionalmente, puede inspeccionar el campo `.status.terminating` de un Trabajo. El valor del campo es el número de Pods pertenecientes al Trabajo que actualmente están terminando.

```shell
kubectl get jobs/myjob -o=jsonpath='{.items[*].status.terminating}'
```

```
3 # three Pods are terminating and have not yet reached the Failed phase
```

Esto puede ser particularmente útil para controladores de cola externos, como [Kueue](https://github.com/kubernetes-sigs/kueue), que rastrea la cuota de los Pods en ejecución de un Trabajo hasta que los recursos son reclamados del Trabajo que actualmente está terminando.

Tenga en cuenta que podReplacementPolicy: Failed es el valor predeterminado al usar una [Política de fallo de Pod personalizada](/docs/concepts/workloads/controllers/job/#pod-failure-policy).

## Límite de reintentos por índice {#backoff-limit-per-index}

Por defecto, los fallos de los Pod en [Trabajos Indexados](/docs/concepts/workloads/controllers/job/#completion-mode) se cuentan hacia el límite global de reintentos, representado por `.spec.backoffLimit`. Esto significa que si hay un índice que falla consistentemente, se reinicia repetidamente hasta que agota el límite. Una vez alcanzado el límite, todo el Trabajo se marca como fallido y algunos índices pueden nunca haberse iniciado.

Esto es problemático para casos de uso donde se desea manejar fallos de Pod para cada índice de manera independiente. Por ejemplo, si usa Trabajos Indexados para ejecutar pruebas de integración donde cada índice corresponde a un conjunto de pruebas. En ese caso, es posible que desee tener en cuenta posibles pruebas inestables permitiendo 1 o 2 reintentos por conjunto. Podría haber algunos conjuntos con errores, haciendo que los índices correspondientes fallen consistentemente. En ese caso, podría preferir limitar los reintentos para los conjuntos con errores, pero permitiendo que otros conjuntos se completen.

La característica le permite:
* completar la ejecución de todos los índices, a pesar de que algunos índices fallen.
* utilizar mejor los recursos computacionales evitando reintentos innecesarios de índices que fallan consistentemente.

### ¿Cómo puede utilizarlo? {#backoff-limit-per-index-how-to-use}

Esta es una característica alfa, la cual puede habilitar activando el `JobBackoffLimitPerIndex` [interruptor de funcionalidad](/docs/reference/command-line-tools-reference/feature-gates/) en su clúster.

Una vez que la funcionalidad esté habilitada en su clúster, puede crear un Trabajo Indexado con el campo
`.spec.backoffLimitPerIndex` especificado.

#### Ejemplo
El siguiente ejemplo demuestra cómo usar esta característica para asegurarse de que el Trabajo ejecute todos los índices (siempre que no haya otra razón para la terminación temprana del Trabajo, como alcanzar el tiempo límite activeDeadlineSeconds, o ser eliminado manualmente por el usuario), y el número de fallos se controla por índice.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: job-backoff-limit-per-index-execute-all
spec:
  completions: 8
  parallelism: 2
  completionMode: Indexed
  backoffLimitPerIndex: 1
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: example # this example container returns an error, and fails,
                      # when it is run as the second or third index in any Job
                      # (even after a retry)        
        image: python
        command:
        - python3
        - -c
        - |
          import os, sys, time
          id = int(os.environ.get("JOB_COMPLETION_INDEX"))
          if id == 1 or id == 2:
            sys.exit(1)
          time.sleep(1)
```

Ahora, inspeccione los Pods después de que el trabajo haya finalizado:

```sh
kubectl get pods -l job-name=job-backoff-limit-per-index-execute-all
```

Devuelve una salida similar a esta:
```
NAME                                              READY   STATUS      RESTARTS   AGE
job-backoff-limit-per-index-execute-all-0-b26vc   0/1     Completed   0          49s
job-backoff-limit-per-index-execute-all-1-6j5gd   0/1     Error       0          49s
job-backoff-limit-per-index-execute-all-1-6wd82   0/1     Error       0          37s
job-backoff-limit-per-index-execute-all-2-c66hg   0/1     Error       0          32s
job-backoff-limit-per-index-execute-all-2-nf982   0/1     Error       0          43s
job-backoff-limit-per-index-execute-all-3-cxmhf   0/1     Completed   0          33s
job-backoff-limit-per-index-execute-all-4-9q6kq   0/1     Completed   0          28s
job-backoff-limit-per-index-execute-all-5-z9hqf   0/1     Completed   0          28s
job-backoff-limit-per-index-execute-all-6-tbkr8   0/1     Completed   0          23s
job-backoff-limit-per-index-execute-all-7-hxjsq   0/1     Completed   0          22s
```

Adicionalmente, puede echar un vistazo al estado de ese Trabajo:

```sh
kubectl get jobs job-backoff-limit-per-index-fail-index -o yaml
```

La salida concluye con un `status` similar a:

```yaml
  status:
    completedIndexes: 0,3-7
    failedIndexes: 1,2
    succeeded: 6
    failed: 4
    conditions:
    - message: Job has failed indexes
      reason: FailedIndexes
      status: "True"
      type: Failed
```

Aquí, los índices `1` y `2` fueron reintentados una vez. Después del segundo fallo en cada uno de ellos, se excedió el `.spec.backoffLimitPerIndex` especificado, por lo que se detuvieron los reintentos. Para comparación, si el retroceso por índice estuviera desactivado, entonces los índices defectuosos intentarían repetidamente hasta que se excediera el `backoffLimit` global, y luego todo el Trabajo sería marcado como fallido, antes de que algunos de los índices más altos comenzaran.

## ¿Cómo puedes aprender más?
- Lee la documentación dirigida al usuario para [Política de reemplazo de Pod](/docs/concepts/workloads/controllers/job/#pod-replacement-policy), [Límite de retroceso por índice](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index) y [Política de fallo de Pod](/docs/concepts/workloads/controllers/job/#pod-failure-policy).
- Lee los KEPs para [Política de reemplazo de Pod](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3939-allow-replacement-when-fully-terminated), [Límite de retroceso por índice](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3850-backoff-limits-per-index-for-indexed-jobs) y [Política de fallo de Pod](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3329-retriable-and-non-retriable-failures).

## Participando
Estas características fueron patrocinadas por [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps). Los casos de uso por lotes están siendo mejorados activamente para los usuarios de Kubernetes en el [grupo de trabajo por lotes](https://github.com/kubernetes/community/tree/master/wg-batch). Los grupos de trabajo son iniciativas de duración relativamente corta centradas en objetivos específicos. El objetivo del WG Batch es mejorar la experiencia para los usuarios de cargas de trabajo por lotes, ofrecer soporte para casos de uso de procesamiento por lotes y mejorar la API de Trabajo para casos de uso comunes. Si eso te interesa, únete al grupo de trabajo ya sea suscribiéndote a nuestra [lista de correo](https://groups.google.com/a/kubernetes.io/g/wg-batch) o en [Slack](https://kubernetes.slack.com/messages/wg-batch).

## Agradecimientos
Como con cualquier característica de Kubernetes, varias personas contribuyeron para que esto se llevara a cabo, desde pruebas y reporte de errores hasta revisión de código.

No habríamos podido lograr ninguna de estas características sin Aldo Culquicondor (Google) proporcionando excelente conocimiento y experiencia en todo el ecosistema de Kubernetes.