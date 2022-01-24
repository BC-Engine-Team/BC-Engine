// import React from 'react'
// import Table from 'react-bootstrap/Table'
// import '../styles/clientTable.css'

// const ClientTable = ({data}) =>{
    

//     // let clientNameList = [];
//     // let clientCountryList = [];


//     // const [clientName, setClientName] = useState();
//     // const [clientCountry, setCountry] = useState();


//     // const [clients] = useState([{name: clientName, country: clientCountry}]);


//     // const table = async () => {
//     //     for(var i = 0; i < data.length; i++) {
//     //         clientNameList.push(data[i].name);
//     //         clientCountryList.push(data[i].country);
//     //     }
//     //     console.log(clientNameList);
//     //     console.log(clientCountryList);

//     //     setClientName(clientNameList);
//     //     setCountry(clientCountryList);
//     // }
    
//     return(
//         <div className="justify-content-center">
//             <div>
//                 <div className="card shadow m-5 uTable">

//                     <Table responsive="xl" hover>

//                         <thead className='bg-light'>
//                             <tr key="0">
//                                 <th className='row-style'>NAME</th>
//                                 <th className='row-style'>COUNTRY</th>
//                                 <th className='row-style'>AVERAGE COLLECTION DAYS</th>
//                                 <th className='row-style'>AMOUNT OWED</th>
//                                 <th className='row-style'>AMOUNT DUE</th>
//                                 <th className='row-style'>CLIENT GRADING</th>
//                                 <th className='row-style'>CURRENT STATUS</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {data.map ((client, index) => {
//                                 return(
//                                     <tr key={index}>
//                                         <td className='row-style'>{client.name}</td>
//                                         <td className='row-style'>{client.country}</td>
//                                         {/* <td className='row-style'>{c.averagecollection}</td>
//                                         <td className='amount-owed'>{c.amountowed}</td>
//                                         <td className='amount-due'>{c.amountdue}</td>
//                                         <td className='row-style'>{c.clientgrading}</td>
//                                         <td className='row-style'>{c.status}</td> */}
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </Table>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ClientTable