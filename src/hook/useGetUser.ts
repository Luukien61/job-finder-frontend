import {UserResponse} from "@/page/GoogleCode.tsx";
import {getUserInfo} from "@/axios/Request.ts";

const UseGetUser = () => {
    let user:UserResponse = JSON.parse(localStorage.getItem("user"));
    const getUser =async ()=> {
        user = await getUserInfo(user.userId)
        if(user) {
            localStorage.setItem("user", JSON.stringify(user))
            return user;
        }
    }
    return getUser().then(value => value);
};

export default UseGetUser;