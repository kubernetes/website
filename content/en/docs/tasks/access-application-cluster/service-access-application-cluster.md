---
title: Use a Service to Access an Application in a Cluster
content_type: tutorial
weight: 60
---

This page shows you how to use Kubernetes
[Services](https://kubernetes.io/docs/concepts/services-networking/service/) to
access the applications in your cluster.

After creating and deploying an application, you might want to expose it on a
network. Kubernetes gives every Pod an IP address within the cluster, so that
Pods can reach other Pods in the cluster without additional configuration.
However, when Pods are terminated and restarted, they're given new IP addresses.
A Service logically groups Pods together and uses a unique IP address (a
clusterIP) to allow communications to reach the Pods.

## Objectives

In this tutorial, you'll do the following:

* Create a Deployment.
* Expose the Deployment to the cluster using a Service.
* Access the Service from inside your cluster.
* Secure the Service.
* Expose the Service to the internet.

## {{% heading "prerequisites" %}}

* Ensure that you're familiar with [Pod
  networking](https://kubernetes.io/docs/concepts/workloads/pods/#pod-networking)
  and Services.
* Become familiar with [The Kubernetes network model](https://kubernetes.io/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

## Create a Deployment {#creating-a-deployment}

1. Save the following manifest as `my-nginx-deployment.yaml`:

   {{< codenew file="service/networking/run-my-nginx.yaml" >}}

1. Apply the manifest:

   ```shell
   kubectl apply -f ./my-nginx-deployment.yaml
   ```
1. Check which nodes the Pods are on:

   ```shell
   kubectl get pods -l run=my-nginx -o wide
   ```

   The output is similar to this: 

   ```
   NAME                        READY     STATUS    RESTARTS   AGE       IP            NODE
   my-nginx-3800858182-jr4a2   1/1       Running   0          13s       10.244.3.4    kubernetes-minion-905m
   my-nginx-3800858182-kna2y   1/1       Running   0          13s       10.244.2.5    kubernetes-minion-ljyd
   ```
1. Get the IP address of the Pods:

   ```shell
   kubectl get pods -l run=my-nginx -o yaml | grep podIP
   ```

   The output is similar to this:

   ```
   podIP: 10.12.0.9
   podIP: 10.12.1.6
   ```

You can get a session into any node in your cluster and `curl` either Pod IP
address. The containers don't use port 80 on the node. There are no NAT rules to
route traffic to the Pods. You could run multiple nginx deployments on the same
node, using the same `containerPort`, and use the IP addresses to access them
from other Pods or nodes in your cluster.

## Create a Service {#creating-a-service}

You can use a Service to prevent issues with Pod communication after restarts or
evictions. In this example, you create a Service for the nginx Deployment that
targets TCP port 80 on each Pod and exposes it on a Service port. 

1. Save the following manifest as `my-nginx-service.yaml`:

   {{< codenew file="service/networking/nginx-svc.yaml" >}}

1. Apply the manifest:

   ```shell
   kubectl apply -f ./my-nginx-service.yaml
   ```

   This is equivalent to running the following command:

   ```shell
   kubectl expose deployment/my-nginx
   ```

1. Check the Service: 

   ```shell
   kubectl get svc my-nginx
   ```

   The output is similar to this:

   ```
   NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
   my-nginx   ClusterIP   10.0.162.149   <none>        80/TCP    21s
   ```

1. Get the Pod `endpoints` associated with the Service:

   ```shell
   kubectl get ep my-nginx
   ```

   The output is similar to this:

   ```
   NAME       ENDPOINTS                     AGE
   my-nginx   10.244.2.5:80,10.244.3.4:80   1m
   ```
   
   Each Pod in your deployment has an endpoint that the Service uses to reach
   it. When new Pods are selected by the Service selector, those endpoints are
   added to the corresponding [Endpoint API resource](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#endpoints-v1-core) for the Service, and the old
   endpoints are removed.

You can now reach the Service by opening a session from any node in your cluster
and using `curl` to reach the `<CLUSTER-IP>:<PORT>`. In this example, that's
`10.0.162.149:80`. For more information about the service IP address, see
[Virtual IPs and service
proxies](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies).

## Access the Service {#accessing-the-service}

You can use the following methods to access the Service: 

* Environment variables
* DNS

For more information on these methods, see [Discovering
services](https://kubernetes.io/docs/concepts/services-networking/service/#discovering-services).

### Use environment variables {#environment-variables}

When a Pod is scheduled on a node, the kubelet adds environment variables
corresponding to each *existing* Service. If you create the Service after
creating the Pod, the environment variables for that Service won't exist until
you restart the Pod. 

1. List your running Pods:

   ```shell
   kubectl get pods -l run=my-nginx
   ```

   The output is similar to this: 

   ```
   NAME                        READY     STATUS    RESTARTS   AGE       IP            NODE
   my-nginx-3800858182-jr4a2   1/1       Running   0          13s       10.244.3.4    kubernetes-minion-905m
   my-nginx-3800858182-kna2y   1/1       Running   0          13s       10.244.2.5    kubernetes-minion-ljyd
   ```

1. Get the environment variables for Services in one of the Pods:

   ```shell
   kubectl exec my-nginx-3800858182-jr4a2 -- printenv | grep SERVICE
   ```

   The output is similar to this:

   ```
   KUBERNETES_SERVICE_HOST=10.0.0.1
   KUBERNETES_SERVICE_PORT=443
   KUBERNETES_SERVICE_PORT_HTTPS=443   
   ```
   In this output, the `my-nginx` Service has no variables present. 

1. Restart the Pods by scaling the Deployment down to 0 and back up:

   ```shell
   kubectl scale deployment my-nginx --replicas=0
   kubectl scale deployment my-nginx --replicas=2
   kubectl get pods -l run=my-nginx -o wide
   ```

   The output is similar to this:

   ```
   NAME                        READY     STATUS    RESTARTS   AGE     IP            NODE
   my-nginx-3800858182-e9ihh   1/1       Running   0          5s      10.244.2.7    kubernetes-minion-ljyd
   my-nginx-3800858182-j4rm4   1/1       Running   0          5s      10.244.3.8    kubernetes-minion-905m
   ```
   In this output, the Pod names and IP addresses are different because they
   were restarted.
   
1. Get the environment variables for a Pod:

   ```shell
   kubectl exec my-nginx-3800858182-e9ihh -- printenv | grep SERVICE
   ```

   The output is similar to this: 

   ```
   KUBERNETES_SERVICE_PORT=443
   MY_NGINX_SERVICE_HOST=10.0.162.149
   KUBERNETES_SERVICE_HOST=10.0.0.1
   MY_NGINX_SERVICE_PORT=80
   KUBERNETES_SERVICE_PORT_HTTPS=443
   ```

### Use DNS to access the Service {#use-dns}

{{<note>}}
To use DNS, your cluster must have a DNS server that assigns DNS names to
Service IP addresses. Kubernetes offers the [CoreDNS cluster
add-on](https://kubernetes.io/docs/tasks/administer-cluster/coredns/#installing-coredns)
(`kube-dns`) to accomplish this. This example uses `kube-dns`.
{{</note>}}

1. Check that `kube-dns` is running:

   ```shell
   kubectl get svc kube-dns -n kube-system
   ```

   The output is similar to this:

   ```
   NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
   kube-dns   ClusterIP   10.0.0.10    <none>        53/UDP,53/TCP   8m
   ```

1. Run a `curl` application to interact with `kube-dns`:

   ```shell
   kubectl run curl --image=radial/busyboxplus:curl -i --tty
   ```

1. Press Enter when prompted. You should now have a session ready for commands.

1. Look up the DNS name assigned to the `my-nginx` Service:

   ```shell
   nslookup my-nginx
   ```

   The output is similar to this:

   ```
   Server:    10.0.0.10
   Address 1: 10.0.0.10

   Name:      my-nginx
   Address 1: 10.0.162.149 
   ```

1. Type `exit` to end the session.

## Secure the Service {#secure-service}

Before exposing your nginx Service to the internet, you should secure the
channel. You'll need the following:

* Self-signed HTTPS certificates
* An nginx server to use the certificates
* A Secret to allow Pods to access the certificates

You can create the certificates using `make` or do it manually:

{{< tabs name="secure-service" >}}
   {{% tab name="`make`" %}}
      1. To use `make` to create certificates, run the following:

         ```shell
         make keys KEY=/tmp/nginx.key CERT=/tmp/nginx.crt
         ```
      1. Create a Secret that contains the certificates:

         ```shell
         kubectl create secret tls nginxsecret --key /tmp/nginx.key --cert /tmp/nginx.crt
         ```
      1. Check that the Secret was created:

         ```shell
         kubectl get secrets
         ```

         The output is similar to this:

         ```
         NAME                  TYPE                                  DATA      AGE
         default-token-il9rc   kubernetes.io/service-account-token   1         1d
         nginxsecret           kubernetes.io/tls                     2         1m
         ```
   {{% /tab %}}
   {{< tab name="Manually create credentials" >}}
      If you have issues running `make`, you can create the certificates and Secret
      manually.

      1. Generate a key pair:
         
         ```shell
         openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /d/tmp/nginx.key -out /d/tmp/nginx.crt -subj "/CN=my-nginx/O=my-nginx"
         ```
      1. Base64 encode the keys: 

         ```shell
         cat /d/tmp/nginx.crt | base64
         cat /d/tmp/nginx.key | base64
         ```
      1. Create a `Secret` manifest:

         ```yaml
         apiVersion: v1
         kind: Secret
         metadata:
            name: nginxsecret
            namespace: default
         type: kubernetes.io/tls
         data:
            tls.crt: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURIekNDQWdlZ0F3SUJBZ0lKQUp5M3lQK0pzMlpJTUEwR0NTcUdTSWIzRFFFQkJRVUFNQ1l4RVRBUEJnTlYKQkFNVENHNW5hVzU0YzNaak1SRXdEd1lEVlFRS0V3aHVaMmx1ZUhOMll6QWVGdzB4TnpFd01qWXdOekEzTVRKYQpGdzB4T0RFd01qWXdOekEzTVRKYU1DWXhFVEFQQmdOVkJBTVRDRzVuYVc1NGMzWmpNUkV3RHdZRFZRUUtFd2h1CloybHVlSE4yWXpDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBSjFxSU1SOVdWM0IKMlZIQlRMRmtobDRONXljMEJxYUhIQktMSnJMcy8vdzZhU3hRS29GbHlJSU94NGUrMlN5ajBFcndCLzlYTnBwbQppeW1CL3JkRldkOXg5UWhBQUxCZkVaTmNiV3NsTVFVcnhBZW50VWt1dk1vLzgvMHRpbGhjc3paenJEYVJ4NEo5Ci82UVRtVVI3a0ZTWUpOWTVQZkR3cGc3dlVvaDZmZ1Voam92VG42eHNVR0M2QURVODBpNXFlZWhNeVI1N2lmU2YKNHZpaXdIY3hnL3lZR1JBRS9mRTRqakxCdmdONjc2SU90S01rZXV3R0ljNDFhd05tNnNTSzRqYUNGeGpYSnZaZQp2by9kTlEybHhHWCtKT2l3SEhXbXNhdGp4WTRaNVk3R1ZoK0QrWnYvcW1mMFgvbVY0Rmo1NzV3ajFMWVBocWtsCmdhSXZYRyt4U1FVQ0F3RUFBYU5RTUU0d0hRWURWUjBPQkJZRUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjcKTUI4R0ExVWRJd1FZTUJhQUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjdNQXdHQTFVZEV3UUZNQU1CQWY4dwpEUVlKS29aSWh2Y05BUUVGQlFBRGdnRUJBRVhTMW9FU0lFaXdyMDhWcVA0K2NwTHI3TW5FMTducDBvMm14alFvCjRGb0RvRjdRZnZqeE04Tzd2TjB0clcxb2pGSW0vWDE4ZnZaL3k4ZzVaWG40Vm8zc3hKVmRBcStNZC9jTStzUGEKNmJjTkNUekZqeFpUV0UrKzE5NS9zb2dmOUZ3VDVDK3U2Q3B5N0M3MTZvUXRUakViV05VdEt4cXI0Nk1OZWNCMApwRFhWZmdWQTRadkR4NFo3S2RiZDY5eXM3OVFHYmg5ZW1PZ05NZFlsSUswSGt0ejF5WU4vbVpmK3FqTkJqbWZjCkNnMnlwbGQ0Wi8rUUNQZjl3SkoybFIrY2FnT0R4elBWcGxNSEcybzgvTHFDdnh6elZPUDUxeXdLZEtxaUMwSVEKQ0I5T2wwWW5scE9UNEh1b2hSUzBPOStlMm9KdFZsNUIyczRpbDlhZ3RTVXFxUlU9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
            tls.key: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQ2RhaURFZlZsZHdkbFIKd1V5eFpJWmVEZWNuTkFhbWh4d1NpeWF5N1AvOE9ta3NVQ3FCWmNpQ0RzZUh2dGtzbzlCSzhBZi9WemFhWm9zcApnZjYzUlZuZmNmVUlRQUN3WHhHVFhHMXJKVEVGSzhRSHA3VkpMcnpLUC9QOUxZcFlYTE0yYzZ3MmtjZUNmZitrCkU1bEVlNUJVbUNUV09UM3c4S1lPNzFLSWVuNEZJWTZMMDUrc2JGQmd1Z0ExUE5JdWFubm9UTWtlZTRuMG4rTDQKb3NCM01ZUDhtQmtRQlAzeE9JNHl3YjREZXUraURyU2pKSHJzQmlIT05Xc0RadXJFaXVJMmdoY1kxeWIyWHI2UAozVFVOcGNSbC9pVG9zQngxcHJHclk4V09HZVdPeGxZZmcvbWIvNnBuOUYvNWxlQlkrZStjSTlTMkQ0YXBKWUdpCkwxeHZzVWtGQWdNQkFBRUNnZ0VBZFhCK0xkbk8ySElOTGo5bWRsb25IUGlHWWVzZ294RGQwci9hQ1Zkank4dlEKTjIwL3FQWkUxek1yall6Ry9kVGhTMmMwc0QxaTBXSjdwR1lGb0xtdXlWTjltY0FXUTM5SjM0VHZaU2FFSWZWNgo5TE1jUHhNTmFsNjRLMFRVbUFQZytGam9QSFlhUUxLOERLOUtnNXNrSE5pOWNzMlY5ckd6VWlVZWtBL0RBUlBTClI3L2ZjUFBacDRuRWVBZmI3WTk1R1llb1p5V21SU3VKdlNyblBESGtUdW1vVlVWdkxMRHRzaG9reUxiTWVtN3oKMmJzVmpwSW1GTHJqbGtmQXlpNHg0WjJrV3YyMFRrdWtsZU1jaVlMbjk4QWxiRi9DSmRLM3QraTRoMTVlR2ZQegpoTnh3bk9QdlVTaDR2Q0o3c2Q5TmtEUGJvS2JneVVHOXBYamZhRGR2UVFLQmdRRFFLM01nUkhkQ1pKNVFqZWFKClFGdXF4cHdnNzhZTjQyL1NwenlUYmtGcVFoQWtyczJxWGx1MDZBRzhrZzIzQkswaHkzaE9zSGgxcXRVK3NHZVAKOWRERHBsUWV0ODZsY2FlR3hoc0V0L1R6cEdtNGFKSm5oNzVVaTVGZk9QTDhPTm1FZ3MxMVRhUldhNzZxelRyMgphRlpjQ2pWV1g0YnRSTHVwSkgrMjZnY0FhUUtCZ1FEQmxVSUUzTnNVOFBBZEYvL25sQVB5VWs1T3lDdWc3dmVyClUycXlrdXFzYnBkSi9hODViT1JhM05IVmpVM25uRGpHVHBWaE9JeXg5TEFrc2RwZEFjVmxvcG9HODhXYk9lMTAKMUdqbnkySmdDK3JVWUZiRGtpUGx1K09IYnRnOXFYcGJMSHBzUVpsMGhucDBYSFNYVm9CMUliQndnMGEyOFVadApCbFBtWmc2d1BRS0JnRHVIUVV2SDZHYTNDVUsxNFdmOFhIcFFnMU16M2VvWTBPQm5iSDRvZUZKZmcraEppSXlnCm9RN3hqWldVR3BIc3AyblRtcHErQWlSNzdyRVhsdlhtOElVU2FsbkNiRGlKY01Pc29RdFBZNS9NczJMRm5LQTQKaENmL0pWb2FtZm1nZEN0ZGtFMXNINE9MR2lJVHdEbTRpb0dWZGIwMllnbzFyb2htNUpLMUI3MkpBb0dBUW01UQpHNDhXOTVhL0w1eSt5dCsyZ3YvUHM2VnBvMjZlTzRNQ3lJazJVem9ZWE9IYnNkODJkaC8xT2sybGdHZlI2K3VuCnc1YytZUXRSTHlhQmd3MUtpbGhFZDBKTWU3cGpUSVpnQWJ0LzVPbnlDak9OVXN2aDJjS2lrQ1Z2dTZsZlBjNkQKckliT2ZIaHhxV0RZK2Q1TGN1YSt2NzJ0RkxhenJsSlBsRzlOZHhrQ2dZRUF5elIzT3UyMDNRVVV6bUlCRkwzZAp4Wm5XZ0JLSEo3TnNxcGFWb2RjL0d5aGVycjFDZzE2MmJaSjJDV2RsZkI0VEdtUjZZdmxTZEFOOFRwUWhFbUtKCnFBLzVzdHdxNWd0WGVLOVJmMWxXK29xNThRNTBxMmk1NVdUTThoSDZhTjlaMTltZ0FGdE5VdGNqQUx2dFYxdEYKWSs4WFJkSHJaRnBIWll2NWkwVW1VbGc9Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K"
         ```
         Replace the `tls.crt` and `tls.key` fields with the base64 encoded output from the previous step.
         
      1. Apply the manifest:
      
         ```shell
         kubectl apply -f nginxsecret.yaml
         ```
      1. Check that the Secret was created:

         ```shell
         kubectl get secrets
         ```

         The output is similar to this:

         ```
         NAME                  TYPE                                  DATA      AGE
         default-token-il9rc   kubernetes.io/service-account-token   1         1d
         nginxsecret           kubernetes.io/tls                     2         1m
         ```
   {{< /tab >}}
{{< /tabs >}}

After creating the Secret, create a ConfigMap:

```shell
kubectl create configmap nginxconfigmap --from-file=default.conf
```

Modify the nginx Deployment and Service to use the certificates and Secret you
created:

1. Save the following manifest as `nginx-secure.yaml`:

   {{< codenew file="service/networking/nginx-secure-app.yaml" >}}

   In this manifest:

   * The Deployment and Service specifications are modified in one file.
   * The nginx server serves HTTP traffic on port 80 and HTTPS traffic on port 443.
     The Service exposes both ports.
   * Each container has access to the keys through a volume mounted at `/etc/nginx/ssl`. This happens
     *before* the server is started.

1. Apply the updated manifest:

   ```shell
   kubectl apply -f ./nginx-secure-app.yaml
   ```

1. Get the new Pod IP addresses:

   ```shell
   kubectl get pods -o yaml | grep -i podIp
   ```

   The output is similar to this:

   ```
   podIP: 10.244.3.5
   ```

1. Establish a session in a node and try to reach the Pod:

   ```shell
   curl -k https://10.244.3.5
   ```
   The `-k` parameter tells `curl` to ignore CName mismatches when making
   connections over HTTPS. 

   The output is similar to this: 

   ```
   <h1>Welcome to nginx!</h1>
   ```

   By creating a Service, you linked the CName in the certificate with the DNS
   name Pods use to look up the Service. You can validate this from a Pod.

1. Save the following manifest as `curlpod.yaml`;

   {{< codenew file="service/networking/curlpod.yaml" >}}

   For simplicity, the Pod uses the `nginxsecret` Secret that contains the
   certificate and key that you created in the previous steps. The Pod only
   needs the certificate to access the Service. 

1. Apply the manifest:

   ```shell
   kubectl apply -f curlpod.yaml
   ```

1. Check that the Pod is running:

   ```shell
   kubectl get pods -l app=curlpod
   ```

   The output is similar to this:

   ```
   NAME                               READY     STATUS    RESTARTS   AGE
   curl-deployment-1515033274-1410r   1/1       Running   0          1m
   ```

1. Try to access the Service from inside the Pod using the Service name instead
   of the IP address:

   ```shell
   kubectl exec curl-deployment-1515033274-1410r \
       -- curl https://my-nginx --cacert /etc/nginx/ssl/tls.crt
   ```

   The output is similar to this:

   ```
   <title>Welcome to nginx!</title>
   ```

## Expose the Service to the internet

For some applications, you might want to expose the Service on an external IP
address. Kubernetes lets you expose Services using
[*NodePort*](/docs/concepts/services-networking/service/#type-nodeport) or
[*LoadBalancer*](/docs/concepts/services-networking/service/#loadbalancer)
objects.

The nginx server that you set up in the previous steps used a `NodePort`. To
start serving traffic on the internet, you need to give your node a public IP
address.



## {{% heading "whatsnext" %}}


Learn more about
[connecting applications with services](/docs/concepts/services-networking/connect-applications-service/).

