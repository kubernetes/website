---
reviewers:
- lachie83
- khenidak
- bridgetkromhout
min-kubernetes-server-version: v1.23
title: Validate IPv4/IPv6 dual-stack
content_type: task
---

<!-- overview -->
Este documento comparte cómo validar los clústeres de Kubernetes habilitados para el dual-stack IPv4/IPv6.


## {{% heading "prerequisites" %}}


* Soporte del proveedor para redes de dual-stack (el proveedor de la nube o de otro tipo debe poder proporcionar a los nodos de Kubernetes interfaces de red IPv4/IPv6 enrutables)
* Un [plugin de red](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) que admite redes de dual-stack.
* [Dual-stack habilitado](/docs/concepts/services-networking/dual-stack/) cluster

{{< version-check >}}

{{< note >}}
Si bien puede validar con una versión anterior, la función solo es GA y se admite oficialmente desde la versión 1.23.
{{< /note >}}


<!-- steps -->

## Validar direccionamiento

### Validar direccionamiento de nodo

Cada nodo del dual-stack debe tener asignado un único bloque IPv4 y un único bloque IPv6. Valide que los rangos de direcciones del pod IPv4/IPv6 estén configurados ejecutando el siguiente comando. Reemplace el nombre del nodo de muestra con un nodo de dual-stack válido de su clúster. En este ejemplo, el nombre del nodo es `k8s-linuxpool1-34450317-0`:

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .spec.podCIDRs}}{{printf "%s\n" .}}{{end}}'
```
```
10.244.1.0/24
2001:db8::/64
```
Debe haber un bloque IPv4 y un bloque IPv6 asignado.

Validar que el nodo tenga una interfaz IPv4 e IPv6 detectada. Reemplace el nombre del nodo con un nodo válido del clúster. En este ejemplo, el nombre del nodo es `k8s-linuxpool1-34450317-0`:

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .status.addresses}}{{printf "%s: %s\n" .type .address}}{{end}}'
```
```
Hostname: k8s-linuxpool1-34450317-0
InternalIP: 10.0.0.5
InternalIP: 2001:db8:10::5
```

### Validar el direccionamiento del pod

Validar que un Pod tenga asignada una dirección IPv4 e IPv6. Reemplace el nombre del Pod con un Pod válido en su clúster. En este ejemplo, el nombre del Pod es `pod01`:

```shell
kubectl get pods pod01 -o go-template --template='{{range .status.podIPs}}{{printf "%s\n" .ip}}{{end}}'
```
```
10.244.1.4
2001:db8::4
```

También puede validar las IPs del Pod utilizando la API descendente a través de `status.podIPs`. El siguiente fragmento muestra cómo se puede exponer las IP del Pod a través de una variable de entorno llamada `MY_POD_IPS` dentro de un contenedor.

```
        env:
        - name: MY_POD_IPS
          valueFrom:
            fieldRef:
              fieldPath: status.podIPs
```

El siguiente comando imprime el valor de la variable de entorno `MY_POD_IPS` desde dentro de un contenedor. El valor es una lista separada por comas que corresponde a las direcciones IPv4 e IPv6 del Pod.

```shell
kubectl exec -it pod01 -- set | grep MY_POD_IPS
```
```
MY_POD_IPS=10.244.1.4,2001:db8::4
```

Las direcciones IPs del Pod también se escribirán en `/etc/hosts` dentro de un contenedor. El siguiente comando cat se ejecuta en `/etc/hosts` en un Pod de dual-stack. Desde el resultado se puede verificar la dirección IP IPv4 e IPv6 del Pod.

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
2001:db8::4    pod01
```

## Validar Servicios

Cree el siguiente servicio que no defina explícitamente `.spec.ipFamilyPolicy`. Kubernetes asignará una direccion IP del clúster para el Servicio desde el primer `service-cluster-ip-range` configurado y establecerá `.spec.ipFamilyPolicy` en `SingleStack`.

{{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

Utilice `kubectl` para ver el archivo YAML del Servicio.

```shell
kubectl get svc my-service -o yaml
```

The Service has `.spec.ipFamilyPolicy` set to `SingleStack` and `.spec.clusterIP` set to an IPv4 address from the first configured range set via `--service-cluster-ip-range` flag on kube-controller-manager.

El Servicio tiene `.spec.ipFamilyPolicy` configurado en `SingleStack` y `.spec.clusterIP` configurado en una dirección IPv4 del primer rango configurado establecido a través de la etiqueta `--service-cluster-ip-range` en el kube-controller-manager.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: default
spec:
  clusterIP: 10.0.217.164
  clusterIPs:
  - 10.0.217.164
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - port: 80
    protocol: TCP
    targetPort: 9376
  selector:
    app.kubernetes.io/name: MyApp
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

Cree el siguiente servicio que define explícitamente la `IPv6` como el primer elemento de matriz en `.spec.ipFamilies`. Kubernetes asignará una IP en el clúster para el Servicio desde el rango IPv6 configurado `service-cluster-ip-range` y establecerá `.spec.ipFamilyPolicy` en `SingleStack`.

{{% code_sample file="service/networking/dual-stack-ipfamilies-ipv6.yaml" %}}

Utilice `kubectl` para ver el archivo YAML del Servicio.

```shell
kubectl get svc my-service -o yaml
```

El Servicio tiene `.spec.ipFamilyPolicy` configurado en `SingleStack` y `.spec.clusterIP` configurado en una dirección IPv6 del rango IPv6 establecido a través de la etiqueta `--service-cluster-ip-range` en kube-controller-manager.

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: MyApp
  name: my-service
spec:
  clusterIP: 2001:db8:fd00::5118
  clusterIPs:
  - 2001:db8:fd00::5118
  ipFamilies:
  - IPv6
  ipFamilyPolicy: SingleStack
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app.kubernetes.io/name: MyApp
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

Cree el siguiente servicio que defina explícitamente `PreferDualStack` en `.spec.ipFamilyPolicy`. Kubernetes asignará direcciones IPv4 e IPv6 (ya que este clúster tiene habilitada el dual-stack) y seleccionará `.spec.ClusterIP` de la lista de `.spec.ClusterIPs` basado en la familia de direcciones del primer elemento de la matriz `.spec.ipFamilies`.

{{% code_sample file="service/networking/dual-stack-preferred-svc.yaml" %}}

{{< note >}}
El comando `kubectl get svc` solo mostrará la IP principal en el campo `CLUSTER-IP`.

```shell
kubectl get svc -l app.kubernetes.io/name=MyApp

NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-service   ClusterIP   10.0.216.242   <none>        80/TCP    5s
```
{{< /note >}}

Valide que el Servicio obtenga las IPs del clúster de los bloques de direcciones IPv4 e IPv6 utilizando `kubectl describe`. Luego podrá validar el acceso al servicio a través de las IPs y los puertos.

```shell
kubectl describe svc -l app.kubernetes.io/name=MyApp
```

```
Name:              my-service
Namespace:         default
Labels:            app.kubernetes.io/name=MyApp
Annotations:       <none>
Selector:          app.kubernetes.io/name=MyApp
Type:              ClusterIP
IP Family Policy:  PreferDualStack
IP Families:       IPv4,IPv6
IP:                10.0.216.242
IPs:               10.0.216.242,2001:db8:fd00::af55
Port:              <unset>  80/TCP
TargetPort:        9376/TCP
Endpoints:         <none>
Session Affinity:  None
Events:            <none>
```

### Cree un servicio de carga equilibrada de dual-stack

Si el proveedor de la nube admite el aprovisionamiento de balanceadores de carga externos habilitados para IPv6, cree el siguiente Servicio con `PreferDualStack` en `.spec.ipFamilyPolicy`, `IPv6` como el primer elemento de la matriz `.spec.ipFamilies` y el campo `type` establecido en `LoadBalancer`.

{{% code_sample file="service/networking/dual-stack-prefer-ipv6-lb-svc.yaml" %}}

Consulta el Servicio:

```shell
kubectl get svc -l app.kubernetes.io/name=MyApp
```

Validar que el Servicio reciba una dirección  `CLUSTER-IP` del bloque de direcciones IPv6 junto con una `EXTERNAL-IP`. Luego podrá validar el acceso al servicio a través de la IP y el puerto.

```shell
NAME         TYPE           CLUSTER-IP            EXTERNAL-IP        PORT(S)        AGE
my-service   LoadBalancer   2001:db8:fd00::7ebc   2603:1030:805::5   80:30790/TCP   35s
```


