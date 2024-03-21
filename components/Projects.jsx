import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const LongText = ({ text, maxLength }) => {
    const [expanded, setExpanded] = useState(false);
    const handleToggle = () => {
      setExpanded(!expanded);
    };
    const shortenedText = expanded ? text : text.slice(0, maxLength);
    const showReadMoreButton = text.length > maxLength;
    return (
      <div>
        <p>{shortenedText}</p>
        {showReadMoreButton && (
          <button className='text-blue-500' onClick={handleToggle}>
            {expanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
    );
  };
  
  

const ProjectsTable = ({data}) => {
    const [projects,setProjects]=useState(data);
    const router=useRouter();
    const handleSubmit=(projectID)=>{
      event.preventDefault();
      router.push(`/projects/${projectID}`);
    }
  return (
    <section className='projects w-full mb-24 flex justify-center items-center'>
        <div className="flex justify-center items-center p-2 mx-auto">
        <table className="table-auto gap-2  justify-center items-center border-collapse border border-slate-400">
            <thead>
                <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Project Developer</th>
                <th>Project Support</th>
                <th>Project Status</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody className=''>
                {projects.map((project,index)=>(
                    <tr className='' key={index}>
                    <td>{project.id}</td>
                    <td>{project.project_name}</td>
                    <td>{project.developer}</td>
                    <td>{project.support}</td>
                    <td>{project.status}</td>
                    <td><button onClick={()=>handleSubmit(project.id)} className='rounded-md bg-blue-500 px-2 py-1 text-white'>Details</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    </section>
  )
}


export default ProjectsTable
