// credit to: http://jsfiddle.net/s8m2t/8/
var buildRec;
buildRec = function(headingNodes, $elm, lv) {
  var cnt, curLv, li, node;
  node = headingNodes.splice(0, 1);
  if (node && node.length > 0) {
    curLv = parseInt(node[0].tagName.substring(1));
    if (curLv === lv) {
      cnt = 0;
    } else if (curLv < lv) {
      cnt = 0;
      while (true) {
        $elm = $elm.parent().parent();
        cnt--;
        if (!(cnt > (curLv - lv))) {
          break;
        }
      }
    } else if (curLv > lv) {
      cnt = 0;
      while (true) {
        li = $elm.children().last();
        if (!($elm.children().last().length > 0)) {
          $elm.append($("<li>"));
            li = $elm.children().last();
        }
        li.append($('<ul style="list-style-type: none;">'));
          $elm = li.children().last();
        cnt++;
        if (!(cnt < (curLv - lv))) {
          break;
        }
      }
    }
    $elm.append($("<li>"));
      li = $elm.children().last();
    li.html("<a href=#" + node[0].id + ">" + node[0].innerHTML + "</a>");
    return buildRec(headingNodes, $elm, lv + cnt);
  }
};
$(document).ready(function(){
  return;
  var headingNodes = $('#docsContent').children().filter(":header");
  var result = $('<ul style="list-style-type: none; padding-left:0px;">');
  buildRec(headingNodes,result,1);
  $("#pageTOC").append(result);
});
