
import axios from "axios";

export const API = process.env.NEXT_API_URL || "https://pgi.cornelder.co.mz/api/v1/"
export const API_HOST_STORAGE = "https://pgi.cornelder.co.mz/storage"



export const api = axios.create({
    baseURL: API
    // headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'ngrok-skip-browser-warning': 'skip=browser-warning',
    // }
})

export const getStockControlLista = async () =>{
    try{
        const res = await api.get("stockcontrol/lista")
        return res.data;
    } catch(err: any){
        return err?.response?.data
    }
}