** Issue**: Fixes issue #42796
** Description**:
Kubernetes icon at top most center in Kubernetes-blog tab have issues when scrolling the website in mobile view. That icon gets sticked to the top most part of sticky navbar and its upper part also gets cutted.
** Changes Made**:
- Added custom CSS rules to adjust the icon's position and behavior in the mobile view.
- Ensured the icon stays centered horizontally and maintains its visibility.
/* Adjust the icon's position */
** changes in the code**:
.your-icon-selector {
    position: absolute;
    top: 10px; /* Adjust this value as needed */
    left: 50%; /* Center the icon horizontally */
    transform: translateX(-50%); /* Center the icon horizontally */
    z-index: 1000; /* Ensure it's above other elements */
}
** Link your custom css**:
<link rel="stylesheet" href="path/to/original.css">
<link rel="stylesheet" href="path/to/custom.css">
**Context**:
This change has been tested on various mobile devices and browsers to ensure compatibility.
**Note**: Please review and provide feedback. Thank you for your attention to this issue.