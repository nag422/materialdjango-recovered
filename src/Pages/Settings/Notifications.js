import React from 'react'
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography,
    CardHeader,
    Paper,
    Grid,
    makeStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FormikField from "../../Components/Controls/FormikField";
import FormikRadio from "../../Components/Controls/FormikRadio";
import axiosInstance from '../../axiosmodelapi';
import axios from 'axios';

const useStyles = makeStyles(() => ({
    root: {},
    avatar: {
        height: 100,
        width: 100
    },
    iconclass: {
        backgroundColor: '#6573c3',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '5px'
    }
}));

const notificationschema = Yup.object().shape({
    email: Yup.string()
        .min(2, 'Too Short!')
        .required("Email is Should not be Empty"),
    lettersub: Yup.string()
    .required("A Subscribe option is required")
})
const initialValues = {
    email: localStorage.getItem('email'),
    lettersub:"",
};


const Notifications = ({ className, ...rest }) => {
    const classes = useStyles();
    const config = {
        headers: {
            Authorization: localStorage.getItem('access')
            ? 'JWT ' + localStorage.getItem('access'):null,
            'Content-Type': 'application/json',
            accept: 'application/json'
        },

    }
    const handleSubmit = (values) => {
        alert(JSON.stringify(values));
        const form_data = new FormData()
        form_data.append('email',values.email)
        form_data.append('lettersub',values.lettersub)
        axios.post("https://app.kiranvoleti.com/subscibenewsletter/",form_data,config)
        .then(res=> {
            console.log(res.data)
        })

    };

    return (
        <>
            <Card
                className={clsx(classes.root, className)}
                {...rest}
            >
                <CardHeader
                    subheader="NewsLetter Subscription"
                    title="Daily News Letter"
                />
                <Divider />
                <CardContent>
                    <Paper elevation={0}>

                        <Grid container spacing={3}>

                            <Formik
                                initialValues={initialValues}
                                onSubmit={handleSubmit}
                                validationSchema={notificationschema}
                            >

                                {({ dirty, isValid }) => {
                                    return (
                                        <Grid item xs={12}>
                                            
                                            <Form>

                                            
                                                <FormikField
                                                    textvariant="outlined"
                                                    name="email"
                                                    label="Email"
                                                    required
                                                />
                                            

                                            
                                            <br />

                                                
                                                    <FormikRadio
                                                    name="lettersub"
                                                    label="Lettersub"
                                                    val="subscribe"
                                                    required
                                                    />
                                                     <FormikRadio
                                                    name="lettersub"
                                                    label="Lettersub"
                                                    val="unsubscribe"
                                                    required
                                                    />
                                                

                                                
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        disabled={!dirty || !isValid}
                                                        type="submit"

                                                    >
                                                        Submit
                                                    </Button>
                                                

                                            </Form>
                                        </Grid>

                                    );
                                }}
                            </Formik>











                        </Grid>
                    </Paper>

                </CardContent>



            </Card>

        </>
    )
}
Notifications.propTypes = {
    className: PropTypes.string
}
export default Notifications
