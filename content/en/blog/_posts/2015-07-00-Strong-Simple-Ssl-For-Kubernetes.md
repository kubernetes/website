---
title: " Strong, Simple SSL for Kubernetes Services "
date: 2015-07-14
slug: strong-simple-ssl-for-kubernetes
url: /blog/2015/07/Strong-Simple-Ssl-For-Kubernetes
author: >
   Evan Brown (Google)
---
Hi, I’m Evan Brown [(@evandbrown](http://twitter.com/evandbrown)) and I work on the solutions architecture team for Google Cloud Platform. I recently wrote an [article](https://cloud.google.com/solutions/automated-build-images-with-jenkins-kubernetes) and [tutorial](https://github.com/GoogleCloudPlatform/kube-jenkins-imager) about using Jenkins on Kubernetes to automate the Docker and GCE image build process. Today I’m going to discuss how I used Kubernetes services and secrets to add SSL to the Jenkins web UI. After reading this, you’ll be able to add SSL termination (and HTTP-\>HTTPS redirects + basic auth) to your public HTTP Kubernetes services.

### In the beginning

In the spirit of minimum viability, the first version of Jenkins-on-Kubernetes I built was very basic but functional:  

- The Jenkins leader was just a single container in one pod, but it was managed by a replication controller, so if it failed it would automatically respawn.
- The Jenkins leader exposes two ports - TCP 8080 for the web UI and TCP 50000 for build agents to register - and those ports are made available as a Kubernetes service with a public load balancer.



Here’s a visual of that first version:

[![](https://1.bp.blogspot.com/-ccmpTmulrng/VaVxOs7gysI/AAAAAAAAAU8/bCEzgGGm-pE/s400/0.png)](https://1.bp.blogspot.com/-ccmpTmulrng/VaVxOs7gysI/AAAAAAAAAU8/bCEzgGGm-pE/s1600/0.png)






This works, but I have a few problems with it. First, authentication isn’t configured in a default Jenkins installation. The leader is sitting on the public Internet, accessible to anyone, until you connect and configure authentication. And since there’s no encryption, configuring authentication is kind of a symbolic gesture. We need SSL, and we need it now!

### Do what you know

For a few milliseconds I considered trying to get SSL working directly on Jenkins. I’d never done it before, and I caught myself wondering if it would be as straightforward as working with SSL on [Nginx](http://nginx.org/), something I do have experience with. I’m all for learning new things, but this seemed like a great place to not invent a new wheel: SSL on Nginx is straightforward and well documented (as are its reverse-proxy capabilities), and Kubernetes is all about building functionality by orchestrating and composing containers. Let’s use Nginx, and add a few bonus features that Nginx makes simple: HTTP-\>HTTPS redirection, and basic access authentication.

### SSL termination proxy as an nginx service

I started by putting together a [Dockerfile](https://github.com/GoogleCloudPlatform/nginx-ssl-proxy/blob/master/Dockerfile) that inherited from the standard nginx image, copied a few Nginx config files, and added a custom entrypoint (start.sh). The entrypoint script checks an environment variable (ENABLE\_SSL) and activates the correct Nginx config accordingly (meaning that unencrypted HTTP reverse proxy is possible, but that defeats the purpose). The script also configures basic access authentication if it’s enabled (the ENABLE\_BASIC\_AUTH env var).



Finally, start.sh evaluates the SERVICE\_HOST\_ENV\_NAME and SERVICE\_PORT\_ENV\_NAME env vars. These variables should be set to the names of the environment variables for the Kubernetes service you want to proxy to. In this example, the service for our Jenkins leader is cleverly named jenkins, which means pods in the cluster will see an environment variable named JENKINS\_SERVICE\_HOST and JENKINS\_SERVICE\_PORT\_UI (the port that 8080 is mapped to on the Jenkins leader). SERVICE\_HOST\_ENV\_NAME and SERVICE\_PORT\_ENV\_NAME simply reference the correct service to use for a particular scenario, allowing the image to be used generically across deployments.

### Defining the Controller and Service

LIke every other pod in this example, we’ll deploy Nginx with a replication controller, allowing us to scale out or in, and recover automatically from container failures. This excerpt from a[complete descriptor in the sample app](https://github.com/GoogleCloudPlatform/kube-jenkins-imager/blob/master/ssl_proxy.yaml#L20-L48) shows some relevant bits of the pod spec:



```
  spec:

    containers:

      -

        name: "nginx-ssl-proxy"

        image: "gcr.io/cloud-solutions-images/nginx-ssl-proxy:latest"

        env:

          -

            name: "SERVICE\_HOST\_ENV\_NAME"

            value: "JENKINS\_SERVICE\_HOST"

          -

            name: "SERVICE\_PORT\_ENV\_NAME"

            value: "JENKINS\_SERVICE\_PORT\_UI"

          -

            name: "ENABLE\_SSL"

            value: "true"

          -

            name: "ENABLE\_BASIC\_AUTH"

            value: "true"

        ports:

          -

            name: "nginx-ssl-proxy-http"

            containerPort: 80

          -

            name: "nginx-ssl-proxy-https"

            containerPort: 443
 ```




The pod will have a service exposing TCP 80 and 443 to a public load balancer. Here’s the service descriptor [(also available in the sample app](https://github.com/GoogleCloudPlatform/kube-jenkins-imager/blob/master/service_ssl_proxy.yaml)):



```
  kind: "Service"

  apiVersion: "v1"

  metadata:

    name: "nginx-ssl-proxy"

    labels:

      name: "nginx"

      role: "ssl-proxy"

  spec:

    ports:

      -

        name: "https"

        port: 443

        targetPort: "nginx-ssl-proxy-https"

        protocol: "TCP"

      -

        name: "http"

        port: 80

        targetPort: "nginx-ssl-proxy-http"

        protocol: "TCP"

    selector:

      name: "nginx"

      role: "ssl-proxy"

    type: "LoadBalancer"
 ```




And here’s an overview with the SSL termination proxy in place. Notice that Jenkins is no longer directly exposed to the public Internet:

[![](https://3.bp.blogspot.com/-0B1BEQo_fWc/VaVxVUBkf3I/AAAAAAAAAVE/5yCCnA29C88/s400/0%2B%25281%2529.png)](https://3.bp.blogspot.com/-0B1BEQo_fWc/VaVxVUBkf3I/AAAAAAAAAVE/5yCCnA29C88/s1600/0%2B%25281%2529.png)





Now, how did the Nginx pods get ahold of the super-secret SSL key/cert and htpasswd file (for basic access auth)?

### Keep it secret, keep it safe

Kubernetes has an [API and resource for Secrets](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/secrets.md). Secrets “are intended to hold sensitive information, such as passwords, OAuth tokens, and ssh keys. Putting this information in a secret is safer and more flexible than putting it verbatim in a pod definition or in a docker image.”



You can create secrets in your cluster in 3 simple steps:



1.
Base64-encode your secret data (i.e., SSL key pair or htpasswd file)

```
$ cat ssl.key | base64  
   LS0tLS1CRUdJTiBDRVJUS...
 ```




1.
Create a json document describing your secret, and add the base64-encoded values:

```
  apiVersion: "v1"

  kind: "Secret"

  metadata:

    name: "ssl-proxy-secret"

    namespace: "default"

  data:

    proxycert: "LS0tLS1CRUd..."

    proxykey: "LS0tLS1CR..."

    htpasswd: "ZXZhb..."
 ```




1.
Create the secrets resource:

```
$ kubectl create -f secrets.json
 ```


To access the secrets from a container, specify them as a volume mount in your pod spec. Here’s the relevant excerpt from the [Nginx proxy template](https://github.com/GoogleCloudPlatform/kube-jenkins-imager/blob/master/ssl_proxy.yaml###L41-L48) we saw earlier:



```
  spec:

    containers:

      -

        name: "nginx-ssl-proxy"

        image: "gcr.io/cloud-solutions-images/nginx-ssl-proxy:latest"

        env: [...]

        ports: ...[]

        volumeMounts:

          -

            name: "secrets"

            mountPath: "/etc/secrets"

            readOnly: true

    volumes:

      -

        name: "secrets"

        secret:

          secretName: "ssl-proxy-secret"
 ```




A volume of type secret that points to the ssl-proxy-secret secret resource is defined, and then mounted into /etc/secrets in the container. The secrets spec in the earlier example defined data.proxycert, data.proxykey, and data.htpasswd, so we would see those files appear (base64-decoded) in /etc/secrets/proxycert, /etc/secrets/proxykey, and /etc/secrets/htpasswd for the Nginx process to access.



All together now

I have “containers and Kubernetes are fun and cool!” moments all the time, like probably every day. I’m beginning to have “containers and Kubernetes are extremely useful and powerful and are adding value to what I do by helping me do important things with ease” more frequently. This SSL termination proxy with Nginx example is definitely one of the latter. I didn’t have to waste time learning a new way to use SSL. I was able to solve my problem using well-known tools, in a reusable way, and quickly (from idea to working took about 2 hours).


Check out the complete [Automated Image Builds with Jenkins, Packer, and Kubernetes](https://github.com/GoogleCloudPlatform/kube-jenkins-imager) repo to see how the SSL termination proxy is used in a real cluster, or dig into the details of the proxy image in the [nginx-ssl-proxy repo](https://github.com/GoogleCloudPlatform/nginx-ssl-proxy) (complete with a Dockerfile and Packer template so you can build the image yourself).
