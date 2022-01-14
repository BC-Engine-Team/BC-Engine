import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import '../styles/clientTable.css'

const ClientTable = (data) => {


    
    const [clients, setClients] = useState([{name: "William Roger", country: "Canada", averagecollection: "35.6", amountowed: "4500", amountdue: "2122", clientgrading: "A", status: "ACTIVE"}]);
    
    let counter = 0;

    
    return(

        <div className="justify-content-center">
            <div>
                <div className="card shadow m-5 uTable">

                    <Table responsive="xl" hover>

                        <thead className='bg-light'>
                            <tr key="0">
                                <th className='row-style'>NAME</th>
                                <th className='row-style'>COUNTRY</th>
                                <th className='row-style'>AVERAGE COLLECTION DAYS</th>
                                <th className='row-style'>AMOUNT OWED</th>
                                <th className='row-style'>AMOUNT DUE</th>
                                <th className='row-style'>CLIENT GRADING</th>
                                <th className='row-style'>CURRENT STATUS</th>
                            </tr>
                        </thead>

                        <tbody>

                            {clients.map (c => {
                                counter++;
                                return(
                                    <tr key={counter}>
                                        <td className='row-style'>{c.name}</td>
                                        <td className='row-style'>{c.country}</td>
                                        <td className='row-style'>{c.averagecollection}</td>
                                        <td className='amount-owed'>{c.amountowed}</td>
                                        <td className='amount-due'>{c.amountdue}</td>
                                        <td className='row-style'>{c.clientgrading}</td>
                                        <td className='row-style'>{c.status}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default ClientTable