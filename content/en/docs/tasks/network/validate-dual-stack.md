---
reviewers:
- lachie83
- khenidak
title: Validate IPv4/IPv6 dual-stack
content_template: templates/task
---

{{% capture overview %}}
This document shares how to validate IPv4/IPv6 dual-stack enabled Kubernetes clusters.
{{% /capture %}}

{{% capture prerequisites %}}

* Kubernetes 1.16 or later
* Provider support for dual-stack networking (Cloud provider or otherwise must be able to provide Kubernetes nodes with routable IPv4/IPv6 network interfaces)
* Kubenet network plugin
* Kube-proxy running in mode IPVS
* [Dual-stack enabled](/docs/concepts/cluster-administration/networking/#enable-ipv4-ipv6-dual-stack) cluster

{{% /capture %}}

{{% capture steps %}}

## Validate Pod and Node addressing

Validate IPv4/IPv6 Pod CIDRs have been assigned on a dual-stack enabled node by running the following command. There should be a single IPv4 and IPv6 CIDR allocated (replace node name with a valid node from the cluster. In this example the node name is k8s-linuxpool1-34450317-0):

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .spec.podCIDRs}}{{printf "%s\n" .}}{{end}}'
10.244.1.0/24
a00:100::/24
```
There should be a single IPv4 and IPv6 CIDR allocated.

Validate that the node has an IPv4 and IPv6 interface detected (replace node name with a valid node from the cluster. In this example the node name is k8s-linuxpool1-34450317-0): 
```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .status.addresses}}{{printf "%s: %s \n" .type .address}}{{end}}'
Hostname: k8s-linuxpool1-34450317-0
InternalIP: 10.240.0.5
InternalIP: 2001:1234:5678:9abc::5
```

Validate that a Pod has an IPv4 and IPv6 address assigned. (replace Pod name with a valid Pod on the cluster. In this example the node name is n01-79845568c8-jm9sq)
```shell
kubectl get pods n01-79845568c8-jm9sq -o go-template --template='{{range .status.podIPs}}{{printf "%s \n" .ip}}{{end}}'
10.244.1.4
a00:100::4
```

## Validate Services

Create the following Service without the `ipFamily` field set. When this field is not set, the Service gets an IP from the first configured range via `--service-cluster-ip-range` flag on the kube-controller-manager.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  labels:
    app: MyApp
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

By viewing the YAML for the Service you can observe that the Service has the `ipFamily` field has set to reflect the address family of the first configured range set via `--service-cluster-ip-range` flag on kube-controller-manager.

```yaml
kubectl get svc my-service -o yaml
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: "2019-09-03T20:45:13Z"
  labels:
    app: MyApp
  name: my-service
  namespace: default
  resourceVersion: "485836"
  selfLink: /api/v1/namespaces/default/services/my-service
  uid: b6fa83ef-fe7e-47a3-96a1-ac212fa5b030
spec:
  clusterIP: 10.0.29.179
  ipFamily: IPv4
  ports:
  - port: 80
    protocol: TCP
    targetPort: 9376
  selector:
    app: MyApp
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

Create the following Service with the `ipFamily` field set to `IPv6`.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  labels:
    app: MyApp
spec:
  ipFamily: IPv6
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

Validate that the Service gets a cluster IP address from the IPv6 address block. You may then validate access to the service via the IP and port.
```
 kubectl get svc -l app=MyApp
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
my-service   ClusterIP   fe80:20d::d06b   <none>        80/TCP    9s
```

### type LoadBalancer

If the cloud provider supports the provisioning of IPv6 enabled external load balancer, create the following Service with both the `ipFamily` field set to `IPv6` and the `type` field set to `LoadBalancer`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  labels:
    app: MyApp
spec:
  ipFamily: IPv6
  type: LoadBalancer
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

Validate that the Service receives a `CLUSTER-IP` address from the IPv6 address block along with an `EXTERNAL-IP`. You may then validate access to the service via the IP and port. 
```
 kubectl get svc -l app=MyApp
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP                     PORT(S)        AGE
my-service   ClusterIP   fe80:20d::d06b   2a01:111:f100:4002::9d37:c0d7   80:31868/TCP   30s
```

{{% /capture %}}


