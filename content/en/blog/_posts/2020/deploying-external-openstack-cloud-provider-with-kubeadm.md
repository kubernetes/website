---
layout: blog
title: "Deploying External OpenStack Cloud Provider with Kubeadm"
date: 2020-02-07
slug: Deploying-External-OpenStack-Cloud-Provider-with-Kubeadm
---
This document describes how to install a single control-plane Kubernetes cluster v1.15 with kubeadm on CentOS, and then deploy an external OpenStack cloud provider and Cinder CSI plugin to use Cinder volumes as persistent volumes in Kubernetes.

### Preparation in OpenStack

This cluster runs on OpenStack VMs, so let's create a few things in OpenStack first.

* A project/tenant for this Kubernetes cluster
* A user in this project for Kubernetes, to query node information and attach volumes etc
* A private network and subnet
* A router for this private network and connect it to a public network for floating IPs
* A security group for all Kubernetes VMs
* A VM as a control-plane node and a few VMs as worker nodes

The security group will have the following rules to open ports for Kubernetes.

**Control-Plane Node**

|Protocol  | Port Number | Description|
|----------|-------------|------------|
|TCP |6443|Kubernetes API Server|
|TCP|2379-2380|etcd server client API|
|TCP|10250|Kubelet API|
|TCP|10251|kube-scheduler|
|TCP|10252|kube-controller-manager|
|TCP|10255|Read-only Kubelet API|

**Worker Nodes**

|Protocol  | Port Number | Description|
|----------|-------------|------------|
|TCP|10250|Kubelet API|
|TCP|10255|Read-only Kubelet API|
|TCP|30000-32767|NodePort Services|

**CNI ports on both control-plane and worker nodes**

|Protocol  | Port Number | Description|
|----------|-------------|------------|
|TCP|179|Calico BGP network|
|TCP|9099|Calico felix (health check)|
|UDP|8285|Flannel|
|UDP|8472|Flannel|
|TCP|6781-6784|Weave Net|
|UDP|6783-6784|Weave Net|

CNI specific ports are only required to be opened when that particular CNI plugin is used. In this guide, we will use Weave Net. Only the Weave Net ports (TCP 6781-6784 and UDP 6783-6784), will need to be opened in the security group.

The control-plane node needs at least 2 cores and 4GB RAM. After the VM is launched, verify its hostname and make sure it is the same as the node name in Nova. 
If the hostname is not resolvable, add it to `/etc/hosts`.

For example, if the VM is called master1, and it has an internal IP 192.168.1.4. Add that to `/etc/hosts` and set hostname to master1.
```shell
echo "192.168.1.4 master1" >> /etc/hosts

hostnamectl set-hostname master1
```
### Install Docker and Kubernetes

Next, we'll follow the official documents to install docker and Kubernetes using kubeadm.

Install Docker following the steps from the [container runtime](/docs/setup/production-environment/container-runtimes/) documentation.

Note that it is a [best practice to use systemd as the cgroup driver](/docs/setup/production-environment/container-runtimes/#cgroup-drivers) for Kubernetes.
If you use an internal container registry, add them to the docker config.
```shell
# Install Docker CE
## Set up the repository
### Install required packages.

yum install yum-utils device-mapper-persistent-data lvm2

### Add Docker repository.

yum-config-manager \
  --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo

## Install Docker CE.

yum update && yum install docker-ce-18.06.2.ce

## Create /etc/docker directory.

mkdir /etc/docker

# Configure the Docker daemon

cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF

mkdir -p /etc/systemd/system/docker.service.d

# Restart Docker
systemctl daemon-reload
systemctl restart docker
systemctl enable docker
```

Install kubeadm following the steps from the [Installing Kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) documentation.

```shell
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF

# Set SELinux in permissive mode (effectively disabling it)
# Caveat: In a production environment you may not want to disable SELinux, please refer to Kubernetes documents about SELinux
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet

cat <<EOF >  /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system

# check if br_netfilter module is loaded
lsmod | grep br_netfilter

# if not, load it explicitly with 
modprobe br_netfilter
```

The official document about how to create a single control-plane cluster can be found from the [Creating a single control-plane cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) documentation.

We'll largely follow that document but also add additional things for the cloud provider.
To make things more clear, we'll use a `kubeadm-config.yml` for the control-plane node.
In this config we specify to use an external OpenStack cloud provider, and where to find its config.
We also enable storage API in API server's runtime config so we can use OpenStack volumes as persistent volumes in Kubernetes.

```yaml
apiVersion: kubeadm.k8s.io/v1beta1
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
    cloud-provider: "external"
---
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: "v1.15.1"
apiServer:
  extraArgs:
    enable-admission-plugins: NodeRestriction
    runtime-config: "storage.k8s.io/v1=true"
controllerManager:
  extraArgs:
    external-cloud-volume-plugin: openstack
  extraVolumes:
  - name: "cloud-config"
    hostPath: "/etc/kubernetes/cloud-config"
    mountPath: "/etc/kubernetes/cloud-config"
    readOnly: true
    pathType: File
networking:
  serviceSubnet: "10.96.0.0/12"
  podSubnet: "10.224.0.0/16"
  dnsDomain: "cluster.local"
```

Now we'll create the cloud config, `/etc/kubernetes/cloud-config`, for OpenStack. 
Note that the tenant here is the one we created for all Kubernetes VMs in the beginning.
All VMs should be launched in this project/tenant.
In addition you need to create a user in this tenant for Kubernetes to do queries.
The ca-file is the CA root certificate for OpenStack's API endpoint, for example `https://openstack.cloud:5000/v3`
At the time of writing the cloud provider doesn't allow insecure connections (skip CA check).

```ini
[Global]
region=RegionOne
username=username
password=password
auth-url=https://openstack.cloud:5000/v3
tenant-id=14ba698c0aec4fd6b7dc8c310f664009
domain-id=default
ca-file=/etc/kubernetes/ca.pem

[LoadBalancer]
subnet-id=b4a9a292-ea48-4125-9fb2-8be2628cb7a1
floating-network-id=bc8a590a-5d65-4525-98f3-f7ef29c727d5

[BlockStorage]
bs-version=v2

[Networking]
public-network-name=public
ipv6-support-disabled=false
```

Next run kubeadm to initiate the control-plane node
```shell
kubeadm init --config=kubeadm-config.yml
```

With the initialization completed, copy admin config to .kube
```shell
  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

At this stage, the control-plane node is created but not ready. All the nodes have the taint `node.cloudprovider.kubernetes.io/uninitialized=true:NoSchedule` and are waiting to be initialized by the cloud-controller-manager.
```console
# kubectl describe no master1
Name:               master1
Roles:              master
......
Taints:             node-role.kubernetes.io/master:NoSchedule
                    node.cloudprovider.kubernetes.io/uninitialized=true:NoSchedule
                    node.kubernetes.io/not-ready:NoSchedule
......
```
Now deploy the OpenStack cloud controller manager into the cluster, following [using controller manager with kubeadm](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/using-controller-manager-with-kubeadm.md).

Create a secret with the cloud-config for the openstack cloud provider. 
```shell
kubectl create secret -n kube-system generic cloud-config --from-literal=cloud.conf="$(cat /etc/kubernetes/cloud-config)" --dry-run -o yaml > cloud-config-secret.yaml
kubectl apply -f cloud-config-secret.yaml 
```

Get the CA certificate for OpenStack API endpoints and put that into `/etc/kubernetes/ca.pem`.

Create RBAC resources.
```shell
kubectl apply -f https://github.com/kubernetes/cloud-provider-openstack/raw/release-1.15/cluster/addons/rbac/cloud-controller-manager-roles.yaml
kubectl apply -f https://github.com/kubernetes/cloud-provider-openstack/raw/release-1.15/cluster/addons/rbac/cloud-controller-manager-role-bindings.yaml
```

We'll run the OpenStack cloud controller manager as a DaemonSet rather than a pod.
The manager will only run on the control-plane node, so if there are multiple control-plane nodes, multiple pods will be run for high availability.
Create `openstack-cloud-controller-manager-ds.yaml` containing the following manifests, then apply it.

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: cloud-controller-manager
  namespace: kube-system
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: openstack-cloud-controller-manager
  namespace: kube-system
  labels:
    k8s-app: openstack-cloud-controller-manager
spec:
  selector:
    matchLabels:
      k8s-app: openstack-cloud-controller-manager
  updateStrategy:
    type: RollingUpdate
  template:
    metadata:
      labels:
        k8s-app: openstack-cloud-controller-manager
    spec:
      nodeSelector:
        node-role.kubernetes.io/master: ""
      securityContext:
        runAsUser: 1001
      tolerations:
      - key: node.cloudprovider.kubernetes.io/uninitialized
        value: "true"
        effect: NoSchedule
      - key: node-role.kubernetes.io/master
        effect: NoSchedule
      - effect: NoSchedule
        key: node.kubernetes.io/not-ready
      serviceAccountName: cloud-controller-manager
      containers:
        - name: openstack-cloud-controller-manager
          image: docker.io/k8scloudprovider/openstack-cloud-controller-manager:v1.15.0
          args:
            - /bin/openstack-cloud-controller-manager
            - --v=1
            - --cloud-config=$(CLOUD_CONFIG)
            - --cloud-provider=openstack
            - --use-service-account-credentials=true
            - --address=127.0.0.1
          volumeMounts:
            - mountPath: /etc/kubernetes/pki
              name: k8s-certs
              readOnly: true
            - mountPath: /etc/ssl/certs
              name: ca-certs
              readOnly: true
            - mountPath: /etc/config
              name: cloud-config-volume
              readOnly: true
            - mountPath: /usr/libexec/kubernetes/kubelet-plugins/volume/exec
              name: flexvolume-dir
            - mountPath: /etc/kubernetes
              name: ca-cert
              readOnly: true
          resources:
            requests:
              cpu: 200m
          env:
            - name: CLOUD_CONFIG
              value: /etc/config/cloud.conf
      hostNetwork: true
      volumes:
      - hostPath:
          path: /usr/libexec/kubernetes/kubelet-plugins/volume/exec
          type: DirectoryOrCreate
        name: flexvolume-dir
      - hostPath:
          path: /etc/kubernetes/pki
          type: DirectoryOrCreate
        name: k8s-certs
      - hostPath:
          path: /etc/ssl/certs
          type: DirectoryOrCreate
        name: ca-certs
      - name: cloud-config-volume
        secret:
          secretName: cloud-config
      - name: ca-cert
        secret:
          secretName: openstack-ca-cert
```

When the controller manager is running, it will query OpenStack to get information about the nodes and remove the taint. In the node info you'll see the VM's UUID in OpenStack.
```console
# kubectl describe no master1
Name:               master1
Roles:              master
......
Taints:             node-role.kubernetes.io/master:NoSchedule
                    node.kubernetes.io/not-ready:NoSchedule
......
sage:docker: network plugin is not ready: cni config uninitialized
......
PodCIDR:                     10.224.0.0/24
ProviderID:                  openstack:///548e3c46-2477-4ce2-968b-3de1314560a5

```
Now install your favourite CNI and the control-plane node will become ready.

For example, to install Weave Net, run this command:
```shell
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

Next we'll set up worker nodes.

Firstly, install docker and kubeadm in the same way as how they were installed in the control-plane node. 
To join them to the cluster we need a token and ca cert hash from the output of control-plane node installation. 
If it is expired or lost we can recreate it using these commands.

```shell
# check if token is expired
kubeadm token list

# re-create token and show join command
kubeadm token create --print-join-command

```

Create `kubeadm-config.yml` for worker nodes with the above token and ca cert hash.
```yaml
apiVersion: kubeadm.k8s.io/v1beta2
discovery:
  bootstrapToken:
    apiServerEndpoint: 192.168.1.7:6443
    token: 0c0z4p.dnafh6vnmouus569
    caCertHashes: ["sha256:fcb3e956a6880c05fc9d09714424b827f57a6fdc8afc44497180905946527adf"]
kind: JoinConfiguration
nodeRegistration:
  kubeletExtraArgs:
    cloud-provider: "external"

```
apiServerEndpoint is the control-plane node, token and caCertHashes can be taken from the join command printed in the output of 'kubeadm token create' command.

Run kubeadm and the worker nodes will be joined to the cluster.
```shell
kubeadm join  --config kubeadm-config.yml 
```

At this stage we'll have a working Kubernetes cluster with an external OpenStack cloud provider.
The provider tells Kubernetes about the mapping between Kubernetes nodes and OpenStack VMs.
If Kubernetes wants to attach a persistent volume to a pod, it can find out which OpenStack VM the pod is running on from the mapping, and attach the underlying OpenStack volume to the VM accordingly.

### Deploy Cinder CSI

The integration with Cinder is provided by an external Cinder CSI plugin, as described in the [Cinder CSI](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/using-cinder-csi-plugin.md) documentation.

We'll perform the following steps to install the Cinder CSI plugin.
Firstly, create a secret with CA certs for OpenStack's API endpoints. It is the same cert file as what we use in cloud provider above.
```shell
kubectl create secret -n kube-system generic openstack-ca-cert --from-literal=ca.pem="$(cat /etc/kubernetes/ca.pem)" --dry-run -o yaml > openstack-ca-cert.yaml
kubectl apply -f openstack-ca-cert.yaml
```
Then create RBAC resources.
```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/cloud-provider-openstack/release-1.15/manifests/cinder-csi-plugin/cinder-csi-controllerplugin-rbac.yaml
kubectl apply -f https://github.com/kubernetes/cloud-provider-openstack/raw/release-1.15/manifests/cinder-csi-plugin/cinder-csi-nodeplugin-rbac.yaml
```

The Cinder CSI plugin includes a controller plugin and a node plugin.
The controller communicates with Kubernetes APIs and Cinder APIs to create/attach/detach/delete Cinder volumes. The node plugin in-turn runs on each worker node to bind a storage device (attached volume) to a pod, and unbind it during deletion.
Create `cinder-csi-controllerplugin.yaml` and apply it to create csi controller.
```yaml
kind: Service
apiVersion: v1
metadata:
  name: csi-cinder-controller-service
  namespace: kube-system
  labels:
    app: csi-cinder-controllerplugin
spec:
  selector:
    app: csi-cinder-controllerplugin
  ports:
    - name: dummy
      port: 12345

---
kind: StatefulSet
apiVersion: apps/v1
metadata:
  name: csi-cinder-controllerplugin
  namespace: kube-system
spec:
  serviceName: "csi-cinder-controller-service"
  replicas: 1
  selector:
    matchLabels:
      app: csi-cinder-controllerplugin
  template:
    metadata:
      labels:
        app: csi-cinder-controllerplugin
    spec:
      serviceAccount: csi-cinder-controller-sa
      containers:
        - name: csi-attacher
          image: quay.io/k8scsi/csi-attacher:v1.0.1
          args:
            - "--v=5"
            - "--csi-address=$(ADDRESS)"
          env:
            - name: ADDRESS
              value: /var/lib/csi/sockets/pluginproxy/csi.sock
          imagePullPolicy: "IfNotPresent"
          volumeMounts:
            - name: socket-dir
              mountPath: /var/lib/csi/sockets/pluginproxy/
        - name: csi-provisioner
          image: quay.io/k8scsi/csi-provisioner:v1.0.1
          args:
            - "--provisioner=csi-cinderplugin"
            - "--csi-address=$(ADDRESS)"
          env:
            - name: ADDRESS
              value: /var/lib/csi/sockets/pluginproxy/csi.sock
          imagePullPolicy: "IfNotPresent"
          volumeMounts:
            - name: socket-dir
              mountPath: /var/lib/csi/sockets/pluginproxy/
        - name: csi-snapshotter
          image: quay.io/k8scsi/csi-snapshotter:v1.0.1
          args:
            - "--connection-timeout=15s"
            - "--csi-address=$(ADDRESS)"
          env:
            - name: ADDRESS
              value: /var/lib/csi/sockets/pluginproxy/csi.sock
          imagePullPolicy: Always
          volumeMounts:
            - mountPath: /var/lib/csi/sockets/pluginproxy/
              name: socket-dir
        - name: cinder-csi-plugin
          image: docker.io/k8scloudprovider/cinder-csi-plugin:v1.15.0
          args :
            - /bin/cinder-csi-plugin
            - "--v=5"
            - "--nodeid=$(NODE_ID)"
            - "--endpoint=$(CSI_ENDPOINT)"
            - "--cloud-config=$(CLOUD_CONFIG)"
            - "--cluster=$(CLUSTER_NAME)"
          env:
            - name: NODE_ID
              valueFrom:
                fieldRef:
                  fieldPath: spec.nodeName
            - name: CSI_ENDPOINT
              value: unix://csi/csi.sock
            - name: CLOUD_CONFIG
              value: /etc/config/cloud.conf
            - name: CLUSTER_NAME
              value: kubernetes
          imagePullPolicy: "IfNotPresent"
          volumeMounts:
            - name: socket-dir
              mountPath: /csi
            - name: secret-cinderplugin
              mountPath: /etc/config
              readOnly: true
            - mountPath: /etc/kubernetes
              name: ca-cert
              readOnly: true
      volumes:
        - name: socket-dir
          hostPath:
            path: /var/lib/csi/sockets/pluginproxy/
            type: DirectoryOrCreate
        - name: secret-cinderplugin
          secret:
            secretName: cloud-config
        - name: ca-cert
          secret:
            secretName: openstack-ca-cert
```


Create `cinder-csi-nodeplugin.yaml` and apply it to create csi node.
```yaml
kind: DaemonSet
apiVersion: apps/v1
metadata:
  name: csi-cinder-nodeplugin
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: csi-cinder-nodeplugin
  template:
    metadata:
      labels:
        app: csi-cinder-nodeplugin
    spec:
      serviceAccount: csi-cinder-node-sa
      hostNetwork: true
      containers:
        - name: node-driver-registrar
          image: quay.io/k8scsi/csi-node-driver-registrar:v1.1.0
          args:
            - "--v=5"
            - "--csi-address=$(ADDRESS)"
            - "--kubelet-registration-path=$(DRIVER_REG_SOCK_PATH)"
          lifecycle:
            preStop:
              exec:
                command: ["/bin/sh", "-c", "rm -rf /registration/cinder.csi.openstack.org /registration/cinder.csi.openstack.org-reg.sock"]
          env:
            - name: ADDRESS
              value: /csi/csi.sock
            - name: DRIVER_REG_SOCK_PATH
              value: /var/lib/kubelet/plugins/cinder.csi.openstack.org/csi.sock
            - name: KUBE_NODE_NAME
              valueFrom:
                fieldRef:
                  fieldPath: spec.nodeName
          imagePullPolicy: "IfNotPresent"
          volumeMounts:
            - name: socket-dir
              mountPath: /csi
            - name: registration-dir
              mountPath: /registration
        - name: cinder-csi-plugin
          securityContext:
            privileged: true
            capabilities:
              add: ["SYS_ADMIN"]
            allowPrivilegeEscalation: true
          image: docker.io/k8scloudprovider/cinder-csi-plugin:v1.15.0
          args :
            - /bin/cinder-csi-plugin
            - "--nodeid=$(NODE_ID)"
            - "--endpoint=$(CSI_ENDPOINT)"
            - "--cloud-config=$(CLOUD_CONFIG)"
          env:
            - name: NODE_ID
              valueFrom:
                fieldRef:
                  fieldPath: spec.nodeName
            - name: CSI_ENDPOINT
              value: unix://csi/csi.sock
            - name: CLOUD_CONFIG
              value: /etc/config/cloud.conf
          imagePullPolicy: "IfNotPresent"
          volumeMounts:
            - name: socket-dir
              mountPath: /csi
            - name: pods-mount-dir
              mountPath: /var/lib/kubelet/pods
              mountPropagation: "Bidirectional"
            - name: kubelet-dir
              mountPath: /var/lib/kubelet
              mountPropagation: "Bidirectional"
            - name: pods-cloud-data
              mountPath: /var/lib/cloud/data
              readOnly: true
            - name: pods-probe-dir
              mountPath: /dev
              mountPropagation: "HostToContainer"
            - name: secret-cinderplugin
              mountPath: /etc/config
              readOnly: true
            - mountPath: /etc/kubernetes
              name: ca-cert
              readOnly: true
      volumes:
        - name: socket-dir
          hostPath:
            path: /var/lib/kubelet/plugins/cinder.csi.openstack.org
            type: DirectoryOrCreate
        - name: registration-dir
          hostPath:
            path: /var/lib/kubelet/plugins_registry/
            type: Directory
        - name: kubelet-dir
          hostPath:
            path: /var/lib/kubelet
            type: Directory
        - name: pods-mount-dir
          hostPath:
            path: /var/lib/kubelet/pods
            type: Directory
        - name: pods-cloud-data
          hostPath:
            path: /var/lib/cloud/data
            type: Directory
        - name: pods-probe-dir
          hostPath:
            path: /dev
            type: Directory
        - name: secret-cinderplugin
          secret:
            secretName: cloud-config
        - name: ca-cert
          secret:
            secretName: openstack-ca-cert

```
When they are both running, create a storage class for Cinder.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: csi-sc-cinderplugin
provisioner: csi-cinderplugin
```
Then we can create a PVC with this class.
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myvol
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: csi-sc-cinderplugin

```

When the PVC is created, a Cinder volume is created correspondingly.
```console
# kubectl get pvc
NAME    STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS          AGE
myvol   Bound    pvc-14b8bc68-6c4c-4dc6-ad79-4cb29a81faad   1Gi        RWO            csi-sc-cinderplugin   3s

```
In OpenStack the volume name will match the Kubernetes persistent volume generated name. In this example it would be: _pvc-14b8bc68-6c4c-4dc6-ad79-4cb29a81faad_

Now we can create a pod with the PVC. 
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web
spec:
  containers:
    - name: web
      image: nginx
      ports:
        - name: web
          containerPort: 80
          hostPort: 8081
          protocol: TCP
      volumeMounts:
        - mountPath: "/usr/share/nginx/html"
          name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: myvol
```
When the pod is running, the volume will be attached to the pod.
If we go back to OpenStack, we can see the Cinder volume is mounted to the worker node where the pod is running on.
```console
# openstack volume show 6b5f3296-b0eb-40cd-bd4f-2067a0d6287f
+--------------------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Field                          | Value                                                                                                                                                                                                                                                                                                                          |
+--------------------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| attachments                    | [{u'server_id': u'1c5e1439-edfa-40ed-91fe-2a0e12bc7eb4', u'attachment_id': u'11a15b30-5c24-41d4-86d9-d92823983a32', u'attached_at': u'2019-07-24T05:02:34.000000', u'host_name': u'compute-6', u'volume_id': u'6b5f3296-b0eb-40cd-bd4f-2067a0d6287f', u'device': u'/dev/vdb', u'id': u'6b5f3296-b0eb-40cd-bd4f-2067a0d6287f'}] |
| availability_zone              | nova                                                                                                                                                                                                                                                                                                                           |
| bootable                       | false                                                                                                                                                                                                                                                                                                                          |
| consistencygroup_id            | None                                                                                                                                                                                                                                                                                                                           |
| created_at                     | 2019-07-24T05:02:18.000000                                                                                                                                                                                                                                                                                                     |
| description                    | Created by OpenStack Cinder CSI driver                                                                                                                                                                                                                                                                                         |
| encrypted                      | False                                                                                                                                                                                                                                                                                                                          |
| id                             | 6b5f3296-b0eb-40cd-bd4f-2067a0d6287f                                                                                                                                                                                                                                                                                           |
| migration_status               | None                                                                                                                                                                                                                                                                                                                           |
| multiattach                    | False                                                                                                                                                                                                                                                                                                                          |
| name                           | pvc-14b8bc68-6c4c-4dc6-ad79-4cb29a81faad                                                                                                                                                                                                                                                                                       |
| os-vol-host-attr:host          | rbd:volumes@rbd#rbd                                                                                                                                                                                                                                                                                                            |
| os-vol-mig-status-attr:migstat | None                                                                                                                                                                                                                                                                                                                           |
| os-vol-mig-status-attr:name_id | None                                                                                                                                                                                                                                                                                                                           |
| os-vol-tenant-attr:tenant_id   | 14ba698c0aec4fd6b7dc8c310f664009                                                                                                                                                                                                                                                                                               |
| properties                     | attached_mode='rw', cinder.csi.openstack.org/cluster='kubernetes'                                                                                                                                                                                                                                                              |
| replication_status             | None                                                                                                                                                                                                                                                                                                                           |
| size                           | 1                                                                                                                                                                                                                                                                                                                              |
| snapshot_id                    | None                                                                                                                                                                                                                                                                                                                           |
| source_volid                   | None                                                                                                                                                                                                                                                                                                                           |
| status                         | in-use                                                                                                                                                                                                                                                                                                                         |
| type                           | rbd                                                                                                                                                                                                                                                                                                                            |
| updated_at                     | 2019-07-24T05:02:35.000000                                                                                                                                                                                                                                                                                                     |
| user_id                        | 5f6a7a06f4e3456c890130d56babf591                                                                                                                                                                                                                                                                                               |
+--------------------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

```

### Summary

In this walk-through, we deployed a Kubernetes cluster on OpenStack VMs and integrated it with OpenStack using an external OpenStack cloud provider. Then on this Kubernetes cluster we deployed Cinder CSI plugin which can create Cinder volumes and expose them in Kubernetes as persistent volumes.
