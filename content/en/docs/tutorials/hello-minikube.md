---
title: Hello Minikube
content_template: templates/tutorial
weight: 5
menu:
  main:
    title: "Get Started"
    weight: 10
    post: >
      <p>Ready to get your hands dirty? Build a simple Kubernetes cluster that runs "Hello World" for Node.js.</p>
---

{{% capture overview %}}

This tutorial shows you how to run a simple Hello World Node.js app
on Kubernetes using [Minikube](/docs/getting-started-guides/minikube) and Katacoda.
Katacoda provides a free, in-browser Kubernetes environment. 

{{< note >}}
You can also follow this tutorial if you've installed [Minikube locally](/docs/tasks/tools/install-minikube/).
{{< /note >}}

{{% /capture %}}

{{% capture objectives %}}

* Deploy a hello world application to Minikube.
* Run the app.
* View application logs.

{{% /capture %}}

{{% capture prerequisites %}}

This tutorial provides a container image built from the following files:

{{< codenew language="js" file="minikube/server.js" >}}

{{< codenew language="conf" file="minikube/Dockerfile" >}}

For more information on the `docker build` command, read the [Docker documentation](https://docs.docker.com/engine/reference/commandline/build/).

{{% /capture %}}

{{% capture lessoncontent %}}

## Create a Minikube cluster

1. Click **Launch Terminal** 

    {{< kat-button >}}

    {{< note >}}If you installed Minikube locally, run `minikube start`.{{< /note >}}

2. Open the Kubernetes dashboard in a browser:

    ```shell
    minikube dashboard
    ```

3. Katacoda environment only: At the top of the terminal pane, click the plus sign, and then click **Select port to view on Host 1**.

4. Katacoda environment only: Type `30000`, and then click **Display Port**. 

## Create a Deployment

A Kubernetes [*Pod*](/docs/concepts/workloads/pods/pod/) is a group of one or more Containers,
tied together for the purposes of administration and networking. The Pod in this
tutorial has only one Container. A Kubernetes
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) checks on the health of your
Pod and restarts the Pod's Container if it terminates. Deployments are the
recommended way to manage the creation and scaling of Pods.

1. Use the `kubectl create` command to create a Deployment that manages a Pod. The
Pod runs a Container based on the provided Docker image. 

    ```shell
    kubectl create deployment hello-node --image=gcr.io/hello-minikube-zero-install/hello-node
    ```

2. View the Deployment:

    ```shell
    kubectl get deployments
    ```

    Output:

    ```shell
    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1         1         1            1           1m
    ```

3. View the Pod:

    ```shell
    kubectl get pods
    ```
    Output:

    ```shell
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. View cluster events:

    ```shell
    kubectl get events
    ```

5. View the `kubectl` configuration:

    ```shell
    kubectl config view
    ```
  
    {{< note >}}For more information about `kubectl`commands, see the [kubectl overview](/docs/user-guide/kubectl-overview/).{{< /note >}}

## Create a Service

By default, the Pod is only accessible by its internal IP address within the
Kubernetes cluster. To make the `hello-node` Container accessible from outside the
Kubernetes virtual network, you have to expose the Pod as a
Kubernetes [*Service*](/docs/concepts/services-networking/service/).

1. Expose the Pod to the public internet using the `kubectl expose` command:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```
    
    The `--type=LoadBalancer` flag indicates that you want to expose your Service
    outside of the cluster.

2. View the Service you just created:

    ```shell
    kubectl get services
    ```

    Output:

    ```shell
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    On cloud providers that support load balancers,
    an external IP address would be provisioned to access the Service. On Minikube,
    the `LoadBalancer` type makes the Service accessible through the `minikube service`
    command.

3. Run the following command:

    ```shell
    minikube service hello-node
    ```

4. Katacoda environment only: Click the plus sign, and then click **Select port to view on Host 1**.

5. Katacoda environment only: Type `8080`, and then click **Display Port**. 

    This opens up a browser window that serves your app and shows the "Hello World" message.

## Enable addons

Minikube has a set of built-in addons that can be enabled, disabled and opened in the local Kubernetes environment.

1. List the currently supported addons:

    ```shell
    minikube addons list
    ```

    Output:

    ```shell
    addon-manager: enabled
    coredns: disabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    heapster: disabled
    ingress: disabled
    kube-dns: enabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    ```
   
2. Enable an addon, for example, `heapster`:

    ```shell
    minikube addons enable heapster
    ```
  
    Output:

    ```shell
    heapster was successfully enabled
    ```

3. View the Pod and Service you just created:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    Output:

    ```shell
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/heapster-9jttx                          1/1       Running   0          26s
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-dns-6dcb57bcc8-gv7mw               3/3       Running   0          34m
    pod/kubernetes-dashboard-5498ccf677-cgspw   1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/heapster               ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/kubernetes-dashboard   NodePort    10.109.29.1     <none>        80:30000/TCP        34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

4. Disable `heapster`:

    ```shell
    minikube addons disable heapster
    ```
  
    Output:

    ```shell
    heapster was successfully disabled
    ```

## Clean up

Now you can clean up the resources you created in your cluster:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Optionally, stop the Minikube virtual machine (VM):

```shell
minikube stop
```

Optionally, delete the Minikube VM:

```shell
minikube delete
```

{{% /capture %}}

{{% capture whatsnext %}}

* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
* Learn more about [Deploying applications](/docs/user-guide/deploying-applications/).
* Learn more about [Service objects](/docs/concepts/services-networking/service/).

{{% /capture %}}
