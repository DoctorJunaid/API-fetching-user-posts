import React, {useEffect, useRef, useState} from 'react'
import {Search, Heart, EyeIcon} from "lucide-react";
import axios from "axios";
import LoaderComponent from "./LoaderComponent.jsx";


const API = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [posts, setPosts] = useState({userId: null, data: []})
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [isPostLoading, setIsPostLoading] = useState(false);
    const useRef1 = useRef({});


    const UsersList = async () => {
        setIsUserLoading(true)
        try {
            const response = await axios.get('https://dummyjson.com/users')
            setTimeout(()=>{
                setUsers(response.data.users)
                setIsUserLoading(false)
            },1000)

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

    return (
        <>
            <div className="w-full h-full bg-zinc-900 flex flex-col justify-center items-center">
                <div className="w-full h-full text-shadow-white flex flex-col items-center py-5">
                    <div className="mb-4 text-xl font-bold leading-tight">Users</div>
                    <div className="flex items-center justify-center relative">
                        <Search className="absolute z-20 left-2 w-10 text-zinc-400"/>
                        <input className="relative text-center py-3.5 px-5 w-[90vw] rounded bg-zinc-600"
                               placeholder="Search users" type="search"/>
                    </div>
                    {isUserLoading ? <LoaderComponent/> :
                        users.map((user) => (
                            <div ref={(el) => useRef1.current[user.id] = el} onClick={() => {
                                if (selectedUser === user.id) {
                                    // If same user → close
                                    setSelectedUser(null);
                                    setPosts({ userId: null, data: [] });
                                } else {
                                    // If different user → switch
                                    setSelectedUser(user.id);
                                    setPosts({ userId: null, data: [] }); // clear old posts while new fetch runs
                                }
                            }}
                                 key={user.id} className={" flex-col"}>
                                <div className="flex items-center w-[90vw] gap-4 mx-auto mt-10 cursor-pointer">
                                    <div
                                        className="bg-red-500 overflow-hidden rounded-full h-[100px] w-[100px] shrink-0  flex justify-center items-center ">
                                        <img className=" w-full h-full object-center object-cover" src={user.image}
                                             alt="image not found"/>
                                    </div>
                                    <div>
                                        <h1 className="text-white text-xl ">{user.firstName + " " + user.lastName}</h1>
                                        <p className="text-gray-300 text-sm">@{user.username}</p>
                                    </div>
                                </div>
                                {/*users*/}
                                <div className="flex flex-col gap-5  border-l-2 border-zinc-600 px-8 mt-4 "  >

                                    {selectedUser === user.id  && (isPostLoading
                                        ? (<LoaderComponent/>)
                                            : (posts.userId === user.id && (
                                                posts.data.length === 0
                                                    ? <div className="text-gray-300 text-center py-4">No posts by this
                                                        user</div>
                                                    : posts.data.map((post, index) => (
                                                        <div key={post.id} 
                                                             className={"pb-6 border-y-2 border-zinc-600 mt-3"}>
                                                            <div
                                                                className="flex items-center gap-2 mt-3">Post: {index + 1}</div>
                                                            <h1 className="text-md font-bold mt-3 ">Title
                                                                : {post.title}</h1>
                                                            <div className="text-gray-300 text-sm">{post.body}</div>

                                                            {post.tags.map((tag) => (
                                                                <div className=" inline m-3 " key={tag + index}>
                                                                    <button
                                                                        className=" bg-zinc-600 p-2 rounded-full text-sm mt-3 cursor-pointer">{tag}</button>
                                                                </div>
                                                            ))}
                                                            <div className="flex gap-2 text-gray-300 mt-2">
                                                                <EyeIcon/> {post.views}
                                                                <Heart
                                                                    className={"text-red-500 fill-red-500"}/> {post.reactions.likes}
                                                            </div>

                                                        </div>
                                                    ))
                                            ))
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    )
}

export default API