$(document).ready(function() {

    var toc = navData.toc;
    var flatToc = navData.flatToc.reverse();

    function collectNodes(tocMap) {
        var tocNodes = {};
        tocMap.map(function(node, index) {
            var sectionNode = $('#' + node.section);
            var tocSubsections = {};
            tocItem = {section: sectionNode};
            var subsectionNodes;
            if (node.subsections) {
                subsectionNodes = (collectNodes(node.subsections));
                tocItem.subsections = subsectionNodes;
            }
            tocNodes[node.section] = tocItem;
        });
        return tocNodes;
    }
    var tocItems = collectNodes(toc);

    function collectNodesFlat(tocMap, obj) {
        var collect = obj || {};
        tocMap.map(function(node, index) {
            var sectionNode = $('#' + node.section);
            tocItem = {section: sectionNode};
            if (node.subsections) {
                subsectionNodes = (collectNodesFlat(node.subsections, collect));
            }
            collect[node.section] = sectionNode;
        });
        return collect;
    }
    var tocFlat = collectNodesFlat(toc);

    var prevSectionToken;
    var prevSubsectionToken;

    function scrollActions(scrollPosition) {
        var activeSection = checkNodePositions(toc, tocFlat, scrollPosition);
        var activeSubSection,
            prevL1Nav,
            currL1Nav,
            prevL2Nav,
            currL2Nav;
        if (!activeSection) {
            return;
        }
        if (!prevSectionToken) {
            prevSectionToken = activeSection.token;
            currL1Nav = getNavNode(activeSection.token);
            currL1Nav.show('fast');
        } else if (activeSection.token !== prevSectionToken) {
            prevL1Nav = getNavNode(prevSectionToken);
            currL1Nav = getNavNode(activeSection.token);
            prevL1Nav.hide('fast');
            currL1Nav.show('fast');
            prevSectionToken = activeSection.token;
        }
        if (activeSection.subsections) {
            activeSubSection = checkNodePositions(activeSection.subsections, tocFlat, scrollPosition);
            if (!activeSubSection) {
                return;
            }
            if (!prevSubsectionToken) {
                prevSubsectionToken = activeSubSection.token;
                currL2Nav = getNavNode(activeSubSection.token);
                currL2Nav.show('fast');
            } else if (activeSubSection.token !== prevSubsectionToken) {
                prevL2Nav = getNavNode(prevSubsectionToken);
                currL2Nav = getNavNode(activeSubSection.token);
                prevL2Nav.hide('fast');
                currL2Nav.show('fast');
                prevSubsectionToken = activeSubSection.token;
            }
        }
        return {L1: prevSectionToken, L2: prevSubsectionToken};
    }

    var prevElemToken;
    var activeElemToken;

    function checkActiveElement(items, scrollPosition) {
        var offset = 50;
        var offsetScroll = scrollPosition + offset;
        var visibleNode;
        for (var i = 0; i < items.length; i++) {
            var token = items[i];
            var node = getHeadingNode(token);
            if (offsetScroll >= node.offset().top) {
                activeElemToken = token;
            }
        }
        if (!prevElemToken) {
            getNavElemNode(activeElemToken).addClass('selected');
            prevElemToken = activeElemToken;
            return;
        }
        if (activeElemToken !== prevElemToken) {
            getNavElemNode(prevElemToken).removeClass('selected');
            getNavElemNode(activeElemToken).addClass('selected');
            prevElemToken = activeElemToken;
        }
        return activeElemToken;
    }

    function getHeadingNode(token) {
        return $('#' + token);
    }

    function getNavNode(token) {
        return $('#' + token + '-nav');
    }

    function getNavElemNode(token) {
        return $('#sidebar-wrapper > ul a[href="#' + token + '"]');
    }

    function checkNodePositions(nodes, flatNodeMap, scrollPosition) {
        var activeNode;
        for (var i = 0; i < nodes.length; i++) {
            var item = nodes[i];
            var node = flatNodeMap[item.section];
            var nodeTop = node.offset().top;
            if (scrollPosition >= nodeTop) {
                activeNode = {token: item.section, node: node};
                if (item.subsections) {
                    activeNode.subsections = item.subsections;
                }
                break;
            }
        }
        return activeNode;
    }

    var scrollPosition = $(window).scrollTop();
    scrollActions(scrollPosition);
    checkActiveElement(flatToc, scrollPosition);
    // TODO: prevent scroll on sidebar from propogating to window
    $(window).on('scroll', function(event) {
        var scrollPosition = $(window).scrollTop();
        var activeSectionTokens = scrollActions(scrollPosition);
        var activeElemToken = checkActiveElement(flatToc, scrollPosition);
        // window.location.hash = activeSectionTokens[0];
    });
});