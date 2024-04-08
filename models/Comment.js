import executeQuery from "@/utils/db";
class Comment{
    constructor(data){
        this.id=data.id,
        this.project_name=data.project_name,
        this.version=data.version,
        this.author=data.author,
        this.text=data.text,
        this.filePath=data.filePath,
        this.status=data.status,
        this.date=data.date
    }

    static async all(){
        const rows=await executeQuery({query:'SELECT * FROM comment'});
        return rows.map(row=>new Comment(row));
    }
    static async find(id){
        const rows= await executeQuery({query:'SELECT * FROM comment WHERE id=?',params:id})
        return rows.length?new Comment(rows[0]):null;
    }

    static async findByProjectNameAndVersion(project_name,version){
        const rows=await executeQuery({query:'SELECT * FROM comment WHERE project_name=? and version=? ORDER BY date DESC',params:[project_name,version]})
        return rows.map(row=>new Comment(row));
    }

    async save(){
        const result = await executeQuery({query:'INSERT INTO comment SET ?', params:[this]});
        return result.insertId;
    }
}

module.exports=Comment;