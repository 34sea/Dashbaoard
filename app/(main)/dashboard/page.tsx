/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../demo/service/ProductService';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import Link from 'next/link';
import { Demo } from '@/types';
import { ChartData, ChartOptions } from 'chart.js';
import { Dialog } from 'primereact/dialog';
import "./dash.css"
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';

import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { getStockControlLista, API_HOST_STORAGE } from '@/app/api'


const Dashboard = () => {
    const [products, setProducts] = useState<Demo.Product[]>([]);
    const menu1 = useRef<Menu>(null);
    const menu2 = useRef<Menu>(null);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);
    const toast = useRef<Toast>(null)

    const [RFQs, setRFQs] = useState([]);
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
        photo_optional: ""
    });

    const [stockControlImg, setStockControlImg] = useState("");
    useEffect(()=>{

        const init = async ()=>{
            try{
                const res = await getStockControlLista();
                console.log(res.data.data)
                if(res.message) return toast.current?.show({
                    severity: "error",
                    summary: 'ERRo',
                    detail: res.message,
                    life: 3000
                });
                setRFQs(res.data.data);
            } catch(error){
                console.error("Failed to fetch RFQs", error)
            }
        }
        init()
    }, []);




    const [globalFilter, setGlobalFilter] = useState('');

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };
    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const basicDialogFooter = <Button type="button" label="OK" onClick={() => setDisplayBasic(false)} icon="pi pi-check" outlined />;
    const basicDialogFooter2 = <Button type="button" label="OK" onClick={() => setDisplayBasic2(false)} icon="pi pi-check" outlined />;

    return (
        <div className="grid">
            

            <div className="col-12 xl:col-6" style={{border: "0px", width: "100%"}}>
                <div className="card" style={{width: "100%"}}>
                    <h5>Transaçõess</h5>
                        {/* const header = (
                            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 className="m-0">Manage Productskdjfdj</h5>
                                <span className="block mt-2 md:mt-0 p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
                                </span>
                            </div>
                        ); */}

                    <DataTable value={RFQs} rows={5} paginator responsiveLayout="scroll">
                        <Column header="Visita" field="truck_visit"/>
                        <Column header="Criado por" field="username"/>
                        <Column header="Data de criação" field="created_at"/>
                        <Column header="Entrega" body={(data) => <img className="shadow-2" src={`${API_HOST_STORAGE}/${data.photo_underdelivery}`} alt={data.photo_underdelivery} width="50" />} />
                        <Column header="Cabeça" body={(data) => <img className="shadow-2" src={`${API_HOST_STORAGE}/${data.photo_truck_head}`} alt={data.photo_truck_head} width="50" />} />
                        <Column header="Atrelado" body={(data) => <img className="shadow-2" src={`${API_HOST_STORAGE}/${data.photo_trailer}`} alt={data.photo_trailer} width="50" />} />
                        <Column header="Carga" body={(data) => <img className="shadow-2" src={`${API_HOST_STORAGE}/${data.photo_load}`} alt={data.photo_load} width="50" />} />
                        <Column header="Opcional" body={(data) => <img className="shadow-2" src={`${API_HOST_STORAGE}/${data.photo_optional}`} alt={data.photo_optional} width="50" />} />
                        <Column body={(data)=>{

                            return(
                                <Button outlined type="button" label="Show" icon="pi pi-eye" onClick={() => {
                                    setDisplayBasic(true);
                                    setStockControlItem(data)
                                }} />
                            )
                        }} />

                    </DataTable>
                </div>



               
            </div>

            <Dialog header="Detalhes" visible={displayBasic} style={{ minWidth: '75vw' }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
                          <div>
                            
                            <div className=''>
                                <table border={1} style={{borderCollapse: "collapse"}}>
                                    <thead className='headTable'>
                                        <th>
                                            Visita
                                        </th>
                                        <th>
                                            Criado Por
                                        </th>
                                        <th>
                                            Data de criação
                                        </th>
                                       

                                    </thead>
                                    <tr className='rowT'>
                                        <td>
                                            {stockControlItem.truck_visit}
                                        </td>
                                        <td>
                                            {stockControlItem.username}
                                        </td>
                                        <td>
                                            {stockControlItem.created_at}
                                        </td>
                                       
                                    </tr>
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
                                    <div className="treIage">
                                        <img className="shadow-2" src={`${API_HOST_STORAGE}/${stockControlItem.photo_optional}`} alt={stockControlItem.photo_optional} width="100" />
                                    
                                        <Button outlined type="button" label="Expandir" icon="pi pi-compress" className='btnExpand' onClick={() => {
                                            
                                            setStockControlImg(`${API_HOST_STORAGE}/${stockControlItem.photo_optional}`)
                                            setDisplayBasic2(true);
                                        }}/>
                                    </div>
                                </div>
                            </div>
                            
                          </div>
                        </Dialog>  

                        <Dialog header="Imagem" visible={displayBasic2} style={{ width: '55vw' }} modal footer={basicDialogFooter2} onHide={() => setDisplayBasic2(false)}>
                            <div className="imagemL">
                                <img className="shadow-2" src={stockControlImg} alt={stockControlImg} width="100" />
                            </div>
                            
                        </Dialog> 
            
        </div>
    );
};

export default Dashboard;
