import executeQuery from "@/utils/db";
import Project from "@/models/Project";
export const GET=async(request)=>{
    try{
        const result=await Project.all()
        if(result.length===0){
            return new Response(JSON.stringify("No projects retrieved"),{status:404});
        }
        return new Response(JSON.stringify(result),{status:200});
    }catch(error){
        return new Response(JSON.stringify("Error to get all projects",{status:500}));
    }
};