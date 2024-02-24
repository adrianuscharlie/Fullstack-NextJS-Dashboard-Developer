import executeQuery from "@/utils/db";
import User from "@/models/User";

export const GET=async(request,{params})=>{
    try{
        const user=await User.findByEmail(params.id);
        return new Response(JSON.stringify(user),{status:200});
    }catch(error){
        return new Response(JSON.stringify("Error to get user data"));
    }
}