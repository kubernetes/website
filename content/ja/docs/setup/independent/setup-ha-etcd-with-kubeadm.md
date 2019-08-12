---
title: kubeadmを使用した高可用性etcdクラスターの作成
content_template: templates/task
weight: 70
---

{{% capture overview %}}

Kubeadm defaults to running a single member etcd cluster in a static pod managed
by the kubelet on the control plane node. This is not a high availability setup
as the etcd cluster contains only one member and cannot sustain any members
becoming unavailable. This task walks through the process of creating a high
availability etcd cluster of three members that can be used as an external etcd
when using kubeadm to set up a kubernetes cluster.

{{% /capture %}}

{{% capture prerequisites %}}

* Three hosts that can talk to each other over ports 2379 and 2380. This
  document assumes these default ports. However, they are configurable through
  the kubeadm config file.
* Each host must [have docker, kubelet, and kubeadm installed][toolbox].
* Some infrastructure to copy files between hosts. For example `ssh` and `scp`
  can satisfy this requirement.

[toolbox]: /docs/setup/independent/install-kubeadm/

{{% /capture %}}

{{% capture steps %}}

## クラスターの構築

The general approach is to generate all certs on one node and only distribute
the *necessary* files to the other nodes.

{{< note >}}
kubeadm contains all the necessary crytographic machinery to generate
the certificates described below; no other cryptographic tooling is required for
this example.
{{< /note >}}


1. Configure the kubelet to be a service manager for etcd.

    Since etcd was created first, you must override the service priority by creating a new unit file
    that has higher precedence than the kubeadm-provided kubelet unit file.

    ```sh
    cat << EOF > /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf
    [Service]
    ExecStart=
    ExecStart=/usr/bin/kubelet --address=127.0.0.1 --pod-manifest-path=/etc/kubernetes/manifests
    Restart=always
    EOF

    systemctl daemon-reload
    systemctl restart kubelet
    ```

1. Create configuration files for kubeadm.

    Generate one kubeadm configuration file for each host that will have an etcd
    member running on it using the following script.

    ```sh
    # Update HOST0, HOST1, and HOST2 with the IPs or resolvable names of your hosts
    export HOST0=10.0.0.6
    export HOST1=10.0.0.7
    export HOST2=10.0.0.8

    # Create temp directories to store files that will end up on other hosts.
    mkdir -p /tmp/${HOST0}/ /tmp/${HOST1}/ /tmp/${HOST2}/

    ETCDHOSTS=(${HOST0} ${HOST1} ${HOST2})
    NAMES=("infra0" "infra1" "infra2")

    for i in "${!ETCDHOSTS[@]}"; do
    HOST=${ETCDHOSTS[$i]}
    NAME=${NAMES[$i]}
    cat << EOF > /tmp/${HOST}/kubeadmcfg.yaml
    apiVersion: "kubeadm.k8s.io/v1beta1"
    kind: ClusterConfiguration
    etcd:
        local:
            serverCertSANs:
            - "${HOST}"
            peerCertSANs:
            - "${HOST}"
            extraArgs:
                initial-cluster: ${NAMES[0]}=https://${ETCDHOSTS[0]}:2380,${NAMES[1]}=https://${ETCDHOSTS[1]}:2380,${NAMES[2]}=https://${ETCDHOSTS[2]}:2380
                initial-cluster-state: new
                name: ${NAME}
                listen-peer-urls: https://${HOST}:2380
                listen-client-urls: https://${HOST}:2379
                advertise-client-urls: https://${HOST}:2379
                initial-advertise-peer-urls: https://${HOST}:2380
    EOF
    done
    ```

1. Generate the certificate authority

    If you already have a CA then the only action that is copying the CA's `crt` and
    `key` file to `/etc/kubernetes/pki/etcd/ca.crt` and
    `/etc/kubernetes/pki/etcd/ca.key`. After those files have been copied,
    proceed to the next step, "Create certificates for each member".

    If you do not already have a CA then run this command on `$HOST0` (where you
    generated the configuration files for kubeadm).

    ```
    kubeadm init phase certs etcd-ca
    ```

    This creates two files

    - `/etc/kubernetes/pki/etcd/ca.crt`
    - `/etc/kubernetes/pki/etcd/ca.key`

1. Create certificates for each member

    ```sh
    kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
    kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
    kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
    kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
    cp -R /etc/kubernetes/pki /tmp/${HOST2}/
    # cleanup non-reusable certificates
    find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

    kubeadm init phase certs etcd-server --config=/tmp/${HOST1}/kubeadmcfg.yaml
    kubeadm init phase certs etcd-peer --config=/tmp/${HOST1}/kubeadmcfg.yaml
    kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
    kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
    cp -R /etc/kubernetes/pki /tmp/${HOST1}/
    find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

    kubeadm init phase certs etcd-server --config=/tmp/${HOST0}/kubeadmcfg.yaml
    kubeadm init phase certs etcd-peer --config=/tmp/${HOST0}/kubeadmcfg.yaml
    kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
    kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
    # No need to move the certs because they are for HOST0

    # clean up certs that should not be copied off this host
    find /tmp/${HOST2} -name ca.key -type f -delete
    find /tmp/${HOST1} -name ca.key -type f -delete
    ```

1. Copy certificates and kubeadm configs

    The certificates have been generated and now they must be moved to their
    respective hosts.

     ```sh
     USER=ubuntu
     HOST=${HOST1}
     scp -r /tmp/${HOST}/* ${USER}@${HOST}:
     ssh ${USER}@${HOST}
     USER@HOST $ sudo -Es
     root@HOST $ chown -R root:root pki
     root@HOST $ mv pki /etc/kubernetes/
     ```

1. Ensure all expected files exist

    The complete list of required files on `$HOST0` is:

    ```
    /tmp/${HOST0}
    └── kubeadmcfg.yaml
    ---
    /etc/kubernetes/pki
    ├── apiserver-etcd-client.crt
    ├── apiserver-etcd-client.key
    └── etcd
        ├── ca.crt
        ├── ca.key
        ├── healthcheck-client.crt
        ├── healthcheck-client.key
        ├── peer.crt
        ├── peer.key
        ├── server.crt
        └── server.key
    ```

    On `$HOST1`:

    ```
    $HOME
    └── kubeadmcfg.yaml
    ---
    /etc/kubernetes/pki
    ├── apiserver-etcd-client.crt
    ├── apiserver-etcd-client.key
    └── etcd
        ├── ca.crt
        ├── healthcheck-client.crt
        ├── healthcheck-client.key
        ├── peer.crt
        ├── peer.key
        ├── server.crt
        └── server.key
    ```

    On `$HOST2`

    ```
    $HOME
    └── kubeadmcfg.yaml
    ---
    /etc/kubernetes/pki
    ├── apiserver-etcd-client.crt
    ├── apiserver-etcd-client.key
    └── etcd
        ├── ca.crt
        ├── healthcheck-client.crt
        ├── healthcheck-client.key
        ├── peer.crt
        ├── peer.key
        ├── server.crt
        └── server.key
    ```

1. Create the static pod manifests

    Now that the certificates and configs are in place it's time to create the
    manifests. On each host run the `kubeadm` command to generate a static manifest
    for etcd.

    ```sh
    root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
    root@HOST1 $ kubeadm init phase etcd local --config=/home/ubuntu/kubeadmcfg.yaml
    root@HOST2 $ kubeadm init phase etcd local --config=/home/ubuntu/kubeadmcfg.yaml
    ```

1. Optional: Check the cluster health

    ```sh
    docker run --rm -it \
    --net host \
    -v /etc/kubernetes:/etc/kubernetes quay.io/coreos/etcd:${ETCD_TAG} etcdctl \
    --cert-file /etc/kubernetes/pki/etcd/peer.crt \
    --key-file /etc/kubernetes/pki/etcd/peer.key \
    --ca-file /etc/kubernetes/pki/etcd/ca.crt \
    --endpoints https://${HOST0}:2379 cluster-health
    ...
    cluster is healthy
    ```
    - Set `${ETCD_TAG}` to the version tag of your etcd image. For example `v3.2.24`.
    - Set `${HOST0}`to the IP address of the host you are testing.

{{% /capture %}}

{{% capture whatsnext %}}

Once you have a working 3 member etcd cluster, you can continue setting up a
highly available control plane using the [external etcd method with
kubeadm](/docs/setup/independent/high-availability/).

{{% /capture %}}


