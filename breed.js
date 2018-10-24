var nodedatas = [];
var linedatas = [];
function initDatas() {

    var initCnt = 16;
    var childCnt = 3;
    var loopCnt = 20;
    //初始化第一代
    for (var i = 0, firstData = []; i < initCnt; i++) {
        firstData.push({
            layno: 0,
            id: i + 1,
            sortid: i + 1,
            pid: [-1, -1],
            pidx: [-1, -1]
        });
    }
    nodedatas.push(firstData);
    //生成后代
    for (var i = 0; i < loopCnt; i++) {
        var childData = [];
        //生成第i层的子代
        for (var j = 0; j < nodedatas[i].length; j++) {
            var fatherNode = nodedatas[i][j];
            if (fatherNode.married) {
                continue;
            }
            //挑选motherNode
            var motherNode = null;
            var pidk = 0;
            var max = 0;
            for (var k = j + 1; k < nodedatas[i].length; k++) {
                var curmotherNode = nodedatas[i][k];
                //跳过已配对的和近亲
                if (!curmotherNode.married && canMarry(fatherNode, curmotherNode, i)) {
                    var seed = Math.random();
                    if (seed > max) {
                        motherNode = curmotherNode;
                        max = seed;
                        pidk = k;
                    }
                }
                else {
                    continue;
                }
            }
            //处理匹配
            if (motherNode) {
                //按照配对排序
                nodedatas[i].forEach(function (val) {
                    if (val.sortid > fatherNode.sortid && val.sortid < motherNode.sortid) {
                        val.sortid += 1;
                    }
                })
                motherNode.sortid = fatherNode.sortid + 1;
                // nodedatas[i].find(val => val.sortid == fatherNode.sortid + 1).sortid = sortid;
                //排序调试
                // {
                //     console.log(fatherNode.id + ',' +
                //         motherNode.id
                //     );
                //     var s1 = [], s2 = []
                //     for (let j = 1; j <= nodedatas[i].length; j++) {
                //         s1.push(nodedatas[i].findIndex(val => val.sortid == j) + 1);
                //         s2.push(nodedatas[i].find(val => val.sortid == j).id);
                //     }
                //     console.log('idx:' + s1.join(','))
                //     console.log('id :' + s2.join(','))
                // }
                //配对成功，生成子代
                var cnt = Math.random()<0.5?2:childCnt;
                for (var z = 0; z < cnt; z++) {
                    var child = {
                        layno: i + 1,
                        // id: (z==0?fatherNode.id:motherNode.id),
                        id: childData.length + 1,
                        sortid: childData.length + 1,
                        pid: [fatherNode.id, motherNode.id],
                        pidx: [j, pidk]
                    };
                    childData.push(child);
                    //生成关系线
                    linedatas.push({
                        sNode: fatherNode,
                        eNode: child
                    });
                    linedatas.push({
                        sNode: motherNode,
                        eNode: child
                    });
                }
                //已配对标志
                fatherNode.married = true;
                motherNode.married = true;
            }
        }
        nodedatas.push(childData);
    }
    console.log(nodedatas);
    return {
        nodeDatas: nodedatas,
        lineDatas: linedatas
    };
}
/** 获取祖先 */
function getSupers(child) {
    var supers = new Set();
    addsupers(supers, [child]);
    return supers;
}

/** 判断是否祖先 */
function isSupers(child, node) {
    var supers = new Set();
    addsupers(supers, [child]);
    if (supers.has(node)) {
        return true;
    }
    return false;
}
function addsupers(supers, nodes) {
    if (nodes[0] && nodes[0].layno == 0) return;
    var snodes = [];
    nodes.forEach(function (node) {
        supers.add(node);
        snodes.push(nodedatas[node.layno - 1][node.pidx[0]]);
        snodes.push(nodedatas[node.layno - 1][node.pidx[1]]);
        supers.add(nodedatas[node.layno - 1][node.pidx[0]]);
        supers.add(nodedatas[node.layno - 1][node.pidx[1]]);
    })
    addsupers(supers, snodes);
}
/** 判断是否近亲 */
function canMarry(fatherNode, motherNode, layer) {
    var preFathers = new Set();
    var preMothers = new Set();
    if (layer > 0) {
        preFathers.add(n1 = nodedatas[layer - 1][fatherNode.pidx[0]]);
        preFathers.add(n2 = nodedatas[layer - 1][fatherNode.pidx[1]]);
        preMothers.add(n3 = nodedatas[layer - 1][motherNode.pidx[0]]);
        preMothers.add(n4 = nodedatas[layer - 1][motherNode.pidx[1]]);
    }
    if (layer > 1) {
        // if(n1){
        preFathers.add(nodedatas[layer - 2][n1.pidx[0]]);
        preFathers.add(nodedatas[layer - 2][n1.pidx[1]]);
        preFathers.add(nodedatas[layer - 2][n2.pidx[0]]);
        preFathers.add(nodedatas[layer - 2][n2.pidx[1]]);

        preMothers.add(nodedatas[layer - 2][n3.pidx[0]]);
        preMothers.add(nodedatas[layer - 2][n3.pidx[1]]);
        preMothers.add(nodedatas[layer - 2][n4.pidx[0]]);
        preMothers.add(nodedatas[layer - 2][n4.pidx[1]]);
        // }
    }

    var boolMarry = true;
    preFathers.forEach(function (item) {
        if (preMothers.has(item)) {
            boolMarry = false;
        }
    });
    return boolMarry;
}