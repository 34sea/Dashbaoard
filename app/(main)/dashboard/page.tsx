/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { getStockControlLista, API_HOST_STORAGE } from '@/app/api';
import './dash.css';
import { ProgressSpinner } from 'primereact/progressspinner';
import * as XLSX from "xlsx";
import { Tag } from 'primereact/tag';



const Dashboard = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const toast = useRef<Toast>(null);

    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [RFQs, setRFQs] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [stockControlItem, setStockControlItem] = useState({
        id: "",
        truck_visit: "",
        photo_underdelivery: "",
        photo_truck_head: "",
        photo_trailer: "",
        photo_load: "",
        username: "",
        created_at: "",
        updated_at: "",
        photo_optional: "",
    });
    const [stockControlImg, setStockControlImg] = useState("");
    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayBasic2, setDisplayBasic2] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await getStockControlLista();
                if (res.message) {
                    toast.current?.show({
                        severity: "error",
                        summary: "Erro",
                        detail: res.message,
                        life: 3000,
                    });
                } else {
                    setRFQs(res.data.data);
                    setFilteredData(res.data.data);
                }
            } catch (error) {
                console.error("Erro ao buscar dados iniciais:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = async (value: string) => {
        setGlobalFilter(value);
        setIsLoading(true);
        try {
            const res = await getStockControlLista(value);
            setFilteredData(res.data.data);
        } catch (error) {
            console.error("Erro ao filtrar dados:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateFilter = async () => {
        if (!startDate || !endDate) {
            toast.current?.show({
                severity: "warn",
                summary: "Filtro inválido",
                detail: "Por favor, selecione datas de início e fim.",
                life: 3000,
            });
            return;
        }

        const startDateTime = startDate.toISOString();
        const endDateTime = endDate.toISOString();

        setIsLoading(true);
        try {
            const res = await getStockControlLista("", startDateTime, endDateTime);
            setFilteredData(res.data.data);
        } catch (error) {
            console.error("Erro ao filtrar dados por data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
        XLSX.writeFile(workbook, "dados.xlsx");
    };

    const basicDialogFooter = (
        <Button
            type="button"
            label="OK"
            onClick={() => setDisplayBasic(false)}
            icon="pi pi-check"
            outlined
        />
    );

    const basicDialogFooter2 = (
        <Button
            type="button"
            label="OK"
            onClick={() => setDisplayBasic2(false)}
            icon="pi pi-check"
            outlined
        />
    );

    return (
        <div className="grid">
            {isLoading && (
                <div className="loading-overlay">
                    <ProgressSpinner />
                </div>
            )}
            <div className="col-12 xl:col-6" style={{ border: "0px", width: "100%" }}>
                <div className="card" style={{ width: "100%" }}>
                    <h5>Transações</h5>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "center" }}>
                        <div>
                            <strong>Total:</strong> {RFQs.length}{" "}
                            <span style={{ marginLeft: "8px" }}>
                                <strong>Filtrados:</strong> {filteredData.length}
                            </span>
                        </div>

                        <Button
                            label="Exportar"
                            icon="pi pi-file-excel"
                            className="btnExport"
                            onClick={exportToExcel}
                        />
                    </div>

                    <hr />
                    
                    <div style={{ marginBottom: "1rem"}} className="filtrosDiv">
                        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                            <InputText
                                value={globalFilter}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Pesquise por RI ou email"
                                className="inputFiltro"
                            />
                            <Calendar
                                value={startDate}
                                onChange={(e) => setStartDate(e.value || null)}
                                placeholder="Data início"
                                showIcon
                                showTime
                                hourFormat="24"
                                showSeconds 
                            />

                            <Calendar
                                value={endDate}
                                onChange={(e) => setEndDate(e.value || null)}
                                placeholder="Data fim"
                                showIcon
                                showTime
                                hourFormat="24" 
                                showSeconds 
                            />

                            <Button label="Filtrar" icon="pi pi-filter" onClick={handleDateFilter} />
                        </div>
                    </div>

                    <DataTable value={filteredData} rows={5} paginator responsiveLayout="scroll">
                        <Column header="Visita" field="truck_visit" />
                        <Column header="Criado por" field="username" />
                        <Column header="Data de criação" field="created_at" />
                        <Column
                            header="Entrega"
                            body={(data) => (
                            
                                <img
                                    className="shadow-2"
                                    src={`${API_HOST_STORAGE}/${data.photo_underdelivery}`}
                                    alt={data.photo_underdelivery}
                                    width="50"
                                />
                            )}
                        />
                        <Column
                            header="Cabeça"
                            body={(data) => (
                                <img
                                    className="shadow-2"
                                    src={`${API_HOST_STORAGE}/${data.photo_truck_head}`}
                                    alt={data.photo_truck_head}
                                    width="50"
                                />
                            )}
                        />
                        <Column
                            header="Atrelado"
                            body={(data) => (
                                <img
                                    className="shadow-2"
                                    src={`${API_HOST_STORAGE}/${data.photo_trailer}`}
                                    alt={data.photo_trailer}
                                    width="50"
                                />
                            )}
                        />
                        <Column
                            header="Carga"
                            body={(data) => (
                                <img
                                    className="shadow-2"
                                    src={`${API_HOST_STORAGE}/${data.photo_load}`}
                                    alt={data.photo_load}
                                    width="50"
                                />
                            )}
                        />
                        <Column
                            header="Opcional"
                            body={(data) => {
                                const imageUrl = `${API_HOST_STORAGE}/${data.photo_optional}`;
                                const isImageAvailable = data.photo_optional && data.photo_optional.trim() !== "";

                                return isImageAvailable ? (
                                    <img
                                        className="shadow-2"
                                        src={imageUrl}
                                        alt="Imagem Opcional"
                                        width="50"
                                        onError={(e) => {
                                            e.currentTarget.src = "/images/broken-image.png"; // Fallback
                                            e.currentTarget.alt = "Imagem não disponível";
                                        }}
                                    />
                                ) : (
                                
                                <div className="flex items-center">
                                    <i className="pi pi-image text-gray-500" style={{ fontSize: '1.5rem' }} />
                                    {/* <span className="ml-2 text-sm text-gray-500">indisponível</span> */}
                                </div>
                                    
                                );
                            }}
                        />
                        <Column
                            body={(data) => (
                                <Button
                                    outlined
                                    type="button"
                                    label="Show"
                                    icon="pi pi-eye"
                                    onClick={() => {
                                        setDisplayBasic(true);
                                        setStockControlItem(data);
                                    }}
                                />
                            )}
                        />
                    </DataTable>
                </div>
            </div>

            
            <Dialog
                header="Detalhes"
                visible={displayBasic}
                style={{ minWidth: "75vw" }}
                modal
                footer={basicDialogFooter}
                onHide={() => setDisplayBasic(false)}
            >
                <div>
                    <table border={1} style={{ borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Visita</th>
                                <th>Criado Por</th>
                                <th>Data de criação</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{stockControlItem.truck_visit}</td>
                                <td>{stockControlItem.username}</td>
                                <td>{stockControlItem.created_at}</td>
                            </tr>
                        </tbody>
                    </table>
                    <hr />
                    <div className='containerImage'>
                                    <div className="treIage">
                                        <img className="shadow-2" src={`${API_HOST_STORAGE}/${stockControlItem.photo_underdelivery}`} alt={stockControlItem.photo_underdelivery} width="100" />
                                    
                                        <Button outlined type="button" label="Expandir" icon="pi pi-eye" className='btnExpand' onClick={() => {
                                            
                                            setStockControlImg(`${API_HOST_STORAGE}/${stockControlItem.photo_underdelivery}`)
                                            //console.log(`Imagem clicada: ${API_HOST_STORAGE}/${stockControlItem.photo_underdelivery}`)
                                            setDisplayBasic2(true);
                                        }}/>
                                        
                                    </div>
                                    <div className="treIage">
                                        <img className="shadow-2" src={`${API_HOST_STORAGE}/${stockControlItem.photo_load}`} alt={stockControlItem.photo_load} width="100" />
                                        <Button outlined type="button" label="Expandir" icon="pi pi-compress" className='btnExpand' onClick={() => {
                                            
                                            setStockControlImg(`${API_HOST_STORAGE}/${stockControlItem.photo_load}`)
                                            setDisplayBasic2(true);
                                        }}/>
                                    </div>
                                    <div className="treIage">
                                        <img className="shadow-2" src={`${API_HOST_STORAGE}/${stockControlItem.photo_truck_head}`} alt={stockControlItem.photo_truck_head} width="100" />

                                        <Button outlined type="button" label="Expandir" icon="pi pi-compress" className='btnExpand' onClick={() => {
                                            
                                            setStockControlImg(`${API_HOST_STORAGE}/${stockControlItem.photo_truck_head}`)
                                            setDisplayBasic2(true);
                                        }}/>
                                    </div>
                                    <div className="treIage">
                                        <img className="shadow-2" src={`${API_HOST_STORAGE}/${stockControlItem.photo_trailer}`} alt={stockControlItem.photo_trailer} width="100" />
                                        <Button outlined type="button" label="Expandir" icon="pi pi-compress" className='btnExpand' onClick={() => {
                                            
                                            setStockControlImg(`${API_HOST_STORAGE}/${stockControlItem.photo_trailer}`)
                                            setDisplayBasic2(true);
                                        }}/>
                                    </div>
                                    {/* <div className="treIage">
                                        <img className="shadow-2" src={`${API_HOST_STORAGE}/${stockControlItem.photo_optional}`} alt={stockControlItem.photo_optional} width="100" />
                                    
                                        <Button outlined type="button" label="Expandir" icon="pi pi-compress" className='btnExpand' onClick={() => {
                                            
                                            setStockControlImg(`${API_HOST_STORAGE}/${stockControlItem.photo_optional}`)
                                            setDisplayBasic2(true);
                                        }}/>
                                    </div> */}
                                </div>
                </div>
            </Dialog>

            <Dialog
                header="Imagem"
                visible={displayBasic2}
                style={{ width: "55vw" }}
                modal
                footer={basicDialogFooter2}
                onHide={() => setDisplayBasic2(false)}
            >
                <div className="imagemL">
                    <img className="shadow-2" src={stockControlImg} alt={stockControlImg} width="100" />
                </div>
            </Dialog>
        </div>
    );
};

export default Dashboard;
