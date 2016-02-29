---
---

### Get the template file

First of all, download the template dns rc and svc file from

[skydns-rc template](/docs/getting-started-guides/docker-multinode/skydns-rc.yaml.in)

[skydns-svc template](/docs/getting-started-guides/docker-multinode/skydns-svc.yaml.in)

### Set env

Then you need to set `DNS_REPLICAS` , `DNS_DOMAIN` , `DNS_SERVER_IP` , `KUBE_SERVER` ENV.

```shell
$ export DNS_REPLICAS=1

$ export DNS_DOMAIN=cluster.local # specify in startup parameter `--cluster-domain` for containerized kubelet 

$ export DNS_SERVER_IP=10.0.0.10  # specify in startup parameter `--cluster-dns` for containerized kubelet 

$ export KUBE_SERVER=10.10.103.250 # your master server ip, you may change it
```

### Replace the corresponding value in the template.

```shell
$ sed -e "s/{{ pillar\['dns_replicas'\] }}/${DNS_REPLICAS}/g;s/{{ pillar\['dns_domain'\] }}/${DNS_DOMAIN}/g;s/{kube_server_url}/${KUBE_SERVER}/g;" skydns-rc.yaml.in > ./skydns-rc.yaml

$ sed -e "s/{{ pillar\['dns_server'\] }}/${DNS_SERVER_IP}/g" skydns-svc.yaml.in > ./skydns-svc.yaml
```

### Use `kubectl` to create skydns rc and service


```shell
$ kubectl -s "$KUBE_SERVER:8080" --namespace=kube-system create -f ./skydns-rc.yaml

$ kubectl -s "$KUBE_SERVER:8080" --namespace=kube-system create -f ./skydns-svc.yaml
```

### Test if DNS works

Follow [this link](https://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns#how-do-i-test-if-it-is-working) to check it out.






