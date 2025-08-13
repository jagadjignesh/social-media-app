import { useState } from "react";
import Users from "../components/users";

const Connections = () => {
    const [ connState , setConnState ] = useState("all");

    const activeTab = "cursor-pointer inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500";

    const inActiveTab = "cursor-pointer inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300";

    return (
        <>
            <div className="dark bg-gray-900 text-white p-6 flex-1">
                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                    <li className="me-2">
                        <div className={connState == "all" ? activeTab : inActiveTab } onClick={() => setConnState("all")}>All Users</div>
                    </li>
                    <li className="me-2">
                        <div className={connState == "following" ? activeTab : inActiveTab } onClick={() => setConnState("following")}>Followings</div>
                    </li>
                    <li className="me-2">
                        <div className={connState == "follower" ? activeTab : inActiveTab } onClick={() => setConnState("follower")}>Followers</div>
                    </li>
                </ul>
                <div id="user_cards">
                    <Users state={connState} setConnState={setConnState} />
                </div>
            </div>
        </>
    )
}

export default Connections;