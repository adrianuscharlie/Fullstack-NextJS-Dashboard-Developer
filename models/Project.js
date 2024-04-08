import executeQuery from "@/utils/db";
class Project {
  constructor(data) {
      (this.project_name = data.project_name),
      (this.developer = data.developer),
      (this.support = data.support),
      (this.notes = data.notes),
      (this.status = data.status),
      (this.version=data.version),
      (this.businessAnalyst=data.businessAnalyst),
      (this.details=data.details)
  }

  static async all() {
    const rows = await executeQuery({ query: "SELECT * FROM project ORDER BY project_name ASC,version DESC" });
    return rows.map((row) => new Project(row));
  }
  static async find(project_name) {
    const rows = await executeQuery({
      query: "SELECT * FROM project WHERE project_name=?",
      params: project_name,
    });
    return rows.length ? new Project(rows[0]) : null;
  }
  static async findSpecific(project_name,version){
    const rows = await executeQuery({
      query: "SELECT * FROM project WHERE project_name=? and version=?",
      params: [project_name,version],
    });
    return rows.length ? new Project(rows[0]) : null;
  }

  static async findByNamaLengkap(pic) {
    const rows = await executeQuery({
      query: "SELECT * FROM project WHERE developer=? or support=? ORDER BY project_name ASC,version DESC",
      params: [pic, pic],
    });
    return rows.map((row) => new Project(row));
  }

  async save() {
    const result = await executeQuery({
      query: "INSERT INTO project SET ?",
      params: [this],
    });
    return result.insertId;
  }

  static async updateStatus(status,project_name,version){
    const result = await executeQuery({
      query: "UPDATE project SET status=? WHERE project_name = ? and version=?",
      params: [status,project_name,version],
    });
    return result.affectedRows;
  }
  static async update(project_name, data) {
    const result = await executeQuery({
      query: "UPDATE project SET ? WHERE project_name = ?",
      params: [data, project_name],
    });
    return result.affectedRows; 
  }

  static async delete(project_name) {
    const result = await executeQuery({
      query: "DELETE FROM project WHERE project_name=?",
      params: project_name,
    });
    return result.affectedRows; 
  }
}

module.exports = Project;
