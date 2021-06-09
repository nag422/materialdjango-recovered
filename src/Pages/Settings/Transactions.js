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
import { Box, Button, Chip, CircularProgress } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});




export default function Transactions() {
  const classes = useStyles();
  const [transactions,setTransactions] = React.useState([])
  const [loading,setLoading] = React.useState(false)
  const [loadingindex,setLoadingindex] = React.useState('')

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

  const getSubscription = async (suburl,loadingin) => {
    setLoading(true)
    setLoadingindex(loadingin)
    
    const config = {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access')}`,
          'Accept': 'application/json'
      }
  };

  const form_data = new FormData();
  form_data.append('suburl',suburl)

  try {
      const response = await axiosInstance.post(`${process_env_REACT_APP_API_URL}/invoice/`,form_data,config);
      
      if (+response.status === 200){
          // console.log(response.data.tags)
          
          return window.location.assign(response.data.invoiceurl)
      }else{
        setLoading(false)
        return alert('Something is went wrong!')
      }
      
      
      
      
  
  } catch (err) {
      setLoading(false)
      return alert(err.toString())
  }

  }

 

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Details</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions?transactions.map((row,index) => (

            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.email}
              </TableCell>
              <TableCell align="right"><Moment format="YYYY/MM/DD HH:MM:SS">{row.createdat}</Moment></TableCell>
              <TableCell align="right">{row.currency ==="usd" ? row.amount_total/100 + ' usd':row.amount_total/100 + ' inr'}</TableCell>
              <TableCell align="right">{row.payment_status}</TableCell>
              <TableCell align="right"><Button variant="contained" color="primary" onClick={() =>getSubscription(row.subscription,index)}>{loading && loadingindex===index? <CircularProgress size={15} style={{color:"#fff",marginRight:10}} />:null} view <LaunchIcon fontSize="small" /></Button></TableCell>
              
            </TableRow>

          )):
          <TableRow>
            <TableCell align="right">No transactions</TableCell>
          </TableRow>       

          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
