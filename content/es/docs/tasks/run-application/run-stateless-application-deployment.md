---
title: Corre una aplicación stateless usando un Deployment
min-kubernetes-server-version: v1.9
content_template: templates/tutorial
weight: 10
---

{{% capture overview %}}

Ésta página enseña como correr una aplicación stateless usando un `deployment` de Kubernetes.

{{% /capture %}}


{{% capture objectives %}}

* Crear un `deployment` de nginx.
* Usar kubectl para obtener información acerca del `deployment`.
* Actualizar el `deployment`.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture lessoncontent %}}

## Creando y explorando un nginx deployment

Puedes correr una aplicación creando un `deployment` de Kubernetes, y puedes describir el `deployment` en un fichero YAML. Por ejemplo, el siguiente fichero YAML describe un `deployment` que corre la imágen Docker nginx:1.7.9:

{{< codenew file="application/deployment.yaml" >}}


1. Crea un `deployment` basado en el fichero YAML:

        kubectl apply -f https://k8s.io/examples/application/deployment.yaml

2. Obtén información acerca del `deployment`:

        kubectl describe deployment nginx-deployment

    El resultado es similar a esto:

        user@computer:~/website$ kubectl describe deployment nginx-deployment
        Name:     nginx-deployment
        Namespace:    default
        CreationTimestamp:  Tue, 30 Aug 2016 18:11:37 -0700
        Labels:     app=nginx
        Annotations:    deployment.kubernetes.io/revision=1
        Selector:   app=nginx
        Replicas:   2 desired | 2 updated | 2 total | 2 available | 0 unavailable
        StrategyType:   RollingUpdate
        MinReadySeconds:  0
        RollingUpdateStrategy:  1 max unavailable, 1 max surge
        Pod Template:
          Labels:       app=nginx
          Containers:
           nginx:
            Image:              nginx:1.7.9
            Port:               80/TCP
            Environment:        <none>
            Mounts:             <none>
          Volumes:              <none>
        Conditions:
          Type          Status  Reason
          ----          ------  ------
          Available     True    MinimumReplicasAvailable
          Progressing   True    NewReplicaSetAvailable
        OldReplicaSets:   <none>
        NewReplicaSet:    nginx-deployment-1771418926 (2/2 replicas created)
        No events.

3. Lista los pods creados por el `deployment`:

        kubectl get pods -l app=nginx

    El resultado es similar a esto:

        NAME                                READY     STATUS    RESTARTS   AGE
        nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
        nginx-deployment-1771418926-r18az   1/1       Running   0          16h

4. Muestra información acerca del pod:

        kubectl describe pod <pod-name>

    donde `<pod-name>` es el nombre de uno de los pods.

## Actualizando el deployment

Puedes actualizar el `deployment` aplicando un nuevo fichero YAML. El siguiente fichero YAML
especifica que el `deployment` debería ser actualizado para usar nginx 1.8.

{{< codenew file="application/deployment-update.yaml" >}}

1. Aplica el nuevo fichero YAML:

         kubectl apply -f https://k8s.io/examples/application/deployment-update.yaml

2. Comprueba como el `deployment` crea nuevos pods con la nueva imagen mientras va eliminando los pods con la especificación antigua:

         kubectl get pods -l app=nginx

## Escalando la aplicación aumentado el número de replicas

Puedes aumentar el número de pods en tu `deployment` aplicando un nuevo fichero YAML.
El siguiente fichero YAML especifica un total de 4 `replicas`, lo que significa que el `deployment` debería tener cuatro pods:

{{< codenew file="application/deployment-scale.yaml" >}}

1. Aplica el nuevo fichero YAML:

        kubectl apply -f https://k8s.io/examples/application/deployment-scale.yaml

2. Verifica que el `deployment` tiene cuatro pods:

        kubectl get pods -l app=nginx

    El resultado es similar a esto:

        NAME                               READY     STATUS    RESTARTS   AGE
        nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
        nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
        nginx-deployment-148880595-fxcez   1/1       Running   0          2m
        nginx-deployment-148880595-rwovn   1/1       Running   0          2m

## Eliminando un deployment

Elimina el `deployment` por el nombre:

    kubectl delete deployment nginx-deployment

## ReplicationControllers

La manera preferida de crear una aplicación con múltiples instancias es usando un Deployment, el cual usa un ReplicaSet. Antes de que Deployment y ReplicaSet fueran introducidos en Kubernetes, aplicaciones con múltiples instancias eran configuradas usando un
[ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).

{{% /capture %}}


{{% capture whatsnext %}}

* Aprende más acerca de [Deployments](/docs/concepts/workloads/controllers/deployment/).

{{% /capture %}}
