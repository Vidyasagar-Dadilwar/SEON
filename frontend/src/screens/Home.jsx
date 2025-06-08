import React, { useState, useEffect } from 'react';
import { useUser } from '../context/user.context';
import axios from '../config/Axios';

const Home = () => {
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/projects/all');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    function createProject(e) {
        e.preventDefault();
        const token = localStorage.getItem('token');
        axios.post('/projects/create',
            { name: projectName },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then((res) => {
                console.log({ res });
                setIsModalOpen(false);
                setProjectName("");
                fetchProjects(); // Refresh projects list
            })
            .catch((err) => {
                console.log({ err });
            });
    }

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            // First get user ID from email
            const userResponse = await axios.get(`/users/find?email=${userEmail}`);
            if (!userResponse.data.user) {
                alert('User not found');
                return;
            }

            const token = localStorage.getItem('token');
            await axios.put('/projects/add-user',
                {
                    projectId: selectedProject._id,
                    users: [userResponse.data.user._id]
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setIsAddUserModalOpen(false);
            setUserEmail("");
            fetchProjects(); // Refresh projects list
        } catch (error) {
            console.error('Error adding user:', error);
            alert(error.response?.data?.message || 'Error adding user to project');
        }
    };

    return (
        <main className="p-4">
            <div className="projects grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <div key={project._id} className="project p-4 border border-slate-300 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                        <button
                            onClick={() => {
                                setSelectedProject(project);
                                setIsAddUserModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Add User
                        </button>
                    </div>
                ))}
                <button
                    className="project p-4 border border-slate-300 rounded-lg"
                    onClick={() => setIsModalOpen(true)}
                >
                    <i className="ri-link mr-2"></i>
                    Create Project
                </button>
            </div>

            {/* Create Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            createProject(e);
                        }}>
                            <div className="mb-4">
                                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    id="projectName"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter project name"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {isAddUserModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Add User to Project</h2>
                        <form onSubmit={handleAddUser}>
                            <div className="mb-4">
                                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                    User Email
                                </label>
                                <input
                                    type="email"
                                    id="userEmail"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter user email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddUserModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Home;