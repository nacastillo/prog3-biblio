import {Table} from "antd";

function setCol (t, di, k, w, r) {
    return {
        title: t,
        dataIndex: di,
        key: k,
        width: w,
        render: r
    }
}

/*
function setHeader (ent) {
    const header = [];
    col.push(setCol("ID", "_id", "_id", 10));
    switch (ent) {
        case "libros":
            col.push()
            col.push()
            col.push()
            col.push()
            col.push()
            col.push()
            break;

        default:
            break;
    }
    
}
*/