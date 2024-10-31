import axios from "axios";
import {backEndPage} from "@/info/AppInfo.ts";

export const instance = axios.create({
    baseURL: backEndPage,
    headers:{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    }
})