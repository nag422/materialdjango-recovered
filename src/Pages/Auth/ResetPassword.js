import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, Redirect } from 'react-router-dom'; 
import {connect} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FormikField from "../../Components/Controls/FormikField";
import { reset_password } from '../../Actions/auth';

import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import YouTubeIcon from '@material-ui/icons/YouTube';
import Alert from '@material-ui/lab/Alert';
import { CircularProgress } from '@material-ui/core';

function Copyright() {

    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            {' '}
            {new Date().getFullYear()}
            {'. '}All Rights Reserved.
        </Typography>
    );
}
 
const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        
        backgroundImage: 'url(https://app.kiranvoleti.com/static/assets/images/login3.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
           
    
    },
     

}));

const loginschema = Yup.object().shape({
    email: Yup.string()
        .min(2, 'Too Short!')
        .email()
        .required("Email is Should not be Empty"),
    
        // .matches(
        //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        //     "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        //   )
})
const initialValues = {
    email: ""
};

function ResetPassword({reset_password}) {
    const classes = useStyles();
    const [requestSent, setRequestSent] = React.useState(false);
    const [loading,setLoading] = React.useState(false)

//    if (isAuthenticated) {
//        return <Redirect to="/profile" />
//    }

const socialnavigation = (socialurl) =>{
    return window.location.assign(socialurl)
}

    const handleSubmit = async (values) => {

        setLoading(true)
        
        const resp = await reset_password(values.email)
        if (resp){
            setRequestSent(true);

        }else{
            alert('Network error')
        }
        setLoading(false)

        
        
    };
    // if (requestSent) return <Redirect to='/login' />

    

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Reset Password
          </Typography>
         {requestSent && <Alert severity="success">Success! A confirmation link has been sent to your email!</Alert>}

                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={loginschema}

                    >

                        {({ dirty, isValid }) => {
                            return (

                                <Grid container>
                                <Form className={classes.form}>

                                <Grid item xs={12}>
                                    <FormikField
                                        name="email"
                                        label="Email"
                                        type="email"
                                        required
                                        textvariant="outlined"

                                    />
                                </Grid>

                               


                                <Grid item xs={12} md={12} sm={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!dirty || !isValid}
                                        type="submit" 
                                        fullWidth                                       
                                        className={classes.submit}
                                    >
                                        {loading && <CircularProgress size={20} style={{ color: "#FFF" }} />} Reset Password
                                    </Button>
                                </Grid>

                                <Grid container>
              <Grid item xs>
              
                <Link 
                component={RouterLink}
                variant="body2"
                to="/profile"
                
                >
                  Back
                  </Link>
                
                
              </Grid>
              <Grid item>
                  
                <Link to="/login" variant="body2" component={RouterLink}>
                
                  {"Have an account? Sign In"}
                  
                </Link>
                
                
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
            <Box display="flex" flexDirection="row" alignContent="center" justifyContent="space-around" mt={5}>
                                            <TwitterIcon style={{color:"#1DA1F2",cursor:"pointer"}} onClick={()=>socialnavigation('https://www.twitter.com/kiranvoleti')} />
                                            <InstagramIcon style={{color:"#C13584",cursor:"pointer"}} onClick={()=>socialnavigation('https://www.instagram.com/kiranvoletidigital')} />
                                            <FacebookIcon style={{color:"#4267B2",cursor:"pointer"}} onClick={()=>socialnavigation('https://www.facebook.com/kiranvoleti')} />
                                            <LinkedInIcon style={{color:"#115293",cursor:"pointer"}} onClick={()=>socialnavigation('https://www.linkedin.com/in/kiranvoleti/')} />
                                            <YouTubeIcon style={{color:"#FF0000",cursor:"pointer"}} onClick={()=>socialnavigation('https://www.youtube.com/channel/UC7mYifiG7sNeRM9aIKXrYuA')} />
                                        </Box>

            

                                </Form>
                                </Grid>


                            );
                        }}
                    </Formik>

                    
                </div>
            </Grid>
        </Grid>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { reset_password  })(ResetPassword);