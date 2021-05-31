import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
 
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  CircularProgress
} from '@material-ui/core';

import {frontendoperations} from "../../Actions/auth";
import {connect} from 'react-redux';
import Alert from '@material-ui/lab/Alert';



const useStyles = makeStyles(() => ({
  root: {}
}));

const Help = ({ className,frontendoperations,isAuthenticated,isAction, ...rest }) => {
  const classes = useStyles();

  const firstvalues = {
    email:"",
    username: "",
    message:""
  };
  const [values, setValues] = React.useState(firstvalues)
  const [loading, setLoading] = React.useState(false);
  const [alertobject,setAlertobject] =  React.useState({
    sever:'',
    isopen:false,
    message:''
  })
  

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  
  const handleSubmit = async () => {  
    setLoading(true) 
    const ismessagesent = await frontendoperations({action:'help',email:values.email,username:values.username,message:values.message})
    setLoading(false) 
    if(ismessagesent){
      return setAlertobject({
        ...alertobject,
        sever:'success',
        isopen:true,
        message:'Submitted, We will get Back Soon'

      })    
      
        
    }else{
      return setAlertobject({
        ...alertobject,
        sever:'error',
        isopen:true,
        message:'Something is went wrong!'

      })   
    }  
    
  };

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="Describe in your own words"
          title="Support"
        />
        <Divider />
        {alertobject.isopen &&
                <Alert severity={alertobject.sever}>{alertobject.message}</Alert>
        }
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={12}
              xs={12}
            >
             <TextField
                fullWidth
                label="Contact Admin"
                name="message"
                multiline
                onChange={handleChange}
                rows={5}
                rowsMax={6}                
                variant="outlined"
                
              />
            </Grid>   
                   
            <Grid item md={12} xs={12}>
            {loading?<CircularProgress size={25} />:  
            <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            disabled = {values.message.length >= 2 ? false:true}
          >   
                 
           Send Now 
          </Button>}
          </Grid>
           
          </Grid>
        </CardContent>
       
      </Card>
    </form>
  );
};

Help.propTypes = {
  className: PropTypes.string
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isAction: state.auth.isAction
});

export default connect(mapStateToProps, { frontendoperations  })(Help);
