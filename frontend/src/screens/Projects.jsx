import React from 'react'
import { useLocation } from 'react-router-dom';

const Projects = () => {
    const { state } = useLocation();
    const project = state?.project;

    console.log('Project Data:', project); // Debug log

    if (!project) {
        return <div className="p-4">Project not found</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Collaborators</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.users && project.users.length > 0 ? (
                        project.users.map((user) => (
                            <div key={user._id || user} className="p-4 border rounded-lg">
                                <p className="font-medium">{user.name || 'User'}</p>
                                <p className="text-gray-600">{user.email || 'No email'}</p>
                            </div>
                        ))
                    ) : (
                        <p>No collaborators found</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Projects;