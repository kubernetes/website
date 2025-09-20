---
title: ResourceHealthStatus
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.31"
---
Enable the `allocatedResourcesStatus` field within the `.status` for a Pod. The field
reports additional details for each container in the Pod,
with the health information for each device assigned to the Pod.
See [Device plugin and unhealthy devices](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices) for more details.

فیلد «وضعیت تخصیص‌یافته منابع» را در فایل «وضعیت». برای یک پاد فعال کنید. این فیلد
جزئیات بیشتری را برای هر کانتینر در پاد گزارش می‌دهد، به همراه اطلاعات سلامت هر دستگاه اختصاص داده شده به پاد.
برای جزئیات بیشتر به [Device plugin and unhealthy devices](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-and-unhealthy-devices) مراجعه کنید.