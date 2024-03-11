import executeQuery from "@/utils/db";
import User from "@/models/User";

export const GET=async(request)=>{
    try{
        const user=await User.all();
        return new Response(JSON.stringify(user),{status:200});
    }catch(error){
        return new Response(JSON.stringify("Error to get user data"));
    }
}