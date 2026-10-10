---
title: FlexVolume
id: flexvolume
full_link: /docs/concepts/storage/volumes/#flexvolume
short_description: >
    FlexVolume là một interface đã ngừng hỗ trợ (deprecated) để tạo các volume plugin ngoài mã nguồn chính (out-of-tree). {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} là một interface mới hơn, giải quyết một số vấn đề của FlexVolume.


aka:
tags:
- storage
---
 FlexVolume là một interface đã ngừng hỗ trợ (deprecated) để tạo các volume plugin ngoài mã nguồn chính (out-of-tree). {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} là một interface mới hơn, giải quyết một số vấn đề của FlexVolume.

<!--more-->

FlexVolume cho phép người dùng viết driver riêng và thêm hỗ trợ cho các volume của họ trong Kubernetes. Các binary và dependency của FlexVolume driver phải được cài đặt trên các máy host. Điều này yêu cầu quyền root. Storage SIG khuyến nghị triển khai {{< glossary_tooltip text="CSI" term_id="csi" >}} driver nếu có thể, vì nó giải quyết được các hạn chế của FlexVolume.

* [FlexVolume trong tài liệu Kubernetes](/docs/concepts/storage/volumes/#flexvolume)
* [Thông tin thêm về FlexVolume](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)
* [Câu hỏi thường gặp về Volume Plugin cho nhà cung cấp Storage](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md)
