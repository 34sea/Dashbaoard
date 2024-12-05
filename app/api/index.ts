import axios from "axios";

// Configuração da URL base da API
export const API = process.env.NEXT_API_URL || "https://pgi.cornelder.co.mz/api/v1/";
export const API_HOST_STORAGE = "https://pgi.cornelder.co.mz/storage";

// Instância do axios com configuração da URL base
export const api = axios.create({
    baseURL: API,
    // Configurações adicionais, se necessário, como headers de autenticação
    // headers: {
    //     Authorization: `Bearer ${token}`,
    //     "ngrok-skip-browser-warning": "skip=browser-warning",
    // },
});


export const getStockControlLista = async (query: string = "") => {
    try {
        const res = await api.get("stockcontrol/lista", { params: { query } });
        return res.data;
    } catch (err: any) {
        console.error("Erro ao buscar lista de controle de estoque:", err);
        return err?.response?.data;
    }
};


export const getStockControlItem = async (id: string) => {
    try {
        const res = await api.get(`stockcontrol/item/${id}`);
        return res.data;
    } catch (err: any) {
        console.error("Erro ao buscar item específico:", err);
        return err?.response?.data;
    }
};

export const createStockControlItem = async (data: Record<string, any>) => {
    try {
        const res = await api.post("stockcontrol/create", data);
        return res.data;
    } catch (err: any) {
        console.error("Erro ao criar item de controle de estoque:", err);
        return err?.response?.data;
    }
};
