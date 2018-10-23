var nodedatas = [];
var linedatas = [];
function initDatas() {

    var initCnt = 8;
    var childCnt = 2;
    var loopCnt = 8;
    //初始化第一代
    for (var i = 0, firstData = []; i < initCnt; i++) {
        firstData.push({
            layno: 0,
            id: i+1,
            pid: [-1, -1]
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
            //查询motherNode
            for (var k = j + 1; k < nodedatas[i].length; k++) {
                var motherNode = nodedatas[i][k];
                if (motherNode.married) {
                    continue;
                }
                else {
                    //匹配成功，判断是否近亲
                    if(canMarry(fatherNode,motherNode,i)){
                        //配对成功，生成子代
                        for (var z = 0; z < childCnt; z++) {
                            var child = {
                                layno: i+1,
                                id: z==0?fatherNode.id:motherNode.id,//childData.length + 1,
                                pid: [j, k]
                            };
                            childData.push(child);
                            //生成关系线
                            linedatas.push({
                                sNode:fatherNode,
                                eNode:child
                            });
                            linedatas.push({
                                sNode:motherNode,
                                eNode:child
                            });
                        }
                        //已配对标志
                        fatherNode.married = true;
                        motherNode.married = true;
                        break;
                    }
                }
            }
        }
        nodedatas.push(childData);
    }
    console.log(nodedatas);
    return { 
        nodeDatas:nodedatas,
        lineDatas:linedatas
    };
}

/** 判断是否近亲 */
function canMarry(fatherNode, motherNode, layer) {
    var preFathers = new Set();
    var preMothers = new Set();
    if (layer > 0) {
        preFathers.add(n1 = nodedatas[layer - 1][fatherNode.pid[0]]);
        preFathers.add(n2 = nodedatas[layer - 1][fatherNode.pid[1]]);
        preMothers.add(n3 = nodedatas[layer - 1][motherNode.pid[0]]);
        preMothers.add(n4 = nodedatas[layer - 1][motherNode.pid[1]]);
    }
    if(layer>1){
        // if(n1){
            preFathers.add(nodedatas[layer-2][n1.pid[0]]);
            preFathers.add(nodedatas[layer-2][n1.pid[1]]);
            preFathers.add(nodedatas[layer-2][n2.pid[0]]);
            preFathers.add(nodedatas[layer-2][n2.pid[1]]);

            preMothers.add(nodedatas[layer-2][n3.pid[0]]);
            preMothers.add(nodedatas[layer-2][n3.pid[1]]);
            preMothers.add(nodedatas[layer-2][n4.pid[0]]);
            preMothers.add(nodedatas[layer-2][n4.pid[1]]);
        // }
    }

    var boolMarry = true;
    preFathers.forEach(function(item){
        if(preMothers.has(item)){
            boolMarry = false;
        }
    });
    return boolMarry;
}