---
title: Rancher Integration with Ubuntu Kubernetes
---

{% capture overview %}
This repository explains how to deploy Rancher 2.0alpha on Canonical Kubernetes. 

These steps are currently in alpha/testing phase and will most likely change. 

The original documentation for this integration can be found at [https://github.com/CalvinHartwell/canonical-kubernetes-rancher/](https://github.com/CalvinHartwell/canonical-kubernetes-rancher/). 

{% endcapture %}
{% capture prerequisites %}
To use this guide, you must have a working kubernetes cluster that was deployed using Canonical's juju. 

The full instructions for deploying Kubernetes with juju can be found at [https://kubernetes.io/docs/getting-started-guides/ubuntu/installation/](https://kubernetes.io/docs/getting-started-guides/ubuntu/installation/).  
{% endcapture %}


{% capture steps %}
## Deploying Rancher

To deploy Rancher, we just need to run the Rancher container workload on-top of Kubernetes. Rancher provides their containers through dockerhub ([https://hub.docker.com/r/rancher/server/tags/](https://hub.docker.com/r/rancher/server/tags/)) and can be downloaded freely from the internet. 

If you're running your own registry or have an offline deployment, the container should be downloaded and pushed to a private registry before proceeding. 

### Deploying Rancher with a nodeport

First create a yaml file which defines how to deploy Rancher on kubernetes. Save the file as cdk-rancher-nodeport.yaml:

```
 ---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: default
    namespace: default
roleRef:
   kind: ClusterRole
   name: cluster-admin
   apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cluster-admin
rules:
- apiGroups:
  - '*'
  resources:
  - '*'
  verbs:
  - '*'
- nonResourceURLs:
  - '*'
  verbs:
  - '*'
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: rancher
  name: rancher
spec:
  replicas: 1
  selector:
    matchLabels:
      app: rancher
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: rancher
        ima: pod
    spec:
      containers:
      - image: rancher/server:preview
        imagePullPolicy: Always
        name: rancher
        ports:
        - containerPort: 80
        - containerPort: 443
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          timeoutSeconds: 30
        resources: {}
      restartPolicy: Always
      serviceAccountName: ""
status: {}
---
apiVersion: v1
kind: Service
metadata:
  name: rancher
  labels:
    app: rancher
spec:
  ports:
    - port: 443
      protocol: TCP
      targetPort: 443
  selector:
    app: rancher
---
apiVersion: v1
kind: Service
metadata: 
  name: rancher-nodeport
spec: 
  type: NodePort
  selector:
     app: rancher
  ports: 
  - name: rancher-api
    protocol: TCP
    nodePort: 30443
    port: 443
    targetPort: 443
```

Once kubectl is running and working, run the following command to deploy Rancher: 

```
  kubectl apply -f cdk-rancher-nodeport.yaml
```

Now we need to open this nodeport so we can access it. For that, we can use juju. We need to run the open-port command for each of the worker nodes in our cluster. Inside the cdk-rancher-nodeport.yaml file, the nodeport has been set to 30443. Below shows how to open the port on each of the worker nodes:

```
   # repeat this for each kubernetes worker in the cluster. 
   juju run --unit kubernetes-worker/0 "open-port 30443"
   juju run --unit kubernetes-worker/1 "open-port 30443"
   juju run --unit kubernetes-worker/2 "open-port 30443"
```

Rancher can now be accessed on this port through a worker IP or DNS entries if you have created them. It is generally recommended that you create a DNS entry for each of the worker nodes in your cluster. For example, if you have three worker nodes and you own the domain example.com, you could create three A records, one for each worker in the cluster. 

As creating DNS entries is outside of the scope of this document, we will use the freely available xip.io service which can return A records for an IP address which is part of the domain name. For example, if you have the domain rancher.35.178.130.245.xip.io, the xip.io service will automatically return the IP address 35.178.130.245 as an A record which is useful for testing purposes.  For your deployment, the IP address 35.178.130.245 should be replaced with one of your worker IP address, which can be found using Juju or AWS: 

```
 calvinh@ubuntu-ws:~/Source/cdk-rancher$ juju status

# ... output omitted. 

Unit                      Workload  Agent  Machine  Public address  Ports                     Message
easyrsa/0*                active    idle   0        35.178.118.232                            Certificate Authority connected.
etcd/0*                   active    idle   1        35.178.49.31    2379/tcp                  Healthy with 3 known peers
etcd/1                    active    idle   2        35.177.99.171   2379/tcp                  Healthy with 3 known peers
etcd/2                    active    idle   3        35.178.125.161  2379/tcp                  Healthy with 3 known peers
kubeapi-load-balancer/0*  active    idle   4        35.178.37.87    443/tcp                   Loadbalancer ready.
kubernetes-master/0*      active    idle   5        35.177.239.237  6443/tcp                  Kubernetes master running.
  flannel/0*              active    idle            35.177.239.237                            Flannel subnet 10.1.27.1/24
kubernetes-worker/0*      active    idle   6        35.178.130.245  80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/2               active    idle            35.178.130.245                            Flannel subnet 10.1.82.1/24
kubernetes-worker/1       active    idle   7        35.178.121.29   80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/3               active    idle            35.178.121.29                             Flannel subnet 10.1.66.1/24
kubernetes-worker/2       active    idle   8        35.177.144.76   80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/1               active    idle            35.177.144.76                        

# Note the IP addresses for the kubernetes-workers in the example above.  You should pick one of the public addresses. 
```

Try opening up Rancher in your browser using the nodeport and the domain name or ip address:  

```
  # replace the IP address with one of your Kubernetes worker, find this from juju status command. 
  wget https://35.178.130.245.xip.io:30443 --no-check-certificate

  # this should also work
  wget https://35.178.130.245:30443 --no-check-certificate 
```

If you need to make any changes to the kubernetes configuration file, edit the yaml file and then just use apply again: 

```
  kubectl apply -f cdk-rancher-nodeport.yaml
```

### Deploying Rancher with an ingress rule

It is also possible to deploy Rancher using an ingress rule. This has the added benefit of not requiring additional ports to be opened up on the Kubernetes cluster. First create a yaml file to describe the deployment called cdk-rancher-ingress.yaml which should contain the following:

```
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: default
    namespace: default
roleRef:
   kind: ClusterRole
   name: cluster-admin
   apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cluster-admin
rules:
- apiGroups:
  - '*'
  resources:
  - '*'
  verbs:
  - '*'
- nonResourceURLs:
  - '*'
  verbs:
  - '*'
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: rancher
  name: rancher
spec:
  replicas: 1
  selector:
    matchLabels:
      app: rancher
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: rancher
    spec:
      containers:
      - image: rancher/server:preview
        imagePullPolicy: Always
        name: rancher
        ports:
        - containerPort: 443
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          timeoutSeconds: 30
        resources: {}
      restartPolicy: Always
      serviceAccountName: ""
status: {}
---
apiVersion: v1
kind: Service
metadata: 
  name: rancher
  labels:
    app: rancher
spec: 
  ports: 
    - port: 443
      targetPort: 443
      protocol: TCP
  selector:
    app: rancher
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
 name: rancher
 annotations:
   kubernetes.io/tls-acme: "true"
   ingress.kubernetes.io/secure-backends: "true"
spec:
 tls:
   - hosts:
     - rancher.34.244.118.135.xip.io
 rules:
   - host: rancher.34.244.118.135.xip.io
     http:
       paths:
         - path: /
           backend: 
             serviceName: rancher
             servicePort: 443
```

It is generally recommended that you create a DNS entry for each of the worker nodes in your cluster. For example, if you have three worker nodes and you own the domain example.com, you could create three A records, one for each worker in the cluster.

As creating DNS entries is outside of the scope of this tutorial, we will use the freely available xip.io service which can return A records for an IP address which is part of the domain name. For example, if you have the domain rancher.35.178.130.245.xip.io, the xip.io service will automatically return the IP address 35.178.130.245 as an A record which is useful for testing purposes.  

For your deployment, the IP address 35.178.130.245 should be replaced with one of your worker IP address, which can be found using Juju or AWS:

```
 calvinh@ubuntu-ws:~/Source/cdk-rancher$ juju status

# ... output omitted. 

Unit                      Workload  Agent  Machine  Public address  Ports                     Message
easyrsa/0*                active    idle   0        35.178.118.232                            Certificate Authority connected.
etcd/0*                   active    idle   1        35.178.49.31    2379/tcp                  Healthy with 3 known peers
etcd/1                    active    idle   2        35.177.99.171   2379/tcp                  Healthy with 3 known peers
etcd/2                    active    idle   3        35.178.125.161  2379/tcp                  Healthy with 3 known peers
kubeapi-load-balancer/0*  active    idle   4        35.178.37.87    443/tcp                   Loadbalancer ready.
kubernetes-master/0*      active    idle   5        35.177.239.237  6443/tcp                  Kubernetes master running.
  flannel/0*              active    idle            35.177.239.237                            Flannel subnet 10.1.27.1/24
kubernetes-worker/0*      active    idle   6        35.178.130.245  80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/2               active    idle            35.178.130.245                            Flannel subnet 10.1.82.1/24
kubernetes-worker/1       active    idle   7        35.178.121.29   80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/3               active    idle            35.178.121.29                             Flannel subnet 10.1.66.1/24
kubernetes-worker/2       active    idle   8        35.177.144.76   80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/1               active    idle            35.177.144.76

# Note the IP addresses for the kubernetes-workers in the example above.  You should pick one of the public addresses. 
```

Looking at the output from the juju status above, the Public Address (35.178.130.245) can be used to create a xip.io DNS entry (rancher.35.178.130.245.xip.io) which should be placed into the cdk-rancher-ingress.yaml file. You could also create your own DNS entry as long as it resolves to each of the worker nodes or one of them it will work fine: 

```
  # The xip.io domain should appear in two places in the file, change both entries. 
  cat cdk-rancher-ingress.yaml | grep xip.io
  - host: rancher.35.178.130.245.xip.io
```

Once you've edited the ingress rule to reflect your DNS entries, run the kubectl apply -f cdk-rancher-ingress.yaml to deploy Kubernetes: 

```
 kubectl apply -f cdk-rancher-ingress.yaml
```

Rancher can now be accessed on the regular 443 through a worker IP or DNS entries if you have created them. Try opening it up in your browser:

```
  # replace the IP address with one of your Kubernetes worker, find this from juju status command.
  wget https://35.178.130.245.xip.io:443 --no-check-certificate
```

If you need to make any changes to the kubernetes configuration file, edit the yaml file and then just use apply again:

```
  kubectl apply -f cdk-rancher-ingress.yaml
```

### Removing Rancher

You can remove Rancher from your cluster using kubectl. Deleting constructs in Kubernetes is as simple as creating them: 

```
  # If you used the nodeport example change the yaml filename if you used the ingress example. 
  kubectl delete -f cdk-rancher-nodeport.yaml
```
{% endcapture %}

{% include templates/task.md %}
