---
reviewers:
- lachie83
- khenidak
min-kubernetes-server-version: v1.16
title: Validate IPv4/IPv6 dual-stack
content_template: templates/task
---

{{% capture overview %}}
This document shares how to validate IPv4/IPv6 dual-stack enabled Kubernetes clusters.
{{% /capture %}}

{{% capture prerequisites %}}

* Provider support for dual-stack networking (Cloud provider or otherwise must be able to provide Kubernetes nodes with routable IPv4/IPv6 network interfaces)
* A [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) that supports dual-stack (such as Kubenet or Calico)
* Kube-proxy running in mode IPVS
* [Dual-stack enabled](/docs/concepts/services-networking/dual-stack/) cluster

{{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Validate addressing

### Validate node addressing

Each dual-stack Node should have a single IPv4 block and a single IPv6 block allocated. Validate that IPv4/IPv6 Pod address ranges are configured by running the following command. Replace the sample node name with a valid dual-stack Node from your cluster. In this example, the Node's name is `k8s-linuxpool1-34450317-0`:

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .spec.podCIDRs}}{{printf "%s\n" .}}{{end}}'
```
```
10.244.1.0/24
a00:100::/24
```
There should be one IPv4 block and one IPv6 block allocated.

Validate that the node has an IPv4 and IPv6 interface detected (replace node name with a valid node from the cluster. In this example the node name is k8s-linuxpool1-34450317-0):
```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .status.addresses}}{{printf "%s: %s \n" .type .address}}{{end}}'
```
```
Hostname: k8s-linuxpool1-34450317-0
InternalIP: 10.240.0.5
InternalIP: 2001:1234:5678:9abc::5
```

### Validate Pod addressing

Validate that a Pod has an IPv4 and IPv6 address assigned. (replace the Pod name with a valid Pod in your cluster. In this example the Pod name is pod01)
```shell
kubectl get pods pod01 -o go-template --template='{{range .status.podIPs}}{{printf "%s \n" .ip}}{{end}}'
```
```
10.244.1.4
a00:100::4
```

You can also validate Pod IPs using the Downward API via the `status.podIPs` fieldPath. The following snippet demonstrates how you can expose the Pod IPs via an environment variable called `MY_POD_IPS` within a container.

```
        env:
        - name: MY_POD_IPS
          valueFrom:
            fieldRef:
              fieldPath: status.podIPs
```

The following command prints the value of the `MY_POD_IPS` environment variable from within a container. The value is a comma separated list that corresponds to the Pod's IPv4 and IPv6 addresses.
```shell
kubectl exec -it pod01 -- set | grep MY_POD_IPS
```
```
MY_POD_IPS=10.244.1.4,a00:100::4
```

The Pod's IP addresses will also be written to `/etc/hosts` within a container. The following command executes a cat on `/etc/hosts` on a dual stack Pod. From the output you can verify both the IPv4 and IPv6 IP address for the Pod.

```shell
kubectl exec -it pod01 -- cat /etc/hosts
```
```
# Kubernetes-managed hosts file.
127.0.0.1    localhost
::1    localhost ip6-localhost ip6-loopback
fe00::0    ip6-localnet
fe00::0    ip6-mcastprefix
fe00::1    ip6-allnodes
fe00::2    ip6-allrouters
10.244.1.4    pod01
a00:100::4    pod01
```

## Validate Services

Create the following Service without the `ipFamily` field set. When this field is not set, the Service gets an IP from the first configured range via `--service-cluster-ip-range` flag on the kube-controller-manager.

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

By viewing the YAML for the Service you can observe that the Service has the `ipFamily` field has set to reflect the address family of the first configured range set via `--service-cluster-ip-range` flag on kube-controller-manager.

```shell
kubectl get svc my-service -o yaml
```

```yaml
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

{{< codenew file="service/networking/dual-stack-ipv6-svc.yaml" >}}

Validate that the Service gets a cluster IP address from the IPv6 address block. You may then validate access to the service via the IP and port.
```
 kubectl get svc -l app=MyApp
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
my-service   ClusterIP   fe80:20d::d06b   <none>        80/TCP    9s
```

### Create a dual-stack load balanced Service

If the cloud provider supports the provisioning of IPv6 enabled external load balancer, create the following Service with both the `ipFamily` field set to `IPv6` and the `type` field set to `LoadBalancer`

{{< codenew file="service/networking/dual-stack-ipv6-lb-svc.yaml" >}}

Validate that the Service receives a `CLUSTER-IP` address from the IPv6 address block along with an `EXTERNAL-IP`. You may then validate access to the service via the IP and port.
```
 kubectl get svc -l app=MyApp
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP                     PORT(S)        AGE
my-service   ClusterIP   fe80:20d::d06b   2001:db8:f100:4002::9d37:c0d7   80:31868/TCP   30s
```

{{% /capture %}}
