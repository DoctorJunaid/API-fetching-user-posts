import React, {useEffect, useRef, useState} from 'react'
import {Search, Heart, EyeIcon, X} from "lucide-react";
import axios from "axios";
import LoaderComponent from "./LoaderComponent.jsx";


const API = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [posts, setPosts] = useState({userId: null, data: []})
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [isPostLoading, setIsPostLoading] = useState(false);
    const useRef1 = useRef({});
    const [search, setSearch] = useState(null) // for search filter to store input value


    const UsersList = async () => {
        setIsUserLoading(true)
        try {
            const response = await axios.get('https://dummyjson.com/users')
            setTimeout(() => {
                setUsers(response.data.users)
                setIsUserLoading(false)
            }, 1000)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        UsersList();
    }, [])

    useEffect(() => {
        const fetchPosts = async () => {
            if (selectedUser) {
                setIsPostLoading(true);
                try {
                    const response = await axios.get(`https://dummyjson.com/posts/user/${selectedUser}`);
                    setTimeout(() => {
                        setPosts({
                            userId: selectedUser,
                            data: response.data.posts
                        });
                        setIsPostLoading(false);
                    }, 1000);
                } catch (error) {
                    console.error(error);
                    setIsPostLoading(false);
                }
            } else {
                setPosts({userId: null, data: []});
            }
        };
        fetchPosts();
    }, [selectedUser]);

    useEffect(() => {
        if (selectedUser && useRef1.current[selectedUser]) {
            useRef1.current[selectedUser].scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [selectedUser]);

    const searchTerm = search?.toLowerCase() || "";
    const selectedUserData = users.find(user => user.id === selectedUser);

    return (
        <>
            <div className="w-full h-screen bg-zinc-900 flex">
                {/* Sidebar - Users List */}
                <div className="w-full md:w-1/3 lg:w-1/4 h-full border-r border-zinc-700 flex flex-col">
                    <div className="p-4 border-b border-zinc-700">
                        <h1 className="text-xl font-bold text-white mb-4 text-center">Users</h1>
                        <div className="flex items-center justify-center relative">
                            <Search className="absolute z-20 left-3 w-5 h-5 text-zinc-400"/>
                            <input
                                value={search || ""}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search users"
                                type="search"
                            />
                        </div>
                    </div>

                    {/* Users List */}
                    <div className="flex-1 overflow-y-auto bg-zinc-900 ">
                        {isUserLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <LoaderComponent/>
                            </div>
                        ) : (
                            users
                                .filter(user => {
                                    const searchTerm = search?.toLowerCase() || "";
                                    const fullName = (user.firstName + " " + user.lastName).toLowerCase();
                                    return (
                                        fullName.includes(searchTerm) ||
                                        user.username.toLowerCase().includes(searchTerm)
                                    );
                                }).map((user) => (
                                <div
                                    ref={(el) => useRef1.current[user.id] = el}
                                    onClick={() => {
                                        if (selectedUser === user.id) {
                                            setSelectedUser(null);
                                            setPosts({ userId: null, data: [] });
                                        } else {
                                            setSelectedUser(user.id);
                                            setPosts({ userId: null, data: [] });
                                        }
                                    }}
                                    key={user.id}
                                    className={`p-4 cursor-pointer hover:bg-zinc-600 transition-colors   ${
                                        selectedUser === user.id ? 'bg-zinc-800 border-l-4 border-blue-500' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-500 overflow-hidden rounded-full h-12 w-12 shrink-0 flex justify-center items-center">
                                            <img
                                                className="w-full h-full object-center object-cover"
                                                src={user.image}
                                                alt="User avatar"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white text-sm font-medium truncate">
                                                {user.firstName + " " + user.lastName}
                                            </h3>
                                            <p className="text-gray-400 text-xs truncate">@{user.username}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Content - Posts */}
                <div className="hidden md:flex flex-1 flex-col h-full">
                    {selectedUser ? (
                        <>
                            {/* Header */}
                            <div className="p-6 border-b border-zinc-700 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {selectedUserData && (
                                        <>
                                            <div className="bg-red-500 overflow-hidden rounded-full h-16 w-16 shrink-0 flex justify-center items-center">
                                                <img
                                                    className="w-full h-full object-center object-cover"
                                                    src={selectedUserData.image}
                                                    alt="User avatar"
                                                />
                                            </div>
                                            <div>
                                                <h2 className="text-white text-2xl font-bold">
                                                    {selectedUserData.firstName + " " + selectedUserData.lastName}
                                                </h2>
                                                <p className="text-gray-400">@{selectedUserData.username}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedUser(null);
                                        setPosts({ userId: null, data: [] });
                                    }}
                                    className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400"/>
                                </button>
                            </div>

                            {/* Posts Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {isPostLoading ? (
                                    <div className="flex justify-center items-center h-32">
                                        <LoaderComponent/>
                                    </div>
                                ) : (
                                    posts.userId === selectedUser && (
                                        posts.data.length === 0 ? (
                                            <div className="text-gray-400 text-center py-8">
                                                No posts by this user
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {posts.data.map((post, index) => (
                                                    <div
                                                        key={post.id}
                                                        className="bg-zinc-800 rounded-lg p-6 border border-zinc-700"
                                                    >
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="text-blue-400 text-sm font-medium">
                                                                Post {index + 1}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-white text-lg font-bold mb-3">
                                                            {post.title}
                                                        </h3>
                                                        <p className="text-gray-300 mb-4 leading-relaxed">
                                                            {post.body}
                                                        </p>

                                                        {/* Tags */}
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {post.tags.map((tag, tagIndex) => (
                                                                <span
                                                                    key={tag + tagIndex}
                                                                    className="bg-zinc-600 px-3 py-1 rounded-full text-xs text-gray-300"
                                                                >
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        {/* Stats */}
                                                        <div className="flex gap-4 text-gray-400 text-sm">
                                                            <div className="flex items-center gap-1">
                                                                <EyeIcon className="w-4 h-4"/>
                                                                {post.views}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Heart className="w-4 h-4 text-red-500 fill-red-500"/>
                                                                {post.reactions.likes}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <h2 className="text-xl text-gray-400 mb-2">Select a user to view their posts</h2>
                                <p className="text-gray-500">Choose a user from the sidebar to see their content</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Posts  () */}
            {selectedUser && (
                <div className="md:hidden fixed inset-0 bg-zinc-900 z-50">
                    <div className="h-full flex flex-col">
                        {/* Mobile Heading */}
                        <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {selectedUserData && (
                                    <>
                                        <div className="bg-red-500 overflow-hidden rounded-full h-10 w-10 shrink-0 flex justify-center items-center">
                                            <img
                                                className="w-full h-full object-center object-cover"
                                                src={selectedUserData.image}
                                                alt="User avatar"
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-white font-bold">
                                                {selectedUserData.firstName + " " + selectedUserData.lastName}
                                            </h2>
                                            <p className="text-gray-400 text-sm">@{selectedUserData.username}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedUser(null);
                                    setPosts({ userId: null, data: [] });
                                }}
                                className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400"/>
                            </button>
                        </div>

                        {/* Mobile Posts */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {isPostLoading ? (
                                <LoaderComponent/>
                            ) : (
                                posts.userId === selectedUser && (
                                    posts.data.length === 0 ? (
                                        <div className="text-gray-400 text-center py-8">
                                            No posts by this user
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {posts.data.map((post, index) => (
                                                <div
                                                    key={post.id}
                                                    className="bg-zinc-800 rounded-lg p-4 border border-zinc-700"
                                                >
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-blue-400 text-sm font-medium">
                                                            Post {index + 1}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-white font-bold mb-3">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                                                        {post.body}
                                                    </p>

                                                    {/* Tags */}
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {post.tags.map((tag, tagIndex) => (
                                                            <span
                                                                key={tag + tagIndex}
                                                                className="bg-zinc-600 px-2 py-1 rounded-full text-xs text-gray-300"
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="flex gap-4 text-gray-400 text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <EyeIcon className="w-4 h-4"/>
                                                            {post.views}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Heart className="w-4 h-4 text-red-500 fill-red-500"/>
                                                            {post.reactions.likes}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default API