import React from 'react'
import Table from 'react-bootstrap/Table'
import '../styles/clientTable.css'

const ClientTable = () => {
    return(

        <div className="justify-content-center">
            <div>
                <div className="card shadow m-5 uTable">

                    <Table responsive="xl">

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
                            <tr>
                                <td className='row-style'>Nicolas Espitalier</td>
                                <td className='row-style'>Canada</td>
                                <td className='row-style'>29</td>
                                <td className='amount-owed'>450.43 CAD</td>
                                <td className='amount-due'>6000.67 CAD</td>
                                <td className='row-style'>A</td>
                                <td className='row-style'>ACTIVE</td>
                            </tr>

                            <tr>
                                <td className='row-style'>Phillipe Heinsenberg</td>
                                <td className='row-style'>Germany</td>
                                <td className='row-style'>30</td>
                                <td className='amount-owed'>120.43 CAD</td>
                                <td className='amount-due'>3542.67 CAD</td>
                                <td className='row-style'>A</td>
                                <td className='row-style'>ACTIVE</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default ClientTable