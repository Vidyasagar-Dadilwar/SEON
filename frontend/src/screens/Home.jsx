import React, { useState } from 'react';
import { useUser } from '../context/user.context';
import axios from '../config/Axios';

const Home = () => {
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState("");

    function createProject(e) {
        e.preventDefault();

        axios.post('/projects/create', { name: projectName })
            .then((res) => {
                console.log({ res });
                setIsModalOpen(false);
                setProjectName("");
            })
            .catch((err) => {
                console.log({ err });
            });
    }

    return (
        <main className="p-4">
            <div className="projects">
                <button className="project p-4 border border-slate-300 rounded-lg" onClick={() => setIsModalOpen(true)}>
                    <i className="ri-link mr-2"></i>
                    Create Project
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            createProject(e);
                            setIsModalOpen(false);
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
        </main>
    );
};

export default Home;