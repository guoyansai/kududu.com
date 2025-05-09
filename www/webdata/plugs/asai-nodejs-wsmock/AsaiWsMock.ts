module.exports = ($asai: any = {}) => {
    if ($asai.hostconfig.plugs?.mock) {
        initMock(process.cwd());
    }
    $asai.mock.initMock = initMock;
    $asai.mock.wsWorkMock = wsWorkMock;
    $asai.mock.wsWorkListen = wsWorkListen;

    function initMock(mockpath: string) {
        const fs: any = require('fs');
        $asai.mock =
            JSON.parse(
                fs.readFileSync(
                    mockpath + $asai.hostconfig.plugs.mock.dir + 'dirmock.json',
                    'utf-8'
                )
            ) || {};
        $asai.mock.dirdb?.forEach((el: any) => {
            let tmpDb: any;
            try {
                tmpDb =
                    JSON.parse(
                        fs.readFileSync(
                            mockpath + $asai.hostconfig.plugs.mock.dir + el,
                            'utf-8'
                        )
                    ) || {};
            } catch (err) {
                tmpDb = {};
            }
            Object.assign($asai.mock.db, tmpDb);
        });
        $asai.mock.dirfn?.forEach((el: any) => {
            let tmpFn: any;
            try {
                tmpFn =
                    require(mockpath + $asai.hostconfig.plugs.mock.dir + el) ||
                    {};
            } catch (err) {
                tmpFn = {};
            }
            Object.assign($asai.mock.fn, tmpFn);
        });
    }

    function wsWorkMock(workopt: any) {
        workopt.mockdata =
            (workopt.reqdataisobj && $asai.mock?.db?.[workopt.reqdata?.ty]) ||
            {};

        let payload: string;
        if (workopt.mockdata?.wc) {
            // 监听
            wsWorkListen(workopt);
        } else {
            // api请求
            payload = workopt.reqdataisobj
                ? JSON.stringify(
                      getMockDb(workopt.reqdata || {}, workopt.mockdata)
                  )
                : workopt.reqdata.toString();

            $asai.serversws[workopt.hostdir]?.sendws?.(payload, 0, workopt.ws);
        }
    }

    function getMockDb(reqdata: any, mockdata: any) {
        let wsfn: any = null;
        if (mockdata?.fn) {
            wsfn = $asai.mock.fn?.[mockdata.fn];
        }
        if (wsfn) {
            return wsfn(reqdata, mockdata);
        }
        return { ...reqdata, ...(mockdata || {}) };
    }

    function wsWorkListen(workopt: any) {
        const reqkey = getKeyByData(workopt.reqdata);
        if (workopt.reqdata?.off) {
            // 清空listen
            if (
                $asai.connectionsws[workopt.hostdir][workopt.ws.Userinfo.us]
                    .tasksws[reqkey]
            ) {
                clearInterval(
                    $asai.connectionsws[workopt.hostdir][workopt.ws.Userinfo.us]
                        .tasksws[reqkey]
                );
                $asai.connectionsws[workopt.hostdir][
                    workopt.ws.Userinfo.us
                ].tasksws[reqkey] = null;
            }
        } else {
            // 监听创建
            if (
                !$asai.connectionsws[workopt.hostdir][workopt.ws.Userinfo.us]
                    .tasksws[reqkey]
            ) {
                const newDataMock = getMockDb(
                    workopt.reqdata,
                    workopt.mockdata
                );
                $asai.connectionsws[workopt.hostdir][
                    workopt.ws.Userinfo.us
                ].tasksws[reqkey] = setInterval(function () {
                    const newData = getMockDb(
                        workopt.reqdata,
                        workopt.mockdata
                    );
                    // console.log(666.2002, newData);
                    // newData.db += 1;// 处理一些特殊数据
                    newData.tm = Date.now();
                    const msgstr = JSON.stringify(newData);
                    $asai.serversws[workopt.hostdir].sendws(
                        msgstr,
                        newData.pb || 0,
                        workopt.ws
                    ); // pb回消息的人群范围，0=自己；1=除自己之外所有人；2=所有人
                    if (
                        !$asai.connectionsws[workopt.hostdir][
                            workopt.ws.Userinfo.us
                        ]?.tasksws[reqkey]
                    ) {
                        // 自清理
                        clearInterval(
                            $asai.connectionsws[workopt.hostdir][
                                workopt.ws.Userinfo.us
                            ]?.tasksws[reqkey]
                        );
                    }
                }, newDataMock?.tc || 2000); // tc用来处理设置返回消息体的时间间隔
            }
        }
    }

    // 颗粒化数据处理
    function getKeyByData(reqdata: any) {
        return '_wstask_' + (reqdata?.id || reqdata?.ty + '.' + reqdata?.ac);
    }
};
