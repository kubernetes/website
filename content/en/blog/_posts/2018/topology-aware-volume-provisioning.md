---
layout: blog
title: 'Topology-Aware Volume Provisioning in Kubernetes'
date: 2018-10-11
author: >
  Michelle Au (Google)
---

The multi-zone cluster experience with persistent volumes is improving in Kubernetes 1.12 with the topology-aware dynamic provisioning beta feature. This feature allows Kubernetes to make intelligent decisions when dynamically provisioning volumes by getting scheduler input on the best place to provision a volume for a pod.  In multi-zone clusters, this means that volumes will get provisioned in an appropriate zone that can run your pod, allowing you to easily deploy and scale your stateful workloads across failure domains to provide high availability and fault tolerance.

## Previous challenges

Before this feature, running stateful workloads with zonal persistent disks (such as AWS ElasticBlockStore, Azure Disk, GCE PersistentDisk) in multi-zone clusters had many challenges. Dynamic provisioning was handled independently from pod scheduling, which meant that as soon as you created a PersistentVolumeClaim (PVC), a volume would get provisioned. This meant that the provisioner had no knowledge of what pods were using the volume, and any pod constraints it had that could impact scheduling.

This resulted in unschedulable pods because volumes were provisioned in zones that:

* did not have enough CPU or memory resources to run the pod
* conflicted with node selectors, pod affinity or anti-affinity policies
* could not run the pod due to taints

Another common issue was that a non-StatefulSet pod using multiple persistent volumes could have each volume provisioned in a different zone, again resulting in an unschedulable pod.

Suboptimal workarounds included overprovisioning of nodes, or manual creation of volumes in the correct zones, making it difficult to dynamically deploy and scale stateful workloads.

The topology-aware dynamic provisioning feature addresses all of the above issues.

## Supported Volume Types

In 1.12, the following drivers support topology-aware dynamic provisioning:

* AWS EBS
* Azure Disk
* GCE PD (including Regional PD)
* CSI (alpha) - currently only the GCE PD CSI driver has implemented topology support

## Design Principles

While the initial set of supported plugins are all zonal-based, we designed this feature to adhere to the Kubernetes principle of portability across environments. Topology specification is generalized and uses a similar label-based specification like in Pod nodeSelectors and nodeAffinity. This mechanism allows you to define your own topology boundaries, such as racks in on-premise clusters, without requiring modifications to the scheduler to understand these custom topologies.

In addition, the topology information is abstracted away from the pod specification, so a pod does not need knowledge of the underlying storage system’s topology characteristics. This means that you can use the same pod specification across multiple clusters, environments, and storage systems.

## Getting Started

To enable this feature, all you need to do is to create a StorageClass with `volumeBindingMode` set to `WaitForFirstConsumer`:

```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: topology-aware-standard
provisioner: kubernetes.io/gce-pd
volumeBindingMode: WaitForFirstConsumer
parameters:
  type: pd-standard
```

This new setting instructs the volume provisioner to not create a volume immediately, and instead, wait for a pod using an associated PVC to run through scheduling. Note that previous StorageClass `zone` and `zones` parameters do not need to be specified anymore, as pod policies now drive the decision of which zone to provision a volume in.

Next, create a pod and PVC with this StorageClass. This sequence is the same as before, but with a different StorageClass specified in the PVC. The following is a hypothetical example, demonstrating the capabilities of the new feature by specifying many pod constraints and scheduling policies:

* multiple PVCs in a pod
* nodeAffinity across a subset of zones
* pod anti-affinity on zones

```
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:   
  serviceName: "nginx"
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: failure-domain.beta.kubernetes.io/zone
                operator: In
                values:
                - us-central1-a
                - us-central1-f
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - nginx
            topologyKey: failure-domain.beta.kubernetes.io/zone
      containers:
      - name: nginx
        image: gcr.io/google_containers/nginx-slim:0.8
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
        - name: logs
          mountPath: /logs
 volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: topology-aware-standard
      resources:
        requests:
          storage: 10Gi
  - metadata:
      name: logs
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: topology-aware-standard
      resources:
        requests:
          storage: 1Gi
```

Afterwards, you can see that the volumes were provisioned in zones according to the policies set by the pod:

```
$ kubectl get pv -o=jsonpath='{range .items[*]}{.spec.claimRef.name}{"\t"}{.metadata.labels.failure\-domain\.beta\.kubernetes\.io/zone}{"\n"}{end}'
www-web-0       us-central1-f
logs-web-0      us-central1-f
www-web-1       us-central1-a
logs-web-1      us-central1-a
```

## How can I learn more?

Official documentation on the topology-aware dynamic provisioning feature is available [here](/docs/concepts/storage/storage-classes/#volume-binding-mode)

Documentation for CSI drivers is available at https://kubernetes-csi.github.io/docs/

## What’s next?

We are actively working on improving this feature to support:

* more volume types, including dynamic provisioning for local volumes
* dynamic volume attachable count and capacity limits per node

## How do I get involved?

If you have feedback for this feature or are interested in getting involved with the design and development, join the [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.

Special thanks to all the contributors that helped bring this feature to beta, including Cheng Xing ([verult](https://github.com/verult)), Chuqiang Li ([lichuqiang](https://github.com/lichuqiang)), David Zhu ([davidz627](https://github.com/davidz627)), Deep Debroy ([ddebroy](https://github.com/ddebroy)), Jan Šafránek ([jsafrane](https://github.com/jsafrane)), Jordan Liggitt ([liggitt](https://github.com/liggitt)), Michelle Au ([msau42](https://github.com/msau42)), Pengfei Ni ([feiskyer](https://github.com/feiskyer)), Saad Ali ([saad-ali](https://github.com/saad-ali)), Tim Hockin ([thockin](https://github.com/thockin)), and Yecheng Fu ([cofyc](https://github.com/cofyc)).
