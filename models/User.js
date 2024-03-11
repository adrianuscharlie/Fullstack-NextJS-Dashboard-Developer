import executeQuery from "@/utils/db";
class User{
    constructor(data){
        this.username=data.username,
        this.email=data.email,
        this.role=data.role,
        this.isActive=data.isActive
    }

    static async all(){
        const rows=await executeQuery({query:'SELECT * FROM users'});
        return rows.map(row=>new User(row));
    }
    static async find(username){
        const rows=await executeQuery({query:'SELECT * FROM users WHERE username=?',params:username})
        return rows.length?new User(rows[0]):null;
    }
    static async save(){
        const result = await executeQuery('INSERT INTO users SET ?', this);
        this.id = result.insertId;
    }

    static async login(email,password){
        const rows=await executeQuery({query:'SELECT * FROM users WHERE email=? and password=?',params:[email,password]})
        return rows.length?new User(rows[0]):null;
    }

    static async findByEmail(email){
        const rows=await executeQuery({query:'SELECT * FROM users WHERE email=?',params:email});
        return rows.length?new User(rows[0]):null;
    }
}

module.exports=User;