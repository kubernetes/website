---
# Removed from Kubernetes
title: EndpointSliceProxying
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.18"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.21"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.24"    

removed: true  
---
وقتی فعال باشد، kube-proxy که روی لینوکس اجرا می‌شود، از EndpointSlices به عنوان منبع داده اصلی به جای Endpoints استفاده می‌کند و امکان مقیاس‌پذیری و بهبود عملکرد را فراهم می‌کند. به  [Enabling Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/). مراجعه کنید.