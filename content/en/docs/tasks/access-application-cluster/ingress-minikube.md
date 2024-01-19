---
title: Set up Ingress on Minikube with the NGINX Ingress Controller
content_type: task
weight: 110
min-kubernetes-server-version: 1.19
---

<!-- overview -->

An [Ingress](/docs/concepts/services-networking/ingress/) is an API object that defines rules
which allow external access to services in a cluster. An
[Ingress controller](/docs/concepts/services-networking/ingress-controllers/)
fulfills the rules set in the Ingress.

This page shows you how to set up a simple Ingress which routes requests to Service 'web' or
'web2' depending on the HTTP URI.

## {{% heading "prerequisites" %}}

This tutorial assumes that you are using `minikube` to run a local Kubernetes cluster.
Visit [Install tools](/docs/tasks/tools/#minikube) to learn how to install `minikube`.

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
If you are using an older Kubernetes version, switch to the documentation for that version.

### Create a minikube cluster

If you haven't already set up a cluster locally, run `minikube start` to create a cluster.


<!-- steps -->

## Enable the Ingress controller

1. To enable the NGINX Ingress controller, run the following command:

   ```shell
   minikube addons enable ingress
   ```

1. Verify that the NGINX Ingress controller is running

   ```shell
   kubectl get pods -n ingress-nginx
   ```

   {{< note >}}
   It can take up to a minute before you see these pods running OK.
   {{< /note >}}

   The output is similar to:

   ```none
   NAME                                        READY   STATUS      RESTARTS    AGE
   ingress-nginx-admission-create-g9g49        0/1     Completed   0          11m
   ingress-nginx-admission-patch-rqp78         0/1     Completed   1          11m
   ingress-nginx-controller-59b45fb494-26npt   1/1     Running     0          11m
   ```

## Deploy a hello, world app

1. Create a Deployment using the following command:

   ```shell
   kubectl create deployment web --image=gcr.io/google-samples/hello-app:1.0
   ```

   The output should be:

   ```none
   deployment.apps/web created
   ```

1. Expose the Deployment:

   ```shell
   kubectl expose deployment web --type=NodePort --port=8080
   ```

   The output should be:

   ```none
   service/web exposed
   ```

1. Verify the Service is created and is available on a node port:

   ```shell
   kubectl get service web
   ```

   The output is similar to:

   ```none
   NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
   web       NodePort   10.104.133.249   <none>        8080:31637/TCP   12m
   ```

1. Visit the Service via NodePort:

   ```shell
   minikube service web --url
   ```

   The output is similar to:

   ```none
   http://172.17.0.15:31637
   ```

   ```shell
   curl http://172.17.0.15:31637 
   ```

   The output is similar to:

   ```none
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

   You can now access the sample application via the Minikube IP address and NodePort.
   The next step lets you access the application using the Ingress resource.

## Create an Ingress

The following manifest defines an Ingress that sends traffic to your Service via
`hello-world.info`.

1. Create `example-ingress.yaml` from the following file:

   {{% code_sample file="service/networking/example-ingress.yaml" %}}

1. Create the Ingress object by running the following command:

   ```shell
   kubectl apply -f https://k8s.io/examples/service/networking/example-ingress.yaml
   ```

   The output should be:

   ```none
   ingress.networking.k8s.io/example-ingress created
   ```

1. Verify the IP address is set:

   ```shell
   kubectl get ingress
   ```

   {{< note >}}
   This can take a couple of minutes.
   {{< /note >}}

   You should see an IPv4 address in the `ADDRESS` column; for example:

   ```none
   NAME              CLASS    HOSTS              ADDRESS        PORTS   AGE
   example-ingress   <none>   hello-world.info   172.17.0.15    80      38s
   ```


1. Verify that the Ingress controller is directing traffic:

   ```shell
   curl --resolve "hello-world.info:80:$( minikube ip )" -i http://hello-world.info
   ```

   You should see:

   ```none
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

   You can also visit `hello-world.info` from your browser.

   * **Optionally**
     Look up the external IP address as reported by minikube:
     ```shell
     minikube ip
     ```

     Add line similar to the following one to the bottom of the `/etc/hosts` file on
     your computer (you will need administrator access):

     ```none
     172.17.0.15 hello-world.info
     ```

     {{< note >}}
     Change the IP address to match the output from `minikube ip`.
     {{< /note >}}

     After you make this change, your web browser sends requests for
     `hello-world.info` URLs to Minikube.

## Create a second Deployment

1. Create another Deployment using the following command:

   ```shell
   kubectl create deployment web2 --image=gcr.io/google-samples/hello-app:2.0
   ```

   The output should be:

   ```none
   deployment.apps/web2 created
   ```

1. Expose the second Deployment:

   ```shell
   kubectl expose deployment web2 --port=8080 --type=NodePort
   ```

   The output should be:

   ```none
   service/web2 exposed
   ```

## Edit the existing Ingress {#edit-ingress}

1. Edit the existing `example-ingress.yaml` manifest, and add the
   following lines at the end:

    ```yaml
    - path: /v2
      pathType: Prefix
      backend:
        service:
          name: web2
          port:
            number: 8080
    ```

1. Apply the changes:

   ```shell
   kubectl apply -f example-ingress.yaml
   ```

   You should see:

   ```none
   ingress.networking/example-ingress configured
   ```

## Test your Ingress

1. Access the 1st version of the Hello World app.

   ```shell
   curl --resolve "hello-world.info:80:$( minikube ip )" -i http://hello-world.info
   ```

   The output is similar to:

   ```none
   Hello, world!
   Version: 1.0.0
   Hostname: web-55b8c6998d-8k564
   ```

1. Access the 2nd version of the Hello World app.

   ```shell
   curl --resolve "hello-world.info:80:$( minikube ip )" -i http://hello-world.info/v2
   ```

   The output is similar to:

   ```none
   Hello, world!
   Version: 2.0.0
   Hostname: web2-75cd47646f-t8cjk
   ```

   {{< note >}}
   If you did the optional step to update `/etc/hosts`, you can also visit `hello-world.info` and
   `hello-world.info/v2` from your browser.
   {{< /note >}}

## {{% heading "whatsnext" %}}

* Read more about [Ingress](/docs/concepts/services-networking/ingress/)
* Read more about [Ingress Controllers](/docs/concepts/services-networking/ingress-controllers/)
* Read more about [Services](/docs/concepts/services-networking/service/)

