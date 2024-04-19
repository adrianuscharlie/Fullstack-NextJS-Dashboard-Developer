import executeQuery from "@/utils/db";
class File{
    constructor(data){
        this.fileName=data.fileName,
        this.commentID=data.commentID,
        this.project_name=data.project_name,
        this.version=data.version,
        this.filePath=data.filePath
    }

    static async all(){
        const rows=await executeQuery({query:'SELECT * FROM files'});
        return rows.map(row=>new File(row));
    }
    static async findByCommentID(commentID){
        const rows=await executeQuery({query:'SELECT * FROM files WHERE commentID=?',params:commentID})
        return rows.map(row=>new File(row));
    }

    // static async findByProjectID(projectID){
    //     const rows=await executeQuery({query:'SELECT * FROM files WHERE projectID=?',params:projectID})
    //     return rows.map(row=>new File(row));
    // }

    static async singleDownload(params){
        console.log(params)
        const rows= await executeQuery({query:'SELECT filePath FROM files WHERE fileName=? and commentID=? and project_name=? and version=?',params:params})
        return rows.length?rows[0].filePath:null;
    }

    async save(){
        const result= await executeQuery({query:'INSERT INTO files SET ?',params: [this]});
        this.id = result.insertId;
    }
}

module.exports=File;