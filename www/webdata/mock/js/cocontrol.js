module.exports = {
    testfn(reqdata, mockdata) {
        console.log(666.0098, mockdata, reqdata);
        return {
            ...reqdata,
            ...mockdata,
        };
    },
};
