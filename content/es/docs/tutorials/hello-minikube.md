---
title: Hello Minikube
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

Este tutorial muestra como ejecutar una aplicación Node.js Hola Mundo en Kubernetes utilizando 
[Minikube](/docs/setup/learning-environment/minikube) y Katacoda.
Katacoda provee un entorno de Kubernetes desde el navegador.

{{< note >}}
También se puede  seguir este tutorial si se ha instalado [Minikube localmente](/docs/tasks/tools/install-minikube/).
{{< /note >}}



## {{% heading "objectives" %}}


* Desplegar una aplicación Hola Mundo en Minikube.
* Ejecutar la aplicación.
* Ver los logs de la aplicación.



## {{% heading "prerequisites" %}}


Este tutorial provee una imagen de contenedor construida desde los siguientes archivos:

{{% codenew language="js" file="minikube/server.js" %}}

{{% codenew language="conf" file="minikube/Dockerfile" %}}

Para más información sobre el comando `docker build`, lea la [documentación de Docker ](https://docs.docker.com/engine/reference/commandline/build/).



<!-- lessoncontent -->

## Crear un clúster Minikube

1. Haz clic en **Launch Terminal**

    {{< kat-button >}}

    {{< note >}}Si se tiene instalado Minikube local, ejecutar `minikube start`.{{< /note >}}

2. Abrir el tablero de Kubernetes dashboard en un navegador:

    ```shell
    minikube dashboard
    ```

3. Solo en el entorno de Katacoda: En la parte superior de la terminal, haz clic en el símbolo + y luego clic en **Select port to view on Host 1**.

4. Solo en el entorno de Katacoda: Escribir `30000`, y hacer clic en **Display Port**.

## Crear un Deployment

Un [*Pod*](/docs/concepts/workloads/pods/pod/) en Kubernetes es un grupo de uno o más contenedores,
asociados con propósitos de administración y redes. El Pod en este tutorial tiene solo un contenedor.
Un [*Deployment*](/docs/concepts/workloads/controllers/deployment/) en Kubernetes verifica la salud del Pod y reinicia su contenedor si este es eliminado. Los Deployments son la manera recomendada de manejar la creación y escalación.

1. Ejecutar el comando `kubectl create` para crear un Deployment que maneje un Pod. El Pod ejecuta un contenedor basado en la imagen proveida por Docker.

    ```shell
    kubectl create deployment hello-node --image=registry.k8s.io/echoserver:1.4
    ```

2. Ver el Deployment:

    ```shell
    kubectl get deployments
    ```

    El resultado es similar a:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

3. Ver el Pod:

    ```shell
    kubectl get pods
    ```

    El resultado es similar a:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. Ver los eventos del clúster:

    ```shell
    kubectl get events
    ```

5. Ver la configuración `kubectl`:

    ```shell
    kubectl config view
    ```

    {{< note >}} Para más información sobre el comando `kubectl`, ver [kubectl overview](/docs/user-guide/kubectl-overview/).{{< /note >}}

## Crear un Service

Por defecto, el Pod es accedido por su dirección IP interna dentro del clúster de Kubernetes, para hacer que el contenedor `hello-node` sea accesible desde afuera de la red virtual Kubernetes, se debe exponer el Pod como un
 [*Service*](/docs/concepts/services-networking/service/) de Kubernetes.

1. Exponer el Pod a la red pública de internet utilizando el comando `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    El flag `--type=LoadBalancer` indica que se quiere exponer el Service fuera del clúster.

2. Ver el Service creado:

    ```shell
    kubectl get services
    ```

    El resultado es similar a:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    Para los proveedores Cloud que soportan balanceadores de carga, una dirección IP externa será provisionada para acceder al servicio, en Minikube, el tipo `LoadBalancer` permite que el servicio sea accesible a través del comando `minikube service`.

3. Ejecutar el siguiente comando:

    ```shell
    minikube service hello-node
    ```

4. Solo en el entorno de Katacoda: Hacer clic sobre el símbolo +, y luego en **Select port to view on Host 1**.

5. Solo en el entorno de Katacoda: Anotar el puerto de 5 dígitos ubicado al lado del valor de `8080` en el resultado de servicios. Este número de puerto es generado aleatoriamente y puede ser diferente al indicado en el ejemplo. Escribir el número de puerto en el cuadro de texto y hacer clic en Display Port. Usando el ejemplo anterior, usted escribiría `30369`.

    Esto abre una ventana de navegador que contiene la aplicación y muestra el mensaje "Hello World".

## Habilitar Extensiones

Minikube tiene un conjunto  de {{< glossary_tooltip text="Extensiones" term_id="addons" >}} que pueden ser habilitados y desahabilitados en el entorno local de Kubernetes.

1. Listar las extensiones soportadas actualmente:

    ```shell
    minikube addons list
    ```

    El resultado es similar a:

    ```
    addon-manager: enabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    gvisor: disabled
    helm-tiller: disabled
    ingress: disabled
    ingress-dns: disabled
    logviewer: disabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    storage-provisioner-gluster: disabled
    ```

2. Habilitar una extensión, por ejemplo, `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    El resultado es similar a:

    ```
    metrics-server was successfully enabled
    ```

3. Ver el Pod y Service creados:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    El resultado es similar a:

    ```
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
    pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
    pod/metrics-server-67fb648c5                1/1       Running   0          26s
    pod/etcd-minikube                           1/1       Running   0          34m
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-apiserver-minikube                 1/1       Running   0          34m
    pod/kube-controller-manager-minikube        1/1       Running   0          34m
    pod/kube-proxy-rnlps                        1/1       Running   0          34m
    pod/kube-scheduler-minikube                 1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

4. Deshabilitar `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    El resultado es similar a:

    ```
    metrics-server was successfully disabled
    ```

## Limpieza

Ahora se puede eliminar los recursos creados en el clúster:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Opcional, detener la máquina virtual de Minikube:

```shell
minikube stop
```

Opcional, eliminar la máquina virtual de Minikube:

```shell
minikube delete
```



## {{% heading "whatsnext" %}}


* Leer más sobre [Deployments](/docs/concepts/workloads/controllers/deployment/).
* Leer más sobre [Desplegando aplicaciones](/docs/tasks/run-application/run-stateless-application-deployment/).
* Leer más sobre [Services](/docs/concepts/services-networking/service/).


