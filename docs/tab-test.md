---
title: tab test
---
{% capture default_tab %}Select one of the tabs.{% endcapture %}

{% capture calico %}
```shell
kubectl apply -f "http://docs.projectcalico.org/v2.0/getting-started/kubernetes/installation/hosted/kubeadm/calico.yaml"
```
{% endcapture %}

{% capture flannel %}
```shell
kubectl apply -f "https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml?raw=true"
```
{% endcapture %}

{% capture romana %}
```shell
kubectl apply -f "https://raw.githubusercontent.com/romana/romana/master/containerize/specs/romana-kubeadm.yml"
```
{% endcapture %}

{% capture weave_net %}
```shell
kubectl apply -f "https://git.io/weave-kube"
```
{% endcapture %}

{% assign tab_set_name = "some_tabs" %}
{% assign tab_names = "Default,Calico,Flannel,Weave Net" | split: ',' | compact %}
{% assign tab_contents = ";" | split: ';' | compact | push: default_tab | push: calico | push: flannel | push: romana | push: weave_net %}

{% include tabs.md %}
