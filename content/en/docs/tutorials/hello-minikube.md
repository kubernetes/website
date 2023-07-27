---
title: Hello Minikube
content_type: tutorial
weight: 5
menu:
  main:
    title: "Get Started"
    weight: 10
    post: >
      <p>Ready to get your hands dirty? Build a simple Kubernetes cluster that runs a sample app.</p>
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

This tutorial shows you how to run a sample app on Kubernetes using minikube.
The tutorial provides a container image that uses NGINX to echo back all the requests.

## {{% heading "objectives" %}}

* Deploy a sample application to minikube.
* Run the app.
* View application logs.

## {{% heading "prerequisites" %}}


This tutorial assumes that you have already set up `minikube`.
See [minikube start](https://minikube.sigs.k8s.io/docs/start/) for installation instructions.

You also need to install `kubectl`.
See [Install tools](/docs/tasks/tools/#kubectl) for installation instructions.


<!-- lessoncontent -->

## Create a minikube cluster

```shell
minikube start
```

## Open the Dashboard

Open the Kubernetes dashboard. You can do this two different ways:

{{< tabs name="dashboard" >}}
{{% tab name="Launch a browser" %}}
Open a **new** terminal, and run:
```shell
# Start a new terminal, and leave this running.
minikube dashboard
```

Now, switch back to the terminal where you ran `minikube start`.

{{< note >}}
The `dashboard` command enables the dashboard add-on and opens the proxy in the default web browser.
You can create Kubernetes resources on the dashboard such as Deployment and Service.

If you are running in an environment as root, see [Open Dashboard with URL](#open-dashboard-with-url).

By default, the dashboard is only accessible from within the internal Kubernetes virtual network.
The `dashboard` command creates a temporary proxy to make the dashboard accessible from outside the Kubernetes virtual network.

To stop the proxy, run `Ctrl+C` to exit the process.
After the command exits, the dashboard remains running in the Kubernetes cluster.
You can run the `dashboard` command again to create another proxy to access the dashboard.
{{< /note >}}

{{% /tab %}}
{{% tab name="URL copy and paste" %}}

If you don't want minikube to open a web browser for you, run the dashboard command with the
`--url` flag. `minikube` outputs a URL that you can open in the browser you prefer.

Open a **new** terminal, and run:
```shell
# Start a new terminal, and leave this running.
minikube dashboard --url
```

Now, switch back to the terminal where you ran `minikube start`.

{{% /tab %}}
{{< /tabs >}}

## Create a Deployment

A Kubernetes [*Pod*](/docs/concepts/workloads/pods/) is a group of one or more Containers,
tied together for the purposes of administration and networking. The Pod in this
tutorial has only one Container. A Kubernetes
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) checks on the health of your
Pod and restarts the Pod's Container if it terminates. Deployments are the
recommended way to manage the creation and scaling of Pods.

1. Use the `kubectl create` command to create a Deployment that manages a Pod. The
   Pod runs a Container based on the provided Docker image.

    ```shell
    # Run a test container image that includes a webserver
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
    ```

1. View the Deployment:

    ```shell
    kubectl get deployments
    ```

    The output is similar to:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

1. View the Pod:

    ```shell
    kubectl get pods
    ```

    The output is similar to:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

1. View cluster events:

    ```shell
    kubectl get events
    ```

1. View the `kubectl` configuration:

    ```shell
    kubectl config view
    ```

{{< note >}}
For more information about `kubectl` commands, see the [kubectl overview](/docs/reference/kubectl/).
{{< /note >}}

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
    
    The application code inside the test image only listens on TCP port 8080. If you used
    `kubectl expose` to expose a different port, clients could not connect to that other port.

2. View the Service you created:

    ```shell
    kubectl get services
    ```

    The output is similar to:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    On cloud providers that support load balancers,
    an external IP address would be provisioned to access the Service. On minikube,
    the `LoadBalancer` type makes the Service accessible through the `minikube service`
    command.

3. Run the following command:

    ```shell
    minikube service hello-node
    ```

    This opens up a browser window that serves your app and shows the app's response.

## Enable addons

The minikube tool includes a set of built-in {{< glossary_tooltip text="addons" term_id="addons" >}} that can be enabled, disabled and opened in the local Kubernetes environment.

1. List the currently supported addons:

    ```shell
    minikube addons list
    ```

    The output is similar to:

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

2. Enable an addon, for example, `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    The output is similar to:

    ```
    The 'metrics-server' addon is enabled
    ```

3. View the Pod and Service you created by installing that addon:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    The output is similar to:

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

4. Disable `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    The output is similar to:

    ```
    metrics-server was successfully disabled
    ```

## Clean up

Now you can clean up the resources you created in your cluster:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Stop the Minikube cluster

```shell
minikube stop
```

Optionally, delete the Minikube VM:

```shell
# Optional
minikube delete
```

If you want to use minikube again to learn more about Kubernetes, you don't need to delete it.

## {{% heading "whatsnext" %}}


* Tutorial to _[deploy your first app on Kubernetes with kubectl](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
* Learn more about [Deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/).
* Learn more about [Service objects](/docs/concepts/services-networking/service/).

