import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const LongText = ({ text, maxLength }) => {
    const router=useRouter();
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
    // const [projects,setProjects]=useState(data);
    const router=useRouter();
  return (
    <div className='w-full mb-24 flex justify-start items-center'>
        <table className="w-full  border-none text-sm text-left rtl:text-right text-gray-500">
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
                <tr>
                <th>Project Name</th>
                <th>Project Type</th>
                <th>Project Version</th>
                <th>Project Developer</th>
                <th>Project Support</th>
                <th>Project Status</th>
                {/* <th>Notes</th> */}
                </tr>
            </thead>
            <tbody >
                {data.map((project,index)=>(
                    <tr className='odd:bg-white even:bg-gray-50 hover:cursor-pointer ' key={index} onClick={()=>router.push("/projects/"+project.project_name+"  "+project.version)}>
                    <td>{project.project_name}</td>
                    <td>{project.type}</td>
                    <td>{project.version}</td>
                    <td>{project.developer}</td>
                    <td>{project.support}</td>
                    <td>{project.status}</td>
                    {/* <td><button onClick={()=>handleSubmit(project.id)} className='rounded-md bg-blue-500 px-2 py-1 text-white'>Details</button></td> */}
                    {/* <td>{project.notes}</td> */}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}


export default ProjectsTable
