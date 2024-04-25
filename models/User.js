import executeQuery from "@/utils/db";
const crypto = require('crypto');

class User{
    constructor(data){
        this.username=data.username,
        this.email=data.email,
        this.namaLengkap=data.namaLengkap,
        this.isActive=data.isActive,
        this.role=data.role
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

    static async login(username,password){
        const rows=await executeQuery({query:'SELECT * FROM users WHERE username=? LIMIT 1',params:[username]})
        const user=rows[0]
        const hashedPassword = user.password;
        const inputPassword = password;
        const salt = user.salt;
        if (this.verifyPassword(hashedPassword, inputPassword, salt)) {
            return new User(user);
        } else {
            return null
        }
    }

    static async findByEmail(email){
        const rows=await executeQuery({query:'SELECT * FROM users WHERE email=?',params:email});
        return rows.length?new User(rows[0]):null;
    }

    static hashPassword(password, salt) {
        const passwordBytes = Buffer.from(password + salt, 'utf8');
        const hashedBytes = crypto.createHash('sha256').update(passwordBytes).digest();
        return hashedBytes.toString('base64');
    }
    
    static verifyPassword(hashedPassword, inputPassword, salt) {
        const hashedInputPassword = this.hashPassword(inputPassword, salt);
        return hashedInputPassword === hashedPassword;
    }
}

module.exports=User;