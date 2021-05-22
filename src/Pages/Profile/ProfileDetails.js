import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';


const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className,user,setsnakreq,snakreq,open, ...rest }) => {
  const classes = useStyles();
  const [alertobject,setAlertobject] =  React.useState({
    sever:'',
    isopen:false,
    message:''
  })

  const [values, setValues] = React.useState({
    first_name:"",
    last_name:"",
    phone:"",
    email:''
  });
 
  React.useEffect(() => {
    setValues({
      ...values,
      first_name:user.first_name,
      last_name:user.last_name,
      phone: user.phone,
      email:user.email
    });
    
  }, [user])
  
  
  const handleChange = (event) => {
    
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleOnClick = (event) => {
    event.preventDefault()
    console.log('email',values.email)
    if (values.email == ""){
      return setAlertobject({
        ...alertobject,
        sever:'error',
        isopen:true,
        message:'Email is should not empty'

      })
      
      
    }
    else if (values.first_name == ""){
      return setAlertobject({
        ...alertobject,
        sever:'error',
        isopen:true,
        message:'Firstname is should not empty'

      })
    }
    else if (values.last_name == ""){
      return setAlertobject({
        ...alertobject,
        sever:'error',
        isopen:true,
        message:'Last_name is should not empty'

      })
    }
    
    const config = {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access')}`,
          'Accept': 'application/json'
      }
    };
    
    const body = new FormData();
    body.append('id',localStorage.getItem('userid'));
    body.append('first_name',values.first_name);
    body.append('last_name',values.last_name);
    body.append('phone',values.phone);    
    body.append('email',values.email);
    
    axios.post(`https://app.kiranvoleti.com/testing/checkfun/`,body, config)
    .then(res => {    
     

      
      if(res.data.response ==="success"){
        return setAlertobject({
          ...alertobject,
          sever:'success',
          isopen:true,
          message:'Successfully Updated'
  
        })

      }else{
        return setAlertobject({
          ...alertobject,
          sever:'error',
          isopen:true,
          message:'Something is went wrong!'
  
        })         

      }
      
        

      
    })
    .catch(e => {
      return setAlertobject({
        ...alertobject,
        sever:'error',
        isopen:true,
        message:'Badrequest! please check your data.'

      })

    })
  }

  

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      onSubmit={handleOnClick}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
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
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                name="first_name"
                onChange={handleChange}
                required
                value={values.first_name}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Last name"
                name="last_name"
                onChange={handleChange}
                required
                value={values.last_name}
                variant="outlined"
              />
            </Grid>
            
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                type="number"
                value={values.phone}
                variant="outlined"
              />
             
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
            <TextField
                fullWidth
                label="Email"
                name="email"
                onChange={handleChange}
                type="email"
                value={values.email}
                variant="outlined"
                required
              />
              </Grid>
           
           
          </Grid>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            type="submit"
          >
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};

// ProfileDetails.propTypes = {
//   className: PropTypes.string
// };

export default ProfileDetails;
