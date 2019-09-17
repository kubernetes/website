---
title: Flexvolume
id: flexvolume
date: 2018-06-25
full_link: /docs/concepts/storage/volumes/#flexvolume
short_description: >
    Flexvolume is an interface for creating out-of-tree volume plugins. The {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} is a newer interface which addresses several problems with Flexvolumes.


aka: 
tags:
- storage 
---
 Flexvolume is an interface for creating out-of-tree volume plugins. The {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} is a newer interface which addresses several problems with Flexvolumes.

<!--more--> 

Flexvolumes enable users to write their own drivers and add support for their volumes in Kubernetes. FlexVolume driver binaries and dependencies must be installed on host machines. This requires root access. The Storage SIG suggests implementing a {{< glossary_tooltip text="CSI" term_id="csi" >}} driver if possible since it addresses the limitations with Flexvolumes.

* [Flexvolume in the Kubernetes documentation](/docs/concepts/storage/volumes/#flexvolume)
* [More information on Flexvolumes](https://github.com/kubernetes/community/blob/master/contributors/devel/flexvolume.md)
* [Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)
