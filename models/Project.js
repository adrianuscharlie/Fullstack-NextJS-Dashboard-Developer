import executeQuery from "@/utils/db";
class Project{
    constructor(data){
    this.id=data.id,
       this.project_name=data.project_name,
       this.pic=data.pic,
       this.notes=data.notes,
       this.status=data.status
    }

    static async all(){
        const rows=await executeQuery({query:'SELECT * FROM project'});
        return rows.map(row=>new Project(row));
    }
    static async find(id){
        const rows= await executeQuery({query:'SELECT * FROM project WHERE id=?',params:id})
        return rows.length?new Project(rows[0]):null;
    }

    static async findByDeveloperID(pic){
        const rows=await executeQuery({query:'SELECT * FROM project WHERE pic=?',params:pic})
        return rows.map(row=>new Project(row));
    }

    static async save(){
        const result = await executeQuery({query:'INSERT INTO project SET ?', params:this});
        this.id = result.insertId;
    }
}

module.exports=Project;