---
---

### Get the template file

First of all, download the dns template

[skydns template](/docs/getting-started-guides/docker-multinode/skydns.yaml.in)

### Set environment variables

Then you need to set `DNS_REPLICAS`, `DNS_DOMAIN` and `DNS_SERVER_IP` envs

```shell
$ export DNS_REPLICAS=1

$ export DNS_DOMAIN=cluster.local # specify in startup parameter `--cluster-domain` for containerized kubelet 

$ export DNS_SERVER_IP=10.0.0.10  # specify in startup parameter `--cluster-dns` for containerized kubelet 
```

### Replace the corresponding value in the template and create the pod

```shell{% raw %}
$ sed -e "s/{{ pillar\['dns_replicas'\] }}/${DNS_REPLICAS}/g;s/{{ pillar\['dns_domain'\] }}/${DNS_DOMAIN}/g;s/{{ pillar\['dns_server'\] }}/${DNS_SERVER_IP}/g" skydns.yaml.in > ./skydns.yaml

# If the kube-system namespace isn't already created, create it
$ kubectl get ns
$ kubectl create namespace kube-system

$ kubectl create -f ./skydns.yaml{% endraw %}
```

### Test if DNS works

Follow [this link](https://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns#how-do-i-test-if-it-is-working) to check it out.
