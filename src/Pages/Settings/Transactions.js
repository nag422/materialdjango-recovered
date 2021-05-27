import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axiosInstance from '../../axiosmodelapi';
import Moment from 'react-moment';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(email, date, payment, status) {
  return { email, date, payment, status };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function Transactions() {
  const classes = useStyles();
  const [transactions,setTransactions] = React.useState([])
  const process_env_REACT_APP_API_URL= "https://app.kiranvoleti.com"
  React.useEffect(() => {
    


                const getransaction = async () => {

                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `JWT ${localStorage.getItem('access')}`,
                            'Accept': 'application/json'
                        }
                    };
    
                    try {
                        const response = await axiosInstance.post(`${process_env_REACT_APP_API_URL}/ui/admin/transactions/`, config);
                        if (response.data.tags !== "undefined"){
                            // console.log(response.data.tags)
                            setTransactions(response.data.tags)
                        }
                        
                        
                        
                    
                    } catch (err) {
                        alert(err.toString())
                    }

                }              
                

                getransaction()


      return () => {
        setTransactions([])
      }
      
  }, [])

 

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Status</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.email}
              </TableCell>
              <TableCell align="right"><Moment format="YYYY/MM/DD HH:MM:SS">{row.createdat}</Moment></TableCell>
              <TableCell align="right">{row.amount_total}</TableCell>
              <TableCell align="right"><Button disableElevation style={{cursor:"no-drop"}} variant="contained" color={row.payment_status == "succeeded" ? "primary":"secondary"}>{row.payment_status}</Button></TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
